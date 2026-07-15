// 高峰競賽平台 Firestore 同步服務
(function () {
  const service = {
    db: null,
    enabled: false,
    docRef: null,
    async init() {
      try {
        if (!window.firebaseConfig || !window.firebase) return false;
        if (!firebase.apps.length) firebase.initializeApp(window.firebaseConfig);
        this.db = firebase.firestore();
        this.docRef = this.db.collection('appData').doc('main');
        this.enabled = true;
        return true;
      } catch (err) {
        console.warn('Firestore 初始化失敗，暫用本機資料：', err);
        return false;
      }
    },
    async loadState() {
      if (!this.enabled) return null;
      const snap = await this.docRef.get();
      return snap.exists ? snap.data().state : null;
    },
    async saveState(state) {
      if (!this.enabled) return false;
      await this.docRef.set({ state, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
      return true;
    },
    collections: { people:'people', products:'products', exchangeRates:'exchangeRates', sales:'sales', competitions:'competitions', rewardActivities:'rewardActivities', settings:'settings' }
  };
  window.PeakFirebaseService = service;
})();
