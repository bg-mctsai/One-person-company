# API 端點實現文檔

> 目的：定義所有 API 端點的具體請求/響應格式、錯誤處理、限流與安全措施。  
> 依賴文件：`Firebase環境規劃.md`、`技術架構設計.md`。

---

## 1) API 基礎設定

### 1.1 基礎 URL

- **開發環境**：`http://localhost:5001/verbal-sinner-game/us-central1`
- **生產環境**：`https://us-central1-verbal-sinner-game.cloudfunctions.net`

### 1.2 認證方式

- **Firebase Authentication**：所有 API 需要 JWT Token
- **Header**：`Authorization: Bearer {token}`
- **App Check**：所有 API 需要 App Check Token（防止濫用）

### 1.3 統一響應格式

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}
```

### 1.4 錯誤碼定義

| 錯誤碼 | HTTP 狀態碼 | 說明 |
|--------|------------|------|
| `AUTH_REQUIRED` | 401 | 需要認證 |
| `AUTH_INVALID` | 401 | Token 無效 |
| `APP_CHECK_FAILED` | 403 | App Check 驗證失敗 |
| `RATE_LIMIT_EXCEEDED` | 429 | 請求過於頻繁 |
| `VALIDATION_ERROR` | 400 | 請求參數錯誤 |
| `NOT_FOUND` | 404 | 資源不存在 |
| `INTERNAL_ERROR` | 500 | 伺服器內部錯誤 |

---

## 2) 遊戲進度相關 API

### 2.1 獲取遊戲進度

```typescript
GET /api/game/progress

Headers:
  Authorization: Bearer {token}
  X-App-Check: {appCheckToken}

Response 200:
{
  "success": true,
  "data": {
    "userId": "user123",
    "currentPhase": "challenge",
    "currentChallengeId": 7,
    "totalProgress": 6,
    "completedChallenges": [1, 2, 3, 4, 5, 6],
    "categoryProgress": {
      "職場": { "completed": 3, "total": 8 },
      "情人": { "completed": 2, "total": 5 },
      "自我": { "completed": 0, "total": 1 }
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}

Error 401:
{
  "success": false,
  "error": {
    "code": "AUTH_REQUIRED",
    "message": "需要認證"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 2.2 更新遊戲進度

```typescript
POST /api/game/progress

Headers:
  Authorization: Bearer {token}
  X-App-Check: {appCheckToken}

Body:
{
  "currentPhase": "challenge",
  "currentChallengeId": 7,
  "totalProgress": 6,
  "completedChallenges": [1, 2, 3, 4, 5, 6]
}

Response 200:
{
  "success": true,
  "data": {
    "updated": true
  },
  "timestamp": "2024-01-15T10:30:00Z"
}

Error 400:
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "請求參數錯誤",
    "details": {
      "field": "currentChallengeId",
      "reason": "必須是 1-14 之間的數字"
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 3) 挑戰相關 API

### 3.1 獲取挑戰列表

```typescript
GET /api/game/challenges

Headers:
  Authorization: Bearer {token}
  X-App-Check: {appCheckToken}

Query Parameters:
  category?: "職場" | "情人" | "自我"
  unlocked?: boolean

Response 200:
{
  "success": true,
  "data": {
    "challenges": [
      {
        "id": 1,
        "title": "初入職場的歡迎",
        "category": "職場",
        "date": "2019/01/10",
        "maxTurns": 3,
        "unlocked": true,
        "completed": true
      },
      ...
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 3.2 獲取特定挑戰

```typescript
GET /api/game/challenges/:id

Headers:
  Authorization: Bearer {token}
  X-App-Check: {appCheckToken}

Response 200:
{
  "success": true,
  "data": {
    "id": 1,
    "title": "初入職場的歡迎",
    "category": "職場",
    "date": "2019/01/10",
    "maxTurns": 3,
    "keyNpc": "同事A",
    "supportNpcs": ["主管"],
    "target": { "type": "emotion", "value": "尊重" },
    "opening": {
      "speaker": "同事A",
      "mode": "ai",
      "npcPrompt": "..."
    },
    "rounds": [...]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}

Error 404:
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "挑戰不存在"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 4) 對話系統相關 API

### 4.1 開始對話

```typescript
POST /api/dialogue/start

Headers:
  Authorization: Bearer {token}
  X-App-Check: {appCheckToken}

Body:
{
  "challengeId": 1,
  "userId": "user123"
}

Response 200:
{
  "success": true,
  "data": {
    "sessionId": "session456",
    "challengeId": 1,
    "currentRound": 1,
    "maxTurns": 3,
    "npcMessage": "新人～以後有事就直接找我。你跟主管聊了什麼？",
    "options": [
      {
        "id": "r1_o1",
        "text": "謝啦。我先把交付清一下，有需要我會主動提。",
        "optionType": "溫和堅持",
        "tags": ["界線", "控場"]
      },
      ...
    ],
    "npcEmotion": "好感",
    "turnsLeft": 3
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 4.2 處理玩家回應

```typescript
POST /api/dialogue/respond

Headers:
  Authorization: Bearer {token}
  X-App-Check: {appCheckToken}

Body:
{
  "sessionId": "session456",
  "optionId": "r1_o1",
  "userId": "user123"
}

Response 200:
{
  "success": true,
  "data": {
    "sessionId": "session456",
    "currentRound": 2,
    "turnsLeft": 2,
    "npcMessage": "哎唷，別這麼見外啦。我只是怕你踩雷。",
    "options": [...],
    "emotionChange": {
      "before": "好感",
      "after": "困惑",
      "delta": -5
    },
    "status": "in_progress" | "completed" | "failed"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}

Error 400:
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "選項無效或會話已結束"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 4.3 生成 NPC 回應（AI）

```typescript
POST /api/dialogue/generateNpcReply

Headers:
  Authorization: Bearer {token}
  X-App-Check: {appCheckToken}

Body:
{
  "provider": "openai",
  "model": "gpt-4o-mini",
  "momentTitle": "被推卸責任",
  "npcName": "主管",
  "npcRole": "主管（結果導向）",
  "npcVoice": "冷、短句、帶壓迫感",
  "npcEmotion": "冷漠",
  "npcTraits": "偏程序、怕麻煩、對證據敏感",
  "playerLine": "這不是我造成的。我可以把時間線和文件攤開。",
  "history": [
    "主管：這次延誤，你負責的部分怎麼解釋？",
    "你：我先把時間線講清楚..."
  ],
  "constraints": "npc_reply 只能 1-2 句；不得出現「遊戲/關卡/玩家/挑戰/UI」"
}

Response 200:
{
  "success": true,
  "data": {
    "provider": "openai",
    "model": "gpt-4o-mini",
    "npc_reply": "…給我看。你最好有東西能證明。",
    "npc_emotion_hint": "震驚",
    "notes": "玩家帶證據，NPC警戒上升但被迫接受對質"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}

Error 429:
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "AI API 請求過於頻繁，請稍後再試"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 5) 情緒系統相關 API

### 5.1 獲取 NPC 情緒

```typescript
GET /api/emotion/:npcId

Headers:
  Authorization: Bearer {token}
  X-App-Check: {appCheckToken}

Query Parameters:
  userId: string

Response 200:
{
  "success": true,
  "data": {
    "npcId": "同事A",
    "currentEmotion": "困惑",
    "intensity": 45,
    "attributes": {
      "信任": 60,
      "警戒": 45,
      "尊重": 40,
      "恐懼": 20,
      "罪惡感": 10,
      "壓力": 30,
      "憤怒": 15,
      "困惑": 10
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 5.2 更新情緒狀態

```typescript
POST /api/emotion/update

Headers:
  Authorization: Bearer {token}
  X-App-Check: {appCheckToken}

Body:
{
  "userId": "user123",
  "npcId": "同事A",
  "emotionDelta": {
    "信任": -5,
    "警戒": 10,
    "尊重": 10,
    "困惑": 5
  }
}

Response 200:
{
  "success": true,
  "data": {
    "npcId": "同事A",
    "currentEmotion": "困惑",
    "intensity": 50,
    "emotionChange": {
      "before": "好感",
      "after": "困惑"
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 6) 線索系統相關 API

### 6.1 獲取線索列表

```typescript
GET /api/clues

Headers:
  Authorization: Bearer {token}
  X-App-Check: {appCheckToken}

Query Parameters:
  userId: string
  category?: "職場" | "情人" | "自我"
  type?: "隱藏" | "關鍵" | "累積" | "最終"

Response 200:
{
  "success": true,
  "data": {
    "clues": [
      {
        "id": "CLUE-01",
        "momentId": 1,
        "title": "過度熱情",
        "description": "同事A的「過度熱情」可能是偽裝",
        "type": "隱藏",
        "category": "職場",
        "relatedNpcs": ["同事A"],
        "tags": ["MASK", "PROBE"],
        "discoveredAt": "2024-01-15T10:30:00Z",
        "isKeyClue": false
      },
      ...
    ],
    "total": 6,
    "keyClues": 0
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 6.2 獲取線索詳情

```typescript
GET /api/clues/:clueId

Headers:
  Authorization: Bearer {token}
  X-App-Check: {appCheckToken}

Query Parameters:
  userId: string

Response 200:
{
  "success": true,
  "data": {
    "id": "CLUE-07",
    "momentId": 7,
    "title": "害怕眼神",
    "description": "同事A在默認責任的時候，眼神有些閃爍，似乎在害怕什麼。",
    "type": "隱藏",
    "category": "職場",
    "relatedNpcs": ["同事A"],
    "tags": ["THREATENED"],
    "discoveredAt": "2024-01-15T10:30:00Z",
    "isKeyClue": false
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 6.3 關聯分析

```typescript
POST /api/clues/analyze

Headers:
  Authorization: Bearer {token}
  X-App-Check: {appCheckToken}

Body:
{
  "userId": "user123",
  "clueIds": ["CLUE-07", "CLUE-11"]
}

Response 200:
{
  "success": true,
  "data": {
    "relation": "被威脅",
    "hint": "兩條線索都指向「被威脅」模式，可能指向「幕後黑手」",
    "confidence": 0.85
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 7) 復活機制相關 API

### 7.1 觸發復活

```typescript
POST /api/revival/initiate

Headers:
  Authorization: Bearer {token}
  X-App-Check: {appCheckToken}

Body:
{
  "userId": "user123"
}

Response 200:
{
  "success": true,
  "data": {
    "revivalId": "revival789",
    "status": "pending_ad",
    "message": "請觀看廣告以完成復活"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 7.2 驗證廣告完成

```typescript
POST /api/revival/verify-ad

Headers:
  Authorization: Bearer {token}
  X-App-Check: {appCheckToken}

Body:
{
  "revivalId": "revival789",
  "userId": "user123",
  "adCompleted": true
}

Response 200:
{
  "success": true,
  "data": {
    "revivalId": "revival789",
    "status": "completed",
    "message": "復活成功，已回到 5 年前"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 8) 回到 5 分鐘前（回溯）

### 8.1 觸發回溯

```typescript
POST /api/revival/rewind

Headers:
  Authorization: Bearer {token}
  X-App-Check: {appCheckToken}

Body:
{
  "userId": "user123",
  "sessionId": "session456",
  "usePass": false  // 是否使用通行證
}

Response 200:
{
  "success": true,
  "data": {
    "rewindId": "rewind123",
    "status": "pending_ad",
    "message": "請觀看廣告以回到 5 分鐘前"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 8.2 驗證回溯廣告完成

```typescript
POST /api/revival/verify-rewind-ad

Headers:
  Authorization: Bearer {token}
  X-App-Check: {appCheckToken}

Body:
{
  "rewindId": "rewind123",
  "userId": "user123",
  "adCompleted": true
}

Response 200:
{
  "success": true,
  "data": {
    "rewindId": "rewind123",
    "status": "completed",
    "sessionId": "session456",
    "currentRound": 1,
    "turnsLeft": 5,
    "message": "已回到 5 分鐘前，NPC 屬性已重置"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 9) 結局系統相關 API

### 9.1 計算結局分數

```typescript
POST /api/ending/calculate

Headers:
  Authorization: Bearer {token}
  X-App-Check: {appCheckToken}

Body:
{
  "userId": "user123"
}

Response 200:
{
  "success": true,
  "data": {
    "behaviorScore": 85,      // b
    "truthScore": 90,          // t
    "scarScore": 25,           // scar
    "rewindsTotal": 3,         // rewinds
    "endingType": "perfect",
    "endingOptions": ["reveal", "leave"]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 9.2 選擇結局

```typescript
POST /api/ending/choose

Headers:
  Authorization: Bearer {token}
  X-App-Check: {appCheckToken}

Body:
{
  "userId": "user123",
  "choice": "reveal"
}

Response 200:
{
  "success": true,
  "data": {
    "endingType": "perfect",
    "endingChoice": "reveal",
    "endingContent": {
      "職場": "真相被揭露，你獲得認可，工作穩定",
      "情人": "關係被修復或結束，你不再被傷害",
      "自我": "你學會接住自己，建立內在力量",
      "真相": "找出真正的兇手，選擇原諒或揭露，獲得正義和內心的平靜"
    },
    "tongueVerdict": [
      "【宣判】行為：85／真相：90",
      "你終於學會站著。不是因為你變強，是因為你不再跪。",
      "你把線索串起來了。你不靠感覺，你靠證據。",
      "你不需要被誰原諒。你已經開始原諒自己了。"
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 10) 限流與安全措施

### 10.1 限流規則

| API 端點 | 限流規則 |
|---------|---------|
| `/api/dialogue/generateNpcReply` | 每用戶每分鐘最多 10 次 |
| `/api/revival/verify-ad` | 每用戶每小時最多 5 次 |
| `/api/revival/verify-rewind-ad` | 每用戶每小時最多 10 次 |
| 其他 API | 每用戶每分鐘最多 60 次 |

### 10.2 安全措施

1. **App Check 驗證**：所有 API 需要 App Check Token
2. **JWT 驗證**：所有 API 需要 Firebase Auth Token
3. **輸入驗證**：使用 Zod 驗證所有輸入
4. **SQL 注入防護**：使用參數化查詢
5. **XSS 防護**：React 自動轉義
6. **CSRF 防護**：使用 SameSite Cookie

### 10.3 錯誤處理

```typescript
// 統一錯誤處理中間件
function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: err.message,
        details: err.details
      },
      timestamp: new Date().toISOString()
    });
  }
  
  if (err instanceof AuthError) {
    return res.status(401).json({
      success: false,
      error: {
        code: "AUTH_INVALID",
        message: "認證失敗"
      },
      timestamp: new Date().toISOString()
    });
  }
  
  // 其他錯誤...
  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_ERROR",
      message: "伺服器內部錯誤"
    },
    timestamp: new Date().toISOString()
  });
}
```

---

## 總結

API 端點的完整實現包括：

1. **基礎設定**：URL、認證、統一響應格式、錯誤碼
2. **遊戲進度 API**：獲取/更新進度
3. **挑戰 API**：獲取挑戰列表/詳情
4. **對話系統 API**：開始對話、處理回應、生成 NPC 回應
5. **情緒系統 API**：獲取/更新情緒狀態
6. **線索系統 API**：獲取線索列表/詳情、關聯分析
7. **復活機制 API**：觸發復活、驗證廣告、回溯
8. **結局系統 API**：計算結局分數、選擇結局
9. **限流與安全**：限流規則、安全措施、錯誤處理

建議按照階段逐步實施，先實現核心 API，再逐步完善限流和安全措施。

