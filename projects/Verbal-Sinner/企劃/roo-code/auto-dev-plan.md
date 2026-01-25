# Roo Code｜自動化開發計畫（草案）

> 本文件是 Roo Code 的「單一入口規格」。  
> 任何未確認事項一律標記 **【尚未確認】**，Roo Code 不應自行腦補成決策。

## 0) MVP 範圍（Web）

**必做（主線可跑）**
- 前情提要（約 1.5–2.5 分鐘）播放；**不提供跳過**
- 復活（看廣告）→ 回到 2019 → 進入主線 10 幕（M01→M10）
- 主線 10 幕（依 `mainline-map.json`）
- 對話互動（依 `moment-configs`）＋玩家句數限制
- 線索（clueIds）發放與查看（EvidenceCard UI 先用 mock 資料跑起來）
- 結算/結局（先用最小可行版本：能計算、能顯示文案；詳細分支可後補）
- **教育講解**：每一關結束（無論達標或句數用完）都會顯示「該如何應對的人際對話方式」

**不做（先不碰）**
- 畫面級完整 UX 規格（狀態機/視覺細節）【尚未確認，後續補】
- 事件追蹤/分析（KPI event schema）【尚未確認，後續補】
- 進階自動化測試（E2E/壓測）→ 先以「功能正常」手測為主
- **付費/通行證/去廣告**：不做（本企劃固定每關看廣告）

---

## 1) 單一技術結論（避免互打）

- **平台**：Web
- **後端/雲**：Firebase
  - Auth：**只用匿名登入（Anonymous Auth）**，不做 Email 登入/註冊
    - 目的：不出登入頁，但能用 uid 做「同一裝置/同一瀏覽器」識別與存檔
    - 備註：若玩家清除瀏覽器資料，uid 會重置（MVP 接受）
  - Firestore：存玩家進度/挑戰記錄/線索/對話歷史
  - Functions：AI 對話（代管 API Key）、（可選）計分/結局計算
  - Hosting：前端部署
  - Storage：**所有素材都上 Firebase Storage**（圖片/音效/前情提要影片）
- **前端**：React + TypeScript + Vite（沿用既定方向）

---

## 2) SSOT（Single Source of Truth）與對齊規則

### 2.1 SSOT 列表（不得違反）
- **故事/機制 SSOT**：`../核心概念.md`
- **主線順序/句數/clueIds SSOT**：`../moment-configs/mainline-map.json`
- **每幕對話/規則 SSOT**：`../moment-configs/moment-*.json`
- **畫面文字 SSOT**：`../介面字串表.md`
- **證物卡資料結構 SSOT**：`../給工程/證物資料結構.md`
- **證物卡 UI 皮膚 SSOT**：`../給美術/證物UI規格.md`

### 2.2 對齊規則（工程必須照做）
- **主線 10 幕 = `mainline-map.json.moments[]`**
  - `sourceMomentIds` 指向 `moment-configs/moment-XX.json`（14 幕完整版）
  - `maxTurns` ＝ 主線當幕玩家句數上限（不一定等於 source moment 的 maxTurns）
- **禁用詞規範**：所有「玩家可見」字串必須遵守 `核心概念.md` 的禁用詞替換
- **EvidenceCard 先跑 UI**：可先用 `../給工程/evidence-cards.sample.json` 作為資料來源（不用等 AI）

---

## 3) 未確認清單（先註記，不做決策）

- 【尚未確認】畫面級規格：各頁狀態機、錯誤/空狀態/載入、動畫與視覺細節
- 【尚未確認】Web 廣告 SDK（Post-MVP）：使用哪一家（AdSense / GAM / 其他）、失敗 fallback、冷卻時間、可否跳過（MVP 先用假廣告）
- 【尚未確認】事件追蹤：要不要 GA4、事件 schema、KPI 對應事件
- 【尚未確認】環境/金鑰：dev/staging/prod、Functions secrets（App Check：MVP 先關掉；上線前再啟用）

### 3.1 已決策（MVP 規則寫死）

- **主線解鎖規則**：**只能線性**（M01 → M10，不能跳幕）
- **每關開始前**：**必須看廣告**（MVP 先用假廣告按鈕；Post-MVP 換真廣告 SDK）
- **勝負判定（MVP）**：
  - **達成單元目標（`target`）**：標記為「本關達標」（可用於結算/評語）
  - **句數用完未達標**：標記為「本關未達標」
  - 不論達標/未達標：**都會進入教育講解，然後進下一關**（不提供重玩）
- **不提供重玩/回溯**：因為每關結束直接給「講解答案」

---

## 4) 可直接實作的任務清單（Tickets）+ DoD

> 原則：每張票都必須能落到「新增/修改哪些模組、產出什麼、怎麼驗收」。

### Epic A：專案骨架（Firebase Web）
- **A1｜建立 Firebase 專案骨架（Hosting + Functions + Firestore）**
  - **DoD**：本地可跑（Hosting emulator）、Functions 可部署（或 emulator）、Firestore 可讀寫（emulator）
- **A2｜Auth：匿名登入（MVP）**
  - **DoD**：首次進站自動取得 uid；Firestore 能以 uid 建立 `users/{uid}` 的進度文件

### Epic B：資料與內容載入（以 SSOT 驅動）
- **B1｜在前端內建主線配置載入器**
  - **內容**：載入 `mainline-map.json`，建立 runtime 的 `MainlineMoment[]`
  - **DoD**：能在 UI 顯示 10 幕列表（含 title/maxTurns/sceneCardRef）
- **B2｜載入 moment-configs（14 幕）並可依 `sourceMomentIds` 聚合**
  - **DoD**：點進任一主線幕，能取得其 source moments 的 opening/rounds/options（至少能渲染第一輪）
- **B3｜證物卡（EvidenceCard）資料先接 mock**
  - **DoD**：能在「線索頁」看到 sample cards（依 evidenceType 套 4 種皮膚）

### Epic C：主線流程（Prologue → Revival → Mainline → Ending）
- **C1｜Prologue 頁（前情提要）**
  - **DoD**：能播放一段素材（先用 placeholder 影片或靜態序列）；播完會進 Revival
  - **備註**：不提供跳過
- **C2｜Revival 頁（看廣告）**
  - **DoD**：先用「假廣告」按鈕模擬完成 → 進入主線
  - **備註**：【尚未確認】真實 Web 廣告 SDK 與驗證方式
- **C2.5｜每關入場廣告 Gate（MVP：假廣告）**
  - **DoD**：每進入一關（M01~M10）前都必須點一次「完成廣告（假）」才可開始對話
- **C3｜主線挑戰頁（10 幕）**
  - **DoD**：依 `mainline-map.json` 顯示進度；**只能按順序解鎖下一幕（不可跳關）**
- **C4｜對話頁（句數限制 + 選項）**
  - **DoD**：每次玩家選一個 option 算 1 句；到 `maxTurns` 結束
  - **判定**：達成 `target` 標記「達標」，但仍可選擇繼續用完句數或直接進講解【尚未確認：達標後是否直接結束對話】
- **C4.5｜教育講解頁（每關結束必出）**
  - **DoD**：顯示本關「該如何應對人際關係的對話方式」（原則 3–5 點 + 範例 1–2 句）
  - **資料來源（暫定）**：`roo-code/education-guides.md`（先用文字稿；後續再搬到 `介面字串表.md`）
- **C5｜線索發放與查看**
  - **DoD**：通關某幕後，把該幕 `clueIds` 記到 Firestore；線索頁能看到已獲得的 clue
- **C6｜結局/結算（最小可行）**
  - **DoD**：跑完 10 幕會進結算頁，能顯示行為/真相的分數占位與毒舌宣判文案（文案從 `介面字串表.md` 取）

### Epic D：AI（先留接口，先不強綁）
- **D1｜Functions：generateNpcReply（可先 stub）**
  - **DoD**：前端可呼叫 Functions 拿到 `{ npc_reply, npc_emotion_hint, notes }`
  - **備註**：【尚未確認】provider / model / prompt 最終規格

### Epic E：最小測試（先手測即可）
- **E1｜手測清單（主線跑通）**
  - **DoD**：以下流程全部通過（見第 5 節）

---

## 5) 測試計畫（先驗「功能是否正常」）

### 手測流程（MVP）
- **Prologue**：進站 → 前情提要可播放 → 播放結束進 Revival
- **Revival**：按「完成廣告（假）」→ 進主線 10 幕列表
- **主線**：依序完成 M01 → M10（每幕句數限制正確）
- **教育講解**：每一關結束都會進「教育講解頁」，看完才會進下一關
- **線索**：每幕結束後 clueIds 有寫入，線索頁可看到 EvidenceCard（先 mock）
- **結局**：跑完 10 幕能到結算頁並顯示宣判文字

