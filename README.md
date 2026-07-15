# 高峰競賽平台 V2.2.2 Firestore 一次修正版

本版修正：
- 改用 Firestore REST API，不再依賴 Firebase CDN SDK
- Safari / GitHub Pages 不再卡在「檢查雲端」
- 雲端狀態改成可點擊按鈕，可重新連線並同步
- 失敗會顯示明確錯誤原因
- 即使集合尚無資料，也會建立 `_meta` 文件，Firebase 控制台可看到分類集合
- 修正手機底部「首頁、每日報件」同時呈現藍色的觸控 hover 問題

## 測試步驟
1. 將所有檔案覆蓋上傳 GitHub。
2. 等待 GitHub Pages 部署 1–3 分鐘。
3. 用 Safari 重新開啟並重新整理。
4. 上方應依序顯示：檢查雲端 → 已連線 → 同步中 → 已同步。
5. 回 Firestore「資料」頁重新整理，即可看到 people、products、exchangeRates、competitions、rewardActivities、sales、settings 等集合。
