// Firebase 設定測試腳本
// 在開發環境中測試 Firebase 連線和功能

import { 
  signInAnonymouslyUser, 
  initUserProgress, 
  getUserProgress,
  getCurrentUser,
  db 
} from './firebase';
import { doc, getDoc } from 'firebase/firestore';

/**
 * 測試 Firebase 設定
 * 在瀏覽器 Console 中執行：window.testFirebase()
 */
export async function testFirebase() {
  console.log('🧪 開始測試 Firebase 設定...\n');

  // 測試 1：檢查環境變數
  console.log('📋 測試 1：檢查環境變數');
  const envVars = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY ? '✅ 已設定' : '❌ 未設定',
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ? '✅ 已設定' : '❌ 未設定',
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ? '✅ 已設定' : '❌ 未設定',
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ? '✅ 已設定' : '❌ 未設定',
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ? '✅ 已設定' : '❌ 未設定',
    appId: process.env.REACT_APP_FIREBASE_APP_ID ? '✅ 已設定' : '❌ 未設定'
  };
  console.table(envVars);
  console.log('');

  // 測試 2：匿名登入
  console.log('🔐 測試 2：匿名登入');
  try {
    const uid = await signInAnonymouslyUser();
    console.log('✅ 匿名登入成功！');
    console.log('   UID:', uid);
    console.log('');

    // 測試 3：初始化用戶進度
    console.log('📝 測試 3：初始化用戶進度');
    try {
      await initUserProgress(uid);
      console.log('✅ 用戶進度初始化成功！');
      console.log('   Firestore 路徑: users/' + uid + '/profile/progress');
      console.log('');

      // 測試 4：讀取用戶進度
      console.log('📖 測試 4：讀取用戶進度');
      try {
        const progress = await getUserProgress(uid);
        if (progress) {
          console.log('✅ 讀取用戶進度成功！');
          console.log('   進度資料:', progress);
        } else {
          console.log('⚠️ 用戶進度為空（可能是首次建立）');
        }
        console.log('');

        // 測試 5：直接讀取 Firestore
        console.log('🔥 測試 5：直接讀取 Firestore');
        try {
          const progressRef = doc(db, 'users', uid, 'profile', 'progress');
          const progressSnap = await getDoc(progressRef);
          if (progressSnap.exists()) {
            console.log('✅ Firestore 讀取成功！');
            console.log('   文件資料:', progressSnap.data());
          } else {
            console.log('⚠️ Firestore 文件不存在');
          }
        } catch (error: any) {
          console.error('❌ Firestore 讀取失敗:', error.message);
          console.error('   錯誤代碼:', error.code);
        }

      } catch (error: any) {
        console.error('❌ 讀取用戶進度失敗:', error.message);
        console.error('   錯誤代碼:', error.code);
      }

    } catch (error: any) {
      console.error('❌ 初始化用戶進度失敗:', error.message);
      console.error('   錯誤代碼:', error.code);
    }

  } catch (error: any) {
    console.error('❌ 匿名登入失敗:', error.message);
    console.error('   錯誤代碼:', error.code);
    console.error('');
    console.error('💡 可能的原因：');
    console.error('   1. Firebase 環境變數未正確設定');
    console.error('   2. Firebase 專案未啟用 Anonymous Auth');
    console.error('   3. 網路連線問題');
    return;
  }

  // 測試 6：檢查當前用戶
  console.log('👤 測試 6：檢查當前用戶');
  const currentUser = getCurrentUser();
  if (currentUser) {
    console.log('✅ 當前用戶存在');
    console.log('   UID:', currentUser.uid);
    console.log('   匿名:', currentUser.isAnonymous);
  } else {
    console.log('⚠️ 當前用戶為 null');
  }

  console.log('');
  console.log('🎉 測試完成！');
  console.log('');
  console.log('💡 如果所有測試都通過，表示 Firebase 設定正確！');
  console.log('   可以開始使用 Roo Code 進行開發了。');
}

// 將測試函數暴露到 window 物件，方便在 Console 中呼叫
if (typeof window !== 'undefined') {
  (window as any).testFirebase = testFirebase;
  console.log('💡 提示：在 Console 中輸入 testFirebase() 來執行測試');
}
