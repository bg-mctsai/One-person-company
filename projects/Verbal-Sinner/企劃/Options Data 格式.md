# Options Data 格式（對話輪次/發話流程/產製策略）

> 目的：定義「每輪誰先說話」與「3–4 選項」的可落地資料結構。  
> 核心原則：**勝負由規則引擎（屬性/輪次/閾值）決定；AI 只做 NPC 回覆的表演文本。**

---

## 1) 對話輪次（硬流程）

### 1.1 單 keyNpc（最常見）

固定節奏（每幕重複）：

1. **進場**：載入 `MomentSpec`（見 `Moment Spec 表.md`） → 套用 `entryOverrides` → 產生 NPC 屬性「進場快照」
2. **開場台詞**：`keyNpc` 先說 1 句（可模板或 AI）
3. **Round i（迴圈）**：
   - 玩家從 **3–4 個選項**中選 1 個（每個選項必帶 `optionType`）
   - 規則引擎依 `optionType`（+可選 tags）更新屬性
   - 規則引擎把更新後的屬性映射為表層情緒（`出場角色.md`）
   - `keyNpc` 回 1–2 句（AI 或模板）
   - 檢查 **成功/失手**：
     - 成功：命中 `targetEmotion` 或 `targetAttrThresholds`
     - 失手：`turnsLeft==0` 或 命中 `failHard`
4. **離場**：成功產出固定 `clueId`；失手進 `復活機制.md` 的回溯（看訊息回到 5 分鐘前）

### 1.2 多 NPC（同幕多人在場）

仍以 `keyNpc` 為主，其他人只能「插話」，不主導判定。

**插話規則（deterministic，避免劇情爆炸）**

- 每輪最多 **1 次插話**
- 插話優先級（高→低）：
  1. **supportNpc** 命中「插話觸發」條件（例如：同事A.恐懼>=70 → 露出破綻）
  2. `keyNpc` 受到玩家選項 `tag=證據` → 其他人先沉默（本輪不插話）
  3. 預設：不插話

插話發生時，輸出順序固定：

`keyNpc`（回應）→ `supportNpc`（插 1 句）→ 下一輪玩家選項

> 注意：不做「A→B→玩家→B→玩家…」那種多主角輪替（會讓輪次/判定/內容產能爆炸）。  
> 你要的沉浸與可控，最佳解是：**永遠只有一個 keyNpc 主導對話節奏**。

---

## 2) Options Data Schema（建議最小可跑版）

> 這份 schema 讓你能先做「固定選項 + AI 回覆」的 MVP；之後要改成全 AI 或半 AI 都不用換資料結構。

### 2.1 Type 定義（概念）

- `MomentConfig`
  - `momentId`
  - `opening`
  - `rounds[]`
  - `supportInterjections[]`（可選）
- `RoundConfig`
  - `roundId`
  - `npcPrompt`（給 AI 的 prompt seed 或模板 key）
  - `options[]`（3–4 個）
- `Option`
  - `id`
  - `text`（顯示）
  - `optionType`：積極對抗 / 溫和堅持 / 情感訴求 / 順從消極
  - `tags`（可選）：證據 / 界線 / 後果 / 反問 / 退縮（用來做額外修飾）
  - `attrDeltaOverrides`（可選）：少量覆寫（用於關鍵幕）

### 2.2 JSON 範例（Moment 7：被推卸責任，5 輪）

```json
{
  "momentId": 7,
  "opening": {
    "speaker": "主管",
    "mode": "ai",
    "npcPrompt": "冷、短句、壓迫感；先問責"
  },
  "rounds": [
    {
      "roundId": 1,
      "npcPrompt": "主管：問你延誤怎麼解釋（冷漠）",
      "options": [
        {
          "id": "r1_o1",
          "text": "我先把時間線講清楚：我在 XX 日完成交付，延誤發生在後續轉交。",
          "optionType": "溫和堅持",
          "tags": ["證據"]
        },
        {
          "id": "r1_o2",
          "text": "對不起…我會想辦法補救。",
          "optionType": "順從消極",
          "tags": ["退縮"]
        },
        {
          "id": "r1_o3",
          "text": "這不是我造成的。請你先看我這份交付紀錄。",
          "optionType": "積極對抗",
          "tags": ["證據", "界線"]
        },
        {
          "id": "r1_o4",
          "text": "你想要的是解釋，還是你已經決定要我背？",
          "optionType": "積極對抗",
          "tags": ["反問"]
        }
      ]
    }
  ],
  "supportInterjections": [
    {
      "npc": "同事A",
      "priority": 10,
      "when": "同事A.恐懼>=70",
      "lineMode": "template",
      "templateKey": "interject.threatened.1"
    }
  ]
}
```

---

## 3) 產製策略（我幫你定死）

### 3.1 MVP（推薦）：**固定選項 + AI 只回 NPC 台詞**

- **選項（Option）**：你寫死（或用模板半自動產生，再人工修）
  - 好處：公平、可測、可平衡、可控禁詞、可控推理節奏
  - 壞處：內容產能壓力大（但你可以用模板化解）
- **NPC 回覆（npc_reply）**：AI 生成 1–2 句
  - 但 AI 輸出只影響「顯示」，不影響判定

### 3.2 內容省力：選項模板化（建議做）

- 每個 `optionType` 準備 20–30 個句型模板（帶 slot）
  - `證據` slot：{文件/截圖/時間點/交付紀錄}
  - `界線` slot：{請用事實討論/我不接受背鍋/先確認流程}
  - `後果` slot：{若要我背請寫入會議紀錄/我會正式提報}
- 每幕只填 token（把 80% 寫作變成填空）

---

## 4) 禁用詞與風格約束（對齊介面字串）

- 顯示文本（NPC/玩家選項）不可出現：遊戲/關卡/玩家/挑戰/UI（見 `介面字串表.md`）
- NPC 回覆長度：1–2 句（短、狠、帶壓迫/甜/冷依角色）

