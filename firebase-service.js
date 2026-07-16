// 高峰競賽平台 Firestore 自動同步服務 V2.3
(function () {
  'use strict';

  const COLLECTION_MAP = {
    users: 'people',
    products: 'products',
    rates: 'exchangeRates',
    competitions: 'competitions',
    bonus: 'rewardActivities',
    sales: 'sales',
    history: 'archives',
    audit: 'auditLogs',
    trash: 'trash'
  };

  let connected = false;
  let syncing = false;
  let lastError = '';
  let baseline = null;
  let syncTimer = null;
  let pendingState = null;

  const dispatch = (status, message = '') => {
    window.dispatchEvent(new CustomEvent('peak:firebase-status', {
      detail: { status, message }
    }));
  };

  const clone = (value) => JSON.parse(JSON.stringify(value, (_k, v) => v === undefined ? null : v));
  const stable = (value) => JSON.stringify(value ?? null);

  function config() {
    return window.firebaseConfig || {};
  }

  function baseUrl() {
    const cfg = config();
    return `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(cfg.projectId)}/databases/(default)/documents`;
  }

  function withKey(url) {
    const key = config().apiKey;
    return `${url}${url.includes('?') ? '&' : '?'}key=${encodeURIComponent(key || '')}`;
  }

  async function request(url, options = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      const res = await fetch(withKey(url), {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        },
        signal: controller.signal
      });
      if (res.status === 404) return null;
      const text = await res.text();
      const data = text ? JSON.parse(text) : null;
      if (!res.ok) {
        const message = data?.error?.message || `${res.status} ${res.statusText}`;
        throw new Error(message);
      }
      return data;
    } finally {
      clearTimeout(timer);
    }
  }

  function encodeValue(value) {
    if (value === null || value === undefined) return { nullValue: null };
    if (typeof value === 'boolean') return { booleanValue: value };
    if (typeof value === 'number') return Number.isInteger(value)
      ? { integerValue: String(value) }
      : { doubleValue: value };
    if (typeof value === 'string') return { stringValue: value };
    if (Array.isArray(value)) return { arrayValue: { values: value.map(encodeValue) } };
    if (typeof value === 'object') {
      const fields = {};
      Object.entries(value).forEach(([k, v]) => { fields[k] = encodeValue(v); });
      return { mapValue: { fields } };
    }
    return { stringValue: String(value) };
  }

  function decodeValue(value) {
    if (!value || typeof value !== 'object') return null;
    if ('nullValue' in value) return null;
    if ('booleanValue' in value) return value.booleanValue;
    if ('integerValue' in value) return Number(value.integerValue);
    if ('doubleValue' in value) return Number(value.doubleValue);
    if ('stringValue' in value) return value.stringValue;
    if ('timestampValue' in value) return value.timestampValue;
    if ('arrayValue' in value) return (value.arrayValue.values || []).map(decodeValue);
    if ('mapValue' in value) return decodeFields(value.mapValue.fields || {});
    return null;
  }

  function encodeFields(obj) {
    const fields = {};
    Object.entries(obj || {}).forEach(([k, v]) => { fields[k] = encodeValue(v); });
    return fields;
  }

  function decodeFields(fields) {
    const obj = {};
    Object.entries(fields || {}).forEach(([k, v]) => { obj[k] = decodeValue(v); });
    return obj;
  }

  async function getDocument(collection, id) {
    return request(`${baseUrl()}/${encodeURIComponent(collection)}/${encodeURIComponent(id)}`);
  }

  async function listCollection(collection) {
    const result = [];
    let token = '';
    do {
      const qs = new URLSearchParams({ pageSize: '1000' });
      if (token) qs.set('pageToken', token);
      const data = await request(`${baseUrl()}/${encodeURIComponent(collection)}?${qs.toString()}`);
      (data?.documents || []).forEach(doc => {
        const id = decodeURIComponent(doc.name.split('/').pop());
        if (id !== '_meta') result.push({ id, ...decodeFields(doc.fields || {}) });
      });
      token = data?.nextPageToken || '';
    } while (token);
    return result;
  }

  function docName(collection, id) {
    return `projects/${config().projectId}/databases/(default)/documents/${collection}/${id}`;
  }

  async function commit(writes) {
    if (!writes.length) return;
    for (let i = 0; i < writes.length; i += 450) {
      await request(`${baseUrl()}:commit`, {
        method: 'POST',
        body: JSON.stringify({ writes: writes.slice(i, i + 450) })
      });
    }
  }

  function buildStateFromRemote(settingsDoc, collections) {
    const state = { settings: settingsDoc ? decodeFields(settingsDoc.fields || {}) : {} };
    Object.entries(COLLECTION_MAP).forEach(([stateKey, collection]) => {
      state[stateKey] = collections[collection] || [];
    });
    return state;
  }

  async function downloadAll() {
    const names = [...new Set(Object.values(COLLECTION_MAP))];
    const [settingsDoc, ...rows] = await Promise.all([
      getDocument('settings', 'main'),
      ...names.map(name => listCollection(name))
    ]);
    const collections = {};
    names.forEach((name, i) => { collections[name] = rows[i] || []; });
    const hasData = Boolean(settingsDoc) || Object.values(collections).some(items => items.length > 0);
    return hasData ? buildStateFromRemote(settingsDoc, collections) : null;
  }

  function diffState(previous, current) {
    const writes = [];
    if (!previous || stable(previous.settings) !== stable(current.settings)) {
      writes.push({
        update: {
          name: docName('settings', 'main'),
          fields: encodeFields({ ...clone(current.settings || {}), updatedAt: new Date().toISOString(), appVersion: '2.4.0' })
        }
      });
    }

    Object.entries(COLLECTION_MAP).forEach(([stateKey, collection]) => {
      const prevRows = new Map((previous?.[stateKey] || []).map(row => [String(row.id), row]));
      const nextRows = new Map((current?.[stateKey] || []).map(row => [String(row.id), row]));

      nextRows.forEach((row, id) => {
        if (!prevRows.has(id) || stable(prevRows.get(id)) !== stable(row)) {
          writes.push({
            update: {
              name: docName(collection, id),
              fields: encodeFields(clone(row))
            }
          });
        }
      });

      prevRows.forEach((_row, id) => {
        if (!nextRows.has(id)) writes.push({ delete: docName(collection, id) });
      });

      if (!nextRows.size && !prevRows.size) {
        writes.push({
          update: {
            name: docName(collection, '_meta'),
            fields: encodeFields({ placeholder: true, updatedAt: new Date().toISOString() })
          }
        });
      }
    });

    return writes;
  }

  async function connect(localState) {
    const cfg = config();
    if (!cfg.projectId || !cfg.apiKey) {
      lastError = 'Firebase 設定不完整';
      dispatch('error', lastError);
      return { connected: false, state: null };
    }

    dispatch('checking', '正在連線 Firebase');
    try {
      const remote = await downloadAll();
      connected = true;
      lastError = '';
      dispatch('connected', `已連線 ${cfg.projectId}`);

      if (!remote) {
        baseline = null;
        await syncNow(localState);
        return { connected: true, state: null, uploadedLocal: true };
      }

      baseline = clone(remote);
      // 只要 Firebase 已有正式資料，初始化時一律下載雲端。
      // 不再用新裝置本機時間判斷上傳，避免 8 位示範資料覆蓋 people。
      dispatch('synced', '已載入 Firebase 雲端資料');
      return { connected: true, state: remote, uploadedLocal: false };
    } catch (error) {
      connected = false;
      lastError = error?.name === 'AbortError' ? '連線逾時' : (error?.message || String(error));
      if (/permission/i.test(lastError)) lastError += '（請確認 Firestore 規則已發布）';
      dispatch('error', lastError);
      return { connected: false, state: null };
    }
  }

  async function syncNow(state) {
    if (syncing) {
      pendingState = clone(state);
      return false;
    }
    if (!connected) {
      const result = await connect(state);
      if (!result.connected) return false;
      if (result.state) return true;
      if (result.uploadedLocal) return true;
    }

    syncing = true;
    dispatch('syncing', '正在同步 Firebase');
    try {
      const current = clone(state);
      const writes = diffState(baseline, current);
      await commit(writes);
      baseline = current;
      lastError = '';
      dispatch('synced', `已同步 ${writes.length} 項變更`);
      return true;
    } catch (error) {
      connected = false;
      lastError = error?.message || String(error);
      dispatch('error', lastError);
      return false;
    } finally {
      syncing = false;
      if (pendingState) {
        const queued = pendingState;
        pendingState = null;
        setTimeout(() => syncNow(queued), 300);
      }
    }
  }

  function queueSync(state, delay = 900) {
    pendingState = clone(state);
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => {
      const queued = pendingState;
      pendingState = null;
      syncNow(queued);
    }, delay);
  }

  window.addEventListener('online', () => {
    if (pendingState) queueSync(pendingState, 100);
  });

  async function testConnection(){const id='health-'+Date.now();await request(`${baseUrl()}/diagnostics/${id}`,{method:'PATCH',body:JSON.stringify({fields:encodeFields({ok:true,time:new Date().toISOString()})})});return true;}

  window.PeakFirebaseService = {
    connect,
    syncNow,
    queueSync,
    downloadAll,
    isConnected: () => connected,
    getLastError: () => lastError,
    testConnection
  };
})();
