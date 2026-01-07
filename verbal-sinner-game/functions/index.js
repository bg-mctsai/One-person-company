const functions = require('firebase-functions');
const admin = require('firebase-admin');
const OpenAI = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');

admin.initializeApp();

// Example function
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});

function getProviderKey(provider) {
  const p = (provider || 'openai').toLowerCase();
  if (p === 'gemini') {
    return (
      process.env.GEMINI_API_KEY ||
      (functions.config().gemini && functions.config().gemini.key) ||
      ''
    );
  }
  return (
    process.env.OPENAI_API_KEY ||
    (functions.config().openai && functions.config().openai.key) ||
    ''
  );
}

function buildNpcPrompt(input) {
  const {
    momentTitle,
    npcName,
    npcRole,
    npcVoice,
    npcEmotion,
    npcTraits,
    playerLine,
    history,
    constraints,
  } = input || {};

  const safeHistory = Array.isArray(history) ? history.slice(-12) : [];

  return {
    system: [
      '你是一個互動敘事遊戲的角色對話引擎。',
      '請用繁體中文輸出。',
      '輸出必須是 JSON（不要包 markdown code block），格式：{"npc_reply":"...","npc_emotion_hint":"...","notes":"..."}。',
      'npc_reply：1-2 句、口吻符合角色；不要使用「遊戲/關卡/玩家/挑戰/UI」等出戲詞。',
      'npc_emotion_hint：用一個詞（冷漠/困惑/震驚/憤怒/慌張/崩潰/好感/欣賞/尊重/愧疚/認同）提示目前情緒走向。',
      'notes：可留空；若玩家帶證據/設界線/退縮，點出原因（但不要教學口吻）。',
    ].join('\n'),
    user: [
      `【時刻】${momentTitle || '（未知）'}`,
      `【NPC】${npcName || '（未知）'}（${npcRole || '角色'}）`,
      npcVoice ? `【語氣】${npcVoice}` : null,
      npcEmotion ? `【當前情緒】${npcEmotion}` : null,
      npcTraits ? `【性格/動機】${npcTraits}` : null,
      constraints ? `【限制】${constraints}` : null,
      safeHistory.length
        ? `【對話史】\n${safeHistory.map((l) => `- ${l}`).join('\n')}`
        : null,
      `【你剛剛說】${playerLine || ''}`,
    ]
      .filter(Boolean)
      .join('\n'),
  };
}

function tryParseJson(text) {
  if (!text) return null;
  const trimmed = String(text).trim();
  try {
    return JSON.parse(trimmed);
  } catch (_) {
    // best-effort: extract first {...}
    const m = trimmed.match(/\{[\s\S]*\}/);
    if (!m) return null;
    try {
      return JSON.parse(m[0]);
    } catch (__) {
      return null;
    }
  }
}

async function callOpenAI({ apiKey, model, prompt }) {
  const client = new OpenAI({ apiKey });
  const resp = await client.chat.completions.create({
    model: model || 'gpt-4o-mini',
    temperature: 0.7,
    max_tokens: 220,
    messages: [
      { role: 'system', content: prompt.system },
      { role: 'user', content: prompt.user },
    ],
  });
  const text = resp.choices?.[0]?.message?.content || '';
  return { raw: text, parsed: tryParseJson(text) };
}

async function callGemini({ apiKey, model, prompt }) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const m = genAI.getGenerativeModel({ model: model || 'gemini-1.5-flash' });
  const r = await m.generateContent([prompt.system, '\n\n', prompt.user].join(''));
  const text = r?.response?.text?.() || '';
  return { raw: text, parsed: tryParseJson(text) };
}

/**
 * generateNpcReply
 *
 * 前端用 httpsCallable 呼叫。API key 只留在 functions。
 *
 * data:
 *  - provider: "openai" | "gemini"
 *  - model?: string
 *  - momentTitle: string
 *  - npcName: string
 *  - npcRole?: string
 *  - npcVoice?: string
 *  - npcEmotion?: string
 *  - npcTraits?: string
 *  - playerLine: string
 *  - history?: string[] (最後 12 句)
 *  - constraints?: string
 */
exports.generateNpcReply = functions
  .runWith({
    // 大量匿名流量時，先靠 App Check 擋掉「非你前端」的濫用呼叫
    enforceAppCheck: true,
    timeoutSeconds: 20,
    memory: '256MB',
  })
  .https.onCall(async (data, context) => {
  const provider = (data && data.provider) || 'openai';
  const apiKey = getProviderKey(provider);
  if (!apiKey) {
    throw new functions.https.HttpsError(
      'failed-precondition',
      `Missing API key for provider=${provider}. Set OPENAI_API_KEY / GEMINI_API_KEY or functions config.`
    );
  }

  // 前端不登入也 OK：匿名流量下 context.auth 會是 null
  // 但我們會用 App Check（enforceAppCheck）做第一層防濫用

  const playerLine = (data && data.playerLine) || '';
  const momentTitle = (data && data.momentTitle) || '';
  const npcName = (data && data.npcName) || '';
  if (!playerLine || !momentTitle || !npcName) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'momentTitle, npcName, playerLine are required.'
    );
  }

  const prompt = buildNpcPrompt(data);
  try {
    const model = data && data.model;
    const result =
      String(provider).toLowerCase() === 'gemini'
        ? await callGemini({ apiKey, model, prompt })
        : await callOpenAI({ apiKey, model, prompt });

    const payload = result.parsed || {
      npc_reply: result.raw.trim().slice(0, 400),
      npc_emotion_hint: '',
      notes: '',
    };

    // Normalize keys
    const npc_reply = payload.npc_reply || payload.reply || payload.npcReply || '';
    const npc_emotion_hint =
      payload.npc_emotion_hint || payload.emotion || payload.emotionHint || '';
    const notes = payload.notes || '';

    return {
      provider: String(provider).toLowerCase(),
      model: model || null,
      npc_reply,
      npc_emotion_hint,
      notes,
      raw: result.parsed ? null : result.raw,
    };
  } catch (err) {
    functions.logger.error('generateNpcReply failed', err);
    throw new functions.https.HttpsError('internal', 'AI generation failed.');
  }
  });