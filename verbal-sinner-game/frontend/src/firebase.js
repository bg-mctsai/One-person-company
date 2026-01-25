// Firebase 初始化與服務匯出
// 根據 auto-dev-plan.md：只用匿名登入、Firestore、Functions、Storage

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  getFunctions, 
  httpsCallable,
  connectFunctionsEmulator 
} from 'firebase/functions';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';

// Firebase 配置
// 從環境變數讀取（.env.local）
// 參考 SETUP_FIREBASE.md 取得這些值

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "verbal-sinnergit-7341965-90a2b",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// 驗證必要配置
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain) {
  console.error('❌ Firebase 環境變數未設定！');
  console.error('請參考 SETUP_FIREBASE.md 設定 .env.local');
  console.error('目前缺少的變數：', {
    apiKey: !firebaseConfig.apiKey ? 'REACT_APP_FIREBASE_API_KEY' : null,
    authDomain: !firebaseConfig.authDomain ? 'REACT_APP_FIREBASE_AUTH_DOMAIN' : null,
    storageBucket: !firebaseConfig.storageBucket ? 'REACT_APP_FIREBASE_STORAGE_BUCKET' : null,
    messagingSenderId: !firebaseConfig.messagingSenderId ? 'REACT_APP_FIREBASE_MESSAGING_SENDER_ID' : null,
    appId: !firebaseConfig.appId ? 'REACT_APP_FIREBASE_APP_ID' : null
  }.filter(Boolean));
} else {
  // 開發環境：顯示配置摘要（隱藏敏感資訊）
  if (process.env.NODE_ENV === 'development') {
    console.log('✅ Firebase 配置已載入');
    console.log('   Project ID:', firebaseConfig.projectId);
    console.log('   Auth Domain:', firebaseConfig.authDomain);
    console.log('   💡 在 Console 中輸入 testFirebase() 來測試連線');
  }
}

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 初始化服務
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app, 'asia-east1'); // 根據 firebase.json 的 region
export const storage = getStorage(app);

// 開發環境：連接到 Emulator（可選）
// 設定 REACT_APP_USE_EMULATOR=true 來啟用
if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_USE_EMULATOR === 'true') {
  // 注意：需要先啟動 Firebase Emulator Suite
  // firebase emulators:start
  try {
    // connectAuthEmulator(auth, 'http://localhost:9099');
    // connectFirestoreEmulator(db, 'localhost', 8080);
    connectFunctionsEmulator(functions, 'localhost', 5001);
    console.log('✅ 已連接到 Firebase Emulator');
  } catch (error) {
    console.warn('⚠️ Emulator 連線失敗，使用實際 Firebase 服務', error);
  }
}

// ========== Auth：匿名登入（Epic A2） ==========

/**
 * 自動匿名登入
 * 根據 auto-dev-plan.md：首次進站自動取得 uid
 * 
 * @returns {Promise<string>} 用戶 uid
 */
export async function signInAnonymouslyUser() {
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user.uid;
  } catch (error) {
    console.error('匿名登入失敗:', error);
    throw error;
  }
}

/**
 * 監聽認證狀態變化
 * @param {Function} callback - (user) => void
 * @returns {Function} 取消監聽的函數
 */
export function onAuthStateChange(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * 取得當前用戶
 * @returns {User | null}
 */
export function getCurrentUser() {
  return auth.currentUser;
}

// ========== Firestore：玩家進度與資料（Epic A2, C5） ==========

/**
 * 初始化用戶進度文件
 * 根據 auto-dev-plan.md：首次進站自動建立 users/{uid}/progress
 * 
 * @param {string} uid - 用戶 ID
 * @returns {Promise<void>}
 */
export async function initUserProgress(uid) {
  const progressRef = doc(db, 'users', uid, 'profile', 'progress');
  const progressSnap = await getDoc(progressRef);
  
  if (!progressSnap.exists()) {
    await setDoc(progressRef, {
      currentMoment: null, // 當前進行到哪一幕（M01-M10）
      completedMoments: [], // 已完成的主線幕 ID
      unlockedMoments: ['M01'], // 已解鎖的主線幕（只能線性解鎖）
      totalClues: [], // 已獲得的線索 ID 列表
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }
}

/**
 * 更新玩家進度
 * @param {string} uid - 用戶 ID
 * @param {Object} progressData - 進度資料
 * @returns {Promise<void>}
 */
export async function updateUserProgress(uid, progressData) {
  const progressRef = doc(db, 'users', uid, 'profile', 'progress');
  await updateDoc(progressRef, {
    ...progressData,
    updatedAt: serverTimestamp()
  });
}

/**
 * 取得玩家進度
 * @param {string} uid - 用戶 ID
 * @returns {Promise<Object | null>}
 */
export async function getUserProgress(uid) {
  const progressRef = doc(db, 'users', uid, 'profile', 'progress');
  const progressSnap = await getDoc(progressRef);
  return progressSnap.exists() ? progressSnap.data() : null;
}

/**
 * 記錄挑戰結果（Epic C4）
 * @param {string} uid - 用戶 ID
 * @param {string} momentId - 主線幕 ID（如 'M01'）
 * @param {Object} challengeData - 挑戰資料
 * @returns {Promise<void>}
 */
export async function saveChallengeResult(uid, momentId, challengeData) {
  const challengeRef = doc(db, 'users', uid, 'challenges', momentId);
  await setDoc(challengeRef, {
    momentId,
    userId: uid,
    ...challengeData,
    completedAt: serverTimestamp()
  }, { merge: true });
}

/**
 * 發放線索（Epic C5）
 * @param {string} uid - 用戶 ID
 * @param {string[]} clueIds - 線索 ID 列表
 * @returns {Promise<void>}
 */
export async function grantClues(uid, clueIds) {
  const progressRef = doc(db, 'users', uid, 'profile', 'progress');
  const progressSnap = await getDoc(progressRef);
  const currentClues = progressSnap.exists() 
    ? (progressSnap.data().totalClues || []) 
    : [];
  
  const newClues = [...new Set([...currentClues, ...clueIds])]; // 去重
  
  await updateDoc(progressRef, {
    totalClues: newClues,
    updatedAt: serverTimestamp()
  });
}

/**
 * 保存對話會話（Epic C4）
 * @param {string} uid - 用戶 ID
 * @param {string} sessionId - 會話 ID
 * @param {Object} dialogueData - 對話資料
 * @returns {Promise<void>}
 */
export async function saveDialogueSession(uid, sessionId, dialogueData) {
  const sessionRef = doc(db, 'users', uid, 'dialogues', sessionId);
  await setDoc(sessionRef, {
    sessionId,
    userId: uid,
    ...dialogueData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }, { merge: true });
}

// ========== Functions：AI 對話（Epic D1） ==========

/**
 * 呼叫 generateNpcReply Function
 * 根據 functions/index.js 的規格
 * 
 * @param {Object} data - 對話資料
 * @param {string} data.provider - "openai" | "gemini"（預設 "openai"）
 * @param {string} data.momentTitle - 時刻標題
 * @param {string} data.npcName - NPC 名稱
 * @param {string} data.playerLine - 玩家台詞
 * @param {string[]} data.history - 對話歷史（最後 12 句）
 * @param {string} [data.npcRole] - NPC 角色
 * @param {string} [data.npcVoice] - NPC 語氣
 * @param {string} [data.npcEmotion] - NPC 當前情緒
 * @param {string} [data.npcTraits] - NPC 性格/動機
 * @param {string} [data.constraints] - 限制條件
 * @param {string} [data.model] - 模型名稱
 * @returns {Promise<Object>} { npc_reply, npc_emotion_hint, notes, provider, model }
 */
export async function generateNpcReply(data) {
  const generateNpcReplyCallable = httpsCallable(functions, 'generateNpcReply');
  try {
    const result = await generateNpcReplyCallable(data);
    return result.data;
  } catch (error) {
    console.error('generateNpcReply 失敗:', error);
    throw error;
  }
}

// ========== Storage：素材載入（可選，Epic C1） ==========

/**
 * 取得 Storage 中的檔案 URL
 * @param {string} path - Storage 路徑（如 'videos/prologue/scene1.mp4'）
 * @returns {Promise<string>} 下載 URL
 */
export async function getStorageFileURL(path) {
  const fileRef = ref(storage, path);
  return await getDownloadURL(fileRef);
}

/**
 * 上傳檔案到 Storage（管理員功能，前端通常不需要）
 * @param {string} path - Storage 路徑
 * @param {Blob} file - 檔案
 * @returns {Promise<string>} 下載 URL
 */
export async function uploadFileToStorage(path, file) {
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, file);
  return await getDownloadURL(fileRef);
}

// ========== 預設匯出 ==========
export default {
  app,
  auth,
  db,
  functions,
  storage,
  signInAnonymouslyUser,
  onAuthStateChange,
  getCurrentUser,
  initUserProgress,
  updateUserProgress,
  getUserProgress,
  saveChallengeResult,
  grantClues,
  saveDialogueSession,
  generateNpcReply,
  getStorageFileURL,
  uploadFileToStorage
};
