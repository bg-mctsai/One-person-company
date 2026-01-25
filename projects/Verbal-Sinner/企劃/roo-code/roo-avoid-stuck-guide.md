# Roo Code 避免卡住指南

> 當 Roo Code 執行任務時卡住（陷入循環、反覆讀取檔案），如何避免和解決

## 🚨 常見卡住原因

### 1. 任務描述不夠明確
- ❌ 不好：「實作匿名登入功能」
- ✅ 好：「在 `index.tsx` 中添加 useEffect，自動呼叫 `signInAnonymouslyUser()`」

### 2. 檔案路徑或內容有問題
- 檔案不存在
- 檔案格式錯誤
- 檔案內容過於複雜

### 3. 任務過於複雜
- 一次要求太多功能
- 沒有明確的停止條件

### 4. 陷入循環讀取
- Roo Code 反覆讀取同一個檔案
- 無法判斷任務是否完成

---

## ✅ 避免卡住的最佳實踐

### 1. 使用明確、具體的任務描述

#### ❌ 不好的描述：
```
"根據 auto-dev-plan.md 的 Epic A2，實作匿名登入功能"
```

#### ✅ 好的描述：
```
"根據 auto-dev-plan.md 的 Epic A2，實作匿名登入功能：

1. 在 `verbal-sinner-game/frontend/src/index.tsx` 中：
   - 添加 useEffect hook
   - 在 useEffect 中自動呼叫 `signInAnonymouslyUser()`（從 `firebase.js` 導入）
   - 登入成功後，呼叫 `initUserProgress(uid)` 建立用戶進度文件
   - 添加錯誤處理，顯示友善的錯誤訊息

2. 完成後：
   - 告訴我你做了什麼
   - 列出修改的檔案
   - 確認是否符合 DoD：首次進站自動取得 uid；Firestore 能以 uid 建立 `users/{uid}` 的進度文件"
```

### 2. 分步驟執行（避免一次做太多）

#### 步驟 1：先檢查現狀
```
"檢查 `verbal-sinner-game/frontend/src/index.tsx` 的目前狀態，
告訴我是否已經有匿名登入相關的代碼。"
```

#### 步驟 2：執行具體修改
```
"在 `index.tsx` 中添加 useEffect，自動呼叫 `signInAnonymouslyUser()`。
只修改這一個功能，完成後告訴我。"
```

#### 步驟 3：驗證結果
```
"檢查剛才的修改是否正確，確認：
1. useEffect 是否正確添加
2. 錯誤處理是否完整
3. 是否符合 DoD 要求"
```

### 3. 設定明確的停止條件

在任務描述中明確告訴 Roo Code 何時停止：

```
"完成以下任務後**立即停止**，不要繼續其他工作：

1. 在 `index.tsx` 中添加匿名登入邏輯
2. 確認代碼可以編譯
3. 告訴我完成狀態

**停止條件**：完成上述 3 點後立即停止，不要讀取其他檔案或做其他修改。"
```

### 4. 限制檔案範圍

明確指定要讀取和修改的檔案：

```
"只讀取和修改以下檔案：
- `verbal-sinner-game/frontend/src/index.tsx`
- `verbal-sinner-game/frontend/src/firebase.js`

**不要讀取其他檔案**，完成後立即停止。"
```

### 5. 提供檢查點

在任務中設定檢查點，讓 Roo Code 報告進度：

```
"執行以下任務，並在每個步驟後告訴我進度：

步驟 1：讀取 `index.tsx` → 告訴我目前狀態
步驟 2：添加 useEffect → 告訴我添加完成
步驟 3：添加錯誤處理 → 告訴我完成
步驟 4：驗證代碼 → 告訴我驗證結果

完成所有步驟後立即停止。"
```

---

## 🔧 當 Roo Code 已經卡住時

### 立即處理步驟

1. **停止當前任務**
   - 在 Roo Code 對話中點擊「停止」或「取消」
   - 或關閉並重新開啟 Roo Code 面板

2. **檢查目前狀態**
   - 查看哪些檔案已被修改
   - 確認已完成的部分

3. **重新描述任務（更明確）**
   ```
   "繼續完成 Epic A2 的匿名登入功能：
   
   - 已完成：已添加 useEffect 和 signInAnonymouslyUser 呼叫
   - 需要完成：檢查並修復重複的 import（第 11-12 行）
   - 相關檔案：verbal-sinner-game/frontend/src/index.tsx
   - 完成後：告訴我修改內容，然後立即停止"
   ```

4. **如果還是卡住**
   - 切換到其他模型（如 `gemini-2.0-flash`）
   - 或手動完成剩餘部分

---

## 📋 Epic A2 的正確指令範例

### 完整版本（推薦）

```
根據 `projects/Verbal-Sinner/企劃/roo-code/auto-dev-plan.md` 的 Epic A2，實作匿名登入功能：

**任務範圍**：
1. 在 `verbal-sinner-game/frontend/src/index.tsx` 中：
   - 添加 useEffect hook（在 App 組件中）
   - 在 useEffect 中自動呼叫 `signInAnonymouslyUser()`（從 `./firebase` 導入）
   - 登入成功後，自動呼叫 `initUserProgress(uid)` 建立用戶進度文件
   - 添加錯誤處理：如果登入失敗，顯示友善的錯誤訊息（使用 setError）

2. **只修改 `index.tsx`**，不要修改其他檔案

3. **完成後立即停止**，並告訴我：
   - 你做了什麼修改
   - 是否符合 DoD：首次進站自動取得 uid；Firestore 能以 uid 建立 `users/{uid}` 的進度文件
```

### 分步驟版本（如果完整版本卡住）

#### 步驟 1：檢查現狀
```
"檢查 `verbal-sinner-game/frontend/src/index.tsx` 的目前狀態，
告訴我是否已經有匿名登入相關的代碼。只讀取這一個檔案，完成後立即停止。"
```

#### 步驟 2：添加功能
```
"在 `index.tsx` 的 App 組件中添加：
1. useState 管理 isLoading 和 error 狀態
2. useEffect 在組件掛載時自動呼叫 `signInAnonymouslyUser()`
3. 登入成功後呼叫 `initUserProgress(uid)`
4. 錯誤處理邏輯

只修改 `index.tsx`，完成後立即停止並告訴我修改內容。"
```

#### 步驟 3：驗證
```
"檢查 `index.tsx` 中的匿名登入實作是否正確：
1. 是否有重複的 import
2. 錯誤處理是否完整
3. 是否符合 DoD 要求

只讀取 `index.tsx`，完成後立即停止並告訴我檢查結果。"
```

---

## 💡 進階技巧

### 1. 使用「完成後停止」指令
在每個任務描述結尾加上：
```
"完成後立即停止，不要繼續其他工作。"
```

### 2. 限制讀取範圍
```
"只讀取以下檔案：
- verbal-sinner-game/frontend/src/index.tsx
- verbal-sinner-game/frontend/src/firebase.js

不要讀取其他檔案。"
```

### 3. 設定明確的驗證標準
```
"完成後驗證：
1. 代碼可以編譯（沒有語法錯誤）
2. 符合 DoD 要求
3. 沒有重複的 import 或代碼

驗證完成後立即停止。"
```

### 4. 使用檢查點
```
"執行任務，並在以下檢查點報告進度：
- 檢查點 1：讀取檔案完成
- 檢查點 2：添加代碼完成
- 檢查點 3：驗證完成

每個檢查點後告訴我狀態，全部完成後立即停止。"
```

---

## 🎯 Epic A2 專用指令（已優化）

### 如果功能已經部分完成

```
"檢查並完成 Epic A2 的匿名登入功能：

1. 讀取 `verbal-sinner-game/frontend/src/index.tsx`
2. 檢查是否已有匿名登入實作
3. 如果有問題（如重複 import），修復它
4. 如果缺少功能，添加它
5. 確認符合 DoD：首次進站自動取得 uid；Firestore 能以 uid 建立 `users/{uid}` 的進度文件

**只修改 `index.tsx`，完成後立即停止並告訴我：**
- 目前的狀態
- 做了什麼修改（如果有的話）
- 是否符合 DoD"
```

### 如果從頭開始

```
"根據 auto-dev-plan.md 的 Epic A2，實作匿名登入功能：

**具體步驟**：
1. 讀取 `verbal-sinner-game/frontend/src/index.tsx`
2. 讀取 `verbal-sinner-game/frontend/src/firebase.js`（確認函數名稱）
3. 在 App 組件中：
   - 添加 `useState` 管理 `isLoading` 和 `error`
   - 添加 `useEffect` 在組件掛載時執行
   - 在 useEffect 中呼叫 `signInAnonymouslyUser()`
   - 登入成功後呼叫 `initUserProgress(uid)`
   - 添加錯誤處理

**限制**：
- 只修改 `index.tsx`
- 完成後立即停止
- 告訴我修改內容和 DoD 符合度"
```

---

## 📝 總結

**避免卡住的關鍵**：
1. ✅ 任務描述要**明確、具體**
2. ✅ 設定**明確的停止條件**
3. ✅ **限制檔案範圍**（只讀取必要的檔案）
4. ✅ **分步驟執行**（不要一次做太多）
5. ✅ 使用**檢查點**讓 Roo Code 報告進度

**當已經卡住時**：
1. 立即停止任務
2. 檢查目前狀態
3. 重新描述任務（更明確）
4. 如果還是卡住，切換模型或手動完成

---

## 🔗 相關文件

- 開發計畫：`auto-dev-plan.md`
- 指令範例：`roo-commands.md`
- 進度追蹤：`README.md`
