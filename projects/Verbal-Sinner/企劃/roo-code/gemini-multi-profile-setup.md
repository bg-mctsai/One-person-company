# Gemini 多模型 Profile 設定指南

> 建立多個 Gemini Profile，當遇到配額限制時可快速切換模型

## 🎯 目標

建立 2-3 個 Gemini Profile，每個使用不同的模型，當一個模型配額用完時，可快速切換到其他模型。

---

## 📋 Profile 設定清單

### Profile 1：`Gemini 2.0 Flash (主要)`

**設定步驟：**
1. 在 Roo Code 設定中點擊「+」新增 Profile
2. **命名**：`Gemini 2.0 Flash (主要)`
3. **API Provider**：選擇「Google Gemini」
4. **Gemini API Key**：貼上你的 API key
5. **Model**：選擇 `gemini-2.0-flash`
6. **Temperature**：0.7（代碼生成）
7. **用途**：日常開發、代碼生成（優先使用）

**免費層配額**：20 次/天

---

### Profile 2：`Gemini 2.5 Flash Lite (備用1)`

**設定步驟：**
1. 在 Roo Code 設定中點擊「+」新增 Profile
2. **命名**：`Gemini 2.5 Flash Lite (備用1)`
3. **API Provider**：選擇「Google Gemini」
4. **Gemini API Key**：貼上**同一個** API key（或不同 key）
5. **Model**：選擇 `gemini-2.5-flash-lite`
6. **Temperature**：0.7（代碼生成）
7. **用途**：當 Profile 1 配額用完時使用

**免費層配額**：20 次/天（獨立配額）

---

### Profile 3：`Gemini 1.5 Flash (備用2)`

**設定步驟：**
1. 在 Roo Code 設定中點擊「+」新增 Profile
2. **命名**：`Gemini 1.5 Flash (備用2)`
3. **API Provider**：選擇「Google Gemini」
4. **Gemini API Key**：貼上**同一個** API key（或不同 key）
5. **Model**：選擇 `gemini-1.5-flash`
6. **Temperature**：0.7（代碼生成）
7. **用途**：當 Profile 1 和 2 配額都用完時使用

**免費層配額**：20 次/天（獨立配額）

---

## 🔄 切換策略

### 當遇到「提供商錯誤」或「配額限制」時：

1. **立即切換 Profile**
   - 在 Roo Code 對話介面的「API Configuration」下拉選單
   - 或設定面板中切換到備用 Profile

2. **切換順序**
   ```
   Profile 1 (2.0 Flash) 用完
   → 切換到 Profile 2 (2.5 Flash Lite)
   → Profile 2 用完
   → 切換到 Profile 3 (1.5 Flash)
   → Profile 3 用完
   → 等待 UTC 00:00 重置或連結付費帳戶
   ```

3. **快速識別**
   - 在 Profile 名稱中加入使用狀態：
     - `Gemini 2.0 Flash (主要)` ✅
     - `Gemini 2.5 Flash Lite (備用1)` ⚠️
     - `Gemini 1.5 Flash (備用2)` 🔄

---

## 📝 設定檢查清單

完成設定後，確認：

- [ ] 已建立 Profile 1：`Gemini 2.0 Flash (主要)`
- [ ] 已建立 Profile 2：`Gemini 2.5 Flash Lite (備用1)`
- [ ] 已建立 Profile 3：`Gemini 1.5 Flash (備用2)`
- [ ] 所有 Profile 都使用相同的 API key（或確認不同 key 的專案狀態）
- [ ] 已將 Profile 1 設為預設（釘選為最愛）
- [ ] 已測試：切換到 Profile 2 和 3 都能正常使用

---

## 🚨 錯誤處理流程

### 當看到「提供商錯誤」時：

1. **識別錯誤類型**
   ```
   錯誤訊息包含：
   - "quota exceeded"
   - "429"
   - "RESOURCE_EXHAUSTED"
   - "Free Tier" 或 "20 requests"
   ```

2. **立即切換**
   - 在 Roo Code 對話介面右上角
   - 點擊「API Configuration」下拉選單
   - 選擇下一個備用 Profile

3. **繼續工作**
   - 切換後立即重試剛才的請求
   - 應該可以正常使用

---

## 💡 進階技巧

### 1. 釘選常用 Profile
- 滑鼠懸停在 Profile 上
- 點擊「釘選」圖示，讓常用 Profile 顯示在最上方

### 2. 監控使用量
- 在 Google Cloud Console 查看每個模型的配額使用情況
- 網址：`https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas`

### 3. 建立更多 Profile（可選）
如果還想增加備用選項：
- Profile 4：`Gemini Flash Latest` → 模型：`gemini-flash-latest`
- Profile 5：使用**不同專案**的 API key（完全獨立配額）

---

## 📊 配額管理

### 每日配額總計
- Profile 1：20 次/天
- Profile 2：20 次/天
- Profile 3：20 次/天
- **總計**：60 次/天（如果所有模型都使用）

### 配額重置時間
- **UTC 00:00**（台灣時間 UTC+8 = 早上 8:00）
- 所有模型的配額會同時重置

---

## ⚠️ 注意事項

1. **API Key 來源**
   - 如果所有 Profile 使用**同一個 API key**：配額是分開的（每個模型獨立）
   - 如果使用**不同專案的 API key**：配額完全獨立（更安全）

2. **模型能力**
   - 所有 Flash 系列模型代碼生成能力相近
   - 切換不會影響代碼品質

3. **成本**
   - 免費層：每個模型 20 次/天
   - 超過免費額度：按使用量付費（$0.10/$0.40 每百萬 token）

---

## 🔗 相關文件

- 詳細設定步驟：`roo-provider-setup.md`
- 設定優化指南：`roo-settings-optimization.md`
- 開發計畫：`auto-dev-plan.md`

---

## ✅ 完成後

設定完成後，你將擁有：
- ✅ 3 個可切換的 Gemini Profile
- ✅ 總計 60 次/天的免費配額（如果全部使用）
- ✅ 當一個模型配額用完時，可立即切換到其他模型
- ✅ 不中斷開發流程

**開始使用**：在 Roo Code 中選擇 `Gemini 2.0 Flash (主要)` 開始開發！
