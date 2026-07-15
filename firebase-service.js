// 高峰競賽平台 Firestore 同步服務 V2.2.2
// 使用 Firestore REST API，不依賴外部 Firebase SDK，避免 Safari / GitHub Pages 載入卡住。
(function () {
  'use strict';

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

  const STATE_KEYS = {
    users: 'users',
    products: 'products',
    rates: 'rates',
    competitions: 'competitions',
    bonus: 'bonus',
    sales: 'sales',
    history: 'history',
    audit: 'audit'
  };

  let initialized = false;
  let syncing = false;
  let lastError = '';
  let baseUrl = '';
  let commitUrl = '';
  let projectId = '';
  let apiKey = '';

  const makeId = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  function setStatus(status, message) {
    window.dispatchEvent(new CustomEvent('peak:firebase-status', {
      detail: { status, message: message || '' }
    }));
  }

  function clean(value) {
    return JSON.parse(JSON.stringify(value, (_key, item) => item === undefined ? null : item));
  }

  function encodeValue(value) {
    if (value === null || value === undefined) return { nullValue: null };
    if (typeof value === 'boolean') return { booleanValue: value };
    if (typeof value === 'number') {
      if (!Number.isFinite(value)) return { nullValue: null };
      return Number.isInteger(value)
        ? { integerValue: String(value) }
        : { doubleValue: value };
    }
    if (typeof value === 'string') return { stringValue: value };
    if (Array.isArray(value)) return { arrayValue: { values: value.map(encodeValue) } };
    if (typeof value === 'object') return { mapValue: { fields: encodeFields(value) } };
    return { stringValue: String(value) };
  }

  function encodeFields(object) {
    const fields = {};
    Object.entries(clean(object || {})).forEach(([key, value]) => {
      fields[key] = encodeValue(value);
    });
    return fields;
  }

  function decodeValue(value) {
    if (!value || 'nullValue' in value) return null;
    if ('booleanValue' in value) return value.booleanValue;
    if ('integerValue' in value) return Number(value.integerValue);
    if ('doubleValue' in value) return Number(value.doubleValue);
    if ('timestampValue' in value) return value.timestampValue;
    if ('stringValue' in value) return value.stringValue;
    if ('arrayValue' in value) return (value.arrayValue.values || []).map(decodeValue);
    if ('mapValue' in value) return decodeFields(value.mapValue.fields || {});
    return null;
  }

  function decodeFields(fields) {
    const result = {};
    Object.entries(fields || {}).forEach(([key, value]) => {
      result[key] = decodeValue(value);
    });
    return result;
  }

  function documentName(collection, id) {
    return `projects/${projectId}/databases/(default)/documents/${collection}/${id}`;
  }

  function encodePath(path) {
    return path.split('/').map(encodeURIComponent).join('/');
  }

  async function request(url, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        }
      });
      const text = await response.text();
      const data = text ? JSON.parse(text) : null;
      if (!response.ok) {
        const message = data?.error?.message || `${response.status} ${response.statusText}`;
        const error = new Error(message);
        error.code = data?.error?.status || `http-${response.status}`;
        throw error;
      }
      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        const timeoutError = new Error('連線逾時，請檢查網路或 Firestore 規則');
        timeoutError.code = 'timeout';
        throw timeoutError;
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }

  async function init(force = false) {
    if (initialized && !force) return true;
    setStatus('checking', '正在檢查 Firebase 專案設定…');

    const config = window.firebaseConfig || {};
    projectId = String(config.projectId || '').trim();
    apiKey = String(config.apiKey || '').trim();
    if (!projectId || !apiKey) {
      initialized = false;
      lastError = 'firebase-config.js 缺少 projectId 或 apiKey';
      setStatus('error', lastError);
      return false;
    }

    baseUrl = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents`;
    commitUrl = `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents:commit?key=${encodeURIComponent(apiKey)}`;

    try {
      // 使用 REST 直接確認 Firestore 可讀取；不存在的 settings/main 會回 404，仍代表 API 可連線。
      const url = `${baseUrl}/settings/main?key=${encodeURIComponent(apiKey)}`;
      try {
        await request(url);
      } catch (error) {
        if (error.code !== 'NOT_FOUND' && error.code !== 'http-404') throw error;
      }
      initialized = true;
      lastError = '';
      setStatus('connected', `已連線 Firebase：${projectId}`);
      return true;
    } catch (error) {
      initialized = false;
      lastError = `${error.code || 'firebase-error'}：${error.message}`;
      console.error('Firestore REST 連線失敗', error);
      setStatus('error', lastError);
      return false;
    }
  }

  async function getDocument(collection, id) {
    const url = `${baseUrl}/${encodePath(`${collection}/${id}`)}?key=${encodeURIComponent(apiKey)}`;
    try {
      const doc = await request(url);
      return { id, ...decodeFields(doc.fields || {}) };
    } catch (error) {
      if (error.code === 'NOT_FOUND' || error.code === 'http-404') return null;
      throw error;
    }
  }

  async function listCollection(collection) {
    const rows = [];
    let pageToken = '';
    do {
      const query = new URLSearchParams({ pageSize: '1000', key: apiKey });
      if (pageToken) query.set('pageToken', pageToken);
      const data = await request(`${baseUrl}/${encodeURIComponent(collection)}?${query.toString()}`);
      (data?.documents || []).forEach(doc => {
        const id = decodeURIComponent(doc.name.split('/').pop());
        if (id === '_meta') return;
        rows.push({ id, ...decodeFields(doc.fields || {}) });
      });
      pageToken = data?.nextPageToken || '';
    } while (pageToken);
    return rows;
  }

  async function commitWrites(writes) {
    for (let index = 0; index < writes.length; index += 350) {
      await request(commitUrl, {
        method: 'POST',
        body: JSON.stringify({ writes: writes.slice(index, index + 350) })
      });
    }
  }

  async function syncCollection(collection, rows) {
    const normalized = (rows || []).map(row => ({ ...clean(row), id: String(row.id || makeId()) }));
    const current = await listCollection(collection);
    const incomingIds = new Set(normalized.map(row => row.id));
    const writes = [];

    normalized.forEach(row => {
      writes.push({
        update: {
          name: documentName(collection, row.id),
          fields: encodeFields(row)
        }
      });
    });

    current.forEach(row => {
      if (!incomingIds.has(row.id)) writes.push({ delete: documentName(collection, row.id) });
    });

    if (normalized.length === 0) {
      writes.push({
        update: {
          name: documentName(collection, '_meta'),
          fields: encodeFields({ placeholder: true, updatedAt: new Date().toISOString() })
        }
      });
    } else {
      writes.push({ delete: documentName(collection, '_meta') });
    }

    await commitWrites(writes);
  }

  async function loadState() {
    if (!await init()) return null;
    try {
      setStatus('syncing', '正在讀取 Firestore 雲端資料…');
      const [settingsDoc, users, products, rates, competitions, bonus, sales, history, audit] = await Promise.all([
        getDocument('settings', 'main'),
        listCollection(COLLECTIONS.users),
        listCollection(COLLECTIONS.products),
        listCollection(COLLECTIONS.rates),
        listCollection(COLLECTIONS.competitions),
        listCollection(COLLECTIONS.bonus),
        listCollection(COLLECTIONS.sales),
        listCollection(COLLECTIONS.history),
        listCollection(COLLECTIONS.audit)
      ]);

      const hasCloudData = Boolean(settingsDoc) || [users, products, rates, competitions, bonus, sales].some(rows => rows.length > 0);
      if (!hasCloudData) {
        setStatus('connected', 'Firestore 已連線，目前尚無資料，準備初始化');
        return null;
      }

      setStatus('synced', '已載入 Firestore 雲端資料');
      return {
        settings: settingsDoc ? Object.fromEntries(Object.entries(settingsDoc).filter(([key]) => key !== 'id')) : {},
        users,
        products,
        rates,
        competitions,
        bonus,
        sales,
        history,
        audit
      };
    } catch (error) {
      lastError = `${error.code || 'read-error'}：${error.message}`;
      console.error('讀取 Firestore 失敗', error);
      setStatus('error', `讀取失敗：${lastError}`);
      throw error;
    }
  }

  async function saveState(state) {
    if (syncing) return false;
    if (!await init()) throw new Error(lastError || 'Firebase 連線失敗');
    syncing = true;
    try {
      setStatus('syncing', '正在寫入 Firestore…');
      await commitWrites([{
        update: {
          name: documentName('settings', 'main'),
          fields: encodeFields({
            ...(state.settings || {}),
            updatedAt: new Date().toISOString(),
            appVersion: window.PEAK_APP_VERSION || '2.2.2'
          })
        }
      }]);

      for (const [key, collection] of Object.entries(COLLECTIONS)) {
        setStatus('syncing', `正在同步 ${collection}…`);
        await syncCollection(collection, state[STATE_KEYS[key]] || []);
      }

      setStatus('synced', `已同步（${new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}）`);
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
