# Moment Configs 補強指南

> 目的：為所有 14 個 moment-configs 文件添加缺失的欄位（clueId、seedMap、entryOverrides）。  
> 參考：`Moment Spec 表.md`、`線索系統實現.md`。

---

## 需要添加的欄位

### 1. clueId（必填）

格式：`"CLUE-01"` ~ `"CLUE-14"`

### 2. seedMap（必填）

格式：
```json
"seedMap": {
  "NPC名稱": ["SEED1", "SEED2"]
}
```

### 3. entryOverrides（可選）

格式：
```json
"entryOverrides": {
  "NPC名稱": {
    "屬性名": 數值
  }
}
```

---

## 所有時刻的配置對照表

| momentId | clueId | seedMap | entryOverrides |
|----------|--------|---------|----------------|
| 1 | CLUE-01 | 許子維:MASK/PROBE；王明哲:WATCH | 許子維.信任+0 |
| 2 | CLUE-02 | 許子維:PROBE | 許子維.信任+5 |
| 3 | CLUE-03 | 王明哲:WATCH；同事群:RUMOR | 同事群.觀望+10 |
| 4 | CLUE-04 | 周承翰:REPORT | 周承翰.信任+5 |
| 5 | CLUE-05 | 周承翰:LIE/PROBE | 周承翰.警戒+5 |
| 6 | CLUE-06 | 許子維:COLLUSION/PROBE；王明哲:KNOW | 王明哲.困惑+20 |
| 7 | CLUE-07 | 許子維:T林予衡EATENED/RUMOR；王明哲:WATCH | 許子維.恐懼+20 |
| 8 | CLUE-08 | 許子維:COLLUSION；王明哲:KNOW | 許子維.警戒+10 |
| 9 | CLUE-09 | 周承翰:LIE | 周承翰.罪惡感+5 |
| 10 | CLUE-10 | 周承翰:REPORT/MASK | 周承翰.警戒+10 |
| 11 | CLUE-11* | 王明哲:T林予衡EATENED/KNOW；許子維:COLLUSION/PROBE；林予衡:WATCH/KNOW | 王明哲.恐懼+30；林予衡.警戒+5 |
| 12 | CLUE-12* | 許子維:T林予衡EATENED/RUMOR；同事群:RUMOR | 許子維.恐懼+20；同事群.傳播性+10 |
| 13 | CLUE-13* | 周承翰:T林予衡EATENED/SHAME；旁人:RUMOR | 周承翰.恐懼+35 |
| 14 | CLUE-14* | 過去的自己:SELF/FINAL | （照初始） |

---

## JSON 格式範例

### moment-01.json（已補強）

```json
{
  "momentId": 1,
  "date": "2019/01/10",
  "category": "職場",
  "title": "初入職場的歡迎",
  "maxTurns": 3,
  "keyNpc": "許子維",
  "supportNpcs": ["王明哲"],
  "target": { "type": "emotion", "value": "尊重" },
  "failHard": ["許子維.警戒>=90"],
  "entryOverrides": {
    "許子維": { "信任": 0 }
  },
  "clueId": "CLUE-01",
  "seedMap": {
    "許子維": ["MASK", "PROBE"],
    "王明哲": ["WATCH"]
  },
  "opening": { ... },
  "rounds": [ ... ],
  "supportInterjections": [ ... ]
}
```

### moment-02.json（已補強）

```json
{
  "momentId": 2,
  "date": "2019/02/15",
  "category": "職場",
  "title": "第一次合作",
  "maxTurns": 3,
  "keyNpc": "許子維",
  "supportNpcs": [],
  "target": { "type": "emotion", "value": "認同" },
  "failHard": ["許子維.憤怒>=80"],
  "entryOverrides": {
    "許子維": { "信任": 5 }
  },
  "clueId": "CLUE-02",
  "seedMap": {
    "許子維": ["PROBE"]
  },
  "opening": { ... },
  "rounds": [ ... ],
  "supportInterjections": [ ... ]
}
```

---

## 補強步驟

### 步驟 1：添加 clueId

在 `failHard` 之後、`opening` 之前添加：
```json
"clueId": "CLUE-XX",
```

### 步驟 2：添加 seedMap

在 `clueId` 之後添加：
```json
"seedMap": {
  "NPC名稱": ["SEED1", "SEED2"]
},
```

### 步驟 3：添加 entryOverrides（如果有）

在 `failHard` 之後、`clueId` 之前添加：
```json
"entryOverrides": {
  "NPC名稱": {
    "屬性名": 數值
  }
},
```

---

## 注意事項

1. **時刻 2 的 target**：目前是 `認同`，但 Moment Spec 表中是 `尊重`。需要確認哪個是正確的。
2. **時刻 14 的 entryOverrides**：Moment Spec 表中寫「（照初始）」，表示不需要 entryOverrides。
3. **seedMap 格式**：使用陣列格式 `["SEED1", "SEED2"]`，不是字串格式。
4. **entryOverrides 格式**：使用物件格式 `{ "屬性名": 數值 }`，不是字串格式。

---

## 驗證

補強完成後，執行驗證腳本：
```bash
node 企劃/scripts/validate-moments.js
```

確保所有欄位都正確添加。

---

## 剩餘需要補強的時刻

- [x] moment-01.json
- [x] moment-02.json
- [ ] moment-03.json
- [ ] moment-04.json
- [ ] moment-05.json
- [ ] moment-06.json
- [ ] moment-07.json
- [ ] moment-08.json
- [ ] moment-09.json
- [ ] moment-10.json
- [ ] moment-11.json
- [ ] moment-12.json
- [ ] moment-13.json
- [ ] moment-14.json

