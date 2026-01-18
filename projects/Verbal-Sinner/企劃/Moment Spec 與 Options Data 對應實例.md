# Moment Spec 與 Options Data 對應實例

> 目的：提供 Moment Spec 表與 Options Data 格式的完整對應實例，確保工程落地時有明確的參考。  
> 依賴文件：`Moment Spec 表.md`、`Options Data 格式.md`、`moment-configs/moment-*.json`。

---

## 1) 對應關係說明

### 1.1 數據流

```
Moment Spec 表（配置）
   ↓
moment-configs/moment-{id}.json（完整配置）
   ↓
Options Data 格式（前端使用）
   ↓
遊戲運行
```

### 1.2 關鍵對應點

| Moment Spec 欄位 | Options Data 欄位 | 說明 |
|-----------------|------------------|------|
| `momentId` | `momentId` | 時刻 ID |
| `maxTurns` | `rounds[].roundId` | 輪次上限對應 rounds 數量 |
| `keyNpc` | `opening.speaker` / `rounds[].npcPrompt` | 主要 NPC |
| `target` | - | 成功條件（前端判定用） |
| `failHard` | - | 失敗條件（前端判定用） |
| `entryOverrides` | - | 入幕屬性修正（後端處理） |
| `clueIds` | - | 線索 ID（成功後產出；可一次多條） |
| `seedMap` | - | 金手指 seed（對應 `金手指提示庫.md`） |

---

## 2) 完整對應實例：時刻 7（被推卸責任）

### 2.1 Moment Spec 表配置

| 欄位 | 值 |
|------|-----|
| momentId | 7 |
| date | 2019/09/10 |
| category | 職場 |
| title | 被推卸責任 |
| maxTurns | 5 |
| keyNpc | 王明哲 |
| supportNpcs | 許子維 |
| target | targetEmotion=尊重 |
| failHard | 王明哲.警戒>=90 或 王明哲.壓力>=95 |
| entryOverrides | 許子維.恐懼+20 |
| clueIds | [CLUE-07] |
| seedMap | 許子維:T林予衡EATENED/RUMOR；王明哲:WATCH |

### 2.2 Options Data 格式（moment-07.json）

```json
{
  "momentId": 7,
  "date": "2019/09/10",
  "category": "職場",
  "title": "被推卸責任",
  "maxTurns": 5,
  "keyNpc": "王明哲",
  "supportNpcs": ["許子維"],
  "target": { "type": "emotion", "value": "尊重" },
  "failHard": [
    "王明哲.警戒>=90",
    "王明哲.壓力>=95"
  ],
  "clueIds": ["CLUE-07"],
  "opening": {
    "speaker": "王明哲",
    "mode": "ai",
    "npcPrompt": "冷、短句、壓迫感；先問責；不講道理只要結果；不得出現禁用詞"
  },
  "rounds": [
    {
      "roundId": 1,
      "npcPrompt": "王明哲：這次延誤，你負責的部分怎麼解釋？（冷漠）",
      "options": [
        {
          "id": "r1_o1",
          "text": "我先把時間線說清楚：我在 XX 日完成交付，延誤發生在後續轉交。",
          "optionType": "溫和堅持",
          "tags": ["證據", "時間點"]
        },
        {
          "id": "r1_o2",
          "text": "我願意補救，但我不接受把不是我的責任算到我頭上。",
          "optionType": "溫和堅持",
          "tags": ["界線"]
        },
        {
          "id": "r1_o3",
          "text": "這不是我造成的。請先看我這份交付紀錄。",
          "optionType": "積極對抗",
          "tags": ["證據", "界線"]
        },
        {
          "id": "r1_o4",
          "text": "對不起…我會想辦法補。",
          "optionType": "順從消極",
          "tags": ["退縮"]
        }
      ]
    },
    // ... 更多 rounds
  ],
  "supportInterjections": [
    {
      "npc": "許子維",
      "priority": 10,
      "when": "許子維.恐懼>=70",
      "lineMode": "template",
      "templateKey": "interject.threatened.1"
    }
  ]
}
```

### 2.3 對應關係驗證

✅ **momentId**: 7 → 對應  
✅ **maxTurns**: 5 → rounds 數量 = 5  
✅ **keyNpc**: 王明哲 → opening.speaker = "王明哲"  
✅ **target**: targetEmotion=尊重 → target.value = "尊重"  
✅ **failHard**: 王明哲.警戒>=90 → failHard 包含此條件  
✅ **entryOverrides**: 許子維.恐懼+20 → 後端處理（不在 JSON 中）  
✅ **clueIds**: [CLUE-07] → 成功後產出（JSON 或主線 map）  
✅ **seedMap**: 許子維:T林予衡EATENED/RUMOR → 對應 `金手指提示庫.md`  

---

## 3) 工程落地檢查清單

### 3.1 數據完整性檢查

- [ ] 所有 14 個 moment-configs 文件存在
- [ ] 每個文件的 `momentId` 與文件名對應
- [ ] 每個文件的 `maxTurns` 與 `rounds` 數量一致
- [ ] 每個文件的 `target` 格式正確
- [ ] 每個文件的 `failHard` 格式正確
- [ ] 每個文件的 `opening` 格式正確
- [ ] 每個文件的 `rounds` 格式正確
- [ ] 每個文件的 `supportInterjections` 格式正確（可選）

### 3.2 內容完整性檢查

- [ ] 每個 round 至少有 3 個選項
- [ ] 每個選項都有 `optionType`（積極對抗/溫和堅持/情感訴求/順從消極）
- [ ] 每個選項都有 `tags`（至少 1 個）
- [ ] 每個選項的文字符合沉浸用語規範（無禁用詞）
- [ ] 每個 NPC prompt 符合角色性格

### 3.3 對應關係檢查

- [ ] `Moment Spec 表.md` 的配置與 `moment-configs/moment-*.json` 一致
- [ ] `clueId` 與 `線索系統實現.md` 的線索定義對應
- [ ] `seedMap` 與 `金手指提示庫.md` 的 seed 定義對應
- [ ] `entryOverrides` 與 `出場角色.md` 的屬性定義對應

---

## 4) 數據驗證規則

### 4.1 TypeScript 類型定義（建議）

```typescript
interface MomentConfig {
  momentId: number;              // 1-14
  date: string;                  // YYYY/MM/DD
  category: '職場' | '情人' | '自我';
  title: string;
  maxTurns: number;              // 3-8
  keyNpc: string;
  supportNpcs: string[];
  target: {
    type: 'emotion' | 'attrThresholds';
    value: string | string[];
  };
  failHard: string[];
  opening: {
    speaker: string;
    mode: 'ai' | 'template';
    npcPrompt: string;
  };
  rounds: RoundConfig[];
  supportInterjections?: SupportInterjection[];
}

interface RoundConfig {
  roundId: number;
  npcPrompt: string;
  options: Option[];
}

interface Option {
  id: string;
  text: string;
  optionType: '積極對抗' | '溫和堅持' | '情感訴求' | '順從消極';
  tags: string[];
  attrDeltaOverrides?: Record<string, number>;  // 可選
}
```

### 4.2 驗證腳本（建議）

```typescript
// scripts/validateMomentConfigs.ts
import momentConfigs from './moment-configs';

function validateMomentConfigs() {
  const errors: string[] = [];
  
  // 檢查所有 14 個時刻都存在
  for (let i = 1; i <= 14; i++) {
    const config = momentConfigs.find(c => c.momentId === i);
    if (!config) {
      errors.push(`時刻 ${i} 不存在`);
      continue;
    }
    
    // 檢查 maxTurns 與 rounds 數量一致
    if (config.maxTurns !== config.rounds.length) {
      errors.push(`時刻 ${i}: maxTurns (${config.maxTurns}) 與 rounds 數量 (${config.rounds.length}) 不一致`);
    }
    
    // 檢查每個 round 至少有 3 個選項
    config.rounds.forEach((round, idx) => {
      if (round.options.length < 3) {
        errors.push(`時刻 ${i} Round ${idx + 1}: 選項數量不足 3 個`);
      }
    });
    
    // 檢查禁用詞
    const forbiddenWords = ['遊戲', '關卡', '玩家', '挑戰', 'UI'];
    config.rounds.forEach((round, idx) => {
      round.options.forEach((option, optIdx) => {
        forbiddenWords.forEach(word => {
          if (option.text.includes(word)) {
            errors.push(`時刻 ${i} Round ${idx + 1} Option ${optIdx + 1}: 包含禁用詞 "${word}"`);
          }
        });
      });
    });
  }
  
  if (errors.length > 0) {
    console.error('驗證失敗：', errors);
    return false;
  }
  
  console.log('驗證通過！');
  return true;
}
```

---

## 5) 數據初始化流程

### 5.1 初始化腳本（Firestore）

```typescript
// scripts/initMomentConfigs.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import moment01 from './moment-configs/moment-01.json';
import moment02 from './moment-configs/moment-02.json';
// ... 其他時刻

async function initializeMomentConfigs() {
  const db = getFirestore();
  
  const configs = [
    moment01, moment02, moment03, moment04, moment05,
    moment06, moment07, moment08, moment09, moment10,
    moment11, moment12, moment13, moment14
  ];
  
  for (const config of configs) {
    await setDoc(
      doc(db, 'public/moments', `moment-${config.momentId}`),
      {
        ...config,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    );
  }
  
  console.log('時刻配置初始化完成！');
}
```

---

## 總結

Moment Spec 與 Options Data 的對應實例包括：

1. **對應關係說明**：Moment Spec 表與 Options Data 格式的對應點
2. **完整對應實例**：時刻 7 的完整對應範例
3. **工程落地檢查清單**：數據完整性、內容完整性、對應關係檢查
4. **數據驗證規則**：TypeScript 類型定義、驗證腳本
5. **數據初始化流程**：Firestore 初始化腳本

建議按照階段逐步實施，先建立基礎的驗證框架，再逐步完善數據初始化流程。

