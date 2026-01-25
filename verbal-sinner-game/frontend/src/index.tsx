import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import Game from './components/Game';
// 導入 Firebase 測試（將 testFirebase 函數暴露到 window）
import './testFirebase';
import {
  signInAnonymouslyUser,
  initUserProgress
} from './firebase';
import { ContentProvider } from './ContentContext';

// 應用程式頂層組件，負責初始化 Firebase 匿名登入和用戶進度
function App() {
  // 狀態管理：載入中、錯誤訊息
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authenticate = async () => {
      try {
        // 1. 首次進站時自動呼叫 signInAnonymouslyUser()
        const uid = await signInAnonymouslyUser();
        console.log('✅ 匿名登入成功，UID:', uid);

        // 2. 登入成功後，自動呼叫 initUserProgress(uid) 建立用戶進度文件
        await initUserProgress(uid);
        console.log('✅ 用戶進度文件已初始化或確認存在');

      } catch (e: any) {
        // 3. 確保錯誤處理：如果登入失敗，顯示友善的錯誤訊息
        console.error('❌ 致命錯誤：應用程式初始化失敗', e);
        // 檢查是否為 Firebase 錯誤
        let message = '遊戲初始化失敗，請檢查網路連線或稍後再試。';
        if (e.code) {
          message += ` (錯誤碼: ${e.code})`;
        }
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    authenticate();
  }, []);

  if (isLoading) {
    // 顯示載入畫面
    return <div style={{ padding: '40px', textAlign: 'center', fontSize: '18px' }}>
      正在啟動遊戲...
    </div>;
  }

  if (error) {
    // 顯示錯誤訊息
    return <div style={{ padding: '40px', color: '#ff3333', textAlign: 'center', fontSize: '18px', border: '1px solid #ff3333', margin: '20px' }}>
      ⛔ 錯誤：{error}
      <p style={{ fontSize: '14px', marginTop: '10px' }}>請嘗試重新整理頁面。</p>
    </div>;
  }

  // 登入成功後，渲染主要遊戲組件
  return <ContentProvider>
    <Game />
  </ContentProvider>;
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
