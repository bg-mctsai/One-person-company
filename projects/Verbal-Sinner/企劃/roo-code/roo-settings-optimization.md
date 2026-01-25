# Roo Code 設定優化指南（針對 Verbal-Sinner 專案）

> 基於你目前的設定（Claude Sonnet 4，$6/$22.5），提供具體的優化建議。

## 🎯 目標：從 Claude Sonnet 4 切換到 Gemini Flash（節省 98% 成本）

**目前成本**：$6.00/$22.50 每百萬 token  
**目標成本**：$0.10/$0.40 每百萬 token  
**節省**：約 98.3%

---

## 📋 設定調整步驟

### 步驟 1：新增 Gemini Profile

1. **在「設定檔」區域**
   - 點擊「+」按鈕（新增設定檔）
   - 命名為：`Gemini Flash (日常)` 或 `Gemini 日常`

2. **選擇 API 供應商**
   - 在「API 供應商」下拉選單中選擇「Google Gemini」

3. **輸入 Gemini API Key**
   - 在「Gemini API Key」欄位貼上你的 API key
   - 如果還沒有，前往 https://ai.google.dev/ 取得

4. **選擇模型**
   - 在「模型」下拉選單選擇：`gemini-2.0-flash` 或 `gemini-2.5-flash-lite`
   - 這兩個都是最便宜的選項（$0.10/$0.40）

---

### 步驟 2：調整 Gemini Profile 設定

#### ✅ 建議啟用的設定

**基本設定：**
- ✅ **模型**：`gemini-2.0-flash`（最便宜且速度快）
- ✅ **Temperature**：0.7（代碼生成）或 1.0（自然建議）

**進階設定（點擊「進階設定」展開）：**
- ❌ **URL Context**：關閉（MVP 階段不需要，會增加成本）
- ❌ **Google Search Grounding**：關閉（MVP 階段不需要，會增加成本）
- ✅ **提示快取**：如果支援，啟用（可節省成本）

#### ❌ 建議關閉的設定

- ❌ **使用自訂基礎 URL**：不需要（除非有特殊需求）
- ❌ **啟用推理**：關閉（Flash 模型可能不支援，且會增加成本）

---

### 步驟 3：保留 Claude Profile 作為備用

**建議保留你目前的 Claude Profile：**
- 命名為：`Claude Sonnet (備用)`
- 用途：當 Gemini 無法滿足複雜任務時使用
- 設定調整：
  - ❌ **關閉「啟用 1M 上下文視窗」**（除非真的需要，否則會增加成本）
  - 模型改為：`claude-sonnet-4-5`（比 4-20250514 便宜）

---

### 步驟 4：設定為預設 Profile

1. **切換到 Gemini Profile**
   - 在「設定檔」下拉選單選擇 `Gemini Flash (日常)`

2. **儲存設定**
   - 點擊右上角的「儲存」按鈕

3. **驗證**
   - 開啟 Roo Code 對話，確認使用的是 Gemini 模型

---

## 💰 成本優化建議

### 日常開發（90% 使用）
- **Profile**：`Gemini Flash (日常)`
- **模型**：`gemini-2.0-flash`
- **成本**：$0.10/$0.40 每百萬 token
- **用途**：React 組件、Firebase Functions、日常代碼生成

### 複雜任務（10% 使用）
- **Profile**：切換到 `Gemini Pro (複雜)` 或保留 `Claude Sonnet (備用)`
- **模型**：`gemini-1.5-pro` 或 `claude-sonnet-4-5`
- **用途**：理解複雜企劃文件、架構設計

### 成本對比

| 場景 | 目前（Claude） | 優化後（Gemini Flash） | 節省 |
|------|---------------|----------------------|------|
| 日常開發 | $6.00/$22.50 | $0.10/$0.40 | **98.3%** |
| 複雜任務 | $6.00/$22.50 | $1.25/$5.00 | **79.2%** |

---

## 🔧 其他設定建議

### 上下文（Context）設定
- **建議**：根據實際需求調整上下文大小
- **Flash 模型**：通常支援 100K-200K tokens，足夠日常使用
- **不需要**：像 Claude 那樣啟用 1M 上下文（除非真的需要）

### 提示詞（Prompts）設定
- **建議**：保持預設即可
- **可選**：如果經常使用特定提示詞，可以自訂

### 自動核准（Auto Approve）
- **建議**：關閉（確保代碼變更前先審查）
- **例外**：如果是簡單的格式化或重構，可以考慮啟用

### 檢查點（Checkpoints）
- **建議**：啟用（方便回退錯誤的變更）

---

## 📝 設定檢查清單

完成設定後，確認以下項目：

- [ ] 已新增 `Gemini Flash (日常)` profile
- [ ] 已設定 Gemini API key
- [ ] 已選擇 `gemini-2.0-flash` 模型
- [ ] 已關閉不必要的進階功能（URL Context、Search Grounding）
- [ ] 已將 Gemini profile 設為預設
- [ ] 已測試：在 Roo Code 對話中確認使用 Gemini 模型
- [ ] 已保留 Claude profile 作為備用

---

## 🚀 使用建議

### 日常開發
1. **預設使用**：`Gemini Flash (日常)` profile
2. **任務類型**：React 組件、Firebase Functions、簡單重構

### 複雜任務
1. **手動切換**：在對話中切換到 `Gemini Pro (複雜)` 或 `Claude Sonnet (備用)`
2. **任務類型**：理解 `auto-dev-plan.md`、架構設計、多文件協調

### 成本監控
1. **定期檢查**：Google Cloud Console 的 API 使用量
2. **設定預算警報**：避免意外超支
3. **根據實際使用調整**：如果 Flash 已足夠，就不需要 Pro

---

## ⚠️ 注意事項

1. **API Key 安全**
   - 不要分享 API key
   - 建議在 Google Cloud Console 設定 API key 限制

2. **模型切換**
   - 不同模型的能力不同，需要時再切換
   - Flash 模型適合大部分日常任務

3. **成本控制**
   - 優先使用 Flash 模型
   - 只在必要時使用 Pro 或 Claude
   - 定期檢查使用量

---

## 📚 參考文件

- 詳細設定步驟：`roo-provider-setup.md`
- 模型選擇指南：`model-selection-guide.md`（如果已建立）
- 開發計畫：`auto-dev-plan.md`
