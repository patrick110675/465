# 新高峰競賽平台 V1.2

## 已完成
- 登入入口（展示版可切換使用者）
- 首頁 Dashboard
- 每日之星：只顯示「今日加權第一名」
- 新增報件
- 自動換算台幣與加權
- 商品固定加權
- 額外加權
- 通訊處目標
- 我的高峰目標
- 個人／分組／競賽隊伍／商品／職級排行榜
- 獎金進度
- QR 活動簽到
- 新朋友記錄
- 出席率統計
- 歷史資料中心
- 修改紀錄 Audit Log
- CSV 匯出
- 管理後台：人員、競賽、商品、匯率、額外加權、獎金活動、QR 活動

## 使用方式
直接開啟 `index.html` 即可測試。

## Firebase
目前是本機 LocalStorage 模式。正式上線時：
1. 建立 Firebase 專案
2. 啟用 Authentication、Firestore、Hosting
3. 將 Firebase 設定貼到 `firebase-config.js`
4. 再把資料存取層改為 Firestore

## 注意
這版是可操作的前端 MVP，適合確認流程、畫面與資料欄位。正式多人同步需接 Firestore 與權限規則。
