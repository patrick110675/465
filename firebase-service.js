// 高峰競賽平台 Firestore 正式同步服務 V2.2.1（Firebase Compat SDK）
(function () {
  const COLLECTIONS = {
    users: 'people',
    products: 'products',
    rates: 'exchangeRates',
    competitions: 'competitions',
    bonus: 'rewardActivities',
    sales: 'sales',
    history: 'archives',
    audit: 'auditLogs'
  };

  let db = null;
  let initialized = false;
  let syncing = false;
  let lastError = '';

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  const makeId = () => (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`);

  function clean(value) {
    return JSON.parse(JSON.stringify(value, (_key, item) => item === undefined ? null : item));
  }

  function setStatus(status, message) {
    window.dispatchEvent(new CustomEvent('peak:firebase-status', {
      detail: { status, message: message || '' }
    }));
  }

  async function waitForFirebase(timeoutMs = 12000) {
    const started = Date.now();
    while (Date.now() - started < timeoutMs) {
      if (window.firebase?.initializeApp && window.firebase?.firestore && window.firebaseConfig?.projectId) return true;
      await sleep(250);
    }
    return false;
  }

  async function init(force = false) {
    if (initialized && !force) return true;
    setStatus('checking', '正在檢查 Firebase SDK 與專案設定…');

    const sdkReady = await waitForFirebase();
    if (!sdkReady) {
      const missing = [];
      if (!window.firebase) missing.push('Firebase SDK');
      if (!window.firebaseConfig?.projectId) missing.push('firebase-config.js');
      lastError = `${missing.join('、') || 'Firebase'} 尚未載入`;
      setStatus('error', lastError);
      return false;
    }

    try {
      if (!window.firebase.apps.length) window.firebase.initializeApp(window.firebaseConfig);
      db = window.firebase.firestore();
      // 強制進行一次伺服器讀取，避免只完成初始化卻誤判已連線。
      await db.collection('settings').doc('main').get({ source: 'server' });
      initialized = true;
      lastError = '';
      setStatus('connected', `已連線 Firebase：${window.firebaseConfig.projectId}`);
      return true;
    } catch (error) {
      initialized = false;
      lastError = `${error.code || 'firebase-error'}：${error.message}`;
      console.error('Firebase 初始化／連線失敗', error);
      setStatus('error', lastError);
      return false;
    }
  }

  async function readCollection(name) {
    const snapshot = await db.collection(name).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async function loadState() {
    if (!await init()) return null;
    try {
      setStatus('syncing', '正在讀取 Firestore 雲端資料…');
      const [settingsDoc, users, products, rates, competitions, bonus, sales, history, audit] = await Promise.all([
        db.collection('settings').doc('main').get(),
        readCollection(COLLECTIONS.users),
        readCollection(COLLECTIONS.products),
        readCollection(COLLECTIONS.rates),
        readCollection(COLLECTIONS.competitions),
        readCollection(COLLECTIONS.bonus),
        readCollection(COLLECTIONS.sales),
        readCollection(COLLECTIONS.history),
        readCollection(COLLECTIONS.audit)
      ]);

      const hasCloudData = settingsDoc.exists || [users, products, rates, competitions, bonus, sales].some(rows => rows.length > 0);
      if (!hasCloudData) {
        setStatus('connected', 'Firestore 已連線，目前尚無資料，準備初始化');
        return null;
      }

      setStatus('synced', '已載入 Firestore 雲端資料');
      return {
        settings: settingsDoc.exists ? settingsDoc.data() : {},
        users, products, rates, competitions, bonus, sales, history, audit
      };
    } catch (error) {
      lastError = `${error.code || 'read-error'}：${error.message}`;
      console.error('讀取 Firestore 失敗', error);
      setStatus('error', `讀取失敗：${lastError}`);
      throw error;
    }
  }

  async function syncCollection(collectionName, rows) {
    const normalized = (rows || []).map(row => ({ ...row, id: String(row.id || makeId()) }));
    const current = await db.collection(collectionName).get();
    const incomingIds = new Set(normalized.map(row => row.id));
    const operations = [];

    normalized.forEach(row => {
      operations.push({ type: 'set', ref: db.collection(collectionName).doc(row.id), data: clean(row) });
    });
    current.docs.forEach(doc => {
      if (!incomingIds.has(doc.id)) operations.push({ type: 'delete', ref: doc.ref });
    });

    for (let i = 0; i < operations.length; i += 400) {
      const batch = db.batch();
      operations.slice(i, i + 400).forEach(op => {
        if (op.type === 'set') batch.set(op.ref, op.data, { merge: false });
        else batch.delete(op.ref);
      });
      await batch.commit();
    }
  }

  async function saveState(state) {
    if (syncing) return false;
    if (!await init()) return false;
    syncing = true;
    try {
      setStatus('syncing', '正在寫入 Firestore…');
      await db.collection('settings').doc('main').set(clean({
        ...(state.settings || {}),
        updatedAt: new Date().toISOString(),
        appVersion: window.PEAK_APP_VERSION || '2.2.1'
      }), { merge: false });

      // 逐集合執行，讓錯誤訊息可明確指出失敗位置。
      for (const [key, collectionName] of Object.entries(COLLECTIONS)) {
        const stateKey = ({ users:'users',products:'products',rates:'rates',competitions:'competitions',bonus:'bonus',sales:'sales',history:'history',audit:'audit' })[key];
        setStatus('syncing', `正在同步 ${collectionName}…`);
        await syncCollection(collectionName, state[stateKey] || []);
      }

      setStatus('synced', `已同步至 Firestore（${new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}）`);
      return true;
    } catch (error) {
      lastError = `${error.code || 'write-error'}：${error.message}`;
      console.error('寫入 Firestore 失敗', error);
      setStatus('error', `同步失敗：${lastError}`);
      throw error;
    } finally {
      syncing = false;
    }
  }

  async function forceSync(state) {
    initialized = false;
    if (!await init(true)) throw new Error(lastError || 'Firebase 連線失敗');
    return saveState(state);
  }

  window.PeakFirebaseService = {
    collections: COLLECTIONS,
    init,
    loadState,
    saveState,
    forceSync,
    isReady: () => initialized,
    getLastError: () => lastError
  };
})();
