// 高峰競賽平台 Firestore 同步服務 V2.2.5
(function(){
  'use strict';
  const MAP={users:'people',products:'products',rates:'exchangeRates',competitions:'competitions',bonus:'rewardActivities',sales:'sales',history:'archives',audit:'auditLogs'};
  let ready=false,lastError='',db=null,mode='';
  const clean=v=>JSON.parse(JSON.stringify(v,(_k,x)=>x===undefined?null:x));
  const status=(s,m='')=>window.dispatchEvent(new CustomEvent('peak:firebase-status',{detail:{status:s,message:m}}));
  const timeout=(promise,ms=15000)=>Promise.race([promise,new Promise((_,rej)=>setTimeout(()=>rej(new Error(`連線逾時（${Math.round(ms/1000)} 秒）`)),ms))]);

  async function init(force=false){
    if(ready&&!force)return true;
    ready=false;lastError='';status('checking','正在檢查 Firebase');
    const config=window.firebaseConfig||{};
    if(!config.projectId||!config.apiKey){lastError='Firebase 設定不完整';status('error',lastError);return false;}
    try{
      if(!window.firebase?.initializeApp||!window.firebase?.firestore)throw new Error('Firebase SDK 未載入，請檢查網路或內容阻擋器');
      if(!window.firebase.apps.length)window.firebase.initializeApp(config);
      db=window.firebase.firestore();
      // 強制向伺服器讀取，避免只從快取判定成功。
      await timeout(db.collection('settings').doc('main').get({source:'server'}).catch(err=>{
        // 文件不存在是正常；權限或網路錯誤則必須拋出。
        if(err?.code==='not-found')return null;
        throw err;
      }));
      ready=true;mode='sdk';status('connected',`已連線 ${config.projectId}`);return true;
    }catch(e){
      ready=false;
      const code=e?.code?`${e.code}：`:'';
      lastError=`${code}${e?.message||e}`;
      if(/permission-denied/i.test(lastError))lastError+='（請確認 Firestore 規則已發布）';
      if(/SDK 未載入/i.test(lastError))lastError+='（Safari 若有內容阻擋器，請先暫停）';
      status('error',lastError);return false;
    }
  }

  async function listCollection(col){
    const snap=await timeout(db.collection(col).get());
    return snap.docs.filter(d=>d.id!=='_meta').map(d=>({id:d.id,...d.data()}));
  }

  async function syncCollection(col,rows){
    const normalized=(rows||[]).map((r,i)=>({...clean(r),id:String(r.id||`${Date.now()}-${i}`)}));
    const existing=await listCollection(col);const keep=new Set(normalized.map(r=>r.id));
    const ops=[];
    normalized.forEach(r=>ops.push({type:'set',ref:db.collection(col).doc(r.id),data:r}));
    existing.forEach(r=>{if(!keep.has(r.id))ops.push({type:'delete',ref:db.collection(col).doc(r.id)});});
    if(!normalized.length)ops.push({type:'set',ref:db.collection(col).doc('_meta'),data:{placeholder:true,updatedAt:new Date().toISOString()}});
    for(let i=0;i<ops.length;i+=450){
      const batch=db.batch();
      ops.slice(i,i+450).forEach(op=>op.type==='delete'?batch.delete(op.ref):batch.set(op.ref,op.data));
      await timeout(batch.commit(),20000);
    }
  }

  async function upload(state){
    if(!await init())throw new Error(lastError);
    status('syncing','正在上傳本機資料');
    await timeout(db.collection('settings').doc('main').set({...clean(state.settings||{}),updatedAt:new Date().toISOString(),appVersion:'2.2.5'}));
    for(const [key,col] of Object.entries(MAP)){status('syncing',`正在同步 ${col}`);await syncCollection(col,state[key]||[]);}
    localStorage.setItem('peakCloudEnabled','1');status('synced','已同步至 Firebase');return true;
  }

  async function download(){
    if(!await init())throw new Error(lastError);
    status('syncing','正在讀取雲端資料');
    const settingsDoc=await timeout(db.collection('settings').doc('main').get());
    const result={settings:settingsDoc.exists?settingsDoc.data():{}};
    for(const [key,col] of Object.entries(MAP))result[key]=await listCollection(col);
    const has=settingsDoc.exists||Object.keys(MAP).some(k=>Array.isArray(result[k])&&result[k].length>0);
    status('synced',has?'已載入雲端資料':'雲端目前沒有資料');return has?result:null;
  }

  window.PeakFirebaseService={init,upload,download,isReady:()=>ready,getLastError:()=>lastError,getMode:()=>mode};
})();
