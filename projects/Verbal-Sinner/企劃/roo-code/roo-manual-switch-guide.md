# Roo Code 手動切換 Profile 指南

> 當遇到「提供商錯誤」時，需要**手動切換** Profile（Roo Code 沒有自動切換功能）

## ⚠️ 重要提醒

**Roo Code 不會自動切換 Profile**，當遇到配額限制時，你必須**手動切換**到下一個 Profile。

---

## 🔄 手動切換步驟（遇到錯誤時）

### 方法 1：在對話介面切換（最快）

1. **找到切換按鈕**
   - 在 Roo Code 對話介面的**右上角**或**頂部**
   - 找到「API Configuration」或「Provider」下拉選單
   - 通常顯示目前使用的 Profile 名稱

2. **點擊下拉選單**
   - 點擊目前 Profile 名稱旁邊的下拉箭頭
   - 會顯示所有可用的 Profile 列表

3. **選擇備用 Profile**
   - 選擇 `Gemini 2.5 Flash Lite (備用1)`
   - 或 `Gemini 1.5 Flash (備用2)`

4. **重新發送請求**
   - 切換後，**重新發送**剛才失敗的請求
   - 應該可以正常使用

### 方法 2：在設定面板切換

1. **開啟設定**
   - 點擊 Roo Code 面板的齒輪圖示 ⚙️
   - 或使用快捷鍵開啟設定

2. **找到 Profile 設定**
   - 進入「API Configuration Profiles」或「Providers」
   - 找到目前使用的 Profile

3. **切換預設 Profile**
   - 選擇另一個 Profile 作為預設
   - 或直接在下拉選單中選擇

4. **關閉設定並重試**
   - 關閉設定面板
   - 重新發送請求

---

## 🚨 錯誤識別

### 當你看到這些錯誤時，需要切換：

```
❌ "提供商錯誤"
❌ "quota exceeded"
❌ "429"
❌ "RESOURCE_EXHAUSTED"
❌ "You exceeded your current quota"
❌ "Free Tier" 或 "20 requests"
```

### 錯誤訊息範例：
```
Gemini 產生內容串流錯誤：{
  "error": {
    "code": 429,
    "message": "You exceeded your current quota...",
    "status": "RESOURCE_EXHAUSTED"
  }
}
```

---

## 📋 切換檢查清單

當遇到錯誤時，按照以下順序檢查：

### ✅ 步驟 1：確認錯誤類型
- [ ] 錯誤訊息包含 "quota" 或 "429"
- [ ] 錯誤訊息提到 "Free Tier" 或 "20 requests"
- [ ] 確認是配額限制，不是其他錯誤

### ✅ 步驟 2：確認目前 Profile
- [ ] 查看目前使用的 Profile 名稱
- [ ] 確認是哪個模型（例如：`gemini-2.5-flash`）

### ✅ 步驟 3：切換到備用 Profile
- [ ] 在對話介面找到「API Configuration」下拉選單
- [ ] 選擇下一個備用 Profile：
  - 如果目前是 `Gemini 2.0 Flash` → 切換到 `Gemini 2.5 Flash Lite`
  - 如果目前是 `Gemini 2.5 Flash Lite` → 切換到 `Gemini 1.5 Flash`
  - 如果目前是 `Gemini 1.5 Flash` → 所有模型都用完了

### ✅ 步驟 4：重新發送請求
- [ ] 切換 Profile 後，**重新發送**剛才失敗的請求
- [ ] 確認可以正常使用

### ✅ 步驟 5：如果所有 Profile 都用完
- [ ] 等待 UTC 00:00（台灣時間早上 8:00）配額重置
- [ ] 或連結 Google Cloud 付費帳戶
- [ ] 或使用其他 Provider（如 OpenAI、Claude）

---

## 💡 快速切換技巧

### 1. 釘選常用 Profile
- 在 Profile 列表中，滑鼠懸停在 Profile 上
- 點擊「釘選」圖示，讓常用 Profile 顯示在最上方
- 方便快速切換

### 2. 記住切換順序
```
主要 → 備用1 → 備用2
Gemini 2.0 Flash → Gemini 2.5 Flash Lite → Gemini 1.5 Flash
```

### 3. 建立快捷方式
- 如果 Roo Code 支援快捷鍵，設定快速切換 Profile 的快捷鍵
- 或將常用 Profile 釘選，減少點擊次數

---

## 🔍 找不到切換選單？

### 可能的位置：

1. **對話介面頂部**
   - 在輸入框上方
   - 顯示目前使用的 Provider/Profile

2. **對話介面右上角**
   - 齒輪圖示旁邊
   - 或設定按鈕附近

3. **設定面板**
   - 點擊齒輪圖示開啟設定
   - 在「API Configuration」或「Providers」區域

4. **快捷鍵**
   - 查看 Roo Code 的快捷鍵設定
   - 可能有快速切換的快捷鍵

---

## ⚡ 緊急處理方案

### 如果所有 Profile 都用完：

1. **等待配額重置**
   - 免費層配額在 UTC 00:00 重置
   - 台灣時間：早上 8:00

2. **使用其他 Provider**
   - 切換到 OpenAI（如果已設定）
   - 切換到 Claude（如果已設定）

3. **建立新 API Key**
   - 在 Google Cloud 建立新專案
   - 取得新的 API key
   - 建立新的 Profile

4. **連結付費帳戶**
   - 在 Google Cloud Console 連結付費帳戶
   - 獲得更高的配額限制

---

## 📊 配額監控

### 查看配額使用情況：

1. **Google Cloud Console**
   ```
   https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas
   ```

2. **檢查每個模型的使用量**
   - 查看 `gemini-2.0-flash` 的使用量
   - 查看 `gemini-2.5-flash-lite` 的使用量
   - 查看 `gemini-1.5-flash` 的使用量

3. **預估剩餘配額**
   - 如果接近 20 次，準備切換到備用 Profile

---

## 🎯 最佳實踐

### 1. 主動切換
- 不要等到錯誤發生才切換
- 如果感覺快用完了，主動切換到備用 Profile

### 2. 記錄使用情況
- 記下每個 Profile 的使用次數
- 或使用 Google Cloud Console 監控

### 3. 分散使用
- 不要在同一個 Profile 上連續使用
- 可以輪流使用不同 Profile，延長使用時間

---

## ❓ 常見問題

### Q: 為什麼切換後還是錯誤？
**A:** 可能原因：
- 切換的 Profile 配額也用完了
- 切換到錯誤的 Profile
- 需要等待幾秒讓切換生效

### Q: 如何確認切換成功？
**A:** 
- 查看對話介面頂部顯示的 Profile 名稱
- 確認名稱已改變
- 重新發送請求測試

### Q: 可以同時使用多個 Profile 嗎？
**A:** 
- 不行，一次只能使用一個 Profile
- 但可以快速切換

### Q: 切換會影響之前的對話嗎？
**A:** 
- 不會，切換只是改變後續請求使用的模型
- 之前的對話記錄不會受影響

---

## 📝 總結

**關鍵要點：**
1. ✅ Roo Code **沒有自動切換**功能
2. ✅ 遇到錯誤時必須**手動切換** Profile
3. ✅ 切換後要**重新發送**請求
4. ✅ 記住切換順序：主要 → 備用1 → 備用2

**快速操作：**
1. 看到錯誤 → 找到「API Configuration」下拉選單
2. 點擊下拉選單 → 選擇備用 Profile
3. 重新發送請求 → 繼續工作

---

## 🔗 相關文件

- 多模型 Profile 設定：`gemini-multi-profile-setup.md`
- Provider 設定指南：`roo-provider-setup.md`
- 設定優化指南：`roo-settings-optimization.md`
