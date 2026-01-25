# Roo Code 指令範例（自動化開發）

> 本文件提供給 Roo Code 的具體指令範例，讓它能夠按照 `auto-dev-plan.md` 進行自動化開發。

## 📋 使用方式

1. **開啟 Roo Code**
2. **切換到 Gemini Profile**（按照 `roo-provider-setup.md` 設定）
3. **複製以下指令**，貼到 Roo Code 對話框
4. **Roo Code 會自動讀取相關企劃文件並開始實作**

---

## 🚀 指令範例

### 指令 1：初始化 Firebase（Epic A2）

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

**避免卡住**：如果遇到問題，立即停止並告訴我，不要反覆讀取檔案。
```

---

### 指令 2：載入主線配置（Epic B1）

```
根據 `projects/Verbal-Sinner/企劃/roo-code/auto-dev-plan.md` 的 Epic B1，實作主線配置載入器：

1. 建立 `verbal-sinner-game/frontend/src/utils/mainlineLoader.ts`
2. 載入 `projects/Verbal-Sinner/企劃/moment-configs/mainline-map.json`
3. 建立 TypeScript 類型定義 `MainlineMoment[]`
4. 提供函數 `loadMainlineMoments(): Promise<MainlineMoment[]>`
5. 確保錯誤處理和載入狀態

DoD：能在 UI 顯示 10 幕列表（含 title/maxTurns/sceneCardRef）
```

---

### 指令 3：載入 Moment Configs（Epic B2）

```
根據 `projects/Verbal-Sinner/企劃/roo-code/auto-dev-plan.md` 的 Epic B2，實作 moment-configs 載入器：

1. 建立 `verbal-sinner-game/frontend/src/utils/momentLoader.ts`
2. 載入 `projects/Verbal-Sinner/企劃/moment-configs/moment-*.json`（14 幕完整版）
3. 提供函數 `loadMomentById(momentId: string): Promise<MomentConfig>`
4. 提供函數 `loadMomentsByIds(sourceMomentIds: string[]): Promise<MomentConfig[]>`
5. 建立 TypeScript 類型定義，對齊 JSON 結構

DoD：點進任一主線幕，能取得其 source moments 的 opening/rounds/options（至少能渲染第一輪）
```

---

### 指令 4：Prologue 頁面（Epic C1）

```
根據 `projects/Verbal-Sinner/企劃/roo-code/auto-dev-plan.md` 的 Epic C1，實作前情提要頁面：

1. 建立 `verbal-sinner-game/frontend/src/components/Prologue.tsx`
2. 播放前情提要素材（先用 placeholder 影片或靜態序列）
3. 播放完成後自動導航到 Revival 頁
4. **不提供跳過按鈕**（根據 auto-dev-plan.md）
5. 參考 `verbal-sinner-game/frontend/src/components/Game.tsx` 的現有實作

DoD：能播放一段素材；播完會進 Revival
```

---

### 指令 5：Revival 頁面（Epic C2）

```
根據 `projects/Verbal-Sinner/企劃/roo-code/auto-dev-plan.md` 的 Epic C2，實作復活頁面：

1. 建立 `verbal-sinner-game/frontend/src/components/Revival.tsx`
2. 顯示「看廣告」按鈕（MVP 先用假廣告按鈕）
3. 點擊後模擬完成廣告 → 進入主線 10 幕列表
4. 參考 `核心概念.md` 的「復活機制」說明

DoD：先用「假廣告」按鈕模擬完成 → 進入主線
```

---

### 指令 6：主線挑戰頁（Epic C3）

```
根據 `projects/Verbal-Sinner/企劃/roo-code/auto-dev-plan.md` 的 Epic C3，實作主線挑戰頁：

1. 建立 `verbal-sinner-game/frontend/src/components/MainlineChallenge.tsx`
2. 顯示主線 10 幕列表（依 `mainline-map.json`）
3. **只能按順序解鎖下一幕**（M01 → M02 → ... → M10，不可跳關）
4. 每關開始前必須看廣告（Epic C2.5，先用假廣告）
5. 整合 `getUserProgress()` 和 `updateUserProgress()` 來追蹤進度

DoD：依 `mainline-map.json` 顯示進度；只能按順序解鎖下一幕（不可跳關）
```

---

### 指令 7：對話頁（Epic C4）

```
根據 `projects/Verbal-Sinner/企劃/roo-code/auto-dev-plan.md` 的 Epic C4，實作對話頁：

1. 建立 `verbal-sinner-game/frontend/src/components/DialoguePage.tsx`
2. 顯示對話選項（依 moment-configs 的 rounds/options）
3. 每次玩家選一個 option 算 1 句；到 `maxTurns` 結束
4. 判定：達成 `target` 標記「達標」
5. 整合 `generateNpcReply()` 來生成 NPC 回應（Epic D1）
6. 保存對話會話到 Firestore（`saveDialogueSession()`）

DoD：每次玩家選一個 option 算 1 句；到 `maxTurns` 結束；達成 `target` 標記「達標」
```

---

### 指令 8：教育講解頁（Epic C4.5）

```
根據 `projects/Verbal-Sinner/企劃/roo-code/auto-dev-plan.md` 的 Epic C4.5，實作教育講解頁：

1. 建立 `verbal-sinner-game/frontend/src/components/EducationGuide.tsx`
2. 顯示本關「該如何應對人際關係的對話方式」（原則 3–5 點 + 範例 1–2 句）
3. 資料來源：`projects/Verbal-Sinner/企劃/roo-code/education-guides.md`
4. 每關結束（無論達標或句數用完）都會顯示
5. 看完後才能進下一關

DoD：顯示本關「該如何應對人際關係的對話方式」（原則 3–5 點 + 範例 1–2 句）
```

---

### 指令 9：線索發放與查看（Epic C5）

```
根據 `projects/Verbal-Sinner/企劃/roo-code/auto-dev-plan.md` 的 Epic C5，實作線索系統：

1. 建立 `verbal-sinner-game/frontend/src/components/EvidenceCard.tsx`（UI 組件）
2. 建立 `verbal-sinner-game/frontend/src/components/CluePage.tsx`（線索查看頁）
3. 通關某幕後，呼叫 `grantClues(uid, clueIds)` 把該幕 `clueIds` 記到 Firestore
4. 線索頁能看到已獲得的 clue（先用 mock 資料，參考 `給工程/evidence-cards.sample.json`）
5. 依 evidenceType 套 4 種皮膚（參考 `給美術/證物UI規格.md`）

DoD：通關某幕後，把該幕 `clueIds` 記到 Firestore；線索頁能看到已獲得的 clue
```

---

### 指令 10：結局/結算頁（Epic C6）

```
根據 `projects/Verbal-Sinner/企劃/roo-code/auto-dev-plan.md` 的 Epic C6，實作結算頁：

1. 建立 `verbal-sinner-game/frontend/src/components/Ending.tsx`
2. 跑完 10 幕會進結算頁
3. 顯示行為/真相的分數占位與毒舌宣判文案
4. 文案從 `projects/Verbal-Sinner/企劃/介面字串表.md` 取（如果有的話）
5. 最小可行版本：能計算、能顯示文案；詳細分支可後補

DoD：跑完 10 幕會進結算頁，能顯示行為/真相的分數占位與毒舌宣判文案
```

---

### 指令 11：路由與導航整合

```
建立 React Router 路由系統，整合所有頁面：

1. 安裝 `react-router-dom`（如果還沒安裝）
2. 建立 `verbal-sinner-game/frontend/src/App.tsx` 作為路由入口
3. 設定路由：
   - `/` → Prologue
   - `/revival` → Revival
   - `/mainline` → MainlineChallenge
   - `/dialogue/:momentId` → DialoguePage
   - `/education/:momentId` → EducationGuide
   - `/clues` → CluePage
   - `/ending` → Ending
4. 確保頁面間導航流暢

參考 `auto-dev-plan.md` 的流程：Prologue → Revival → Mainline → Dialogue → Education → (下一關) → Ending
```

---

### 指令 12：完整流程測試（Epic E1）

```
根據 `projects/Verbal-Sinner/企劃/roo-code/auto-dev-plan.md` 的 Epic E1，建立手測清單：

1. 建立 `verbal-sinner-game/TESTING.md` 文件
2. 列出完整的手測流程（參考 auto-dev-plan.md 第 5 節）
3. 確保每個步驟都有明確的驗收標準

手測流程：
- Prologue：進站 → 前情提要可播放 → 播放結束進 Revival
- Revival：按「完成廣告（假）」→ 進主線 10 幕列表
- 主線：依序完成 M01 → M10（每幕句數限制正確）
- 教育講解：每一關結束都會進「教育講解頁」，看完才會進下一關
- 線索：每幕結束後 clueIds 有寫入，線索頁可看到 EvidenceCard（先 mock）
- 結局：跑完 10 幕能到結算頁並顯示宣判文字
```

---

## 🎯 進階指令：一次完成多個 Epic

### 指令 13：完成 Epic A + B（基礎架構）

```
根據 `projects/Verbal-Sinner/企劃/roo-code/auto-dev-plan.md`，完成 Epic A 和 Epic B：

**Epic A：專案骨架**
- A1：確認 Firebase 專案骨架已建立（firebase.json、functions、firestore.rules）
- A2：實作匿名登入（見指令 1）

**Epic B：資料與內容載入**
- B1：實作主線配置載入器（見指令 2）
- B2：實作 moment-configs 載入器（見指令 3）
- B3：實作證物卡 UI（先用 mock 資料，見指令 9）

請按照順序實作，確保每個 DoD 都達成。
```

---

### 指令 14：完成 Epic C（主線流程）

```
根據 `projects/Verbal-Sinner/企劃/roo-code/auto-dev-plan.md`，完成 Epic C：

**Epic C：主線流程**
- C1：Prologue 頁（見指令 4）
- C2：Revival 頁（見指令 5）
- C2.5：每關入場廣告 Gate（整合到 C3）
- C3：主線挑戰頁（見指令 6）
- C4：對話頁（見指令 7）
- C4.5：教育講解頁（見指令 8）
- C5：線索發放與查看（見指令 9）
- C6：結局/結算頁（見指令 10）

請按照順序實作，並整合路由系統（見指令 11）。
```

---

## 📝 注意事項

### 給 Roo Code 的提醒

1. **必須遵守 SSOT**：
   - 故事/機制：`核心概念.md`
   - 主線順序：`mainline-map.json`
   - 每幕對話：`moment-*.json`
   - 畫面文字：`介面字串表.md`（如果有的話）

2. **禁用詞規範**：
   - 所有「玩家可見」字串必須遵守 `核心概念.md` 的禁用詞替換
   - 不使用「遊戲/關卡/玩家/挑戰/UI」等出戲詞

3. **未確認事項**：
   - 標記為「【尚未確認】」的項目，不要自行腦補
   - 使用最小可行版本（MVP）即可

4. **錯誤處理**：
   - 所有 Firebase 操作都要有錯誤處理
   - 顯示友善的錯誤訊息給用戶

5. **TypeScript 類型**：
   - 所有函數都要有完整的 TypeScript 類型定義
   - 對齊 JSON 結構建立類型

---

## 🔄 迭代開發建議

1. **先完成 Epic A + B**（基礎架構）
2. **再完成 Epic C**（主線流程）
3. **最後整合 Epic D**（AI 對話，如果需要的話）
4. **進行手測**（Epic E1）

每個 Epic 完成後，先測試再繼續下一個。
