// Firebase 接入骨架（不會影響目前 LocalStorage 示範版）
// 等你建立 Firebase 專案並填好 firebase-config.js 後，再把 app.js 的 load/save 改成呼叫這裡。
(function () {
  window.PeakFirebaseService = {
    collections: {
      users: 'users',
      sales: 'sales',
      products: 'products',
      exchangeRates: 'exchangeRates',
      competitions: 'competitions',
      bonusRules: 'bonusRules',
      archives: 'archives',
      auditLogs: 'auditLogs',
      settings: 'settings'
    },
    normalizeSaleInput({ date, person, product, premium }, calculated, meta = {}) {
      return {
        date,
        person,
        product,
        premium: Number(premium || 0),
        currency: calculated.currency || 'TWD',
        exchangeRate: calculated.exchangeRate || null,
        twdPremium: calculated.twdPremium || 0,
        baseWeighted: calculated.baseWeighted || 0,
        extraWeighted: calculated.extraWeighted || 0,
        totalWeighted: calculated.totalWeighted || 0,
        competitionId: meta.competitionId || '',
        createdBy: meta.createdBy || '',
        createdAt: new Date().toISOString()
      };
    }
  };
})();
