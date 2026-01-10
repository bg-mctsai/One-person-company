// Moment Configs 驗證腳本 (Node.js 版本)
// 執行方式: node scripts/validate-moments.js

const fs = require('fs');
const path = require('path');

// 禁用詞列表
const FORBIDDEN_WORDS = ['遊戲', '關卡', '玩家', '挑戰', 'UI'];

// 選項類型列表
const VALID_OPTION_TYPES = ['積極對抗', '溫和堅持', '情感訴求', '順從消極'];

// Moment Spec 表配置（從 Moment Spec 表.md 提取）
const MOMENT_SPECS = {
  1: { date: '2019/01/10', category: '職場', title: '初入職場的歡迎', maxTurns: 3, keyNpc: '同事A', supportNpcs: ['主管'] },
  2: { date: '2019/02/15', category: '職場', title: '第一次合作', maxTurns: 3, keyNpc: '同事A', supportNpcs: [] },
  3: { date: '2019/03/20', category: '職場', title: '職場聚會', maxTurns: 3, keyNpc: '主管', supportNpcs: ['同事群'] },
  4: { date: '2019/06/01', category: '情人', title: '第一次約會', maxTurns: 3, keyNpc: '情人C', supportNpcs: [] },
  5: { date: '2019/06/20', category: '情人', title: '情人的承諾', maxTurns: 4, keyNpc: '情人C', supportNpcs: [] },
  6: { date: '2019/07/15', category: '職場', title: '第一次被搶功', maxTurns: 5, keyNpc: '主管', supportNpcs: ['同事A'] },
  7: { date: '2019/09/10', category: '職場', title: '被推卸責任', maxTurns: 5, keyNpc: '主管', supportNpcs: ['同事A'] },
  8: { date: '2019/11/05', category: '職場', title: '被當成工具', maxTurns: 5, keyNpc: '同事A', supportNpcs: ['主管'] },
  9: { date: '2019/07/25', category: '情人', title: '情人的謊言', maxTurns: 5, keyNpc: '情人C', supportNpcs: [] },
  10: { date: '2019/09/30', category: '情人', title: '不在照片裡的戀人', maxTurns: 6, keyNpc: '情人C', supportNpcs: [] },
  11: { date: '2020/02/10', category: '職場', title: '被陷害離職', maxTurns: 7, keyNpc: 'HR', supportNpcs: ['主管', '同事A'] },
  12: { date: '2020/04/05', category: '職場', title: '職場名聲被毀', maxTurns: 7, keyNpc: '同事群', supportNpcs: ['同事A'] },
  13: { date: '2020/02/25', category: '情人', title: '情人的徹底傷害', maxTurns: 7, keyNpc: '情人C', supportNpcs: ['旁人'] },
  14: { date: '2020/06/15', category: '自我', title: '最後的求救', maxTurns: 8, keyNpc: '過去的自己', supportNpcs: [] },
};

// 已知的插話模板（從 插話模板庫.md 提取）
const VALID_TEMPLATE_KEYS = [
  'interject.watch.1',
  'interject.rumor.1',
  'interject.rumor.2',
  'interject.collusion.1',
  'interject.threatened.1',
  'interject.threatened.2',
  'interject.threatened.3',
  'interject.know.1',
  'interject.know.2',
];

function validateMomentConfigs() {
  const errors = [];
  const warnings = [];
  const configsDir = path.join(__dirname, '../moment-configs');

  console.log('🔍 開始驗證 moment-configs...\n');

  // 檢查所有 14 個時刻都存在
  for (let i = 1; i <= 14; i++) {
    const filePath = path.join(configsDir, `moment-${i}.json`);
    
    if (!fs.existsSync(filePath)) {
      errors.push(`❌ 時刻 ${i} 文件不存在: ${filePath}`);
      continue;
    }

    let config;
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      config = JSON.parse(fileContent);
    } catch (e) {
      errors.push(`❌ 時刻 ${i} JSON 格式錯誤: ${e.message}`);
      continue;
    }

    // 檢查 momentId 與文件名對應
    if (config.momentId !== i) {
      errors.push(`❌ 時刻 ${i}: momentId (${config.momentId}) 與文件名不一致`);
    }

    // 檢查 maxTurns 與 rounds 數量一致
    if (config.maxTurns !== config.rounds.length) {
      errors.push(`❌ 時刻 ${i}: maxTurns (${config.maxTurns}) 與 rounds 數量 (${config.rounds.length}) 不一致`);
    }

    // 檢查每個 round 至少有 3 個選項
    config.rounds.forEach((round, idx) => {
      if (round.options.length < 3) {
        errors.push(`❌ 時刻 ${i} Round ${idx + 1}: 選項數量不足 3 個 (只有 ${round.options.length} 個)`);
      }

      // 檢查每個選項的格式
      round.options.forEach((option, optIdx) => {
        // 檢查 optionType
        if (!VALID_OPTION_TYPES.includes(option.optionType)) {
          errors.push(`❌ 時刻 ${i} Round ${idx + 1} Option ${optIdx + 1}: 無效的 optionType "${option.optionType}"`);
        }

        // 檢查 tags
        if (!option.tags || option.tags.length === 0) {
          errors.push(`❌ 時刻 ${i} Round ${idx + 1} Option ${optIdx + 1}: 缺少 tags`);
        }

        // 檢查禁用詞
        FORBIDDEN_WORDS.forEach(word => {
          if (option.text.includes(word)) {
            errors.push(`❌ 時刻 ${i} Round ${idx + 1} Option ${optIdx + 1}: 包含禁用詞 "${word}"`);
          }
        });
      });

      // 檢查 NPC prompt 中的禁用詞
      FORBIDDEN_WORDS.forEach(word => {
        if (round.npcPrompt.includes(word)) {
          errors.push(`❌ 時刻 ${i} Round ${idx + 1} NPC Prompt: 包含禁用詞 "${word}"`);
        }
      });
    });

    // 檢查與 Moment Spec 表的對應
    const spec = MOMENT_SPECS[i];
    if (spec) {
      if (config.date !== spec.date) {
        warnings.push(`⚠️  時刻 ${i}: date (${config.date}) 與 Moment Spec 表 (${spec.date}) 不一致`);
      }
      if (config.category !== spec.category) {
        warnings.push(`⚠️  時刻 ${i}: category (${config.category}) 與 Moment Spec 表 (${spec.category}) 不一致`);
      }
      if (config.title !== spec.title) {
        warnings.push(`⚠️  時刻 ${i}: title (${config.title}) 與 Moment Spec 表 (${spec.title}) 不一致`);
      }
      if (config.maxTurns !== spec.maxTurns) {
        warnings.push(`⚠️  時刻 ${i}: maxTurns (${config.maxTurns}) 與 Moment Spec 表 (${spec.maxTurns}) 不一致`);
      }
      if (config.keyNpc !== spec.keyNpc) {
        warnings.push(`⚠️  時刻 ${i}: keyNpc (${config.keyNpc}) 與 Moment Spec 表 (${spec.keyNpc}) 不一致`);
      }
      
      // 檢查 supportNpcs（順序可能不同，所以用集合比較）
      const configNpcs = new Set(config.supportNpcs || []);
      const specNpcs = new Set(spec.supportNpcs || []);
      if (configNpcs.size !== specNpcs.size || 
          [...configNpcs].some(npc => !specNpcs.has(npc))) {
        warnings.push(`⚠️  時刻 ${i}: supportNpcs (${JSON.stringify(config.supportNpcs)}) 與 Moment Spec 表 (${JSON.stringify(spec.supportNpcs)}) 不一致`);
      }
    }

    // 檢查 supportInterjections 的 templateKey
    if (config.supportInterjections) {
      config.supportInterjections.forEach((interjection, idx) => {
        if (!interjection.templateKey || !interjection.templateKey.startsWith('interject.')) {
          warnings.push(`⚠️  時刻 ${i} SupportInterjection ${idx + 1}: templateKey 格式可能不正確 "${interjection.templateKey}"`);
        }
        if (interjection.templateKey && !VALID_TEMPLATE_KEYS.includes(interjection.templateKey)) {
          warnings.push(`⚠️  時刻 ${i} SupportInterjection ${idx + 1}: templateKey "${interjection.templateKey}" 未在插話模板庫中定義`);
        }
      });
    }

    // 檢查必要欄位
    const requiredFields = ['momentId', 'date', 'category', 'title', 'maxTurns', 'keyNpc', 'target', 'failHard', 'opening', 'rounds'];
    requiredFields.forEach(field => {
      if (!(field in config)) {
        errors.push(`❌ 時刻 ${i}: 缺少必要欄位 "${field}"`);
      }
    });
  }

  // 輸出結果
  console.log('📊 驗證結果：\n');
  
  if (errors.length > 0) {
    console.error('❌ 發現錯誤：');
    errors.forEach(error => console.error(`  ${error}`));
    console.log('');
  }

  if (warnings.length > 0) {
    console.warn('⚠️  發現警告：');
    warnings.forEach(warning => console.warn(`  ${warning}`));
    console.log('');
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ 驗證通過！所有 moment-configs 文件完整且正確。\n');
    return true;
  }

  console.log(`📈 統計：${errors.length} 個錯誤，${warnings.length} 個警告\n`);
  return errors.length === 0;
}

// 執行驗證
if (require.main === module) {
  const success = validateMomentConfigs();
  process.exit(success ? 0 : 1);
}

module.exports = { validateMomentConfigs };

