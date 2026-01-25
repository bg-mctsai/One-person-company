# Roo Code 專用入口（企劃）

> 目標：讓 Roo Code 只讀這個資料夾就能「自動化開發計畫」不走偏。

## 單一結論（MVP）

- **平台**：Web
- **技術路線**：Firebase（Auth / Firestore / Functions / Hosting / Storage）
- **不採用**：自建 Node/Express/DB/Redis（避免兩套後端路線互打）

## SSOT（Single Source of Truth）

- **故事/機制 SSOT**：`../核心概念.md`
- **主線 10 幕 SSOT**：`../moment-configs/mainline-map.json`
- **每幕對話/規則 SSOT**：`../moment-configs/moment-*.json`（14 幕完整版來源；主線 10 幕取子集）
- **畫面文字 SSOT**：`../介面字串表.md`

> 備註：任何「文件內的範例資料」若與 SSOT 不一致，一律視為示意，不可當成實作依據。

## Roo Code 目前要吃的文件

- `auto-dev-plan.md`：自動化開發計畫（含缺口備註、可直接拆票的任務清單）
- `education-guides.md`：每關教育講解草案（每關必出）

