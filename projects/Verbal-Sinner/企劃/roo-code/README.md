# Roo Code 文件說明

> 本目錄包含 Roo Code 相關的設定指南、指令範例和最佳實踐文件

## 📁 檔案用途說明

### 給 Roo Code 看的（AI 會讀取）

#### `auto-dev-plan.md`
- **用途**：開發計畫，Roo Code 會讀取來理解專案結構和任務
- **內容**：Epic 劃分、任務清單、DoD（Definition of Done）
- **使用方式**：在指令中引用，例如「根據 auto-dev-plan.md 的 Epic A2...」

#### `roo-commands.md`
- **用途**：給 Roo Code 的具體指令範例
- **內容**：可直接複製貼上的指令模板
- **使用方式**：複製指令 → 貼到 Roo Code → 自動執行

---

### 給人類看的（設定和操作指南）

#### `roo-provider-setup.md`
- **用途**：如何設定 Gemini/OpenAI/Claude 等 Provider
- **讀者**：**你**（開發者）
- **內容**：API key 取得、Profile 設定、模型選擇建議

#### `roo-manual-switch-guide.md`
- **用途**：手動切換 Profile 的操作指南
- **讀者**：**你**（開發者）
- **內容**：遇到配額限制時如何手動切換模型

#### `roo-settings-optimization.md`
- **用途**：Roo Code 設定優化建議
- **讀者**：**你**（開發者）
- **內容**：成本優化、模型選擇、設定調整

#### `gemini-multi-profile-setup.md`
- **用途**：建立多個 Gemini Profile 的詳細步驟
- **讀者**：**你**（開發者）
- **內容**：3 個 Profile 的設定步驟、切換策略

#### `education-guides.md`
- **用途**：Roo Code 使用教學
- **讀者**：**你**（開發者）
- **內容**：如何有效使用 Roo Code、最佳實踐

---

## 🔍 如何追蹤 Roo Code 的進度？

### Roo Code **不會自動勾選**完成項目

但你可以通過以下方式追蹤：

### 方法 1：查看對話記錄
- 在 Roo Code 對話面板中查看歷史記錄
- 可以看到 Roo Code 說「已完成 XXX」或「正在處理 XXX」

### 方法 2：查看檔案變更
- 在 VS Code 的「Source Control」面板查看修改的檔案
- 可以看到哪些檔案被修改、修改了什麼內容

### 方法 3：主動詢問 Roo Code
```
"你剛才完成了什麼？目前進度如何？"
```

### 方法 4：檢查 DoD（Definition of Done）
- 查看 `auto-dev-plan.md` 中的 DoD
- 手動測試功能是否符合 DoD 要求
- 符合就代表完成了

### 方法 5：查看 Git 提交記錄
- 如果 Roo Code 有自動 commit，可以查看 commit 訊息
- 了解完成了哪些功能

---

## 💡 建議的工作流程

### 1. 開始任務前
```
"根據 auto-dev-plan.md 的 Epic A2，實作匿名登入功能。
完成後告訴我你做了什麼。"
```

### 2. 任務進行中
- 定期查看對話記錄
- 查看檔案變更
- 如有疑問，主動詢問 Roo Code

### 3. 任務完成後
- 檢查 DoD 是否達成
- 測試功能是否正常
- 在 `auto-dev-plan.md` 中**手動勾選**完成項目（如果需要的話）

---

## 📝 檔案維護建議

### 需要定期更新
- `auto-dev-plan.md`：隨著開發進度更新 Epic 狀態
- `roo-commands.md`：根據實際使用情況調整指令範例

### 不需要頻繁更新
- `roo-provider-setup.md`：設定完成後很少需要修改
- `roo-manual-switch-guide.md`：操作指南，除非 Roo Code 介面改變
- `roo-settings-optimization.md`：優化建議，完成後很少需要修改

---

## 🎯 快速參考

### 想讓 Roo Code 自動開發？
→ 使用 `roo-commands.md` 中的指令範例

### 想設定 Provider？
→ 參考 `roo-provider-setup.md`

### 遇到配額限制？
→ 參考 `roo-manual-switch-guide.md`

### 想優化成本？
→ 參考 `roo-settings-optimization.md`

### 想知道開發計畫？
→ 查看 `auto-dev-plan.md`

---

## ❓ 常見問題

### Q: Roo Code 會自動更新這些檔案嗎？
**A:** 通常不會。這些檔案主要是給人類看的設定指南，Roo Code 主要讀取 `auto-dev-plan.md` 和 `roo-commands.md`。

### Q: 我需要手動勾選完成項目嗎？
**A:** 建議手動勾選，這樣可以清楚追蹤進度。Roo Code 不會自動勾選。

### Q: 這些檔案對 Roo Code 有幫助嗎？
**A:** 
- `auto-dev-plan.md` 和 `roo-commands.md`：**有幫助**，Roo Code 會讀取
- 其他設定指南：**間接幫助**，幫助你正確設定，讓 Roo Code 運作更好

### Q: 可以刪除這些檔案嗎？
**A:** 
- **不要刪除** `auto-dev-plan.md` 和 `roo-commands.md`（Roo Code 會用到）
- 其他檔案可以刪除，但建議保留作為參考

---

## 📚 相關資源

- [Roo Code 官方文檔](https://docs.roocode.com/)
- [Google Gemini API 文檔](https://ai.google.dev/gemini-api/docs)
- [Verbal-Sinner 專案主目錄](../../)
