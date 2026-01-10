# 罪語者 (Verbal Sinner) - Firebase 環境規劃

## Firebase 專案概述

### 專案結構
```
verbal-sinner-game/
├── frontend/              # React 前端應用
├── functions/             # Cloud Functions 後端邏輯
├── storage/               # 靜態資源（圖片、音頻）
└── firestore/             # 數據庫結構
```

### Firebase 服務使用

| 服務 | 用途 | 優先級 |
|------|------|--------|
| **Firestore** | 遊戲數據存儲 | ⭐⭐⭐ 核心 |
| **Authentication** | 用戶登入/註冊 | ⭐⭐⭐ 核心 |
| **Storage** | 圖片、音頻、資源文件 | ⭐⭐⭐ 核心 |
| **Hosting** | 前端部署 | ⭐⭐ 重要 |
| **Functions** | 後端邏輯、AI 整合 | ⭐⭐ 重要 |
| **Realtime Database** | 實時對話（可選） | ⭐ 可選 |

---

## Firestore 數據庫設計

### 數據結構原則

1. **公共數據**：所有用戶共享的靜態數據（挑戰、NPC、對話選項）
2. **用戶數據**：每個用戶的遊戲進度、對話記錄、情緒狀態
3. **實時數據**：正在進行的對話會話

### 集合結構設計

```
firestore/
├── public/                    # 公共數據（只讀）
│   ├── challenges/            # 挑戰配置
│   │   └── {challengeId}
│   ├── npcs/                  # NPC 配置
│   │   └── {npcId}
│   ├── dialogueOptions/       # 對話選項配置
│   │   └── {optionId}
│   └── gameConfig/             # 遊戲全局配置
│       └── version
│
├── users/                     # 用戶數據
│   └── {userId}/
│       ├── profile/           # 用戶資料
│       ├── progress/          # 遊戲進度
│       ├── challenges/        # 挑戰記錄
│       │   └── {challengeId}
│       ├── dialogues/         # 對話會話
│       │   └── {sessionId}
│       ├── emotions/          # 情緒狀態
│       │   └── {npcId}
│       └── relationships/     # 關係狀態
│           └── {npcId}
│
└── sessions/                  # 活躍會話（實時）
    └── {sessionId}
```

---

## 詳細數據結構

### 1. 公共數據集合

#### `/public/challenges/{challengeId}`

```typescript
interface Challenge {
  id: string;                    // 挑戰 ID (1-14)
  title: string;                 // 挑戰標題
  description: string;           // 挑戰描述
  category: '職場' | '朋友' | '情人' | '自我';
  difficulty: '簡單' | '中等' | '困難';
  maxRounds: number;             // 最大對話輪次 (3-8)
  targetEmotion: string;         // 目標情緒類型
  npcId: string;                 // 對應 NPC ID
  storyDate: string;             // 故事日期 (ISO 8601)
  
  // 場景配置
  scene: {
    backgroundUrl: string;       // 背景圖片 URL
    musicUrl?: string;            // 背景音樂 URL
    initialDialogue: string;      // NPC 初始對話
  };
  
  // 元數據
  metadata: {
    order: number;                // 挑戰順序
    unlockCondition?: string;    // 解鎖條件
    tags: string[];               // 標籤
  };
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**範例數據**：
```json
{
  "id": "challenge_1",
  "title": "晚餐桌上的空位",
  "description": "家人忘記為你準備碗筷",
  "category": "職場",
  "difficulty": "簡單",
  "maxRounds": 3,
  "targetEmotion": "愧疚",
  "npcId": "npc_mother",
  "storyDate": "2019-01-10",
  "scene": {
    "backgroundUrl": "gs://verbal-sinner/storage/scenes/dinner_table.jpg",
    "initialDialogue": "啊，忘了你也在家。你自己去廚房拿碗吧。"
  },
  "metadata": {
    "order": 1,
    "tags": ["家庭", "被忽視"]
  }
}
```

#### `/public/npcs/{npcId}`

```typescript
interface NPC {
  id: string;
  name: string;
  role: '職場' | '朋友' | '情人' | '家人';
  description: string;           // 角色描述
  
  // 視覺資源
  sprites: {
    normal: string;              // 正常表情 URL
    agitated: string;            // 被激怒表情 URL
    broken: string;              // 崩潰表情 URL
    defeated: string;            // 徹底崩潰表情 URL
  };
  
  // 初始狀態
  initialEmotion: string;        // 初始情緒
  initialIntensity: number;      // 初始強度 (0-100)
  
  // 性格設定（用於 AI 生成）
  personality: {
    traits: string[];            // 性格特質
    speechStyle: string;         // 說話風格
    background: string;          // 背景故事
  };
  
  // 元數據
  metadata: {
    voiceId?: string;            // TTS 語音 ID
    age?: number;
    gender?: string;
  };
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

**範例數據**：
```json
{
  "id": "npc_mother",
  "name": "母親",
  "role": "家人",
  "description": "總是忽略你的存在",
  "sprites": {
    "normal": "gs://verbal-sinner/storage/npcs/mother_normal.png",
    "agitated": "gs://verbal-sinner/storage/npcs/mother_agitated.png",
    "broken": "gs://verbal-sinner/storage/npcs/mother_broken.png",
    "defeated": "gs://verbal-sinner/storage/npcs/mother_defeated.png"
  },
  "initialEmotion": "冷漠",
  "initialIntensity": 50,
  "personality": {
    "traits": ["忽略", "冷漠", "習慣性"],
    "speechStyle": "簡短、不帶感情",
    "background": "習慣性地忽略你的存在，認為這是正常的"
  }
}
```

#### `/public/dialogueOptions/{optionId}`

```typescript
interface DialogueOption {
  id: string;
  challengeId: string;          // 所屬挑戰
  roundNumber: number;           // 輪次 (1, 2, 3...)
  optionText: string;            // 選項文字
  optionType: '積極對抗' | '溫和堅持' | '情感訴求' | '順從消極';
  
  // 情緒影響
  emotionImpact: {
    [emotionType: string]: number;  // 情緒變化值 (-100 to 100)
  };
  
  // 後續處理
  nextRound?: number;            // 下一輪次編號
  isTerminal?: boolean;          // 是否終止對話
  
  // AI 生成相關
  aiContext?: {
    prompt?: string;             // AI 提示詞
    expectedResponse?: string;    // 預期 NPC 回應
  };
  
  createdAt: Timestamp;
}
```

**範例數據**：
```json
{
  "id": "opt_ch1_r1_1",
  "challengeId": "challenge_1",
  "roundNumber": 1,
  "optionText": "媽，我也是這個家的一份子，為什麼每次都要我自己拿碗？",
  "optionType": "積極對抗",
  "emotionImpact": {
    "震驚": 30,
    "愧疚": 20
  },
  "nextRound": 2
}
```

#### `/public/gameConfig/version`

```typescript
interface GameConfig {
  version: string;               // 遊戲版本
  totalChallenges: number;       // 總挑戰數
  categories: {
    [category: string]: {
      count: number;
      challenges: string[];      // 挑戰 ID 列表
    };
  };
  
  // 遊戲設定
  settings: {
    autoSave: boolean;
    defaultDifficulty: string;
    maxRetries: number;
  };
  
  updatedAt: Timestamp;
}
```

---

### 2. 用戶數據集合

#### `/users/{userId}/profile`

```typescript
interface UserProfile {
  userId: string;                 // 對應 Auth UID
  email: string;
  username?: string;
  displayName?: string;
  
  // 遊戲統計
  stats: {
    totalPlayTime: number;       // 總遊戲時間（秒）
    challengesCompleted: number; // 完成挑戰數
    dialoguesCompleted: number;  // 完成對話數
    firstPlayDate: Timestamp;
    lastPlayDate: Timestamp;
  };
  
  // 設定
  settings: {
    soundEnabled: boolean;
    musicEnabled: boolean;
    autoSave: boolean;
    language: string;
  };
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### `/users/{userId}/progress`

```typescript
interface GameProgress {
  userId: string;
  
  // 當前狀態
  currentPhase: 'prologue' | 'revival' | 'challenge' | 'ending';
  currentChallengeId: string | null;
  
  // 進度追蹤
  totalProgress: number;         // 0-20
  completedChallenges: string[]; // 已完成的挑戰 ID 列表
  
  // 分類進度
  categoryProgress: {
    [category: string]: {
      completed: number;
      total: number;
    };
  };
  
  // 里程碑
  milestones: {
    [milestoneId: string]: {
      achieved: boolean;
      achievedAt?: Timestamp;
    };
  };
  
  updatedAt: Timestamp;
}
```

#### `/users/{userId}/challenges/{challengeId}`

```typescript
interface UserChallenge {
  challengeId: string;
  userId: string;
  
  // 挑戰狀態
  status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  startedAt?: Timestamp;
  completedAt?: Timestamp;
  
  // 挑戰結果
  result: {
    roundsUsed: number;          // 使用的輪次
    finalEmotion: string;        // 最終情緒
    targetAchieved: boolean;     // 是否達成目標
    score?: number;              // 評分 (0-100)
  };
  
  // 對話歷史
  dialogueHistory: {
    round: number;
    playerOption: string;
    npcResponse: string;
    emotionBefore: string;
    emotionAfter: string;
    timestamp: Timestamp;
  }[];
  
  // 重試記錄
  retries: number;
  lastRetryAt?: Timestamp;
  
  updatedAt: Timestamp;
}
```

#### `/users/{userId}/dialogues/{sessionId}`

```typescript
interface DialogueSession {
  sessionId: string;
  userId: string;
  challengeId: string;
  npcId: string;
  
  // 會話狀態
  status: 'active' | 'completed' | 'failed' | 'abandoned';
  currentRound: number;
  maxRounds: number;
  
  // 當前狀態
  currentState: {
    npcEmotion: string;
    emotionIntensity: number;
    targetEmotion: string;
    lastMessage?: string;
  };
  
  // 對話歷史
  history: {
    round: number;
    type: 'player' | 'npc';
    message: string;
    optionId?: string;
    emotionChange?: {
      before: string;
      after: string;
      delta: number;
    };
    timestamp: Timestamp;
  }[];
  
  startedAt: Timestamp;
  updatedAt: Timestamp;
  completedAt?: Timestamp;
}
```

#### `/users/{userId}/emotions/{npcId}`

```typescript
interface EmotionState {
  userId: string;
  npcId: string;
  
  // 當前情緒
  currentEmotion: string;
  intensity: number;             // 0-100
  
  // 情緒歷史
  emotionHistory: {
    emotion: string;
    intensity: number;
    timestamp: Timestamp;
    trigger?: string;            // 觸發原因
  }[];
  
  // 目標追蹤
  targetEmotion?: string;
  targetAchieved: boolean;
  targetAchievedAt?: Timestamp;
  
  updatedAt: Timestamp;
}
```

#### `/users/{userId}/relationships/{npcId}`

```typescript
interface Relationship {
  userId: string;
  npcId: string;
  
  // 關係狀態
  opinionScore: number;           // -100 to 100
  relationshipLevel: '敵對' | '冷漠' | '中立' | '友好' | '親密';
  
  // 互動記錄
  interactions: {
    challengeId: string;
    outcome: 'positive' | 'negative' | 'neutral';
    emotionChange: number;
    timestamp: Timestamp;
  }[];
  
  // 里程碑
  milestones: {
    [milestoneId: string]: {
      achieved: boolean;
      achievedAt?: Timestamp;
    };
  };
  
  lastInteraction: Timestamp;
  updatedAt: Timestamp;
}
```

---

### 3. 實時會話集合（可選）

#### `/sessions/{sessionId}`

```typescript
interface ActiveSession {
  sessionId: string;
  userId: string;
  challengeId: string;
  npcId: string;
  
  // 實時狀態
  currentRound: number;
  npcEmotion: string;
  emotionIntensity: number;
  
  // 最後活動
  lastActivity: Timestamp;
  expiresAt: Timestamp;          // 會話過期時間
  
  // 狀態標記
  isActive: boolean;
}
```

---

## Firebase Storage 規劃

### 存儲結構

```
gs://verbal-sinner-game.appspot.com/
├── scenes/                      # 場景圖片
│   ├── prologue/                # 前情提要場景
│   │   ├── scene_1.jpg
│   │   ├── scene_2.jpg
│   │   └── ...
│   └── challenges/              # 挑戰場景
│       ├── challenge_1/
│       │   ├── background.jpg
│       │   └── variants/
│       │       ├── normal.jpg
│       │       ├── twilight.jpg
│       │       └── broken.jpg
│       └── ...
│
├── npcs/                        # NPC 資源
│   ├── {npcId}/
│   │   ├── sprites/
│   │   │   ├── normal.png
│   │   │   ├── agitated.png
│   │   │   ├── broken.png
│   │   │   └── defeated.png
│   │   └── avatar.png
│   └── ...
│
├── audio/                       # 音頻資源
│   ├── music/                   # 背景音樂
│   │   ├── prologue.mp3
│   │   ├── challenge_bg.mp3
│   │   └── ending.mp3
│   ├── sfx/                     # 音效
│   │   ├── emotion_change.mp3
│   │   ├── challenge_complete.mp3
│   │   └── ...
│   └── tts/                     # TTS 生成音頻（緩存）
│       └── {hash}.mp3
│
├── ui/                          # UI 資源
│   ├── icons/
│   ├── buttons/
│   └── effects/
│
└── temp/                        # 臨時文件
    └── uploads/
```

### Storage 安全規則

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // 公共資源（所有人可讀）
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                      request.auth.token.admin == true;
    }
    
    // 場景圖片（所有人可讀）
    match /scenes/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                      request.auth.token.admin == true;
    }
    
    // NPC 資源（所有人可讀）
    match /npcs/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                      request.auth.token.admin == true;
    }
    
    // 音頻資源（所有人可讀）
    match /audio/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                      request.auth.token.admin == true;
    }
    
    // TTS 緩存（所有人可讀，用戶可寫入自己的）
    match /audio/tts/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && 
                      request.auth.uid == userId;
    }
    
    // 用戶上傳（僅用戶自己）
    match /users/{userId}/{allPaths=**} {
      allow read: if request.auth != null && 
                     request.auth.uid == userId;
      allow write: if request.auth != null && 
                      request.auth.uid == userId &&
                      request.resource.size < 10 * 1024 * 1024; // 10MB
    }
  }
}
```

---

## Firestore 安全規則

### 安全規則設計

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ========== 公共數據（只讀） ==========
    match /public/{document=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                      request.auth.token.admin == true;
    }
    
    // ========== 用戶數據 ==========
    match /users/{userId} {
      // 用戶資料（用戶自己可讀寫）
      match /profile {
        allow read: if request.auth != null && 
                       request.auth.uid == userId;
        allow write: if request.auth != null && 
                        request.auth.uid == userId;
      }
      
      // 遊戲進度（用戶自己可讀寫）
      match /progress {
        allow read: if request.auth != null && 
                       request.auth.uid == userId;
        allow write: if request.auth != null && 
                        request.auth.uid == userId;
      }
      
      // 挑戰記錄（用戶自己可讀寫）
      match /challenges/{challengeId} {
        allow read: if request.auth != null && 
                       request.auth.uid == userId;
        allow create: if request.auth != null && 
                         request.auth.uid == userId;
        allow update: if request.auth != null && 
                         request.auth.uid == userId &&
                         request.resource.data.userId == userId;
        allow delete: if false; // 不允許刪除
      }
      
      // 對話會話（用戶自己可讀寫）
      match /dialogues/{sessionId} {
        allow read: if request.auth != null && 
                       request.auth.uid == userId;
        allow create: if request.auth != null && 
                         request.auth.uid == userId;
        allow update: if request.auth != null && 
                         request.auth.uid == userId &&
                         request.resource.data.userId == userId;
        allow delete: if request.auth != null && 
                         request.auth.uid == userId;
      }
      
      // 情緒狀態（用戶自己可讀寫）
      match /emotions/{npcId} {
        allow read: if request.auth != null && 
                       request.auth.uid == userId;
        allow write: if request.auth != null && 
                        request.auth.uid == userId;
      }
      
      // 關係狀態（用戶自己可讀寫）
      match /relationships/{npcId} {
        allow read: if request.auth != null && 
                       request.auth.uid == userId;
        allow write: if request.auth != null && 
                        request.auth.uid == userId;
      }
    }
    
    // ========== 實時會話（可選） ==========
    match /sessions/{sessionId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
                       (request.resource.data.userId == request.auth.uid ||
                        resource.data.userId == request.auth.uid);
      allow delete: if request.auth != null && 
                       resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## Firebase Authentication 規劃

### 認證方式

1. **匿名登入**（初期 MVP）
   - 快速開始遊戲
   - 數據存儲在本地，可後續綁定帳號

2. **Email/Password**（主要方式）
   - 標準註冊/登入
   - 支持密碼重置

3. **Google 登入**（後續擴展）
   - 一鍵登入
   - 提升用戶體驗

4. **其他社交登入**（可選）
   - Facebook、Twitter 等

### 用戶資料結構

```typescript
interface AuthUser {
  uid: string;                   // Firebase Auth UID
  email: string;
  emailVerified: boolean;
  displayName?: string;
  photoURL?: string;
  
  // 自定義聲明（Custom Claims）
  customClaims?: {
    admin?: boolean;
    premium?: boolean;
    beta?: boolean;
  };
  
  metadata: {
    creationTime: string;
    lastSignInTime: string;
  };
}
```

---

## Firebase Functions 規劃

### Functions 結構

```
functions/
├── src/
│   ├── index.ts                 # 入口文件
│   ├── dialogue/                # 對話相關
│   │   ├── generateResponse.ts  # AI 生成回應
│   │   ├── processEmotion.ts    # 處理情緒變化
│   │   └── validateDialogue.ts  # 驗證對話
│   ├── challenge/               # 挑戰相關
│   │   ├── completeChallenge.ts # 完成挑戰
│   │   ├── updateProgress.ts    # 更新進度
│   │   └── checkMilestone.ts    # 檢查里程碑
│   ├── ai/                      # AI 整合
│   │   ├── openai.ts            # OpenAI 整合
│   │   ├── claude.ts            # Claude 整合
│   │   └── tts.ts               # TTS 生成
│   ├── utils/                   # 工具函數
│   │   ├── auth.ts              # 認證工具
│   │   ├── validation.ts        # 數據驗證
│   │   └── errors.ts            # 錯誤處理
│   └── triggers/                # 觸發器
│       ├── onUserCreate.ts      # 用戶創建時
│       ├── onChallengeComplete.ts # 挑戰完成時
│       └── onProgressUpdate.ts  # 進度更新時
├── package.json
└── tsconfig.json
```

### 主要 Functions

#### 1. HTTP Functions（API 端點）

```typescript
// functions/src/index.ts

import { onRequest } from 'firebase-functions/v2/https';
import { generateDialogueResponse } from './dialogue/generateResponse';
import { completeChallenge } from './challenge/completeChallenge';

// 生成 NPC 回應
export const generateNPCResponse = onRequest({
  cors: true,
  timeoutSeconds: 30,
}, async (req, res) => {
  // 驗證認證
  // 調用 AI 生成回應
  // 返回結果
});

// 完成挑戰
export const completeChallenge = onRequest({
  cors: true,
}, async (req, res) => {
  // 驗證挑戰完成
  // 更新進度
  // 返回結果
});
```

#### 2. Firestore Triggers

```typescript
// 用戶創建時初始化資料
export const onUserCreate = onDocumentCreated(
  'users/{userId}/profile',
  async (event) => {
    const userId = event.params.userId;
    
    // 初始化遊戲進度
    await admin.firestore()
      .collection('users')
      .doc(userId)
      .collection('progress')
      .doc('current')
      .set({
        currentPhase: 'prologue',
        totalProgress: 0,
        completedChallenges: [],
        // ...
      });
  }
);

// 挑戰完成時觸發
export const onChallengeComplete = onDocumentUpdated(
  'users/{userId}/challenges/{challengeId}',
  async (event) => {
    const data = event.data.after.data();
    
    if (data.status === 'completed') {
      // 更新總進度
      // 檢查里程碑
      // 發送通知
    }
  }
);
```

#### 3. Scheduled Functions（定時任務）

```typescript
// 清理過期會話
export const cleanupSessions = onSchedule(
  'every 1 hours',
  async () => {
    // 清理過期的對話會話
  }
);
```

---

## Firebase Hosting 規劃

### 部署配置

```json
// firebase.json
{
  "hosting": {
    "public": "frontend/dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|gif|png|svg|webp)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=3600"
          }
        ]
      }
    ]
  }
}
```

### 環境變數配置

```bash
# .env.production
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 前端 Firebase 整合

### Firebase SDK 初始化

```typescript
// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export default app;
```

### Firestore 數據服務

```typescript
// src/services/firestoreService.ts
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '@/config/firebase';

// 獲取挑戰列表
export async function getChallenges() {
  const challengesRef = collection(db, 'public/challenges');
  const snapshot = await getDocs(challengesRef);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

// 獲取用戶進度
export async function getUserProgress(userId: string) {
  const progressRef = doc(db, `users/${userId}/progress/current`);
  const snapshot = await getDoc(progressRef);
  return snapshot.data();
}

// 實時監聽對話會話
export function subscribeDialogueSession(
  userId: string,
  sessionId: string,
  callback: (data: any) => void
) {
  const sessionRef = doc(db, `users/${userId}/dialogues/${sessionId}`);
  return onSnapshot(sessionRef, (snapshot) => {
    callback(snapshot.data());
  });
}
```

---

## 開發環境設置

### 1. Firebase 專案創建

```bash
# 安裝 Firebase CLI
npm install -g firebase-tools

# 登入 Firebase
firebase login

# 初始化專案
firebase init

# 選擇服務：
# - Firestore
# - Functions
# - Hosting
# - Storage
```

### 2. 本地開發環境

```bash
# 啟動 Firestore Emulator
firebase emulators:start --only firestore

# 啟動 Functions Emulator
firebase emulators:start --only functions

# 啟動所有 Emulators
firebase emulators:start
```

### 3. 環境變數配置

```bash
# .env.local
VITE_FIREBASE_USE_EMULATOR=true
VITE_FIREBASE_EMULATOR_HOST=localhost
VITE_FIREBASE_EMULATOR_FIRESTORE_PORT=8080
```

---

## 數據遷移與初始化

### 初始化腳本

```typescript
// scripts/initFirestore.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import challengesData from './data/challenges.json';
import npcsData from './data/npcs.json';

async function initializeFirestore() {
  // 初始化挑戰數據
  for (const challenge of challengesData) {
    await setDoc(
      doc(db, 'public/challenges', challenge.id),
      challenge
    );
  }
  
  // 初始化 NPC 數據
  for (const npc of npcsData) {
    await setDoc(
      doc(db, 'public/npcs', npc.id),
      npc
    );
  }
  
  // 初始化遊戲配置
  await setDoc(
    doc(db, 'public/gameConfig/version'),
    {
      version: '1.0.0',
      totalChallenges: 20,
      // ...
    }
  );
}
```

---

## 成本估算

### Firebase 定價（Blaze Plan）

| 服務 | 免費額度 | 超出後價格 |
|------|----------|------------|
| **Firestore** | 50K 讀/日, 20K 寫/日 | $0.06/10萬讀, $0.18/10萬寫 |
| **Storage** | 5GB | $0.026/GB/月 |
| **Functions** | 200萬次/月 | $0.40/百萬次 |
| **Hosting** | 10GB 存儲, 360MB/日 | $0.026/GB 存儲, $0.15/GB 傳輸 |
| **Authentication** | 免費 | 免費 |

### 初期成本估算（1000 用戶/月）

- **Firestore**：約 $5-10/月（假設每用戶 100 次讀寫/日）
- **Storage**：約 $2-5/月（假設 10GB 資源）
- **Functions**：約 $1-3/月（假設 10萬次調用/月）
- **Hosting**：約 $1-2/月（假設 5GB 傳輸/月）
- **總計**：約 **$9-20/月**

---

## 最佳實踐

### 1. 數據讀取優化

- **使用索引**：為常用查詢創建複合索引
- **批量讀取**：使用 `getDocs` 批量獲取數據
- **分頁查詢**：使用 `limit` 和 `startAfter` 分頁
- **緩存策略**：前端緩存靜態數據（挑戰、NPC）

### 2. 寫入優化

- **批量寫入**：使用 `batch()` 批量寫入
- **事務處理**：關鍵操作使用事務
- **離線支持**：使用 Firestore 離線持久化

### 3. 安全最佳實踐

- **最小權限原則**：只授予必要的權限
- **數據驗證**：在 Functions 中驗證所有輸入
- **速率限制**：防止濫用
- **審計日誌**：記錄重要操作

### 4. 性能監控

- **Firebase Console**：監控使用量
- **Performance Monitoring**：監控應用性能
- **Crashlytics**：追蹤錯誤

---

## 總結

這個 Firebase 環境規劃提供了：

1. **完整的數據結構**：公共數據和用戶數據分離
2. **安全規則**：確保數據安全
3. **存儲規劃**：資源文件組織清晰
4. **Functions 設計**：後端邏輯模組化
5. **開發流程**：從本地到生產的完整流程
6. **成本可控**：初期成本低，按需擴展

建議按照階段逐步實施，先建立基礎結構，再逐步完善功能。

