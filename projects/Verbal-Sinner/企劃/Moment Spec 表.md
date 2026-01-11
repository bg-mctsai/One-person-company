# Moment Spec 表（14 幕，一頁版）

> 目的：把每一幕「判定規則」跟「初始化修正」寫成可直接工程化的配置。  
> 依賴文件：`出場角色.md`（屬性/情緒映射/增減）、`挑戰系統.md`（總流程）、`金手指提示庫.md`（seed）、`計分公式.md`（b/t/scar/rewinds）。

---

## 欄位定義（MomentSpec）

- **momentId**：1–14
- **date**：故事日期
- **title**：幕標題
- **category**：職場 / 情人 / 自我
- **maxTurns**：本幕句數上限（3–8）
- **keyNpc**：本幕「主要判定 NPC」（成功/失手看它為主）
- **supportNpcs**：可能插話/影響氛圍的次要 NPC（可空）
- **target**：成功條件（2 擇 1）
  - `targetEmotion`: 目標表層情緒（例：尊重）
  - `targetAttrThresholds`: 目標屬性閾值（例：主管.尊重>=70 或 HR.尊重>=65）
- **failHard**：不可逆失敗門檻（命中即直接失手，不等輪次歸零）
  - 例：`keyNpc.警戒>=90` 或 `keyNpc.壓力>=95 且 keyNpc.恐懼>=80`
- **entryOverrides**：入幕屬性修正（只改本幕初始快照，不改跨幕累積值）
- **clueId**：本幕固定產出線索 id（成功必得 1 條）
- **seedMap**：本幕可用金手指 seed（對齊 `金手指提示庫.md`）
- **ai**：AI 僅負責 `npc_reply`（表演）；勝負永遠由規則引擎算（屬性/輪次/閾值）

---

## 14 幕一頁表（可直接填成配置）

> `target` 建議先用 **targetEmotion**（最容易做 MVP）。  
> 需要更精準時，把關鍵幕（11–14）改成 **targetAttrThresholds**。

| momentId | date | category | title | maxTurns | keyNpc | supportNpcs | target | failHard（建議） | entryOverrides（建議） | clueId | seedMap（摘要） |
|---:|---|---|---|---:|---|---|---|---|---|---|---|
| 1 | 2019/01/10 | 職場 | 初入職場的歡迎 | 3 | 同事A | 主管 | targetEmotion=尊重 | 同事A.警戒>=90 | 同事A.信任+0（照初始） | CLUE-01 | 同事A:MASK/PROBE；主管:WATCH |
| 2 | 2019/02/15 | 職場 | 第一次合作 | 3 | 同事A |  | targetEmotion=認同 | 同事A.憤怒>=80 | 同事A.信任+5（更像「好人」） | CLUE-02 | 同事A:PROBE |
| 3 | 2019/03/20 | 職場 | 職場聚會 | 3 | 主管 | 同事群 | targetEmotion=尊重 | 主管.警戒>=90 | 同事群.觀望+10 | CLUE-03 | 主管:WATCH；同事群:RUMOR |
| 4 | 2019/06/01 | 辦公室霸凌延伸 | 辦公室戀情的開始 | 3 | 同事C |  | targetEmotion=好感 | 同事C.警戒>=85 | 同事C.信任+5 | CLUE-04 | 同事C:REPORT |
| 5 | 2019/06/20 | 辦公室霸凌延伸 | 辦公室戀情的承諾 | 4 | 同事C |  | targetEmotion=尊重 | 同事C.逃避>=90 | 同事C.警戒+5 | CLUE-05 | 同事C:LIE/PROBE |
| 6 | 2019/07/15 | 職場 | 第一次被搶功 | 5 | 主管 | 同事A | targetEmotion=尊重 | 主管.憤怒>=85 且 主管.尊重<35 | 主管.困惑+20（照建議） | CLUE-06 | 同事A:COLLUSION/PROBE；主管:KNOW |
| 7 | 2019/09/10 | 職場 | 被推卸責任 | 5 | 主管 | 同事A | targetEmotion=尊重 | 主管.警戒>=90 或 主管.壓力>=95 | 同事A.恐懼+20 | CLUE-07 | 同事A:THREATENED/RUMOR；主管:WATCH |
| 8 | 2019/11/05 | 職場 | 被當成工具 | 5 | 同事A | 主管 | targetEmotion=震驚 | 同事A.警戒>=95 | 同事A.警戒+10 | CLUE-08 | 同事A:COLLUSION；主管:KNOW |
| 9 | 2019/07/25 | 辦公室霸凌延伸 | 辦公室戀情的謊言 | 5 | 同事C |  | targetEmotion=愧疚 | 同事C.逃避>=95 | 同事C.罪惡感+5（更容易被戳中） | CLUE-09 | 同事C:LIE |
| 10 | 2019/09/30 | 辦公室霸凌延伸 | 辦公室戀情被利用 | 6 | 同事C |  | targetEmotion=尊重 | 同事C.警戒>=90 且 同事C.尊重<25 | 同事C.警戒+10 | CLUE-10 | 同事C:REPORT/MASK |
| 11 | 2020/02/10 | 職場 | 被霸凌離職 | 7 | HR | 主管/同事A | targetAttrThresholds=HR.尊重>=65 | HR.警戒>=95 | 主管.恐懼+30；HR.警戒+5 | CLUE-11* | 主管:THREATENED/KNOW；同事A:COLLUSION/PROBE；HR:WATCH/KNOW |
| 12 | 2020/04/05 | 職場 | 職場名聲被毀 | 7 | 同事群 | 同事A | targetAttrThresholds=同事群.尊重>=55 且 同事群.傳播性<=35 | 同事群.傳播性>=95 | 同事A.恐懼+20；同事群.傳播性+10 | CLUE-12* | 同事A:THREATENED/RUMOR；同事群:RUMOR |
| 13 | 2020/02/25 | 辦公室霸凌延伸 | 辦公室戀情的徹底傷害 | 7 | 同事C | 旁人（可選） | targetEmotion=尊重 | 同事C.警戒>=95 或 同事C.壓力>=95 | 同事C.恐懼+35 | CLUE-13* | 同事C:THREATENED/SHAME；旁人:RUMOR |
| 14 | 2020/06/15 | 自我 | 最後的求救 | 8 | 過去的自己 |  | targetAttrThresholds=內在力量>=65 且 絕望<=40 | 絕望>=98 | （照初始） | CLUE-14* | 過去的自己:SELF/FINAL |

> `CLUE-11*~CLUE-14*` 建議標成 **關鍵線索**（影響 `t` 真相分權重，見 `計分公式.md`）。

---

## 線性主線解鎖（硬規則）

- **Moment 1** 預設解鎖。
- **Moment N** 必須在 **Moment N-1 成立**後解鎖。
- 已通關的幕允許回顧（重玩）但 **不重置主線解鎖**；重玩不額外產出第二條固定線索（避免刷分）。

