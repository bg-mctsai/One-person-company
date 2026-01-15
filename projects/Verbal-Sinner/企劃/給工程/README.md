# 給工程（實作交付索引）

> 目標：工程不用讀全部企劃，就能把主線跑起來。

---

## 0) 先跑主線（必讀 5 份）

1. **主線配置（10 幕）**：`../moment-configs/mainline-map.json`
2. **Options / rounds 資料結構**：`../Options Data 格式.md`
3. **MomentSpec（14 幕完整版對齊 moment-configs）**：`../Moment Spec 表.md`
4. **UI 字串（含入場背景卡/終局審判）**：`../介面字串表.md`
5. **AI 串接（含 Interrupt Event）**：`../AI對話串接.md`

---

## 1) 規則引擎（判定/分數/線索）

- **線索機制**：`../線索系統實現.md`
- **線索＝證物卡（UI/資料）**：`./證物資料結構.md`
- **情報卡範例資料（可直接串 UI）**：`./evidence-cards.sample.json`
- **AI 產線索輸出 Schema（防飄）**：`./ai-insight-output.schema.json`
- **結局機制**：`../結局系統詳細設計.md`
- **分數公式**：`../計分公式.md`

---

## 2) 資料驗證（建議接 CI）

- **驗證腳本**：`../scripts/validate-moments.js`
- **JSON 配置**：`../moment-configs/`

---

## 3) 你會遇到的坑（已在企劃定死）

- **句數**：玩家句數以主線 `mainline-map.json.maxTurns` 為準；14 幕 JSON 是完整版參考
- **線索數**：固定線索仍是 **CLUE-01~14**，但主線只有 10 幕（某些幕會一次發 2 條）
- **打斷**：不要打斷玩家打字；用送出後插入的 `Interrupt Event`（不扣玩家句數）

