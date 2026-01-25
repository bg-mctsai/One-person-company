# Roo Code 多供應商配置指南

> 本文件記錄如何在 Roo Code 中設定多個 LLM 供應商，並針對 Verbal-Sinner 專案提供使用建議。

## 1. 取得 Google Gemini API Key

### 步驟
1. 前往 https://ai.google.dev/
2. 使用 Google 帳號登入
3. 點擊左側選單的「Create API key」
4. 選擇或建立 Google Cloud 專案
5. 複製生成的 API key（格式類似：`AIza...`）

### 注意事項
- API key 只會顯示一次，請妥善保存
- 建議設定 API key 限制（限制 IP 或應用程式）
- 可在 Google Cloud Console 管理配額和監控使用量

---

## 2. 在 Roo Code 中新增 Gemini Profile

### 步驟
1. **開啟 Roo Code 設定**
   - 點擊 Roo Code 面板的齒輪圖示 ⚙️
   - 或使用快捷鍵開啟設定

2. **新增新的 Profile**
   - 進入「Providers」或「API Configuration Profiles」
   - 點擊「+」按鈕新增 profile

3. **設定 Gemini**
   - **API Provider**：選擇「Google Gemini」
   - **Gemini API Key**：貼上剛才取得的 API key
   - **Model**：選擇模型（見下方建議）
   - **Temperature**：建議 1.0（自然建議）或 0.7（代碼生成）

4. **命名 Profile**
   - 建議命名：`Gemini Flash (日常)` 或 `Gemini Pro (複雜任務)`
   - 方便後續快速切換

---

## 3. Gemini 模型選擇建議

### 針對 Verbal-Sinner 專案

#### **日常開發（推薦）**
- **模型**：`gemini-2.0-flash` 或 `gemini-2.5-flash-lite`
- **成本**：$0.10/$0.40 每百萬 token（輸入/輸出）
- **適合**：
  - Roo Code 的日常代碼生成
  - React + TypeScript 組件開發
  - 簡單的文件理解
  - Firebase Functions 開發

#### **複雜任務**
- **模型**：`gemini-1.5-pro` 或 `gemini-2.5-pro`
- **成本**：$1.25/$5.00 或 $1.25/$10.00 每百萬 token
- **適合**：
  - 理解複雜的企劃文件（`auto-dev-plan.md`、`完整故事情節.md`）
  - 架構設計決策
  - 多文件協調開發
  - 需要深度推理的任務

#### **AI 對話生成（generateNpcReply）**
- **模型**：`gemini-2.0-flash`
- **成本**：$0.10/$0.40 每百萬 token
- **適合**：
  - NPC 對話生成
  - 情緒判斷
  - 短文本生成

---

## 4. 成本對比（每 100 萬 token，50/50 輸入輸出）

| 模型 | 輸入成本 | 輸出成本 | 總成本 | 適合場景 |
|------|---------|---------|--------|----------|
| **Gemini 2.0 Flash** | $0.10 | $0.40 | **$0.25** | 日常代碼生成 ⭐ |
| **Gemini 2.5 Flash-Lite** | $0.10 | $0.40 | **$0.25** | 日常代碼生成 |
| **Gemini 1.5 Pro** | $1.25 | $5.00 | **$3.125** | 複雜推理 |
| **Gemini 2.5 Pro** | $1.25 | $10.00 | **$5.625** | 最強性能 |
| **Claude Sonnet 4.5**（你目前） | $5.00 | $25.00 | **$15.00** | 最強性能 |

**結論**：Gemini 2.0 Flash 比 Claude Sonnet 4.5 便宜 **98.3%**（$15 → $0.25）

---

## 5. 多 Profile 使用策略

### 建議設定 2-3 個 Profiles

#### Profile 1：`Gemini Flash (日常)`
- **Provider**：Google Gemini
- **Model**：`gemini-2.0-flash`
- **Temperature**：0.7
- **用途**：90% 的日常開發任務

#### Profile 2：`Gemini Pro (複雜)`
- **Provider**：Google Gemini
- **Model**：`gemini-1.5-pro`
- **Temperature**：1.0
- **用途**：理解複雜企劃、架構設計

#### Profile 3：`Claude Sonnet (備用)`
- **Provider**：Anthropic
- **Model**：`claude-sonnet-4-5`
- **用途**：當 Gemini 無法滿足需求時使用

### 切換方式
- **設定面板**：在 Settings → API Configuration 下拉選單切換
- **對話中**：在聊天介面的 API Configuration 下拉選單切換
- **釘選常用**：滑鼠懸停在 profile 上可釘選為最愛

---

## 6. Gemini 進階功能（可選）

### URL Context
- **啟用**：可讀取並分析網頁和文檔
- **用途**：讀取外部 API 文檔、GitHub 專案說明
- **成本**：可能產生額外費用

### Google Search Grounding
- **啟用**：即時搜尋結果和事實查證
- **用途**：查詢最新技術資訊、解決方案
- **成本**：可能產生額外費用

**建議**：MVP 階段先不啟用，專注核心功能。

---

## 7. 針對 Verbal-Sinner 專案的建議

### 階段 1：MVP 開發（現在）
- **主要使用**：`Gemini 2.0 Flash`
- **用途**：
  - Epic A-C：Firebase 設定、React 組件、主線流程
  - 日常代碼生成和重構
- **複雜任務**：需要理解 `auto-dev-plan.md` 時切換到 `Gemini 1.5 Pro`

### 階段 2：AI 對話功能（Epic D）
- **使用**：`Gemini 2.0 Flash`
- **用途**：`generateNpcReply` Functions
- **原因**：對話生成不需要最強模型，Flash 已足夠

### 階段 3：優化後
- 根據實際使用量調整
- 如果 Flash 已滿足大部分需求，就不需要 Pro

---

## 8. 成本監控建議

### Google Cloud Console
1. 前往 https://console.cloud.google.com/
2. 選擇你的專案
3. 查看「Billing」→「Reports」
4. 監控 Gemini API 使用量

### 設定預算警報
- 在 Google Cloud Console 設定預算上限
- 當使用量達到 50%、80%、100% 時發送通知
- 避免意外超支

---

## 9. 驗證設定

### 測試步驟
1. 在 Roo Code 中切換到 Gemini profile
2. 發送簡單請求：「幫我生成一個 React 組件」
3. 確認回應正常且速度合理
4. 檢查 Google Cloud Console 是否有 API 呼叫記錄

### 常見問題
- **API key 無效**：確認 key 是否正確複製，是否有設定限制
- **配額不足**：檢查 Google Cloud 專案的配額設定
- **回應慢**：Flash 模型應該很快，如果慢可能是網路問題

---

## 10. 後續優化

### 根據使用情況調整
- **如果 Flash 已足夠**：持續使用，節省成本
- **如果需要更強能力**：在特定任務時切換到 Pro
- **如果成本超預期**：檢查是否有不必要的長上下文或重複請求

### 考慮混合策略
- **代碼生成**：Gemini Flash
- **企劃理解**：Gemini Pro
- **特殊需求**：Claude Sonnet（備用）

---

## 參考資料

- [Roo Code Gemini 文檔](https://docs.roocode.com/providers/gemini)
- [Google Gemini API 定價](https://ai.google.dev/gemini-api/docs/pricing)
- [Roo Code API Configuration Profiles](https://docs.roocode.com/features/api-configuration-profiles)
