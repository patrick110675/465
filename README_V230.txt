高峰競賽平台 V2.3.0｜自動 Firebase 同步＋回收桶

已完成：
1. 管理中心新增／修改後，自動寫入 Firebase，不需手動上傳。
2. Firebase 空白時，第一次連線會自動上傳目前本機資料。
3. Firebase 已有資料時，新裝置會自動讀取雲端資料。
4. 網路中斷仍先保存 LocalStorage；恢復連線後可點雲端狀態重新連線。
5. 刪除人員、商品、匯率、競賽與獎勵時，先移到回收桶。
6. 回收桶可以還原或永久刪除。
7. Firebase 分集合：people、products、exchangeRates、competitions、rewardActivities、sales、archives、auditLogs、trash、settings。

使用方式：
- 將整個資料夾內容覆蓋上傳 GitHub。
- Firestore 規則貼上 firestore.rules 並發布。
- 開啟網站後，頂端顯示「已同步」代表成功。
- 第一次成功連線後，Firestore 會自動出現集合。
