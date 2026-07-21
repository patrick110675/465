console.info("新高峰智慧匯入模組 v4 2026-07-21 已載入");
const LS_KEY='peakCompetitionV211';
const APP_VERSION='OFFICIAL-FIXED-BONUS-PERSON-20260717';
const fmt=n=>(Number(n)||0).toLocaleString('zh-TW',{maximumFractionDigits:0});
const pct=n=>`${Math.round((Number(n)||0)*100)}%`;
const today=()=>new Date().toISOString().slice(0,10);
const monthKey=d=>String(d||today()).slice(0,7);
const uid=()=>Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4);
const norm=v=>String(v??'').trim();

const demo={
  settings:{platformTitle:'高峰競賽平台',banner:'新高峰',competitionStart:'2026-07-02',competitionEnd:'2026-12-15',period:'2026/07/02 - 2026/12/15',officeTarget:40000000,officeDoneManual:0,officeManual:false,peakTargetManual:2650000,peakDoneManual:0,superTargetManual:4000000,superDoneManual:0,competitionManual:false,dashboardWidgets:{todayWeighted:true,todayPremium:true,dailyStar:true,todayCount:true,officeProgress:true,competitionProgress:true,bonus:true,top5:true,latest:true},customCards:[],appName:'高峰競賽',platformLogo:'',appIcon:'',selectedCompetitionPersonId:'',selectedBonusPersonId:'',shortcuts:[{key:'sales',label:'新增報件',icon:'➕',enabled:true},{key:'ranking',label:'排行榜',icon:'🏆',enabled:true}],theme:{bg:'#eef7ff',primary:'#1769e8',text:'#0b1b3d',card:'#ffffff',radius:18}},
  users:[
    {id:uid(),name:'張永朋',unit:'素伶區',team:'靛隊',group:'永朋組',role:'主任',active:true},
    {id:uid(),name:'林志明',unit:'文斌區',team:'紅隊',group:'志明組',role:'主任',active:true},
    {id:uid(),name:'蔡汪霖',unit:'汪霖區',team:'藍隊',group:'汪霖區',role:'區經理',active:true},
    {id:uid(),name:'陳澄任',unit:'惠娟區',team:'紫隊',group:'悟儷組',role:'業代',active:true},
    {id:uid(),name:'黃金鳳',unit:'俊傑區',team:'紅隊',group:'俊傑區',role:'業代',active:true},
    {id:uid(),name:'李雅萍',unit:'昱勳區',team:'橙隊',group:'昱勳區',role:'業代',active:true},
    {id:uid(),name:'王小明',unit:'俊傑區',team:'紅隊',group:'俊傑區',role:'業代',active:true},
    {id:uid(),name:'李大華',unit:'惠音區',team:'綠隊',group:'惠音區',role:'業代',active:true}
  ],
  products:[
    {id:uid(),name:'BVA',code:'BVA3',year:'躉繳',currency:'TWD',category:'ILP',originalWeight:.05,contestWeight:.05,ah:false,active:true},
    {id:uid(),name:'UBVA',code:'UBVA2',year:'躉繳',currency:'USD',category:'ILP',originalWeight:.05,contestWeight:.05,ah:false,active:true},
    {id:uid(),name:'WEHS 20年',code:'20(G)WEHS',year:'20',currency:'TWD',category:'Health',originalWeight:3,contestWeight:3,ah:true,active:true},
    {id:uid(),name:'ACUPL 10年',code:'10(S)ACUPL',year:'10',currency:'USD',category:'Life',originalWeight:2,contestWeight:2,ah:false,active:true},
    {id:uid(),name:'HLTC 20年',code:'20(G)HLTC',year:'20',currency:'TWD',category:'Health',originalWeight:3,contestWeight:3,ah:true,active:true},
    {id:uid(),name:'小園保',code:'小園保',year:'1',currency:'TWD',category:'Health',originalWeight:1,contestWeight:3,ah:true,active:true}
  ],
  rates:[{id:uid(),year:2026,month:6,usd:31.4545},{id:uid(),year:2026,month:7,usd:31.57333}],
  competitions:[
    {id:uid(),name:'新高峰',start:'2026-07-02',end:'2026-12-15',role:'主任',weightedTarget:2650000,premiumTarget:20000000,reward:'日本關西'},
    {id:uid(),name:'新高峰',start:'2026-07-02',end:'2026-12-15',role:'業代',weightedTarget:2200000,premiumTarget:16000000,reward:'日本關西'},
    {id:uid(),name:'新高峰',start:'2026-07-02',end:'2026-12-15',role:'區經理',weightedTarget:4000000,premiumTarget:28000000,reward:'日本關西'},
    {id:uid(),name:'新極峰',start:'2026-07-02',end:'2026-12-15',role:'主任',weightedTarget:4000000,premiumTarget:0,ahTarget:0,reward:'新極峰'},
    {id:uid(),name:'新極峰',start:'2026-07-02',end:'2026-12-15',role:'業代',weightedTarget:3300000,premiumTarget:0,ahTarget:0,reward:'新極峰'}
  ],
  bonus:[
    {id:uid(),name:'BVA',start:'2026-07-01',deadline:'2026-07-15',metric:'premium',target:3000000,amount:5000,product:'BVA',category:'',ahOnly:false,protectionOnly:false,roles:'',active:true},
    {id:uid(),name:'WEHS',start:'2026-07-01',deadline:'2026-07-31',metric:'weighted',target:0,amount:3000,product:'WEHS',category:'Health',ahOnly:false,protectionOnly:false,roles:'',active:true},
    {id:uid(),name:'主任活動',start:'2026-07-01',deadline:'2026-07-31',metric:'weighted',target:1350000,amount:10000,product:'',category:'',ahOnly:false,protectionOnly:false,roles:'主任',active:true}
  ],
  sales:[],history:[],audit:[],trash:[]
};

demo.sales=[
  makeSale('2026-07-07','張永朋','BVA',500000),makeSale('2026-07-07','林志明','WEHS 20年',234160),makeSale('2026-07-07','蔡汪霖','ACUPL 10年',9950),makeSale('2026-07-07','陳澄任','WEHS 20年',99402),makeSale('2026-07-07','黃金鳳','WEHS 20年',90860),makeSale('2026-07-07','李雅萍','BVA',68000),makeSale('2026-07-06','王小明','WEHS 20年',200000),makeSale('2026-07-06','李大華','BVA',95000)
].filter(Boolean);

let state=load();
normalizeState();
let pendingImport=[];
let pendingImportMeta={sheetName:'',fileName:'',type:'',mapped:[]};
let rankMode='person';
let currentAdmin='people';

let cloudReady=false;
const DEMO_USER_NAMES=new Set(['張永朋','林志明','蔡汪霖','陳澄任','黃金鳳','李雅萍','王小明','李大華']);
const DEMO_PRODUCT_CODES=new Set(['BVA3','UBVA2','20(G)WEHS','10(S)ACUPL','20(G)HLTC','小園保']);
function deepClone(v){return JSON.parse(JSON.stringify(v??null));}
function isDemoUsers(rows){return Array.isArray(rows)&&rows.length>0&&rows.length<=8&&rows.every(x=>DEMO_USER_NAMES.has(norm(x.name)));}
function isDemoProducts(rows){return Array.isArray(rows)&&rows.length>0&&rows.length<=6&&rows.every(x=>DEMO_PRODUCT_CODES.has(norm(x.code||x.name)));}
function isDemoSales(rows){return Array.isArray(rows)&&rows.length>0&&rows.length<=8&&rows.every(x=>DEMO_USER_NAMES.has(norm(x.userName)));}
function mergeUnique(base,extra,keyFn){const out=[];const seen=new Set();[...(base||[]),...(extra||[])].forEach(x=>{if(!x)return;const k=String(keyFn(x)||'').trim();if(!k||seen.has(k))return;seen.add(k);out.push(deepClone(x));});return out;}
function saleKey(s){return [s.id||'',s.date||'',s.userName||'',s.productCode||s.productName||'',Number(s.premium||0)].join('|');}
function recoverySeed(){return window.PEAK_SEED_DATA||{};}
function recoverCollections(source={}){
  const seed=recoverySeed();
  const users=(Array.isArray(source.users)&&source.users.length&&!isDemoUsers(source.users))?source.users:(seed.users||[]);
  const products=(Array.isArray(source.products)&&source.products.length&&!isDemoProducts(source.products))?source.products:(seed.products||[]);
  const sales=(Array.isArray(source.sales)&&source.sales.length&&!isDemoSales(source.sales))?source.sales:(seed.sales||[]);
  return {
    ...source,
    users:mergeUnique(users,(!isDemoUsers(source.users)?source.users:[]),x=>x.name),
    products:mergeUnique(products,(!isDemoProducts(source.products)?source.products:[]),x=>x.code||`${x.name}|${x.year}`),
    rates:mergeUnique((source.rates&&source.rates.length?source.rates:(seed.rates||[])),[],x=>`${x.year}-${x.month}`),
    sales:mergeUnique(sales,(!isDemoSales(source.sales)?source.sales:[]),saleKey)
  };
}
function mergeRemoteState(local,remote){
  const seed=recoverySeed();
  const remoteSafe=recoverCollections(remote||{});
  const localSafe=recoverCollections(local||{});
  const chooseUsers=(remote?.users?.length&&!isDemoUsers(remote.users))?remote.users:localSafe.users;
  const chooseProducts=(remote?.products?.length&&!isDemoProducts(remote.products))?remote.products:localSafe.products;
  const chooseSales=(remote?.sales?.length&&!isDemoSales(remote.sales))?remote.sales:localSafe.sales;
  return {
    ...deepClone(localSafe),
    ...deepClone(remote||{}),
    settings:{...(localSafe.settings||{}),...(remote?.settings||{})},
    users:mergeUnique(chooseUsers,localSafe.users,x=>x.name),
    products:mergeUnique(chooseProducts,localSafe.products,x=>x.code||`${x.name}|${x.year}`),
    rates:mergeUnique((remote?.rates?.length?remote.rates:localSafe.rates),localSafe.rates,x=>`${x.year}-${x.month}`),
    sales:mergeUnique(chooseSales,localSafe.sales,saleKey),
    competitions:(remote?.competitions?.length?deepClone(remote.competitions):deepClone(localSafe.competitions||seed.competitions||[])),
    bonus:(remote?.bonus?.length?deepClone(remote.bonus):deepClone(localSafe.bonus||[])),
    history:mergeUnique(remote?.history||[],localSafe.history||[],x=>x.id),
    audit:mergeUnique(remote?.audit||[],localSafe.audit||[],x=>x.id),
    trash:mergeUnique(remote?.trash||[],localSafe.trash||[],x=>x.id)
  };
}


function normalizeState(){
  state.settings={...demo.settings,...(state.settings||{})};
  state.settings.dashboardWidgets={...demo.settings.dashboardWidgets,...(state.settings.dashboardWidgets||{})};
  state.settings.customCards=state.settings.customCards||[];
  state.settings.appName=state.settings.appName||'高峰競賽';
  state.settings.platformLogo=state.settings.platformLogo||'';
  state.settings.appIcon=state.settings.appIcon||'';
  state.settings.selectedCompetitionPersonId=state.settings.selectedCompetitionPersonId||'';
  state.settings.selectedBonusPersonId=state.settings.selectedBonusPersonId||state.settings.selectedCompetitionPersonId||'';
  state.settings.shortcuts=Array.isArray(state.settings.shortcuts)&&state.settings.shortcuts.length?state.settings.shortcuts:[{key:'sales',label:'新增報件',icon:'➕',enabled:true},{key:'ranking',label:'排行榜',icon:'🏆',enabled:true}];
  state.trash=Array.isArray(state.trash)?state.trash:[];
  state.audit=Array.isArray(state.audit)?state.audit:[];
  state.products=(state.products||[]).map(p=>({subcategory:'',protection:false,mainRider:'主約',...p}));
  state.bonus=(state.bonus||[]).map(b=>normalizeBonus(b));
  state.competitions=migrateCompetitions(state.competitions||[]);
  // 新高峰、新極峰共用三項核心標準；實收欄位固定保留並可由管理中心填入各職級目標。
  state.competitions=state.competitions.map(c=>{
    if(c.scope!=='office' && ['新高峰','新極峰'].some(name=>String(c.name||'').includes(name))){
      c.metrics=c.metrics||{};
      c.metrics.weighted={enabled:c.metrics.weighted?.enabled!==false};
      c.metrics.premium={enabled:true};
      c.metrics.ah={enabled:!!c.metrics.ah?.enabled};
    }
    return c;
  });
  if(!state.competitions.some(c=>c.scope==='office')){
    state.competitions.unshift(normalizeCompetition({id:uid(),name:'通訊處進度',scope:'office',start:'',end:'',logic:'AND',active:true,manualEnabled:!!state.settings.officeManual,manualValues:{weighted:Number(state.settings.officeDoneManual||0),premium:0,ah:0},metrics:{weighted:{enabled:true},premium:{enabled:false},ah:{enabled:false}},targets:{'通訊處':{weighted:Number(state.settings.officeTarget||40000000),premium:0,ah:0}},extraConditions:[]}));
  }
  localStorage.setItem(LS_KEY,JSON.stringify(state));
}
function migrateCompetitions(rows){
  if(!rows.length)return [];
  if(rows.some(c=>c.targets||c.metrics))return rows.map(c=>normalizeCompetition(c));
  const groups=new Map();
  rows.forEach(r=>{
    const key=[r.name,r.start,r.end].join('|');
    if(!groups.has(key))groups.set(key,{id:uid(),name:r.name||'未命名競賽',start:r.start||'',end:r.end||'',scope:'personal',logic:'AND',active:true,reward:r.reward||'',metrics:{weighted:{enabled:true},premium:{enabled:false},ah:{enabled:false}},targets:{},extraConditions:[]});
    const c=groups.get(key); const role=r.role||'全員';
    c.targets[role]={weighted:Number(r.weightedTarget||0),premium:Number(r.premiumTarget||0),ah:Number(r.ahTarget||0)};
    if(Number(r.premiumTarget||0)>0 || String(r.name||'').includes('新極峰') || String(r.name||'').includes('新高峰'))c.metrics.premium.enabled=true;
    if(Number(r.ahTarget||0)>0)c.metrics.ah.enabled=true;
  });
  return [...groups.values()].map(normalizeCompetition);
}
function normalizeCompetition(c){
  return {id:c.id||uid(),name:c.name||'未命名競賽',scope:c.scope==='office'?'office':'personal',start:c.start||'',end:c.end||'',logic:c.logic==='OR'?'OR':'AND',active:c.active!==false,reward:c.reward||'',manualEnabled:!!c.manualEnabled,manualValues:{weighted:Number(c.manualValues?.weighted||0),premium:Number(c.manualValues?.premium||0),ah:Number(c.manualValues?.ah||0)},metrics:{weighted:{enabled:c.metrics?.weighted?.enabled!==false},premium:{enabled:!!c.metrics?.premium?.enabled},ah:{enabled:!!c.metrics?.ah?.enabled}},targets:c.targets||{},extraConditions:Array.isArray(c.extraConditions)?c.extraConditions:[]};
}
function csvList(v){return String(v||'').split(/[,，、;；\n]/).map(x=>x.trim()).filter(Boolean)}
function normalizeBonusMetric(metric){
  const raw=norm(metric).toLowerCase();
  return ({weighted:'weighted','競賽加權':'weighted','加權計績':'weighted','加權':'weighted',premium:'premium','實收':'premium','實收保費':'premium',original:'original','原始加權':'original',ah:'ah','a&h':'ah','a＆h':'ah',count:'count','件數':'count'})[raw]||'weighted';
}
function normalizeBonus(source={}){
  const b={start:'',deadline:'',category:'',subcategory:'',ahOnly:false,protectionOnly:false,roles:'',units:'',teams:'',groups:'',products:'',active:true,...source};
  b.products=b.products||b.product||'';
  b.metric=normalizeBonusMetric(b.metric);
  const name=norm(b.name).toUpperCase();
  // 只轉換官方舊預設，避免改動使用者自行建立的其他活動。
  if(name==='BVA'&&b.metric==='weighted')b.metric='premium';
  if(name==='WEHS'&&b.metric==='count'){
    b.metric='weighted';
    // 舊版的「3」代表件數，不能直接當成加權計績目標。
    if(Number(b.target||0)<=100)b.target=0;
  }
  b.active=b.active!==false&&b.active!=='false';
  return b;
}
function saleProduct(sale){return state.products.find(p=>p.id===sale.productId||p.code===sale.productCode||p.name===sale.productName)||{} }
function bonusMetricLabel(metric){return ({weighted:'加權計績',premium:'實收',original:'原始加權',ah:'A&H',count:'件數'})[normalizeBonusMetric(metric)]||metric}
function bonusValue(bonus,userSales,user){
  let data=userSales.filter(s=>(!bonus.start||s.date>=bonus.start)&&(!bonus.deadline||s.date<=bonus.deadline));
  const roles=csvList(bonus.roles),units=csvList(bonus.units),teams=csvList(bonus.teams),groups=csvList(bonus.groups);
  if(roles.length&&!roles.includes(user?.role)) return {value:0,eligible:false,data:[]};
  if(units.length&&!units.includes(user?.unit)) return {value:0,eligible:false,data:[]};
  if(teams.length&&!teams.includes(user?.team)) return {value:0,eligible:false,data:[]};
  if(groups.length&&!groups.includes(user?.group)) return {value:0,eligible:false,data:[]};
  const products=csvList(bonus.products||bonus.product);
  data=data.filter(s=>{
    const p=saleProduct(s);
    if(products.length&&!products.some(x=>String(s.productName||'').includes(x)||String(s.productCode||'').includes(x)))return false;
    if(bonus.category&&String(p.category||'')!==String(bonus.category))return false;
    if(bonus.subcategory&&String(p.subcategory||'')!==String(bonus.subcategory))return false;
    if(bonus.ahOnly&&!p.ah)return false;
    if(bonus.protectionOnly&&!p.protection)return false;
    return true;
  });
  const metric=normalizeBonusMetric(bonus.metric);
  const key={premium:'twdPremium',original:'originalWeighted',ah:'ahWeighted',weighted:'contestWeighted'}[metric]||'contestWeighted';
  return {value:metric==='count'?data.length:sum(data,key),eligible:true,data};
}

function load(){
  const raw=localStorage.getItem(LS_KEY);
  if(raw){try{return recoverCollections(JSON.parse(raw));}catch(_e){}}
  const seed=recoverySeed();
  return recoverCollections({settings:deepClone(demo.settings),users:seed.users||[],products:seed.products||[],rates:seed.rates||[],sales:seed.sales||[],competitions:seed.competitions||demo.competitions,bonus:demo.bonus,history:[],audit:[],trash:[]});
}
function save(){
  state.settings=state.settings||{};
  state.settings.localUpdatedAt=new Date().toISOString();
  localStorage.setItem(LS_KEY,JSON.stringify(state));
  if(cloudReady) window.PeakFirebaseService?.queueSync?.(state);
}

window.PeakHomeAPI={
  get(){return JSON.parse(JSON.stringify(state.settings.homeCustomizer||{}));},
  set(config){state.settings.homeCustomizer=JSON.parse(JSON.stringify(config||{}));save();return state.settings.homeCustomizer;},
  sync(){save();}
};

function log(action,detail){state.audit.unshift({id:uid(),time:new Date().toISOString(),action,detail});}
function makeSale(date,userName,productName,premium){
  const u=(demo.users||state?.users||[]).find(x=>x.name===userName); const p=(demo.products||state?.products||[]).find(x=>x.name===productName); if(!u||!p)return null;
  const y=Number(date.slice(0,4)),m=Number(date.slice(5,7)); const rate=(p.currency==='USD')?((demo.rates||state?.rates||[]).find(r=>r.year===y&&r.month===m)?.usd||1):1;
  const twd=Number(premium)*rate; return {id:uid(),date,userId:u.id,userName:u.name,productId:p.id,productName:p.name,productCode:p.code,premium:Number(premium),currency:p.currency,usdRate:rate,twdPremium:twd,originalWeighted:twd*p.originalWeight,contestWeighted:twd*p.contestWeight,ahWeighted:p.ah?twd*p.contestWeight:0,createdAt:new Date().toISOString()};
}
function findSaleUser(ref){
  const key=norm(ref);
  return state.users.find(x=>String(x.id||'')===key || norm(x.name)===key);
}
function findSaleProduct(ref){
  const key=norm(ref);
  const shortKey=norm(key.split('｜')[0]);
  return state.products.find(x=>String(x.id||'')===key || norm(x.code)===key || norm(x.name)===key || norm(x.name)===shortKey);
}
function createSale(date,userRef,productRef,premium){
  const u=findSaleUser(userRef);
  const p=findSaleProduct(productRef);
  if(!u||!p) throw new Error(`找不到報件資料：${!u?'人員':''}${!u&&!p?'、':''}${!p?'商品':''}。請回管理中心重新儲存該資料。`);
  if(!date) throw new Error('請選擇報件日期');
  const premiumValue=Number(premium);
  if(!Number.isFinite(premiumValue)||premiumValue<=0) throw new Error('原始保費必須大於 0');
  const y=Number(date.slice(0,4)),m=Number(date.slice(5,7)); let rate=1;
  if(String(p.currency||'TWD').toUpperCase()==='USD'){
    const r=state.rates.find(x=>Number(x.year)===y&&Number(x.month)===m);
    if(!r) throw new Error(`尚未設定 ${y}/${m} 美金匯率`);
    rate=Number(r.usd);
    if(!Number.isFinite(rate)||rate<=0) throw new Error(`${y}/${m} 美金匯率格式錯誤`);
  }
  const originalWeight=Number(p.originalWeight)||0;
  const contestWeight=Number(p.contestWeight)||0;
  const twd=premiumValue*rate;
  return {id:uid(),date,userId:u.id||u.name,userName:u.name,unit:u.unit||'',team:u.team||'',group:u.group||'',role:u.role||'',productId:p.id||p.code||p.name,productName:p.name,productCode:p.code||'',premium:premiumValue,currency:String(p.currency||'TWD').toUpperCase(),usdRate:rate,twdPremium:twd,originalWeighted:twd*originalWeight,contestWeighted:twd*contestWeight,ahWeighted:p.ah?twd*contestWeight:0,createdAt:new Date().toISOString()};
}

function init(){
  applyTheme(); bindNav(); fillSelects(); fillCompetitionPersonSelector(); fillBonusPersonSelector(); bindForms(); renderAll(); renderAdmin(); bindCloudStatus();
  connectCloud();
}
function bindCloudStatus(){
  window.addEventListener('peak:firebase-status',e=>setCloudStatus(e.detail||{}));
  const el=document.getElementById('cloudSyncStatus');
  if(el) el.onclick=()=>connectCloud(true);
}
function setCloudStatus(detail={}){
  const el=document.getElementById('cloudSyncStatus'); if(!el)return;
  const text={checking:'⏳ 連線中',connected:'☁️ 已連線',syncing:'↻ 同步中',synced:'✅ 已同步',error:'⚠️ 離線備援'}[detail.status]||'☁️ 本機備援';
  el.textContent=text; el.className=`cloud-status ${detail.status||'offline'}`; el.title=detail.message||'點擊重新連線';
}
async function connectCloud(force=false){
  const el=document.getElementById('cloudSyncStatus'); if(el&&force)el.textContent='⏳ 重新連線';
  const result=await window.PeakFirebaseService?.connect?.(state);
  if(!result?.connected){cloudReady=false;return;}
  state=mergeRemoteState(state,result.state||{});
  normalizeState();
  localStorage.setItem(LS_KEY,JSON.stringify(state));
  cloudReady=true;
  applyTheme(); fillSelects(); fillCompetitionPersonSelector(); fillBonusPersonSelector(); renderAll(); renderAdmin();
  const counts=`人員 ${state.users.length} 位｜商品 ${state.products.length} 項｜業績 ${state.sales.length} 筆`;
  toast(`已載入正式資料：${counts}`);
  // 若雲端只有舊示範資料，將恢復後的正式資料補回雲端；不會用空白或 8 人資料覆蓋正式資料。
  window.PeakFirebaseService?.syncNow?.(state);
}

function bindNav(){document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>showPage(b.dataset.page));document.querySelectorAll('[data-admin-tab]').forEach(b=>b.onclick=()=>{showPage('admin');currentAdmin=b.dataset.adminTab;renderAdmin();});document.querySelectorAll('.admin-tab').forEach(b=>b.onclick=()=>{currentAdmin=b.dataset.admin;renderAdmin();});document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');rankMode=b.dataset.rank;renderTop5();});document.addEventListener('click',e=>{if(!e.target.closest('.autocomplete-field'))document.querySelectorAll('.autocomplete-menu').forEach(x=>x.hidden=true);});}
function showPage(id){document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));document.getElementById(id)?.classList.add('active');document.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.page===id));}
function fillSelects(){
  const su=document.getElementById('saleUser'),sp=document.getElementById('saleProduct');
  if(su&&!su.dataset.autocompleteBound){bindSaleAutocomplete(su,document.getElementById('saleUserSuggestions'),'user');su.dataset.autocompleteBound='1';}
  if(sp&&!sp.dataset.autocompleteBound){bindSaleAutocomplete(sp,document.getElementById('saleProductSuggestions'),'product');sp.dataset.autocompleteBound='1';}
  fillFilter('filterUnit',[...new Set(state.users.map(u=>u.unit).filter(Boolean))],'全部區單位');fillFilter('filterTeam',[...new Set(state.users.map(u=>u.team).filter(Boolean))],'全部隊伍');fillFilter('filterRole',[...new Set(state.users.map(u=>u.role).filter(Boolean))],'全部職級');
  if(!document.getElementById('saleDate').value)document.getElementById('saleDate').value=today(); if(!document.getElementById('filterDate').value)document.getElementById('filterDate').value=today();
}
function saleAutocompleteItems(type,q=''){
  const key=norm(q).toLowerCase();
  if(type==='user')return state.users.filter(u=>u.active!==false&&(!key||[u.name,u.unit,u.team,u.group,u.role].some(v=>String(v||'').toLowerCase().includes(key)))).slice(0,20).map(u=>({value:u.name,label:`${u.name}｜${u.unit||''}｜${u.role||''}`}));
  return state.products.filter(p=>p.active!==false&&(!key||[p.name,p.code,p.year,p.currency,p.category,p.subcategory].some(v=>String(v||'').toLowerCase().includes(key)))).slice(0,20).map(p=>({value:p.name,label:`${p.name}${p.code?`｜${p.code}`:''}｜${p.year||''}｜${p.currency||'TWD'}｜${weightText(p.contestWeight)}`}));
}
function bindSaleAutocomplete(input,menu,type){
  const draw=()=>{const q=input.value;const items=saleAutocompleteItems(type,q);menu.innerHTML=items.map(x=>`<button type="button" data-autocomplete-value="${escapeHtml(x.value)}">${escapeHtml(x.label)}</button>`).join('')||'<div class="autocomplete-empty">找不到符合資料</div>';menu.hidden=false;menu.querySelectorAll('[data-autocomplete-value]').forEach(b=>b.onclick=()=>{input.value=b.dataset.autocompleteValue;menu.hidden=true;if(type==='user')document.getElementById('saleProduct')?.focus();else document.getElementById('salePremium')?.focus();});};
  input.addEventListener('focus',draw); input.addEventListener('input',draw); input.addEventListener('keydown',e=>{if(e.key==='Escape')menu.hidden=true;});
}
function fillFilter(id,arr,label){const el=document.getElementById(id);el.innerHTML=`<option value="">${label}</option>`+arr.map(v=>`<option>${v}</option>`).join('');}
function canonicalRoles(){
  const fixed=['區經理','襄理','主任','新進主任','業代','新進業代','特定新進業代'];
  return [...new Set([...fixed,...state.users.map(u=>u.role).filter(Boolean)])];
}
function fillCompetitionPersonSelector(){
  const person=document.getElementById('competitionPerson'); if(!person)return;
  const search=document.getElementById('competitionPersonSearch');
  const menu=document.getElementById('competitionPersonSuggestions');
  const unit=document.getElementById('competitionUnit'),team=document.getElementById('competitionTeam'),group=document.getElementById('competitionGroup');
  const keep=state.settings.selectedCompetitionPersonId;
  const fill=(el,values,label)=>{const old=el.value;el.innerHTML=`<option value="">${label}</option>`+values.map(v=>`<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('');if(values.includes(old))el.value=old;};
  fill(unit,[...new Set(state.users.map(x=>x.unit).filter(Boolean))],'全部區單位');
  fill(team,[...new Set(state.users.map(x=>x.team).filter(Boolean))],'全部隊伍');
  fill(group,[...new Set(state.users.map(x=>x.group).filter(Boolean))],'全部組別');

  const filteredRows=()=>state.users.filter(u=>(!unit.value||u.unit===unit.value)&&(!team.value||u.team===team.value)&&(!group.value||u.group===group.value)&&u.active!==false);
  const selectPerson=(id,shouldSave=true)=>{
    const row=state.users.find(u=>String(u.id)===String(id));
    if(!row)return;
    person.value=String(row.id);
    state.settings.selectedCompetitionPersonId=String(row.id);
    // 我的獎勵活動與我的競賽進度共用同一位人員。
    state.settings.selectedBonusPersonId=String(row.id);
    if(search)search.value=row.name;
    if(menu)menu.hidden=true;
    if(shouldSave)save();else localStorage.setItem(LS_KEY,JSON.stringify(state));
    renderDashboard();
  };
  const drawSuggestions=()=>{
    if(!search||!menu)return;
    const q=norm(search.value).toLowerCase();
    const rows=filteredRows().filter(u=>!q||[u.name,u.unit,u.team,u.group,u.role].some(v=>norm(v).toLowerCase().includes(q))).slice(0,30);
    menu.innerHTML=rows.map(u=>`<button type="button" data-competition-person="${escapeHtml(String(u.id))}"><b>${escapeHtml(u.name)}</b><small>${escapeHtml([u.unit,u.team,u.role].filter(Boolean).join('｜'))}</small></button>`).join('')||'<div class="autocomplete-empty">找不到符合的人員</div>';
    menu.hidden=false;
    menu.querySelectorAll('[data-competition-person]').forEach(b=>b.onclick=()=>selectPerson(b.dataset.competitionPerson));
  };
  const redraw=()=>{
    const rows=filteredRows();
    const selected=person.value||keep||rows[0]?.id||'';
    person.innerHTML=rows.map(u=>`<option value="${escapeHtml(String(u.id))}">${escapeHtml(u.name)}｜${escapeHtml(u.role||'未設定')}</option>`).join('');
    const finalId=rows.some(u=>String(u.id)===String(selected))?selected:(rows[0]?.id||'');
    if(finalId)selectPerson(finalId,false);
    else{state.settings.selectedCompetitionPersonId='';if(search)search.value='';renderDashboard();}
    if(search&&document.activeElement===search)drawSuggestions();
  };
  [unit,team,group].forEach(el=>el.onchange=redraw);
  person.onchange=()=>selectPerson(person.value);
  if(search&&menu){
    search.onfocus=drawSuggestions;
    search.oninput=drawSuggestions;
    search.onkeydown=e=>{if(e.key==='Escape')menu.hidden=true;if(e.key==='Enter'){e.preventDefault();const first=menu.querySelector('[data-competition-person]');if(first)first.click();}};
    document.addEventListener('click',e=>{if(!search.contains(e.target)&&!menu.contains(e.target))menu.hidden=true;});
  }
  redraw();
}
function selectedCompetitionPerson(){
  return state.users.find(u=>String(u.id)===String(state.settings.selectedCompetitionPersonId))||state.users.find(u=>u.name==='張永朋')||state.users[0];
}
function fillBonusPersonSelector(){
  // 已改為與「我的競賽進度」共用同一位人員，不再維護第二套名單。
  state.settings.selectedBonusPersonId=state.settings.selectedCompetitionPersonId||'';
}
function selectedBonusPerson(){
  return selectedCompetitionPerson();
}
function bindForms(){
  document.getElementById('saleForm').onsubmit=e=>{
    e.preventDefault();
    const dateEl=document.getElementById('saleDate');
    const userEl=document.getElementById('saleUser');
    const productEl=document.getElementById('saleProduct');
    const premiumEl=document.getElementById('salePremium');
    try{
      const s=createSale(dateEl.value,userEl.value,productEl.value,premiumEl.value);
      state.sales.unshift(s);
      log('新增報件',`${s.userName} ${s.productName} ${fmt(s.twdPremium)}`);
      save();
      premiumEl.value='';
      document.getElementById('filterDate').value=s.date;
      renderAll();
      toast(`已新增報件：${s.userName}／${s.productName}`);
    }catch(err){
      console.error('新增報件失敗',err,{date:dateEl.value,user:userEl.value,product:productEl.value,premium:premiumEl.value});
      alert(err?.message||'新增報件失敗，請重新整理後再試');
    }
  };
  ['filterDate','filterUnit','filterTeam','filterRole'].forEach(id=>document.getElementById(id).onchange=renderDaily);document.getElementById('clearFilters').onclick=()=>{filterDate.value='';filterUnit.value='';filterTeam.value='';filterRole.value='';renderDaily();};
  rankingType.onchange=renderRanking;
  ['historyStart','historyEnd','historyKeyword','historyUnit','historyTeam','historyRole'].forEach(id=>{const el=document.getElementById(id);if(el)el.addEventListener(id==='historyKeyword'?'input':'change',renderHistory);});
  document.getElementById('clearHistoryFilters')?.addEventListener('click',()=>{['historyStart','historyEnd','historyKeyword'].forEach(id=>document.getElementById(id).value='');['historyUnit','historyTeam','historyRole'].forEach(id=>document.getElementById(id).value='');renderHistory();});
  document.getElementById('exportHistorySales')?.addEventListener('click',()=>exportRows('歷史業績紀錄',getHistorySales().map(s=>({日期:s.date,姓名:s.userName,商品:s.productName,原始保費:s.premium,實收:s.twdPremium,加權:s.contestWeighted,'A&H':s.ahWeighted,區單位:s.unit,隊伍:s.team,職級:s.role})))); document.getElementById('exportRanking')?.addEventListener('click',()=>exportRows('排行榜',getRanking(document.getElementById('rankingType').value)));
  document.getElementById('selectAllTeams')?.addEventListener('click',()=>document.querySelectorAll('[data-team-report-team]').forEach(x=>x.checked=true));
  document.getElementById('clearAllTeams')?.addEventListener('click',()=>document.querySelectorAll('[data-team-report-team]').forEach(x=>x.checked=false));
  document.getElementById('exportTeamExcel')?.addEventListener('click',exportTeamReportExcel);
  document.getElementById('exportTeamPdf')?.addEventListener('click',exportTeamReportPdf);
  document.querySelectorAll('[data-history-range]').forEach(btn=>btn.addEventListener('click',()=>setHistoryRange(btn.dataset.historyRange))); 
  document.getElementById('platformLogoFile').onchange=e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{state.settings.platformLogo=ev.target.result;save();applyTheme();toast('平台 Logo 已更新');};reader.readAsDataURL(file);}; document.getElementById('removePlatformLogo').onclick=()=>{state.settings.platformLogo='';save();applyTheme();toast('已移除平台 Logo');}; document.getElementById('appIconFile').onchange=e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{state.settings.appIcon=ev.target.result;save();applyTheme();toast('App 圖示已更新；iPhone 請刪除舊捷徑後重新加入主畫面');};reader.readAsDataURL(file);}; document.getElementById('removeAppIcon').onclick=()=>{state.settings.appIcon='';save();applyTheme();toast('已恢復預設圖示');}; document.getElementById('saveTheme').onclick=saveThemeSettings; document.getElementById('defaultTheme').onclick=()=>{state.settings.theme=JSON.parse(JSON.stringify(demo.settings.theme));save();applyTheme();};
}
function weightText(w){return Number(w)>=1?`${Number(w)*100}%`:`${Number(w)*100}%`;}
function renderAll(){renderDashboard();renderDaily();renderRanking();renderHistory();fillSelects();}
function salesOn(date=today()){return state.sales.filter(s=>s.date===date)}
function sum(arr,key){return arr.reduce((a,b)=>a+(Number(b[key])||0),0)}
function renderDashboard(){
  competitionSubtitle.textContent=`${state.settings.banner}｜${formatCompetitionPeriod()}`;
  pageTitle.textContent=`${state.settings.platformTitle||'高峰競賽平台'} 👋`;
  document.getElementById('brandTitle')&&(document.getElementById('brandTitle').textContent=state.settings.platformTitle||'高峰競賽平台');
  const t=salesOn(today()); todayWeighted.textContent=fmt(sum(t,'contestWeighted')); todayPremium.textContent=fmt(sum(t,'twdPremium')); todayCount.textContent=`${t.length} 件`;
  const star=[...aggregate(t,'userName')].sort((a,b)=>b.contestWeighted-a.contestWeighted)[0]; dailyStar.textContent=star?.name||'尚無'; dailyStarSub.textContent=star?`今日加權 ${fmt(star.contestWeighted)}`:'今日加權第一名';
  const officeCompetition=state.competitions.find(c=>c.active!==false&&c.scope==='office');
  if(officeCompetition){
    const metric=['weighted','premium','ah'].find(m=>officeCompetition.metrics?.[m]?.enabled)||'weighted';
    const target=Number(officeCompetition.targets?.['通訊處']?.[metric]||officeCompetition.targets?.['全員']?.[metric]||0);
    const periodSales=state.sales.filter(s=>(!officeCompetition.start||s.date>=officeCompetition.start)&&(!officeCompetition.end||s.date<=officeCompetition.end));
    const autoDone=competitionMetricValue(metric,periodSales);
    const done=officeCompetition.manualEnabled?Number(officeCompetition.manualValues?.[metric]||0):autoDone;
    officeTarget.textContent=fmt(target); officeDone.textContent=fmt(done); officeRemain.textContent=fmt(Math.max(target-done,0)); officeRate.textContent=pct(target?done/target:0); officeBar.style.width=`${Math.min(target?done/target*100:0,100)}%`;
    const officeTitle=document.querySelector('#dashboardOfficeCard h2'); if(officeTitle)officeTitle.textContent=`🎯 ${officeCompetition.name||'通訊處進度'}`;
  }else{
    officeTarget.textContent='0'; officeDone.textContent='0'; officeRemain.textContent='0'; officeRate.textContent='0%'; officeBar.style.width='0%';
  }
  const me=selectedCompetitionPerson();
  const bonusPerson=me;
  renderCompetitionProgress(me);
  renderDashboardShortcuts();
  renderBonus(competitionSales({start:'',end:''},bonusPerson),bonusPerson); renderTop5(); renderLatest(); applyDashboardWidgets(); renderCustomDashboardCards();
}
function competitionSales(c,user){
  return state.sales.filter(s=>s.userName===user?.name&&(!c.start||s.date>=c.start)&&(!c.end||s.date<=c.end));
}

// 唯一的個人競賽統計核心：本人業績 + 直屬業代業績；件數永遠只算本人。
function isSalesAgentRole(role){
  const r=norm(role);
  const supervisorWords=['經理','襄理','主任'];
  return !supervisorWords.some(word=>r.includes(word))&&(r.includes('業代')||r.includes('業務員')||r.includes('業務代表'));
}
function isSupervisorRole(role){
  // 主管可能是經理、襄理、主任、新科主任、業務主任等。
  const r=norm(role);
  return ['經理','襄理','主任'].some(word=>r.includes(word));
}
function findDirectSupervisor(user){
  if(!user||!isSalesAgentRole(user.role))return null;
  const group=norm(user.group),team=norm(user.team),unit=norm(user.unit);
  const supervisors=state.users.filter(x=>x.active!==false&&String(x.id)!==String(user.id)&&isSupervisorRole(x.role));
  if(!supervisors.length)return null;

  const namedMatch=(items,label)=>items.find(x=>{
    const name=norm(x.name),supervisorGroup=norm(x.group),supervisorUnit=norm(x.unit);
    return (name&&label.includes(name))||
      (supervisorGroup&&(label.includes(supervisorGroup)||supervisorGroup.includes(label)))||
      (supervisorUnit&&(label.includes(supervisorUnit)||supervisorUnit.includes(label)));
  });

  // 1. 「某某組的業代」先歸給同組主管。
  if(group){
    const exactGroup=supervisors.filter(x=>norm(x.group)===group);
    if(exactGroup.length===1)return exactGroup[0];
    const groupNamed=namedMatch(exactGroup.length?exactGroup:supervisors,group);
    if(groupNamed)return groupNamed;
  }

  // 2. 「某某區的業代」歸給同區主管；同區多人時再用姓名／組別判斷。
  if(unit){
    const exactUnit=supervisors.filter(x=>norm(x.unit)===unit);
    if(exactUnit.length===1)return exactUnit[0];
    const unitNamed=namedMatch(exactUnit.length?exactUnit:supervisors,unit);
    if(unitNamed)return unitNamed;
  }

  // 3. 最後僅在同隊伍只剩唯一主管時才自動歸屬，避免重複或錯加。
  const sameTeam=supervisors.filter(x=>!team||norm(x.team)===team);
  return sameTeam.length===1?sameTeam[0]:null;
}
function salesInCompetitionRange(c){
  return state.sales.filter(s=>(!c?.start||s.date>=c.start)&&(!c?.end||s.date<=c.end));
}
function emptyPersonStat(user){return {id:user?.id||'',name:user?.name||'未分類',role:user?.role||'',unit:user?.unit||'',team:user?.team||'',group:user?.group||'',twdPremium:0,originalWeighted:0,contestWeighted:0,ahWeighted:0,count:0};}
function addSaleToStat(stat,sale,includeCount=true){
  stat.twdPremium+=Number(sale.twdPremium)||0;
  stat.originalWeighted+=Number(sale.originalWeighted)||0;
  stat.contestWeighted+=Number(sale.contestWeighted)||0;
  stat.ahWeighted+=Number(sale.ahWeighted)||0;
  if(includeCount)stat.count+=1;
}
function buildPersonCompetitionStats(sales){
  const map=new Map();
  state.users.filter(u=>u.active!==false).forEach(u=>map.set(String(u.id),emptyPersonStat(u)));
  (sales||[]).forEach(sale=>{
    const owner=findSaleUser(sale.userId)||findSaleUser(sale.userName);
    if(!owner)return;
    const ownerKey=String(owner.id);
    if(!map.has(ownerKey))map.set(ownerKey,emptyPersonStat(owner));
    addSaleToStat(map.get(ownerKey),sale,true);
    const supervisor=findDirectSupervisor(owner);
    if(supervisor){
      const supervisorKey=String(supervisor.id);
      if(!map.has(supervisorKey))map.set(supervisorKey,emptyPersonStat(supervisor));
      addSaleToStat(map.get(supervisorKey),sale,false);
    }
  });
  return [...map.values()];
}
function personCompetitionStat(c,user){
  if(!user)return emptyPersonStat(null);
  // 個人競賽進度與排行榜共用『全部正式報件』統計，避免匯入舊業績因日期被排除。
  return buildPersonCompetitionStats(state.sales).find(x=>String(x.id)===String(user.id))||emptyPersonStat(user);
}

function primaryCompetition(){
  const personal=state.competitions.filter(c=>c.active!==false&&c.scope!=='office');
  return personal.find(c=>norm(c.name)===norm(state.settings.banner))||personal[0]||{start:state.settings.competitionStart||'',end:state.settings.competitionEnd||''};
}
function rankingCompetition(){
  const c=primaryCompetition();
  return {start:c?.start||state.settings.competitionStart||'',end:c?.end||state.settings.competitionEnd||''};
}
function competitionMetricValue(metric,sales){
  return metric==='weighted'?sum(sales,'contestWeighted'):metric==='premium'?sum(sales,'twdPremium'):metric==='ah'?sum(sales,'ahWeighted'):0;
}
function competitionMetricFromStat(metric,stat){
  return metric==='weighted'?Number(stat.contestWeighted||0):metric==='premium'?Number(stat.twdPremium||0):metric==='ah'?Number(stat.ahWeighted||0):0;
}
function competitionTarget(c,role,metric){
  return Number(c.targets?.[role]?.[metric]??c.targets?.['全員']?.[metric]??0);
}
function competitionStatus(c,user){
  const sales=competitionSales(c,user); const stat=personCompetitionStat(c,user); const rows=[];
  ['weighted','premium','ah'].forEach(metric=>{if(!c.metrics?.[metric]?.enabled)return;const target=competitionTarget(c,user?.role,metric);const done=c.manualEnabled?Number(c.manualValues?.[metric]||0):competitionMetricFromStat(metric,stat);rows.push({metric,target,done,configured:target>0,rate:target?Math.min(done/target*100,100):0,met:target>0&&done>=target});});
  const extra=(c.extraConditions||[]).filter(x=>x.enabled!==false).map(x=>{const bonusLike={start:c.start,deadline:c.end,metric:x.metric||'count',target:Number(x.target||0),category:x.category||'',subcategory:x.subcategory||'',products:x.products||'',ahOnly:!!x.ahOnly,protectionOnly:!!x.protectionOnly,roles:x.roles||''};const result=bonusValue(bonusLike,sales,user);return {metric:x.label||bonusMetricLabel(x.metric),target:Number(x.target||0),done:result.value,rate:x.target?Math.min(result.value/Number(x.target)*100,100):0,met:Number(x.target)>0&&result.value>=Number(x.target),extra:true};});
  const all=[...rows,...extra]; const achieved=all.length?(c.logic==='OR'?all.some(x=>x.met):all.every(x=>x.met)):false;
  return {rows:all,achieved};
}
function metricName(m){return ({weighted:'加權保費',premium:'實收保費',ah:'A&H'})[m]||m}
function renderCompetitionProgress(me){
  const box=document.getElementById('competitionProgressCards'); if(!box)return;
  const comps=state.competitions.filter(c=>c.active!==false&&c.scope!=='office');
  box.innerHTML=comps.map(c=>{const st=competitionStatus(c,me);const details=st.rows.map(r=>{const configured=r.extra||r.configured!==false;const valueText=configured?`${fmt(r.done)} / ${fmt(r.target)}`:`${fmt(r.done)} / 尚未設定`;const statusText=!configured?'請到競賽管理填入此職級目標':(r.met?'✅ 已達成':`還差 ${fmt(Math.max(r.target-r.done,0))}｜${r.rate.toFixed(1)}%`);return `<div class="competition-metric"><div><b>${escapeHtml(r.extra?r.metric:metricName(r.metric))}</b><span>${valueText}</span></div><div class="progress small"><i style="width:${configured?r.rate:0}%"></i></div><small>${statusText}</small></div>`}).join('')||'<small>尚未啟用任何標準</small>';return `<div class="mini-card competition-card ${st.achieved?'achieved':''}"><div class="competition-title"><b>${escapeHtml(c.name)}</b><span>${st.achieved?'🎉 已達成':(c.logic==='OR'?'任一達成':'全部達成')}</span></div><small>${c.start||'不限'}～${c.end||'不限'}｜職級：${escapeHtml(me?.role||'未設定')}</small>${details}</div>`}).join('')||'<p class="empty">尚未建立競賽目標</p>';
}
function shortcutCatalog(){return {
  sales:{label:'新增報件',icon:'➕',page:'sales'},ranking:{label:'排行榜',icon:'🏆',page:'ranking'},history:{label:'歷史資料',icon:'📊',page:'history'},people:{label:'人員管理',icon:'👤',page:'admin',admin:'people'},products:{label:'商品管理',icon:'📦',page:'admin',admin:'products'},rates:{label:'匯率管理',icon:'💵',page:'admin',admin:'rates'},competitions:{label:'競賽與目標',icon:'🎯',page:'admin',admin:'competitions'},bonus:{label:'獎勵活動',icon:'🎁',page:'admin',admin:'bonus'},import:{label:'匯入資料',icon:'📥',page:'admin',admin:'import'},trash:{label:'回收桶',icon:'🗑️',page:'admin',admin:'trash'}
}}
function renderDashboardShortcuts(){const box=document.getElementById('dashboardShortcuts');if(!box)return;const cat=shortcutCatalog();const rows=(state.settings.shortcuts||[]).filter(x=>x.enabled!==false&&cat[x.key]);box.innerHTML=rows.map(x=>{const d=cat[x.key];return `<button type="button" class="dashboard-shortcut" data-shortcut="${x.key}"><span>${escapeHtml(x.icon||d.icon)}</span><b>${escapeHtml(x.label||d.label)}</b></button>`}).join('')||'<p class="empty">尚未設定快捷功能</p>';box.querySelectorAll('[data-shortcut]').forEach(b=>b.onclick=()=>{const d=cat[b.dataset.shortcut];if(d.admin){currentAdmin=d.admin;showPage('admin');document.querySelectorAll('.admin-tab').forEach(x=>x.classList.toggle('active',x.dataset.admin===currentAdmin));renderAdmin();}else showPage(d.page);});}
function renderBonus(mySales,me=selectedCompetitionPerson()){
  bonusCards.innerHTML=state.bonus.filter(b=>b.active!==false).slice(0,6).map(b=>{
    const result=bonusValue(b,mySales,me); if(!result.eligible)return '';
    const metric=normalizeBonusMetric(b.metric); const val=result.value, unit=metric==='count'?'件':''; const rate=Number(b.target)?Math.min(val/Number(b.target)*100,100):0;
    const filters=[b.category,b.ahOnly?'A&H':'',b.protectionOnly?'保障型':'',b.products||b.product].filter(Boolean).join('｜')||'全部業績';
    return `<div class="bonus-item"><b>${escapeHtml(b.name)}</b><div class="bonus-line"><span>${b.start||'不限'}～${b.deadline||'不限'}</span><span>獎金 $${fmt(b.amount)}</span></div><div class="bonus-line"><span>${bonusMetricLabel(b.metric)}｜${escapeHtml(filters)}</span><span>${fmt(val)}${unit} / ${fmt(b.target)}${unit}</span></div><div class="progress small"><i style="width:${rate}%"></i></div><div class="bonus-line"><span>達成率 ${rate.toFixed(1)}%</span><span class="danger">還差 ${fmt(Math.max(Number(b.target)-val,0))}${unit}</span></div></div>`
  }).join('')||'<p class="empty">尚未設定適用的獎勵活動</p>';
}
function renderTop5(){const rows=getRanking(rankMode).slice(0,5);top5Rows.innerHTML=rows.map((r,i)=>`<tr><td>${i<3?'👑 ':''}${i+1}</td><td>${r.name}</td><td class="num">${fmt(r.contestWeighted)}</td></tr>`).join('')||'<tr><td colspan="3" class="empty">尚無資料</td></tr>';}
function renderLatest(){latestRows.innerHTML=salesOn(today()).slice(0,5).map(s=>`<tr><td>${new Date(s.createdAt).toLocaleTimeString('zh-TW',{hour:'2-digit',minute:'2-digit'})}</td><td>${s.userName}</td><td>${s.productName}</td><td class="num">${fmt(s.contestWeighted)}</td></tr>`).join('')||'<tr><td colspan="4" class="empty">今日尚無報件</td></tr>';}
function aggregate(arr,key){const map=new Map();arr.forEach(s=>{const name=s[key]||'未分類';const r=map.get(name)||{name,twdPremium:0,originalWeighted:0,contestWeighted:0,ahWeighted:0,count:0};r.twdPremium+=s.twdPremium;r.originalWeighted+=s.originalWeighted;r.contestWeighted+=s.contestWeighted;r.ahWeighted+=s.ahWeighted;r.count++;map.set(name,r)});return [...map.values()];}
function getRanking(type='person'){
  // 排行榜維持原本全部正式報件口徑；不可因競賽起日而讓既有第一名消失。
  const sales=state.sales;
  if(type==='person')return buildPersonCompetitionStats(sales).filter(r=>r.twdPremium||r.originalWeighted||r.contestWeighted||r.ahWeighted||r.count).sort((a,b)=>b.contestWeighted-a.contestWeighted||b.twdPremium-a.twdPremium||a.name.localeCompare(b.name,'zh-Hant'));
  const key={unit:'unit',team:'team',group:'group',role:'role',product:'productName'}[type]||'userName';
  return aggregate(sales,key).sort((a,b)=>b.contestWeighted-a.contestWeighted);
}
function getDailyFiltered(){return state.sales.filter(s=>(!filterDate.value||s.date===filterDate.value)&&(!filterUnit.value||s.unit===filterUnit.value)&&(!filterTeam.value||s.team===filterTeam.value)&&(!filterRole.value||s.role===filterRole.value));}
function getDailyAggRows(){return aggregate(getDailyFiltered(),'userName').sort((a,b)=>b.contestWeighted-a.contestWeighted)}
function renderDaily(){const rows=getDailyAggRows();dailyRows.innerHTML=rows.map(r=>`<tr><td>${escapeHtml(r.name)}</td><td class="num">${fmt(r.contestWeighted)}</td><td class="num">${fmt(r.twdPremium)}</td><td class="num">${fmt(r.ahWeighted)}</td><td class="num">${fmt(r.originalWeighted)}</td><td class="row-actions"><button class="edit" onclick="showPersonDetail('${escapeJs(r.name)}')">明細</button><button class="edit" onclick="chooseSaleAction('${escapeJs(r.name)}','edit')">修改</button><button class="delete" onclick="chooseSaleAction('${escapeJs(r.name)}','delete')">刪除</button></td></tr>`).join('')||'<tr><td colspan="6" class="empty">此條件尚無資料</td></tr>';sumWeighted.textContent=fmt(sum(rows,'contestWeighted'));sumPremium.textContent=fmt(sum(rows,'twdPremium'));sumAH.textContent=fmt(sum(rows,'ahWeighted'));sumOriginal.textContent=fmt(sum(rows,'originalWeighted'));}
function renderRanking(){const rows=getRanking(rankingType.value);rankingRows.innerHTML=rows.map((r,i)=>`<tr><td>${i+1}</td><td>${r.name}</td><td class="num">${fmt(r.twdPremium)}</td><td class="num">${fmt(r.originalWeighted)}</td><td class="num">${fmt(r.ahWeighted)}</td><td class="num"><b>${fmt(r.contestWeighted)}</b></td></tr>`).join('')||'<tr><td colspan="6" class="empty">尚無資料</td></tr>';}
function filteredPersonSales(name){return getDailyFiltered().filter(s=>s.userName===name).sort((a,b)=>String(b.createdAt||b.date).localeCompare(String(a.createdAt||a.date)));}
function ensureSaleDialog(){let d=document.getElementById('saleDetailDialog');if(d)return d;d=document.createElement('dialog');d.id='saleDetailDialog';d.className='sale-detail-dialog';d.innerHTML='<div class="dialog-head"><h3>報件明細</h3><button type="button" data-close-dialog>✕</button></div><div id="saleDetailBody"></div>';document.body.appendChild(d);d.querySelector('[data-close-dialog]').onclick=()=>d.close();d.addEventListener('click',e=>{if(e.target===d)d.close();});return d;}
function showPersonDetail(name){const rows=filteredPersonSales(name);const d=ensureSaleDialog();d.querySelector('h3').textContent=`${name}｜報件明細`;const body=d.querySelector('#saleDetailBody');body.innerHTML=rows.map(s=>`<div class="sale-detail-item"><div><b>${escapeHtml(s.date)}｜${escapeHtml(s.productName)}</b><small>原始保費 ${fmt(s.premium)}｜實收 ${fmt(s.twdPremium)}｜加權 ${fmt(s.contestWeighted)}｜A&H ${fmt(s.ahWeighted)}</small></div><div><button class="edit" onclick="editSale('${s.id}')">修改</button><button class="delete" onclick="deleteSale('${s.id}')">刪除</button></div></div>`).join('')||'<p class="empty">尚無明細</p>';d.showModal();}
function chooseSaleAction(name,action){const rows=filteredPersonSales(name);if(!rows.length)return toast('找不到可操作的報件');if(rows.length===1)return action==='edit'?editSale(rows[0].id):deleteSale(rows[0].id);showPersonDetail(name);toast('此人有多筆報件，請在明細中選擇要操作的那一筆');}
function editSale(id){const old=state.sales.find(s=>String(s.id)===String(id));if(!old)return;const date=prompt('修改報件日期（YYYY-MM-DD）',old.date);if(date===null)return;const user=prompt('修改人員（請填完整姓名）',old.userName);if(user===null)return;const product=prompt('修改商品（請填商品名稱或代碼）',old.productName);if(product===null)return;const premium=prompt('修改原始保費',old.premium);if(premium===null)return;try{const updated=createSale(date,user,product,premium);Object.assign(old,updated,{id:old.id,createdAt:old.createdAt||updated.createdAt,updatedAt:new Date().toISOString()});log('修改報件',`${old.userName} ${old.productName} ${fmt(old.twdPremium)}`);save();renderAll();ensureSaleDialog().close();toast('報件已修改並重新計算');}catch(err){alert(err?.message||'修改失敗');}}
function deleteSale(id){const sale=state.sales.find(s=>String(s.id)===String(id));if(!sale)return;if(!confirm(`確定刪除這筆報件？\n${sale.date}｜${sale.userName}｜${sale.productName}｜原始保費 ${fmt(sale.premium)}\n刪除後會移到回收桶，可再還原。`))return;moveToTrash('sales',id);ensureSaleDialog().close();renderAll();toast('報件已移到回收桶');}
function escapeJs(v){return String(v??'').replace(/\\/g,'\\\\').replace(/'/g,"\\'").replace(/\n/g,' ');}

function renderAdmin(){document.querySelectorAll('.admin-tab').forEach(t=>t.classList.toggle('active',t.dataset.admin===currentAdmin));const p=adminPanel;if(currentAdmin==='import'){p.innerHTML=document.getElementById('importTemplate').innerHTML;bindImport();return}
  if(currentAdmin==='dashboardSettings'){renderDashboardSettings(p);return}
  if(currentAdmin==='competitions'){renderCompetitionAdmin(p);return}
  if(currentAdmin==='trash'){renderTrashAdmin(p);return}
  const config={people:{title:'👤 人員管理',cols:['姓名','區單位','隊伍','組別','職級'],fields:['name','unit','team','group','role'],data:'users'},products:{title:'📦 商品管理',cols:['商品','代碼','年期','幣別','大類','次類','保障型','主/附約','原始加權','競賽加權','A&H'],fields:['name','code','year','currency','category','subcategory','protection','mainRider','originalWeight','contestWeight','ah'],data:'products'},rates:{title:'💵 匯率管理',cols:['年度','月份','美金匯率'],fields:['year','month','usd'],data:'rates'},bonus:{title:'🎁 獎勵活動',cols:['名稱','開始','結束','累計欄位','目標','獎金','商品大類','指定商品','A&H','保障型','適用職級','顯示'],fields:['name','start','deadline','metric','target','amount','category','products','ahOnly','protectionOnly','roles','active'],data:'bonus'}}[currentAdmin];
  const data=state[config.data]||[];
  const peopleToolbar=currentAdmin==='people'?`<div class="admin-tools"><input id="peopleSearch" placeholder="搜尋姓名／區單位／隊伍／組別／職級"><button type="button" id="quickPeopleImport">匯入人員 Excel</button><button type="button" id="clearPeopleSearch" class="edit">清除</button></div><div class="summary-row"><span>人員 ${state.users.length} 位</span><span>區單位 ${new Set(state.users.map(x=>x.unit).filter(Boolean)).size} 個</span><span>隊伍 ${new Set(state.users.map(x=>x.team).filter(Boolean)).size} 個</span><span>組別 ${new Set(state.users.map(x=>x.group).filter(Boolean)).size} 個</span></div>`:'';
  const productToolbar=currentAdmin==='products'?`<div class="admin-tools"><input id="productSearch" placeholder="搜尋商品名稱／代碼／年期／幣別"><select id="productCurrencyFilter"><option value="">全部幣別</option><option value="TWD">台幣 TWD</option><option value="USD">美金 USD</option></select><button type="button" id="quickProductImport">匯入商品 Excel</button><button type="button" id="clearProductSearch" class="edit">清除</button></div><div class="summary-row"><span>商品 ${state.products.length} 項</span><span>台幣 ${state.products.filter(x=>x.currency==='TWD').length} 項</span><span>美金 ${state.products.filter(x=>x.currency==='USD').length} 項</span><span>A&H ${state.products.filter(x=>x.ah).length} 項</span></div>`:'';
  p.innerHTML=`<div class="section-head"><h2>${config.title}</h2><div><button onclick="exportRows('${config.title}',state['${config.data}'])">匯出 Excel</button></div></div>${peopleToolbar}${productToolbar}<form class="admin-form" id="adminForm">${config.fields.map(f=>inputFor(f)).join('')}<button id="adminSubmitBtn">新增</button><button type="button" id="adminCancelEdit" class="edit" style="display:none">取消編輯</button></form><table><thead><tr>${config.cols.map(c=>`<th>${c}</th>`).join('')}<th>操作</th></tr></thead><tbody id="adminRows">${renderAdminRows(data,config)}</tbody></table>`;
  if(currentAdmin==='people'){bindPeopleTools(config)}
  if(currentAdmin==='products'){bindProductTools(config)}
  adminForm.dataset.editId='';
  adminCancelEdit.onclick=()=>{adminForm.reset();adminForm.dataset.editId='';adminSubmitBtn.textContent='新增';adminCancelEdit.style.display='none'};
  adminForm.onsubmit=e=>{e.preventDefault();const fd=new FormData(adminForm);const obj={id:adminForm.dataset.editId||uid(),active:true};config.fields.forEach(f=>{let v=fd.get(f); if(['originalWeight','contestWeight'].includes(f)) v=parseWeight(v); else if(['year','month','usd','weightedTarget','premiumTarget','target','amount'].includes(f)) v=Number(v); else if(f==='currency') v=String(v||'TWD').toUpperCase(); else if(typeof v==='string') v=norm(v); if(['ah','protection','ahOnly','protectionOnly','active'].includes(f)) v=v==='true'; obj[f]=v;});
    if(adminForm.dataset.editId){const old=state[config.data].find(x=>x.id===adminForm.dataset.editId);Object.assign(old,obj,{id:old.id});log('修改主檔',`${config.title} ${obj.name||`${obj.year}/${obj.month}`||''}`);}
    else{let existing=null;if(config.data==='rates')existing=state.rates.find(x=>x.year===obj.year&&x.month===obj.month); if(config.data==='products')existing=state.products.find(x=>(x.code&&obj.code&&x.code===obj.code)||(!obj.code&&x.name===obj.name&&String(x.year)===String(obj.year))); if(existing){Object.assign(existing,obj,{id:existing.id});log('修改匯率',`${obj.year}/${obj.month} 美金匯率 ${obj.usd}`);}else{state[config.data].push(obj);log('新增主檔',`${config.title} ${obj.name||obj.year||''}`);}}
    save();fillSelects();fillCompetitionPersonSelector();fillBonusPersonSelector();renderAdmin();renderAll();};
}

function renderAdminRows(rows,config){return rows.map(row=>`<tr>${config.fields.map(f=>`<td>${displayField(row[f],f)}</td>`).join('')}<td><button class="edit" onclick="editRow('${config.data}','${row.id}')">修改</button> <button class="delete" onclick="deleteRow('${config.data}','${row.id}')">刪除</button></td></tr>`).join('')||`<tr><td colspan="${config.cols.length+1}" class="empty">尚無資料</td></tr>`;}
function bindPeopleTools(config){
  const q=document.getElementById('peopleSearch');
  const rows=document.getElementById('adminRows');
  const apply=()=>{const text=norm(q.value).toLowerCase();const filtered=state.users.filter(u=>[u.name,u.unit,u.team,u.group,u.role].some(v=>norm(v).toLowerCase().includes(text)));rows.innerHTML=renderAdminRows(filtered,config)};
  q.oninput=apply;
  document.getElementById('clearPeopleSearch').onclick=()=>{q.value='';apply()};
  document.getElementById('quickPeopleImport').onclick=()=>{currentAdmin='import';renderAdmin();setTimeout(()=>{importType.value='people';},0)};
}


function bindProductTools(config){
  const q=document.getElementById('productSearch');
  const currency=document.getElementById('productCurrencyFilter');
  const rows=document.getElementById('adminRows');
  const apply=()=>{
    const text=norm(q.value).toLowerCase();
    const c=currency.value;
    const filtered=state.products.filter(p=>{
      const hit=[p.name,p.code,p.year,p.currency,p.category,weightText(p.originalWeight),weightText(p.contestWeight)].some(v=>norm(v).toLowerCase().includes(text));
      const cur=!c || p.currency===c;
      return hit && cur;
    });
    rows.innerHTML=renderAdminRows(filtered,config);
  };
  q.oninput=apply;
  currency.onchange=apply;
  document.getElementById('clearProductSearch').onclick=()=>{q.value='';currency.value='';apply()};
  document.getElementById('quickProductImport').onclick=()=>{currentAdmin='import';renderAdmin();setTimeout(()=>{importType.value='products';},0)};
}


function applyDashboardWidgets(){
  const w=state.settings.dashboardWidgets||{};
  const map={todayWeighted:todayWeighted.closest('.kpi'),todayPremium:todayPremium.closest('.kpi'),dailyStar:dailyStar.closest('.kpi'),todayCount:todayCount.closest('.kpi'),officeProgress:officeTarget.closest('.card'),competitionProgress:document.getElementById('competitionProgressCards')?.closest('.card'),bonus:bonusCards.closest('.card'),top5:top5Rows.closest('.card'),latest:latestRows.closest('.card')};
  Object.entries(map).forEach(([key,el])=>{if(el)el.style.display=w[key]===false?'none':''});
}
function renderCustomDashboardCards(){
  const box=document.getElementById('customDashboardCards'); if(!box)return;
  box.innerHTML=(state.settings.customCards||[]).map(c=>`<article class="card custom-dashboard-card"><h2>${escapeHtml(c.title||'自訂資訊')}</h2><strong>${escapeHtml(c.value||'')}</strong><small>${escapeHtml(c.note||'')}</small></article>`).join('');
  box.style.display=box.children.length?'grid':'none';
}
function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
function renderCompetitionAdmin(p){
  const roles=canonicalRoles();
  p.innerHTML=`<div class="section-head"><h2>🏆 競賽與目標管理</h2><button id="newCompetition">＋新增競賽</button></div><div class="notice">固定標準：加權保費、實收保費、A&H。新高峰與新極峰都保留實收保費；請在各職級列填入目標。可設定全部達成（AND）或任一達成（OR）。</div><div id="competitionEditor"></div><hr><div id="competitionList" class="stack"></div>`;
  const editor=p.querySelector('#competitionEditor'),list=p.querySelector('#competitionList');
  const renderList=()=>{list.innerHTML=state.competitions.map(c=>`<div class="bonus-item"><div class="bonus-line"><b>${escapeHtml(c.name)}</b><span>${c.scope==='office'?'通訊處':'個人'}｜${c.active!==false?'啟用':'停用'}｜${c.logic}</span></div><div class="bonus-line"><span>${c.start||'不限'}～${c.end||'不限'}</span><span>${Object.keys(c.targets||{}).length} 個職級</span></div><div><button class="edit" data-edit-comp="${c.id}">修改</button> <button class="delete" data-del-comp="${c.id}">刪除</button></div></div>`).join('')||'<p class="empty">尚無競賽</p>';list.querySelectorAll('[data-edit-comp]').forEach(b=>b.onclick=()=>openEditor(state.competitions.find(c=>c.id===b.dataset.editComp)));list.querySelectorAll('[data-del-comp]').forEach(b=>b.onclick=()=>{if(confirm('確定刪除競賽？')){moveToTrash('competitions',b.dataset.delComp);renderDashboard();renderList();}})};
  const openEditor=(source)=>{const c=normalizeCompetition(source?JSON.parse(JSON.stringify(source)):{id:uid(),name:'',scope:'personal',start:'',end:'',logic:'AND',active:true,reward:'',manualEnabled:false,manualValues:{weighted:0,premium:0,ah:0},metrics:{weighted:{enabled:true},premium:{enabled:true},ah:{enabled:false}},targets:{},extraConditions:[]});const targetRows=c.scope==='office'?['通訊處']:roles;targetRows.forEach(r=>{c.targets[r]=c.targets[r]||{weighted:0,premium:0,ah:0}});editor.innerHTML=`<form id="competitionForm"><div class="admin-form"><input name="name" placeholder="競賽／目標名稱" value="${escapeHtml(c.name)}" required><select name="scope"><option value="personal" ${c.scope!=='office'?'selected':''}>個人競賽</option><option value="office" ${c.scope==='office'?'selected':''}>通訊處進度</option></select><input name="start" type="date" value="${c.start}"><input name="end" type="date" value="${c.end}"><select name="logic"><option value="AND" ${c.logic==='AND'?'selected':''}>全部達成 AND</option><option value="OR" ${c.logic==='OR'?'selected':''}>任一達成 OR</option></select><input name="reward" placeholder="獎勵內容" value="${escapeHtml(c.reward)}"><label class="check-label"><input name="active" type="checkbox" ${c.active?'checked':''}> 啟用</label></div><h3>核心標準</h3><div class="core-metrics"><label><input type="checkbox" name="enable_weighted" ${c.metrics.weighted.enabled?'checked':''}> 加權保費</label><label><input type="checkbox" name="enable_premium" ${c.metrics.premium.enabled?'checked':''}> 實收保費</label><label><input type="checkbox" name="enable_ah" ${c.metrics.ah.enabled?'checked':''}> A&H</label></div><label class="check-label"><input type="checkbox" name="manualEnabled" ${c.manualEnabled?'checked':''}> 使用手動完成業績（特殊調整）</label><div class="admin-form"><label>手動加權<input type="number" name="manual_weighted" value="${Number(c.manualValues?.weighted||0)}"></label><label>手動實收<input type="number" name="manual_premium" value="${Number(c.manualValues?.premium||0)}"></label><label>手動 A&H<input type="number" name="manual_ah" value="${Number(c.manualValues?.ah||0)}"></label></div><div class="table-scroll"><table><thead><tr><th>${c.scope==='office'?'範圍':'職級'}</th><th>加權目標</th><th>實收目標</th><th>A&H目標</th></tr></thead><tbody>${targetRows.map(r=>`<tr><td>${escapeHtml(r)}</td><td><input type="number" step="1" data-role="${escapeHtml(r)}" data-metric="weighted" value="${Number(c.targets[r]?.weighted||0)}"></td><td><input type="number" step="1" data-role="${escapeHtml(r)}" data-metric="premium" value="${Number(c.targets[r]?.premium||0)}"></td><td><input type="number" step="1" data-role="${escapeHtml(r)}" data-metric="ah" value="${Number(c.targets[r]?.ah||0)}"></td></tr>`).join('')}</tbody></table></div><h3>其他條件（選填）</h3><div id="extraConditions"></div><button type="button" id="addExtra" class="edit">＋新增其他條件</button><div class="form-actions"><button type="submit">儲存競賽</button><button type="button" id="cancelCompetition" class="edit">取消</button></div></form>`;
    editor.querySelector('[name="scope"]').onchange=e=>{c.scope=e.target.value==='office'?'office':'personal';openEditor(c);};
    const extraBox=editor.querySelector('#extraConditions');const drawExtra=()=>{extraBox.innerHTML=(c.extraConditions||[]).map((x,i)=>`<div class="extra-condition"><input data-extra="label" data-index="${i}" placeholder="條件名稱" value="${escapeHtml(x.label||'')}"><select data-extra="metric" data-index="${i}"><option value="count" ${x.metric==='count'?'selected':''}>件數</option><option value="weighted" ${x.metric==='weighted'?'selected':''}>競賽加權</option><option value="premium" ${x.metric==='premium'?'selected':''}>實收</option><option value="ah" ${x.metric==='ah'?'selected':''}>A&H</option></select><input data-extra="target" data-index="${i}" type="number" placeholder="目標" value="${Number(x.target||0)}"><input data-extra="category" data-index="${i}" placeholder="商品大類" value="${escapeHtml(x.category||'')}"><input data-extra="products" data-index="${i}" placeholder="指定商品" value="${escapeHtml(x.products||'')}"><button type="button" class="delete" data-remove-extra="${i}">刪除</button></div>`).join('');extraBox.querySelectorAll('[data-remove-extra]').forEach(b=>b.onclick=()=>{c.extraConditions.splice(Number(b.dataset.removeExtra),1);drawExtra()});};drawExtra();editor.querySelector('#addExtra').onclick=()=>{c.extraConditions.push({label:'',metric:'count',target:0,category:'',products:'',enabled:true});drawExtra()};editor.querySelector('#cancelCompetition').onclick=()=>{editor.innerHTML=''};editor.querySelector('#competitionForm').onsubmit=e=>{e.preventDefault();const fd=new FormData(e.target);c.name=norm(fd.get('name'));c.scope=fd.get('scope')==='office'?'office':'personal';c.start=fd.get('start');c.end=fd.get('end');c.logic=fd.get('logic');c.reward=norm(fd.get('reward'));c.active=fd.get('active')==='on';c.manualEnabled=fd.get('manualEnabled')==='on';c.manualValues={weighted:Number(fd.get('manual_weighted'))||0,premium:Number(fd.get('manual_premium'))||0,ah:Number(fd.get('manual_ah'))||0};c.metrics.weighted.enabled=fd.get('enable_weighted')==='on';c.metrics.premium.enabled=fd.get('enable_premium')==='on';c.metrics.ah.enabled=fd.get('enable_ah')==='on';editor.querySelectorAll('[data-role][data-metric]').forEach(inp=>{const role=inp.dataset.role,metric=inp.dataset.metric;c.targets[role]=c.targets[role]||{};c.targets[role][metric]=Number(inp.value)||0});editor.querySelectorAll('[data-extra]').forEach(inp=>{const i=Number(inp.dataset.index);c.extraConditions[i][inp.dataset.extra]=inp.dataset.extra==='target'?Number(inp.value)||0:inp.value});const idx=state.competitions.findIndex(x=>x.id===c.id);if(idx>=0)state.competitions[idx]=c;else state.competitions.push(c);state.settings.banner=c.name||state.settings.banner;state.settings.period=`${c.start||'不限'} - ${c.end||'不限'}`;save();renderDashboard();renderList();editor.innerHTML='';toast('競賽設定已更新，首頁已同步');};};p.querySelector('#newCompetition').onclick=()=>openEditor();renderList();
}
function renderDashboardSettings(p){
  state.settings.dashboardWidgets=state.settings.dashboardWidgets||{}; state.settings.customCards=state.settings.customCards||[];
  const w=state.settings.dashboardWidgets;
  const labels={todayWeighted:'今日加權',todayPremium:'今日實收',dailyStar:'每日之星',todayCount:'今日件數',officeProgress:'通訊處進度',competitionProgress:'我的競賽進度',bonus:'我的獎勵活動',top5:'排行榜 Top 5',latest:'今日戰況'};
  const cat=shortcutCatalog(); const current=state.settings.shortcuts||[]; const map=new Map(current.map(x=>[x.key,x]));
  const shortcutRows=Object.entries(cat).map(([key,d])=>{const x=map.get(key)||{key,label:d.label,icon:d.icon,enabled:false};return `<tr><td><input type="checkbox" data-sc-enabled="${key}" ${x.enabled!==false?'checked':''}></td><td><input data-sc-icon="${key}" value="${escapeHtml(x.icon||d.icon)}" maxlength="4"></td><td><input data-sc-label="${key}" value="${escapeHtml(x.label||d.label)}"></td><td><button type="button" class="edit" data-sc-up="${key}">↑</button> <button type="button" class="edit" data-sc-down="${key}">↓</button></td></tr>`}).join('');
  p.innerHTML=`<div class="section-head"><h2>🏠 首頁設定</h2></div>
  <h3>⚡ 首頁快捷鍵管理</h3><div class="notice">預設保留「新增報件」與「排行榜」。可自行勾選、改名稱、改圖示及調整順序。</div><table><thead><tr><th>顯示</th><th>圖示</th><th>名稱</th><th>順序</th></tr></thead><tbody>${shortcutRows}</tbody></table><button type="button" id="saveShortcuts">儲存快捷鍵</button>
  <div class="notice">首頁所有整區與統計卡的顯示、隱藏和排序，請使用下方「首頁所有區塊排序」。競賽目標請到「🏆 競賽與目標管理」。</div>
  <hr><h3>增加自訂方塊</h3><form id="customCardForm" class="admin-form"><input name="title" placeholder="方塊標題" required><input name="value" placeholder="主要內容／數字" required><input name="note" placeholder="補充說明"><button>新增方塊</button></form>
  <table><thead><tr><th>標題</th><th>內容</th><th>說明</th><th>操作</th></tr></thead><tbody>${state.settings.customCards.map(c=>`<tr><td>${escapeHtml(c.title)}</td><td>${escapeHtml(c.value)}</td><td>${escapeHtml(c.note)}</td><td><button class="delete" data-delete-card="${c.id}">刪除</button></td></tr>`).join('')||'<tr><td colspan="4" class="empty">尚未增加自訂方塊</td></tr>'}</tbody></table>`;
  const readShortcuts=()=>Object.keys(cat).map(key=>({key,enabled:p.querySelector(`[data-sc-enabled="${key}"]`).checked,icon:norm(p.querySelector(`[data-sc-icon="${key}"]`).value)||cat[key].icon,label:norm(p.querySelector(`[data-sc-label="${key}"]`).value)||cat[key].label}));
  p.querySelector('#saveShortcuts').onclick=()=>{const formRows=readShortcuts(), oldOrder=(state.settings.shortcuts||[]).map(x=>x.key);formRows.sort((a,b)=>{let ai=oldOrder.indexOf(a.key),bi=oldOrder.indexOf(b.key);return (ai<0?999:ai)-(bi<0?999:bi)});state.settings.shortcuts=formRows;save();renderDashboard();toast('首頁快捷鍵已更新');};
  const move=(key,dir)=>{let rows=readShortcuts(),i=rows.findIndex(x=>x.key===key),j=i+dir;if(j<0||j>=rows.length)return;[rows[i],rows[j]]=[rows[j],rows[i]];state.settings.shortcuts=rows;save();renderDashboardSettings(p);};
  p.querySelectorAll('[data-sc-up]').forEach(b=>b.onclick=()=>move(b.dataset.scUp,-1));p.querySelectorAll('[data-sc-down]').forEach(b=>b.onclick=()=>move(b.dataset.scDown,1));
  p.querySelector('#customCardForm').onsubmit=e=>{e.preventDefault();const fd=new FormData(e.target);state.settings.customCards.push({id:uid(),title:norm(fd.get('title')),value:norm(fd.get('value')),note:norm(fd.get('note'))});save();renderDashboard();renderDashboardSettings(p);toast('已新增首頁方塊');};
  p.querySelectorAll('[data-delete-card]').forEach(b=>b.onclick=()=>{state.settings.customCards=state.settings.customCards.filter(c=>c.id!==b.dataset.deleteCard);save();renderDashboard();renderDashboardSettings(p);});
}

function inputFor(f){const label={name:'名稱/姓名',unit:'區單位',team:'隊伍',group:'組別',role:'職級',code:'商品代碼',year:'年期/年度',currency:'幣別',originalWeight:'原始加權',contestWeight:'競賽加權',ah:'A&H',month:'月份',usd:'美金匯率',start:'開始日期',end:'結束日期',weightedTarget:'加權目標',premiumTarget:'實收目標',reward:'獎勵',deadline:'截止日期',metric:'累計欄位',target:'目標',amount:'獎金',product:'指定商品',products:'指定商品（可多個，逗號分隔）',category:'商品大類',subcategory:'商品次類',protection:'保障型',mainRider:'主約／附約',ahOnly:'只抓 A&H',protectionOnly:'只抓保障型',roles:'適用職級（可多個）',units:'適用區單位',teams:'適用隊伍',groups:'適用組別',active:'首頁顯示'}[f]||f; if(f==='currency')return `<select name="${f}"><option>TWD</option><option>USD</option></select>`; if(['ah','protection','ahOnly','protectionOnly'].includes(f))return `<select name="${f}"><option value="false">否</option><option value="true">是</option></select>`; if(f==='active')return `<select name="${f}"><option value="true">顯示</option><option value="false">隱藏</option></select>`; if(f==='metric')return `<select name="${f}"><option value="premium">實收</option><option value="weighted">加權計績</option><option value="original">原始加權</option><option value="ah">A&H</option><option value="count">件數</option></select>`; if(f==='mainRider')return `<select name="${f}"><option>主約</option><option>附約</option></select>`; if(['start','end','deadline'].includes(f))return `<input name="${f}" type="date" placeholder="${label}">`; if(['originalWeight','contestWeight'].includes(f))return `<input name="${f}" placeholder="${label}，可輸入 300% / 3 / 0.05">`; if(['year','month','usd','weightedTarget','premiumTarget','target','amount'].includes(f))return `<input name="${f}" type="number" step="0.00001" placeholder="${label}">`; return `<input name="${f}" placeholder="${label}">`;}
function displayField(v,f){if(f==='metric')return bonusMetricLabel(v);if(f==='active')return v===false||v==='false'?'隱藏':'顯示';if(['originalWeight','contestWeight'].includes(f))return weightText(v);if(typeof v==='boolean')return v?'是':'否';if(['ahOnly','protectionOnly','protection'].includes(f))return v===true||v==='true'?'是':'否';if(f==='usd')return Number(v||0).toLocaleString('zh-TW',{minimumFractionDigits:0,maximumFractionDigits:5,useGrouping:false});if(['weightedTarget','premiumTarget','target','amount'].includes(f))return fmt(v);return v??''}
function editRow(collection,id){const row=state[collection].find(x=>x.id===id);if(!row)return;const form=document.getElementById('adminForm');form.dataset.editId=id;[...form.elements].forEach(el=>{if(!el.name)return;if(row[el.name]!==undefined)el.value=String(row[el.name]);});adminSubmitBtn.textContent='儲存修改';adminCancelEdit.style.display='inline-block';window.scrollTo({top:0,behavior:'smooth'});}
function deleteRow(collection,id){
  if(!confirm('確定移到回收桶？之後可以還原。'))return;
  moveToTrash(collection,id);
  fillSelects();renderAdmin();renderAll();
}
function moveToTrash(collection,id){
  const rows=state[collection]||[];
  const index=rows.findIndex(x=>String(x.id)===String(id));
  if(index<0)return;
  const [record]=rows.splice(index,1);
  state.trash.unshift({id:uid(),sourceCollection:collection,sourceId:id,deletedAt:new Date().toISOString(),record:JSON.parse(JSON.stringify(record))});
  log('移到回收桶',`${collection}/${id}`);save();toast('已移到回收桶，可隨時還原');
}
function renderTrashAdmin(p){
  p.innerHTML=`<div class="section-head"><h2>🗑️ 回收桶／資料救援</h2><span class="muted">刪除資料會先保留在這裡</span></div>
  <div class="trash-list">${state.trash.map(item=>`<div class="bonus-item"><div><b>${trashLabel(item.sourceCollection)}</b><div class="muted">${escapeHtml(trashSummary(item))}</div><small>刪除時間：${new Date(item.deletedAt).toLocaleString('zh-TW')}</small></div><div><button class="edit" data-restore-trash="${item.id}">還原</button> <button class="delete" data-permanent-trash="${item.id}">永久刪除</button></div></div>`).join('')||'<p class="empty">回收桶目前沒有資料</p>'}</div>`;
  p.querySelectorAll('[data-restore-trash]').forEach(b=>b.onclick=()=>restoreTrash(b.dataset.restoreTrash));
  p.querySelectorAll('[data-permanent-trash]').forEach(b=>b.onclick=()=>permanentDeleteTrash(b.dataset.permanentTrash));
}
function trashLabel(collection){return ({users:'人員',products:'商品',rates:'匯率',competitions:'競賽',bonus:'獎勵活動',sales:'業績',history:'歷史資料'})[collection]||collection;}
function trashSummary(item){const r=item.record||{};return r.name||r.userName||r.productName||`${r.year||''}/${r.month||''}`||item.sourceId;}
function restoreTrash(trashId){
  const index=state.trash.findIndex(x=>x.id===trashId);if(index<0)return;
  const [item]=state.trash.splice(index,1);state[item.sourceCollection]=state[item.sourceCollection]||[];
  const restored={...item.record,id:item.sourceId||item.record.id||uid()};
  const existing=state[item.sourceCollection].findIndex(x=>String(x.id)===String(restored.id));
  if(existing>=0)state[item.sourceCollection][existing]=restored;else state[item.sourceCollection].push(restored);
  log('還原資料',`${item.sourceCollection}/${restored.id}`);save();fillSelects();renderAdmin();renderAll();toast('資料已還原');
}
function permanentDeleteTrash(trashId){if(!confirm('永久刪除後無法還原，確定嗎？'))return;state.trash=state.trash.filter(x=>x.id!==trashId);log('永久刪除',trashId);save();renderAdmin();toast('已永久刪除');}

window.deleteRow=deleteRow; window.editRow=editRow; window.showPersonDetail=showPersonDetail; window.chooseSaleAction=chooseSaleAction; window.editSale=editSale; window.deleteSale=deleteSale; window.restoreTrash=restoreTrash;

function bindImport(){
  const downloadBtn=document.getElementById('downloadTemplate');
  const fileInput=document.getElementById('importFile');
  const confirmBtn=document.getElementById('confirmImport');
  const typeSelect=document.getElementById('importType');
  if(downloadBtn)downloadBtn.onclick=()=>downloadTemplateFile(typeSelect?.value||'sales');
  if(fileInput)fileInput.onchange=readImportFile;
  if(confirmBtn)confirmBtn.onclick=executeConfirmedImport;
  const b=document.getElementById('importBuiltInData');if(b)b.onclick=importBuiltIn115Data;
}
function importBuiltIn115Data(){
  const seed=window.PEAK_SEED_DATA;if(!seed){toast('找不到內建資料');return;}
  if(!confirm(`將匯入 ${seed.source.people} 位人員、${seed.source.products} 項商品、${seed.source.sales} 筆業績，確定嗎？`))return;
  const merge=(target,rows,keyFn)=>{const map=new Map(target.map(x=>[keyFn(x),x]));rows.forEach(r=>{const k=keyFn(r);if(map.has(k))Object.assign(map.get(k),r,{id:map.get(k).id||r.id});else target.push(JSON.parse(JSON.stringify(r)));});};
  merge(state.users,seed.users,x=>x.name);
  merge(state.products,seed.products,x=>x.code||`${x.name}|${x.year}`);
  merge(state.rates,seed.rates,x=>`${x.year}-${x.month}`);
  merge(state.sales,seed.sales,x=>x.id);
  seed.competitions.forEach(c=>{const old=state.competitions.find(x=>x.name===c.name&&x.start===c.start&&x.end===c.end);if(old)Object.assign(old,c,{id:old.id});else state.competitions.push(JSON.parse(JSON.stringify(c)));});
  log('匯入內建115資料',JSON.stringify(seed.source));save();fillSelects();fillCompetitionPersonSelector();fillBonusPersonSelector();renderAll();renderAdmin();toast('115 資料已匯入並排程同步 Firebase');
}
function normalizedImportRow(row){const out={};Object.entries(row||{}).forEach(([k,v])=>{out[norm(String(k)).replace(/\s+/g,'')]=v;});return out;}
function importSheetScore(rows,type){if(!rows.length)return -1;const keys=Object.keys(normalizedImportRow(rows[0]));const wanted=type==='sales'?['姓名','商品名稱','商品','保費','實收','加權計績','e投保上傳日期','報件日']:type==='people'?['姓名','區單位','組別','隊伍','職級']:type==='products'?['商品名稱','商品代碼','原始加權','競賽加權']:[];return wanted.reduce((n,k)=>n+(keys.includes(k)?1:0),0);}
function chooseImportSheet(wb,type){const preferred={sales:['原始資料','報件明細'],people:['組織表'],products:['商品計績一覽'],rates:['美元匯率']}[type]||[];let best=null;wb.SheetNames.forEach((name,index)=>{const ws=wb.Sheets[name];const rows=XLSX.utils.sheet_to_json(ws,{defval:'',raw:true});const score=(preferred.includes(name)?100-preferred.indexOf(name):0)+importSheetScore(rows,type);if(!best||score>best.score)best={name,rows,score,index};});return best||{name:wb.SheetNames[0],rows:[],score:0};}
function readImportFile(e){const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{try{const type=document.getElementById('importType')?.value||'sales';const wb=XLSX.read(ev.target.result,{type:'array',cellDates:true});const selected=chooseImportSheet(wb,type);pendingImport=selected.rows;pendingImportMeta={sheetName:selected.name,fileName:file.name,type,mapped:[]};renderImportPreview();}catch(err){console.error(err);pendingImport=[];const preview=document.getElementById('importPreview');if(preview)preview.innerHTML=`<div class="card"><b>⚠️ 無法讀取檔案</b><p>${escapeHtml(err.message||'Excel 格式錯誤')}</p></div>`;const btn=document.getElementById('confirmImport');if(btn)btn.disabled=true;}};reader.readAsArrayBuffer(file);}
function importNumber(v){if(typeof v==='number')return Number.isFinite(v)?v:0;const s=String(v??'').replace(/[,，$￥元%\s]/g,'').trim();const n=Number(s);return Number.isFinite(n)?n:0;}
function importGet(row,...keys){const r=normalizedImportRow(row);for(const k of keys){const key=norm(String(k)).replace(/\s+/g,'');if(r[key]!==undefined&&r[key]!==null&&r[key]!=='')return r[key]}return '';}
function cleanImportText(v){return norm(String(v??'')).replace(/[\u200B-\u200D\uFEFF]/g,'').replace(/\u3000/g,' ').replace(/\s+/g,' ').trim();}
function compactImportKey(v){return cleanImportText(v).toUpperCase().replace(/[\s　]/g,'').replace(/[()（）\[\]【】._\-\/\\]/g,'');}
function findImportUser(name,unit='',team='',group=''){
  const n=compactImportKey(name);
  if(!n)return null;
  const sameName=state.users.filter(u=>compactImportKey(u.name)===n);
  if(sameName.length<=1)return sameName[0]||null;
  const u=compactImportKey(unit),t=compactImportKey(team),g=compactImportKey(group);
  return sameName.find(x=>u&&compactImportKey(x.unit)===u&&t&&compactImportKey(x.team)===t)
    ||sameName.find(x=>u&&compactImportKey(x.unit)===u&&g&&compactImportKey(x.group)===g)
    ||sameName.find(x=>u&&compactImportKey(x.unit)===u)
    ||sameName[0];
}
function normalizeImportProductAlias(value){
  const raw=cleanImportText(value);
  const key=compactImportKey(raw);
  if(!key)return {raw,key:'',canonical:'',matched:false};
  // 只處理已確認的公司商品命名差異，避免過度模糊配對。
  if(key==='增額UBVA')return {raw,key,canonical:'UBVA',matched:true,rule:'增額UBVA → UBVA'};
  // 年期最多 30 年；10(G)HRLTC3／20(G)HRLTC3／30(G)HRLTC3 均歸類 HRLTC。
  if(/^(10G|20G|30G)HRLTC3$/.test(key))return {raw,key,canonical:'HRLTC',matched:true,rule:`${raw} → HRLTC`};
  return {raw,key,canonical:raw,matched:false};
}
function findImportProduct(name,code=''){
  const aliases=[normalizeImportProductAlias(name),normalizeImportProductAlias(code)];
  const inputs=aliases.flatMap(a=>[a.raw,a.canonical]).map(compactImportKey).filter(Boolean);
  if(!inputs.length)return null;
  const exact=state.products.find(p=>{const keys=[p.name,p.code].map(compactImportKey).filter(Boolean);return inputs.some(i=>keys.includes(i));});
  if(exact)return {product:exact,alias:aliases.find(a=>a.matched)||null};
  const fuzzy=state.products.find(p=>{
    const keys=[p.name,p.code].map(compactImportKey).filter(Boolean);
    return inputs.some(i=>keys.some(k=>i.length>=4&&k.length>=4&&(i.includes(k)||k.includes(i))));
  })||null;
  return fuzzy?{product:fuzzy,alias:aliases.find(a=>a.matched)||null}:null;
}
function saleImportKey(data){const timestamp=String(data.sourceTimestamp||'').trim();if(timestamp)return `ts|${timestamp}|${data.userName}|${data.productName}`;return ['row',data.date,data.userName,data.productCode||data.productName,Number(data.premium||0),Number(data.twdPremium||0),Number(data.contestWeighted||0)].join('|');}
function mapImportedSale(row,rowIndex=0){
  const name=cleanImportText(importGet(row,'姓名','業務員','姓名(中文)','userName'));
  const unit=cleanImportText(importGet(row,'區單位','單位'));
  const team=cleanImportText(importGet(row,'隊伍','隊名'));
  const group=cleanImportText(importGet(row,'組別','小組'));
  const productName=cleanImportText(importGet(row,'商品名稱','商品','險種名稱','productName'));
  const productCode=cleanImportText(importGet(row,'商品代碼','險種','險種代碼','productCode'));
  if(name==='公式用'||unit==='公式用')return {skip:true,reason:'公式範例列',rowNumber:rowIndex+2,raw:row};
  if(!name)return {error:'缺少姓名',rowNumber:rowIndex+2,raw:row};
  const user=findImportUser(name,unit,team,group);
  if(!user)return {error:`找不到人員：${name}`,rowNumber:rowIndex+2,raw:row};
  if(!productName&&!productCode)return {error:'缺少商品名稱',rowNumber:rowIndex+2,raw:row};
  const productMatch=findImportProduct(productName,productCode);
  if(!productMatch)return {error:`找不到商品：${productName||productCode}`,rowNumber:rowIndex+2,raw:row};
  const prod=productMatch.product;
  const date=toDate(importGet(row,'e投保上傳日期','報件日期','日期','報件日','上傳日期','時間戳記'));
  const rawPremium=importNumber(importGet(row,'保費','原始保費','原始保費(外幣)'));
  if(rawPremium<=0)return {error:'保費必須大於 0',rowNumber:rowIndex+2,raw:row};
  let sale;try{sale=createSale(date,user.id,prod.id,rawPremium);}catch(err){return {error:err.message,rowNumber:rowIndex+2,raw:row};}
  const has=(...keys)=>importGet(row,...keys)!=='';
  const twd=importNumber(importGet(row,'實收','實收保費','台幣實收','換算實收'));
  const original=importNumber(importGet(row,'原始加權','原始加權計績'));
  const contest=importNumber(importGet(row,'加權計績','競賽加權','競賽計績'));
  const ah=importNumber(importGet(row,'A&H','A＆H','AH','A&H計績'));
  if(has('實收','實收保費','台幣實收','換算實收'))sale.twdPremium=twd;
  if(has('原始加權','原始加權計績'))sale.originalWeighted=original;
  if(has('加權計績','競賽加權','競賽計績'))sale.contestWeighted=contest;
  if(has('A&H','A＆H','AH','A&H計績'))sale.ahWeighted=ah;
  sale.sourceTimestamp=String(importGet(row,'時間戳記','Timestamp')||'');
  sale.importSource=pendingImportMeta.fileName||'Excel';sale.importSheet=pendingImportMeta.sheetName||'';sale.importKey=saleImportKey(sale);sale.createdAt=new Date().toISOString();
  sale.importDisplay={name,unit,team,group,product:productName||productCode};
  if(productMatch.alias){sale.importProductOriginal=productMatch.alias.raw;sale.importProductAlias=productMatch.alias.canonical;sale.importAliasRule=productMatch.alias.rule;}
  return sale;
}

function mapRow(row,type,rowIndex=0){const get=(...keys)=>importGet(row,...keys); if(type==='people')return {id:uid(),name:norm(get('姓名','業務員','姓名(中文)')),unit:norm(get('區單位','單位')),team:norm(get('隊伍','隊名')),group:norm(get('組別','小組')),role:norm(get('職級','職稱')),active:true}; if(type==='products'){const name=norm(get('商品名稱','商品','名稱','商品名')); const code=norm(get('商品代碼','險種','險種代碼')); const category=norm(get('商品類別','類別')); const currencyRaw=norm(get('幣別','幣種')); const currency=currencyRaw||(name.includes('美元')||code.includes('(S)')||code.startsWith('U')?'USD':'TWD'); return {id:uid(),name,code,year:norm(get('年期','繳費年期')),currency:currency.toUpperCase(),category,subcategory:norm(get('商品次類','次類')),protection:String(get('保障型','是否保障型')).includes('是'),mainRider:norm(get('主約/附約','主附約'))||'主約',originalWeight:parseWeight(get('原始加權','原始倍率')),contestWeight:parseWeight(get('競賽加權','競賽倍率','加權')),ah:category.includes('Health')||category.includes('A&H')||String(get('A&H','AH')).includes('是'),active:true};} if(type==='rates')return {id:uid(),year:importNumber(get('年度','年'))||new Date().getFullYear(),month:importNumber(get('月份','月')),usd:importNumber(get('匯率','美金匯率','美元匯率'))}; if(type==='sales')return mapImportedSale(row,rowIndex); if(type==='bonus')return {id:uid(),name:get('活動名稱','名稱'),start:toDate(get('開始日期','開始')),deadline:toDate(get('截止日期','結束日期','日期')),metric:normalizeBonusMetric(get('累計欄位','計算方式')||'weighted'),target:importNumber(get('目標','達成業績')),amount:importNumber(get('獎金')),category:get('商品大類','商品類別'),subcategory:get('商品次類','次類'),products:get('指定商品','商品'),ahOnly:String(get('只抓A&H','A&H')).includes('是'),protectionOnly:String(get('只抓保障型','保障型')).includes('是'),roles:get('適用職級','職級'),units:get('適用區單位','區單位'),teams:get('適用隊伍','隊伍'),groups:get('適用組別','組別'),active:String(get('首頁顯示','顯示','啟用')||'是')!=='否'}; if(type==='competitions')return {id:uid(),name:get('競賽名稱','名稱'),scope:'personal',start:toDate(get('開始日期','開始')),end:toDate(get('結束日期','結束')),role:get('職級'),weightedTarget:importNumber(get('加權目標')),premiumTarget:importNumber(get('實收目標')),ahTarget:importNumber(get('A&H目標','AH目標')),reward:get('獎勵')};}
function parseWeight(v){let s=String(v).replace('%','').trim();let n=Number(s);if(!n)return 0;return n>10?n/100:n}
function toDate(v){if(v instanceof Date&&!Number.isNaN(v.getTime()))return v.toISOString().slice(0,10);if(typeof v==='number'){const d=XLSX.SSF.parse_date_code(v);if(d)return `${d.y}-${String(d.m).padStart(2,'0')}-${String(d.d).padStart(2,'0')}`;}const raw=String(v||today()).trim();const match=raw.match(/(20\d{2}|19\d{2})[\/-](\d{1,2})[\/-](\d{1,2})/);if(match)return `${match[1]}-${String(match[2]).padStart(2,'0')}-${String(match[3]).padStart(2,'0')}`;return raw.replaceAll('/','-').slice(0,10);}
function renderImportPreview(){
  const type=document.getElementById('importType')?.value||'sales';
  const mapped=pendingImport.map((r,i)=>mapRow(r,type,i)).map(r=>(type==='products'&&!r.name)?{error:'缺少商品名稱',raw:r}:r);
  pendingImportMeta.mapped=mapped;
  const skipped=mapped.filter(r=>r.skip);
  const errors=mapped.filter(r=>r.error);
  let duplicates=0;const seen=new Set();
  if(type==='sales')mapped.filter(r=>!r.error&&!r.skip).forEach(r=>{const key=r.importKey||saleImportKey(r);const exists=state.sales.some(s=>(s.importKey&&s.importKey===key)||saleImportKey(s)===key);if(exists||seen.has(key))duplicates++;seen.add(key);});
  const ok=mapped.filter(r=>!r.error&&!r.skip).length-duplicates;
  const errorSamples=errors.slice(0,8).map(r=>`<tr><td>⚠️ 第 ${r.rowNumber||'?'} 列：${escapeHtml(r.error)}</td></tr>`).join('');
  const okSamples=mapped.filter(r=>!r.error&&!r.skip).slice(0,5).map(r=>`<tr><td>✅ ${escapeHtml([r.date,r.userName,r.productName,fmt(r.twdPremium||0),fmt(r.contestWeighted||0)].filter(Boolean).join('｜'))}</td></tr>`).join('');
  const aliasCounts={};mapped.filter(r=>!r.error&&!r.skip&&r.importAliasRule).forEach(r=>aliasCounts[r.importAliasRule]=(aliasCounts[r.importAliasRule]||0)+1);
  const aliasSummary=Object.entries(aliasCounts).map(([rule,count])=>`<li>${escapeHtml(rule)}（${count} 筆）</li>`).join('');
  pendingImportMeta.aliasCounts=aliasCounts;
  importPreview.innerHTML=`<div class="card"><h3>智慧匯入預覽 v4</h3><p>檔案：${escapeHtml(pendingImportMeta.fileName||'')}｜工作表：<b>${escapeHtml(pendingImportMeta.sheetName||'')}</b></p><p><b>可匯入 ${Math.max(ok,0)} 筆</b>｜錯誤 ${errors.length} 筆｜重複 ${duplicates} 筆｜公式列略過 ${skipped.length} 筆</p>${aliasSummary?`<div class="notice"><b>商品智慧對應</b><ul>${aliasSummary}</ul></div>`:''}<table><tbody>${okSamples}${errorSamples||''}</tbody></table>${errors.length?'<p class="muted">錯誤會分別顯示人員或商品名稱；平台內部 p_ 編號不參與辨識，也不會顯示。</p>':''}</div>`;
  const confirmBtn=document.getElementById('confirmImport');if(confirmBtn)confirmBtn.disabled=ok<=0;
}

function executeConfirmedImport(){
  const type=document.getElementById('importType')?.value||'sales';
  const all=(pendingImportMeta.mapped?.length?pendingImportMeta.mapped:pendingImport.map((r,i)=>mapRow(r,type,i)));
  const mapped=all.filter(r=>!r.error&&!r.skip).filter(r=>type!=='people'||r.name).filter(r=>type!=='products'||r.name);
  const collection={people:'users',products:'products',rates:'rates',sales:'sales',bonus:'bonus',competitions:'competitions'}[type];
  let added=0,updated=0,skipped=0;
  mapped.forEach(item=>{
    let existing=null;
    if(type==='people')existing=state.users.find(x=>x.name===item.name);
    if(type==='products')existing=state.products.find(x=>(x.code&&item.code&&x.code===item.code)||(!item.code&&x.name===item.name&&String(x.year)===String(item.year)));
    if(type==='rates')existing=state.rates.find(x=>x.year===item.year&&x.month===item.month);
    if(type==='sales'){
      const key=item.importKey||saleImportKey(item);
      existing=state.sales.find(x=>(x.importKey&&x.importKey===key)||saleImportKey(x)===key);
      if(existing&&item.sourceTimestamp){Object.assign(existing,item,{id:existing.id,createdAt:existing.createdAt||item.createdAt});updated++;return;}
      if(existing){skipped++;return;}
    }
    if(existing){Object.assign(existing,item,{id:existing.id});updated++;}
    else{state[collection].push(item);added++;}
  });
  const errorCount=all.filter(x=>x.error).length;
  const formulaSkipped=all.filter(x=>x.skip).length;
  const aliasCounts=pendingImportMeta.aliasCounts||{};
  const aliasText=Object.entries(aliasCounts).map(([rule,count])=>`${rule}（${count}筆）`).join('、');
  log('智慧匯入資料',`${type} 新增 ${added} 更新 ${updated} 重複跳過 ${skipped} 錯誤 ${errorCount} 公式略過 ${formulaSkipped}${aliasText?` 商品對應：${aliasText}`:''}`);
  if(type==='competitions')state.competitions=migrateCompetitions(state.competitions);
  save();fillSelects();fillCompetitionPersonSelector();fillBonusPersonSelector();renderAll();renderAdmin();
  const summary=`匯入完成：新增 ${added}，更新 ${updated}，重複跳過 ${skipped}，錯誤 ${errorCount}，公式列略過 ${formulaSkipped}${aliasText?`；商品智慧對應：${aliasText}`:''}`;
  toast(summary);
  const preview=document.getElementById('importPreview');
  if(preview)preview.innerHTML=`<div class="card"><h3>✅ 匯入完成</h3><p>${escapeHtml(summary)}</p><p class="muted">本次紀錄已寫入平台操作紀錄。</p></div>`;
  const confirmBtn=document.getElementById('confirmImport');if(confirmBtn)confirmBtn.disabled=true;
}

function downloadTemplateFile(type){const templates={people:[{姓名:'張永朋',區單位:'素伶區',隊伍:'靛隊',組別:'永朋組',職級:'主任'}],products:[{商品名稱:'BVA',商品代碼:'BVA3',年期:'躉繳',幣別:'TWD',原始加權:'5%',競賽加權:'5%',商品類別:'ILP'},{商品名稱:'WEHS 20年',商品代碼:'20(G)WEHS',年期:'20',幣別:'TWD',原始加權:'300%',競賽加權:'300%',商品類別:'Health'}],rates:[{年度:2026,月份:7,美金匯率:31.57333}],sales:[{日期:today(),姓名:'張永朋',商品:'BVA',保費:500000}],bonus:[{活動名稱:'醫療險衝刺獎',開始日期:'2026-07-01',截止日期:'2026-07-31',累計欄位:'加權計績',目標:300000,獎金:5000,商品大類:'Health',指定商品:'WEHS','只抓A&H':'否',只抓保障型:'否',適用職級:'主任,業代',首頁顯示:'是'}],competitions:[{競賽名稱:'新高峰',開始日期:'2026-07-02',結束日期:'2026-12-15',職級:'主任',加權目標:2650000,實收目標:20000000,'A&H目標':0,獎勵:'日本關西'}]};exportRows(`${type}_template`,templates[type]);}

function exportRows(name,rows){const ws=XLSX.utils.json_to_sheet(rows);const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'資料');XLSX.writeFile(wb,`${name}.xlsx`)}
function isoDate(d){return d.toISOString().slice(0,10);}
function setHistoryRange(range){
  const now=new Date(); let start='',end=isoDate(now);
  if(range==='today')start=end;
  if(range==='week'){const d=new Date(now);const day=(d.getDay()+6)%7;d.setDate(d.getDate()-day);start=isoDate(d);}
  if(range==='month'){start=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-01`;}
  if(range==='quarter'){const qm=Math.floor(now.getMonth()/3)*3;start=`${now.getFullYear()}-${String(qm+1).padStart(2,'0')}-01`;}
  if(range==='year')start=`${now.getFullYear()}-01-01`;
  if(range==='all'){start='';end='';}
  const a=document.getElementById('historyStart'),b=document.getElementById('historyEnd');if(a)a.value=start;if(b)b.value=end;renderHistory();
}
function populateHistoryFilters(){
  [['historyUnit','unit'],['historyTeam','team'],['historyRole','role']].forEach(([id,key])=>{const el=document.getElementById(id);if(!el)return;const current=el.value;const label={unit:'全部區單位',team:'全部隊伍',role:'全部職級'}[key];const vals=[...new Set(state.sales.map(s=>s[key]).filter(Boolean))].sort((a,b)=>String(a).localeCompare(String(b),'zh-Hant'));el.innerHTML=`<option value="">${label}</option>`+vals.map(v=>`<option value="${v}">${v}</option>`).join('');el.value=vals.includes(current)?current:'';});
}
function getHistorySales(){
  const start=document.getElementById('historyStart')?.value||'';
  const end=document.getElementById('historyEnd')?.value||'';
  const keyword=(document.getElementById('historyKeyword')?.value||'').trim().toLowerCase();
  const unit=document.getElementById('historyUnit')?.value||'';
  const team=document.getElementById('historyTeam')?.value||'';
  const role=document.getElementById('historyRole')?.value||'';
  return state.sales.filter(s=>(!start||s.date>=start)&&(!end||s.date<=end)&&(!keyword||`${s.userName||''} ${s.productName||''} ${s.productCode||''}`.toLowerCase().includes(keyword))&&(!unit||s.unit===unit)&&(!team||s.team===team)&&(!role||s.role===role)).sort((a,b)=>String(b.date||'').localeCompare(String(a.date||''))||String(b.createdAt||'').localeCompare(String(a.createdAt||'')));
}
function renderHistory(){
  populateHistoryFilters();
  populateTeamReportTeams();
  const rows=getHistorySales();
  const body=document.getElementById('historySalesRows'); if(!body)return;
  body.innerHTML=rows.map(s=>`<tr><td>${s.date||''}</td><td>${s.userName||''}</td><td>${s.productName||''}</td><td>${fmt(s.premium||0)}</td><td>${fmt(s.twdPremium||0)}</td><td>${fmt(s.contestWeighted||0)}</td><td>${fmt(s.ahWeighted||0)}</td><td>${s.unit||''}</td><td>${s.team||''}</td><td>${s.role||''}</td></tr>`).join('')||'<tr><td colspan="10" class="empty">目前沒有符合條件的業績資料</td></tr>';
  const sum=k=>rows.reduce((a,x)=>a+Number(x[k]||0),0);
  document.getElementById('historyPremiumTotal').textContent=fmt(sum('premium'));
  document.getElementById('historyTwdTotal').textContent=fmt(sum('twdPremium'));
  document.getElementById('historyWeightedTotal').textContent=fmt(sum('contestWeighted'));
  document.getElementById('historyAHTotal').textContent=fmt(sum('ahWeighted'));
  document.getElementById('historyCountTotal').textContent=`${rows.length} 件`;
  document.getElementById('historyWeightedSummary').textContent=fmt(sum('contestWeighted'));
  document.getElementById('historyTwdSummary').textContent=fmt(sum('twdPremium'));
  document.getElementById('historyAHSummary').textContent=fmt(sum('ahWeighted'));
}

function populateTeamReportTeams(){
  const box=document.getElementById('teamReportTeams');if(!box)return;
  const selected=new Set([...box.querySelectorAll('[data-team-report-team]:checked')].map(x=>x.value));
  const teams=[...new Set(state.users.map(u=>u.team).filter(Boolean))].sort((a,b)=>String(a).localeCompare(String(b),'zh-Hant'));
  box.innerHTML=teams.map(t=>`<label><input type="checkbox" data-team-report-team value="${escapeHtml(t)}" ${selected.size===0||selected.has(t)?'checked':''}> ${escapeHtml(t)}</label>`).join('')||'<span class="empty">尚無隊伍資料</span>';
  const hs=document.getElementById('historyStart')?.value||'',he=document.getElementById('historyEnd')?.value||'';
  const rs=document.getElementById('teamReportStart'),re=document.getElementById('teamReportEnd');
  if(rs&&!rs.value)rs.value=hs;if(re&&!re.value)re.value=he;
}
function selectedTeamReportColumns(){return new Set([...document.querySelectorAll('[data-team-col]:checked')].map(x=>x.dataset.teamCol));}
function teamReportData(){
  const start=document.getElementById('teamReportStart')?.value||'',end=document.getElementById('teamReportEnd')?.value||'';
  const teams=[...document.querySelectorAll('[data-team-report-team]:checked')].map(x=>x.value);
  if(!teams.length)throw new Error('請至少選擇一個隊伍');
  const sort=document.getElementById('teamReportSort')?.value||'weighted';
  const sales=state.sales.filter(s=>(!start||s.date>=start)&&(!end||s.date<=end)&&teams.includes(s.team));
  const activeCompetition=state.competitions.find(c=>c.active!==false&&c.scope!=='office');
  return teams.map(team=>{
    const members=state.users.filter(u=>u.team===team&&u.active!==false);
    const rows=members.map((u,index)=>{
      const us=sales.filter(x=>String(x.userId)===String(u.id)||x.userName===u.name);
      const weighted=sum(us,'contestWeighted'),premium=sum(us,'twdPremium'),ah=sum(us,'ahWeighted');
      const activity=us.length>0||weighted>0||premium>0||ah>0;
      return {index,name:u.name,role:u.role||'',weighted,premium,ah,count:us.length,activity};
    });
    if(sort==='weighted')rows.sort((a,b)=>b.weighted-a.weighted||a.name.localeCompare(b.name,'zh-Hant'));
    if(sort==='name')rows.sort((a,b)=>a.name.localeCompare(b.name,'zh-Hant'));
    return {team,rows,totals:{weighted:rows.reduce((a,x)=>a+x.weighted,0),premium:rows.reduce((a,x)=>a+x.premium,0),ah:rows.reduce((a,x)=>a+x.ah,0),count:rows.reduce((a,x)=>a+x.count,0),activity:rows.filter(x=>x.activity).length,members:rows.length}};
  });
}
function exportTeamReportExcel(){
  try{
    const groups=teamReportData(),cols=selectedTeamReportColumns(),wb=XLSX.utils.book_new();
    groups.forEach(g=>{
      const rows=g.rows.map(r=>{const o={姓名:r.name,職級:r.role};if(cols.has('weighted'))o['加權保費']=r.weighted;if(cols.has('premium'))o['實收保費']=r.premium;if(cols.has('ah'))o['A&H']=r.ah;if(cols.has('count'))o['件數']=r.count;if(cols.has('activity'))o['活動率']=r.activity?'✅':'';return o;});
      rows.push({姓名:'合計',職級:`活動 ${g.totals.activity} 人`,...(cols.has('weighted')?{'加權保費':g.totals.weighted}:{}),...(cols.has('premium')?{'實收保費':g.totals.premium}:{}),...(cols.has('ah')?{'A&H':g.totals.ah}:{}),...(cols.has('count')?{'件數':g.totals.count}:{})});
      const ws=XLSX.utils.json_to_sheet(rows);XLSX.utils.book_append_sheet(wb,ws,String(g.team).slice(0,31));
    });
    const start=document.getElementById('teamReportStart')?.value||'全部',end=document.getElementById('teamReportEnd')?.value||'全部';
    XLSX.writeFile(wb,`各隊業績報表_${start}_${end}.xlsx`);
  }catch(err){alert(err.message||'匯出失敗')}
}
function escapePrint(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function exportTeamReportPdf(){
  try{
    const groups=teamReportData(),cols=selectedTeamReportColumns(),layout=document.getElementById('teamReportLayout')?.value||'multi';
    const start=document.getElementById('teamReportStart')?.value||'不限',end=document.getElementById('teamReportEnd')?.value||'不限';
    const tables=groups.map(g=>`<section class="team ${layout==='single'?'page-break':''}"><h2>${escapePrint(g.team)}</h2><table><thead><tr><th>姓名</th>${cols.has('weighted')?'<th>加權保費</th>':''}${cols.has('premium')?'<th>實收保費</th>':''}${cols.has('ah')?'<th>A&amp;H</th>':''}${cols.has('count')?'<th>件數</th>':''}${cols.has('activity')?'<th>活動率</th>':''}</tr></thead><tbody>${g.rows.map(r=>`<tr><td>${escapePrint(r.name)}</td>${cols.has('weighted')?`<td>${fmt(r.weighted)}</td>`:''}${cols.has('premium')?`<td>${fmt(r.premium)}</td>`:''}${cols.has('ah')?`<td>${fmt(r.ah)}</td>`:''}${cols.has('count')?`<td>${r.count}</td>`:''}${cols.has('activity')?`<td>${r.activity?'✅':''}</td>`:''}</tr>`).join('')}<tr class="total"><td>合計</td>${cols.has('weighted')?`<td>${fmt(g.totals.weighted)}</td>`:''}${cols.has('premium')?`<td>${fmt(g.totals.premium)}</td>`:''}${cols.has('ah')?`<td>${fmt(g.totals.ah)}</td>`:''}${cols.has('count')?`<td>${g.totals.count}</td>`:''}${cols.has('activity')?`<td>${g.totals.activity} 人</td>`:''}</tr></tbody></table></section>`).join('');
    const win=window.open('','_blank');if(!win)throw new Error('瀏覽器阻擋新視窗，請允許彈出視窗後重試');
    win.document.write(`<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><title>各隊業績報表</title><style>@page{size:A4 landscape;margin:12mm}*{box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,"PingFang TC","Noto Sans TC","Microsoft JhengHei",sans-serif;color:#111;margin:0}h1{text-align:center;font-size:22px}p{text-align:center}.report{display:grid;grid-template-columns:${layout==='multi'?'repeat(2,minmax(0,1fr))':'1fr'};gap:14px}.team{break-inside:avoid}.page-break{break-after:page}.page-break:last-child{break-after:auto}h2{background:#dbeafe;margin:0;padding:7px;text-align:center;font-size:17px;border:1px solid #444}table{width:100%;border-collapse:collapse;font-size:12px}th,td{border:1px solid #555;padding:5px;text-align:right}th:first-child,td:first-child{text-align:left}.total{font-weight:700;background:#f3f4f6}.note{font-size:11px;color:#555}@media print{button{display:none}}</style></head><body><h1>${escapePrint(state.settings.platformTitle||'高峰競賽平台')}｜各隊業績報表</h1><p>${escapePrint(start)} ～ ${escapePrint(end)}</p><div class="report">${tables}</div><p class="note">本報表使用瀏覽器原生繁體中文字型列印，請在列印視窗選擇「儲存為 PDF」。</p><script>window.onload=()=>setTimeout(()=>window.print(),350)<\/script></body></html>`);win.document.close();
  }catch(err){alert(err.message||'PDF 匯出失敗')}
}

function formatCompetitionPeriod(){const a=state.settings.competitionStart||'';const b=state.settings.competitionEnd||'';if(a&&b)return `${a.replaceAll('-','/')} - ${b.replaceAll('-','/')}`;return state.settings.period||'';}
function applyTheme(){const t=state.settings.theme||demo.settings.theme;document.documentElement.style.setProperty('--bg',t.bg);document.documentElement.style.setProperty('--primary',t.primary);document.documentElement.style.setProperty('--text',t.text);document.documentElement.style.setProperty('--card',t.card);document.documentElement.style.setProperty('--radius',`${t.radius}px`);bgColor.value=t.bg;primaryColor.value=t.primary;textColor.value=t.text;cardColor.value=t.card;radiusRange.value=t.radius;bannerText.value=state.settings.banner||'新高峰';platformTitleInput.value=state.settings.platformTitle||'高峰競賽平台';competitionStartInput.value=state.settings.competitionStart||'';competitionEndInput.value=state.settings.competitionEnd||'';appNameInput.value=state.settings.appName||'高峰競賽';document.title=`${state.settings.platformTitle||'高峰競賽平台'}｜Peak Competition Platform`;document.querySelector('meta[name="apple-mobile-web-app-title"]')?.setAttribute('content',state.settings.appName||'高峰競賽');const logo=document.getElementById('brandLogoImage'),fallback=document.getElementById('brandLogoFallback'),logoPreview=document.getElementById('platformLogoPreview');if(state.settings.platformLogo){logo.src=state.settings.platformLogo;logo.style.display='block';fallback.style.display='none';logoPreview.src=state.settings.platformLogo;logoPreview.style.display='block';}else{logo.removeAttribute('src');logo.style.display='none';fallback.style.display='inline';logoPreview.style.display='none';}const appPreview=document.getElementById('appIconPreview');if(state.settings.appIcon){document.querySelectorAll('link[rel="icon"],link[rel="apple-touch-icon"]').forEach(l=>l.href=state.settings.appIcon);appPreview.src=state.settings.appIcon;appPreview.style.display='block';}else{appPreview.style.display='none';}}

function saveThemeSettings(){state.settings.theme={bg:bgColor.value,primary:primaryColor.value,text:textColor.value,card:cardColor.value,radius:Number(radiusRange.value)};state.settings.platformTitle=platformTitleInput.value.trim()||'高峰競賽平台';state.settings.banner=bannerText.value.trim()||'新高峰';state.settings.competitionStart=competitionStartInput.value||'';state.settings.competitionEnd=competitionEndInput.value||'';state.settings.period=formatCompetitionPeriod();state.settings.appName=appNameInput.value||'高峰競賽';save();applyTheme();renderAll();toast('平台名稱、競賽名稱與日期已更新');}
function toast(msg){const d=document.createElement('div');d.className='toast';d.textContent=msg;document.body.appendChild(d);setTimeout(()=>d.remove(),2200)}

init();
