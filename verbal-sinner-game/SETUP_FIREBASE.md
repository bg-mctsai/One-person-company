# Firebase 環境變數設定指南

## 📋 快速開始

1. **取得 Firebase 配置值**（見下方步驟）
2. **複製 `.env.example` 為 `.env.local`**：
   ```bash
   cd frontend
   cp .env.example .env.local
   ```
3. **填入實際值到 `.env.local`**
4. **重新啟動開發伺服器**

---

## 🔑 如何取得 Firebase 配置值

### 步驟 1：前往 Firebase Console

1. 開啟 https://console.firebase.google.com/
2. 登入你的 Google 帳號
3. 選擇專案：**verbal-sinnergit-7341965-90a2b**

### 步驟 2：取得 Web 應用程式配置

1. 點擊左側選單的 **⚙️ 專案設定**
2. 滾動到 **「你的應用程式」** 區塊
3. 如果已經有 Web 應用程式：
   - 點擊 Web 應用程式圖示（`</>`）
   - 複製 `firebaseConfig` 中的值
4. 如果還沒有 Web 應用程式：
   - 點擊 **「新增應用程式」** → 選擇 **Web（`</>`）**
   - 輸入應用程式暱稱（例如：`verbal-sinner-web`）
   - 可選：勾選「也為此應用程式設定 Firebase Hosting」
   - 點擊 **「註冊應用程式」**
   - 複製 `firebaseConfig` 中的值

### 步驟 3：複製配置值

你會看到類似這樣的配置：

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAY7GtGOwGnulbWXdNTfjXjzQ9OF3DiYyc",
  authDomain: "verbal-sinnergit-7341965-90a2b.firebaseapp.com",
  projectId: "verbal-sinnergit-7341965-90a2b",
  storageBucket: "verbal-sinnergit-7341965-90a2b.firebasestorage.app",
  messagingSenderId: "72448476710",
  appId: "1:72448476710:web:3bc8a37ed2767bbd7ac8e7"
};
```

### 步驟 4：填入到 `.env.local`

在 `frontend/.env.local` 中填入：

```bash
REACT_APP_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
REACT_APP_FIREBASE_AUTH_DOMAIN=verbal-sinnergit-7341965-90a2b.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=verbal-sinnergit-7341965-90a2b
REACT_APP_FIREBASE_STORAGE_BUCKET=verbal-sinnergit-7341965-90a2b.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

---

## 🔧 更新 firebase.js

`firebase.js` 已經設定為自動讀取環境變數：

```javascript
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};
```

**注意**：如果環境變數未設定，會使用預設值（可能導致錯誤）。

---

## 🧪 測試設定

### 1. 確認環境變數已載入

重新啟動開發伺服器後，在瀏覽器 Console 檢查：

```javascript
// 在 React DevTools 或 Console 中
console.log(process.env.REACT_APP_FIREBASE_PROJECT_ID);
// 應該顯示：verbal-sinnergit-7341965-90a2b
```

### 2. 測試 Firebase 連線

在 `frontend/src/index.tsx` 中暫時加入：

```typescript
import { auth } from './firebase';
import { signInAnonymouslyUser } from './firebase';

// 測試匿名登入
signInAnonymouslyUser()
  .then(uid => console.log('✅ 匿名登入成功，uid:', uid))
  .catch(error => console.error('❌ 匿名登入失敗:', error));
```

如果看到 `✅ 匿名登入成功`，表示設定正確。

---

## 🚨 常見問題

### Q: 環境變數沒有生效？

**A:** 確保：
1. 檔案名稱是 `.env.local`（不是 `.env`）
2. 變數名稱以 `REACT_APP_` 開頭
3. 重新啟動開發伺服器（`npm start`）

### Q: 找不到 Web 應用程式？

**A:** 需要先建立 Web 應用程式：
1. Firebase Console → 專案設定
2. 滾動到「你的應用程式」
3. 點擊「新增應用程式」→ 選擇 Web

### Q: API Key 安全嗎？

**A:** Firebase Web API Key 是公開的，但可以設定限制：
1. Google Cloud Console → API 和服務 → 憑證
2. 找到你的 API Key
3. 設定「應用程式限制」和「API 限制」

**注意**：即使有 API Key，Firestore Rules 和 Functions 的 `enforceAppCheck` 仍會保護你的資料。

---

## 📝 環境變數說明

| 變數名稱 | 說明 | 範例值 |
|---------|------|--------|
| `REACT_APP_FIREBASE_API_KEY` | Firebase API Key | `AIzaSy...` |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | 認證網域 | `verbal-sinnergit-7341965-90a2b.firebaseapp.com` |
| `REACT_APP_FIREBASE_PROJECT_ID` | 專案 ID | `verbal-sinnergit-7341965-90a2b` |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | Storage 儲存桶 | `verbal-sinnergit-7341965-90a2b.appspot.com` |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | 訊息發送者 ID | `123456789012` |
| `REACT_APP_FIREBASE_APP_ID` | 應用程式 ID | `1:123456789012:web:...` |
| `REACT_APP_USE_EMULATOR` | 是否使用 Emulator | `false` |

---

## 🔄 下一步

設定完成後，可以開始實作：

1. **Epic A2**：匿名登入功能
2. **Epic B**：資料載入器
3. **Epic C**：主線流程

參考 `projects/Verbal-Sinner/企劃/roo-code/roo-commands.md` 的指令範例。
