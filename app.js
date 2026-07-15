const LS_KEY='peakCompetitionV211';
const APP_VERSION='V2.2.5';
const fmt=n=>(Number(n)||0).toLocaleString('zh-TW',{maximumFractionDigits:0});
const pct=n=>`${Math.round((Number(n)||0)*100)}%`;
const today=()=>new Date().toISOString().slice(0,10);
const monthKey=d=>String(d||today()).slice(0,7);
const uid=()=>Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4);
const norm=v=>String(v??'').trim();

const demo={
  settings:{banner:'115下半年 新高峰競賽',period:'2026/07/02 - 2026/12/15',officeTarget:40000000,officeDoneManual:0,officeManual:false,peakTargetManual:2650000,peakDoneManual:0,superTargetManual:4000000,superDoneManual:0,competitionManual:false,dashboardWidgets:{todayWeighted:true,todayPremium:true,dailyStar:true,todayCount:true,officeProgress:true,competitionProgress:true,bonus:true,top5:true,latest:true},customCards:[],appName:'高峰競賽',appIcon:'',theme:{bg:'#eef7ff',primary:'#1769e8',text:'#0b1b3d',card:'#ffffff',radius:18}},
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
    {id:uid(),name:'BVA',start:'2026-07-01',deadline:'2026-07-15',metric:'weighted',target:3000000,amount:5000,product:'BVA',category:'',ahOnly:false,protectionOnly:false,roles:'',active:true},
    {id:uid(),name:'WEHS',start:'2026-07-01',deadline:'2026-07-31',metric:'count',target:3,amount:3000,product:'WEHS',category:'Health',ahOnly:false,protectionOnly:false,roles:'',active:true},
    {id:uid(),name:'主任活動',start:'2026-07-01',deadline:'2026-07-31',metric:'weighted',target:1350000,amount:10000,product:'',category:'',ahOnly:false,protectionOnly:false,roles:'主任',active:true}
  ],
  sales:[],history:[],audit:[]
};

demo.sales=[
  makeSale('2026-07-07','張永朋','BVA',500000),makeSale('2026-07-07','林志明','WEHS 20年',234160),makeSale('2026-07-07','蔡汪霖','ACUPL 10年',9950),makeSale('2026-07-07','陳澄任','WEHS 20年',99402),makeSale('2026-07-07','黃金鳳','WEHS 20年',90860),makeSale('2026-07-07','李雅萍','BVA',68000),makeSale('2026-07-06','王小明','WEHS 20年',200000),makeSale('2026-07-06','李大華','BVA',95000)
].filter(Boolean);

let state=load();
normalizeState();
let pendingImport=[];
let rankMode='person';
let currentAdmin='people';


function normalizeState(){
  state.settings={...demo.settings,...(state.settings||{})};
  state.settings.dashboardWidgets={...demo.settings.dashboardWidgets,...(state.settings.dashboardWidgets||{})};
  state.settings.customCards=state.settings.customCards||[];
  state.settings.appName=state.settings.appName||'高峰競賽';
  state.settings.appIcon=state.settings.appIcon||'';
  state.products=(state.products||[]).map(p=>({subcategory:'',protection:false,mainRider:'主約',...p}));
  state.bonus=(state.bonus||[]).map(b=>({start:'',category:'',subcategory:'',ahOnly:false,protectionOnly:false,roles:'',units:'',teams:'',groups:'',products:'',active:true,...b,products:b.products||b.product||''}));
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
  save();
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
function saleProduct(sale){return state.products.find(p=>p.id===sale.productId||p.code===sale.productCode||p.name===sale.productName)||{} }
function bonusMetricLabel(metric){return ({weighted:'競賽加權',premium:'實收',original:'原始加權',ah:'A&H',count:'件數'})[metric]||metric}
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
  const key={premium:'twdPremium',original:'originalWeighted',ah:'ahWeighted',weighted:'contestWeighted'}[bonus.metric]||'contestWeighted';
  return {value:bonus.metric==='count'?data.length:sum(data,key),eligible:true,data};
}

function load(){
  const keys=[LS_KEY,'peakCompetitionV211','peakCompetitionV20','peakCompetitionV19','peakCompetitionData'];
  for(const key of keys){
    const raw=localStorage.getItem(key);
    if(!raw) continue;
    try{
      const parsed=JSON.parse(raw);
      if(parsed&&typeof parsed==='object'){
        if(key!==LS_KEY)localStorage.setItem(LS_KEY,raw);
        return parsed;
      }
    }catch(e){console.warn('忽略損壞的本機資料',key,e)}
  }
  localStorage.setItem(LS_KEY,JSON.stringify(demo));
  return JSON.parse(JSON.stringify(demo));
}
let cloudSaveTimer=null;
function save(){
  localStorage.setItem(LS_KEY,JSON.stringify(state));
  if(localStorage.getItem('peakCloudEnabled')==='1' && window.PeakFirebaseService?.isReady?.()){
    clearTimeout(cloudSaveTimer);
    cloudSaveTimer=setTimeout(()=>window.PeakFirebaseService.upload(state).catch(console.error),800);
  }
}
function log(action,detail){state.audit.unshift({id:uid(),time:new Date().toISOString(),action,detail});}
function makeSale(date,userName,productName,premium){
  const u=(demo.users||state?.users||[]).find(x=>x.name===userName); const p=(demo.products||state?.products||[]).find(x=>x.name===productName); if(!u||!p)return null;
  const y=Number(date.slice(0,4)),m=Number(date.slice(5,7)); const rate=(p.currency==='USD')?((demo.rates||state?.rates||[]).find(r=>r.year===y&&r.month===m)?.usd||1):1;
  const twd=Number(premium)*rate; return {id:uid(),date,userId:u.id,userName:u.name,productId:p.id,productName:p.name,productCode:p.code,premium:Number(premium),currency:p.currency,usdRate:rate,twdPremium:twd,originalWeighted:twd*p.originalWeight,contestWeighted:twd*p.contestWeight,ahWeighted:p.ah?twd*p.contestWeight:0,createdAt:new Date().toISOString()};
}
function createSale(date,userId,productId,premium){
  const u=state.users.find(x=>x.id===userId); const p=state.products.find(x=>x.id===productId); if(!u||!p) throw new Error('缺少人員或商品');
  const y=Number(date.slice(0,4)),m=Number(date.slice(5,7)); let rate=1;
  if(p.currency==='USD'){const r=state.rates.find(x=>x.year===y&&x.month===m); if(!r) throw new Error(`尚未設定 ${y}/${m} 美金匯率`); rate=Number(r.usd);}
  const twd=Number(premium)*rate;
  return {id:uid(),date,userId:u.id,userName:u.name,unit:u.unit,team:u.team,group:u.group,role:u.role,productId:p.id,productName:p.name,productCode:p.code,premium:Number(premium),currency:p.currency,usdRate:rate,twdPremium:twd,originalWeighted:twd*p.originalWeight,contestWeighted:twd*p.contestWeight,ahWeighted:p.ah?twd*p.contestWeight:0,createdAt:new Date().toISOString()};
}

function init(){
  applyTheme(); bindNav(); fillSelects(); bindForms(); renderAll(); renderAdmin();
  bindCloudControls();
  setTimeout(()=>window.PeakFirebaseService?.init?.(),50);
}
function bindCloudControls(){
  const el=document.getElementById('cloudSyncStatus');
  window.addEventListener('peak:firebase-status',e=>setCloudStatus(e.detail));
  if(el){el.type='button';el.onclick=e=>{e.preventDefault();e.stopPropagation();openCloudPanel();};}
  document.querySelectorAll('[data-close-cloud]').forEach(x=>x.onclick=closeCloudPanel);
  const up=document.getElementById('cloudUploadBtn'),down=document.getElementById('cloudDownloadBtn'),check=document.getElementById('cloudCheckBtn');
  if(up)up.onclick=e=>{e.preventDefault();uploadCloud();};
  if(down)down.onclick=e=>{e.preventDefault();downloadCloud();};
  if(check)check.onclick=e=>{e.preventDefault();checkCloudConnection();};
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCloudPanel();});
}

async function checkCloudConnection(){
  setCloudPanelMessage('正在檢查 Firebase 連線…');
  try{
    const ok=await window.PeakFirebaseService?.init?.(true);
    const err=window.PeakFirebaseService?.getLastError?.()||'';
    setCloudPanelMessage(ok?'✅ Firebase 已連線，可以上傳本機資料。':`❌ 連線失敗：${err||'未知錯誤'}`);
    return ok;
  }catch(e){
    setCloudPanelMessage(`❌ 連線失敗：${e?.message||e}`);
    return false;
  }
}
window.checkPeakCloud=checkCloudConnection;
window.uploadPeakCloud=uploadCloud;
window.downloadPeakCloud=downloadCloud;

function cloudCounts(){return {人員:state.users?.length||0,商品:state.products?.length||0,匯率:state.rates?.length||0,競賽:state.competitions?.length||0,獎勵:state.bonus?.length||0,業績:state.sales?.length||0};}
function setCloudPanelMessage(msg){const el=document.getElementById('cloudModalMessage');if(el)el.textContent=msg;}
function openCloudPanel(){
  const modal=document.getElementById('cloudSyncModal');if(!modal)return;
  const summary=document.getElementById('cloudLocalSummary');const counts=cloudCounts();
  if(summary)summary.innerHTML=Object.entries(counts).map(([k,v])=>`<span><b>${k}</b><strong>${v} 筆</strong></span>`).join('');
  setCloudPanelMessage(window.PeakFirebaseService?.isReady?.()?'Firebase 已連線，請選擇同步方式。':'目前尚未連線，建議先按「重新檢查連線」。');
  modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('cloud-modal-open');
}
function closeCloudPanel(){const modal=document.getElementById('cloudSyncModal');if(modal){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');}document.body.classList.remove('cloud-modal-open');}
window.openPeakCloudPanel=openCloudPanel;window.closePeakCloudPanel=closeCloudPanel;
function setCloudStatus(detail={}){
  const el=document.getElementById('cloudSyncStatus');if(!el)return;
  const map={checking:'⏳ 檢查雲端',connected:'☁️ 已連線',syncing:'↻ 同步中',synced:'✅ 已同步',error:'⚠️ 連線失敗'};
  el.textContent=map[detail.status]||'☁️ 本機模式';
  el.className=`cloud-status ${detail.status||'offline'}`;
  el.title=detail.message||'點擊管理雲端同步';
}
function openCloudDialog(){openCloudPanel();}
async function uploadCloud(){
  try{setCloudPanelMessage('正在上傳本機資料…');toast('正在上傳本機資料…');await window.PeakFirebaseService.upload(state);setCloudPanelMessage('✅ 已同步至 Firebase');toast('已同步至 Firebase');}
  catch(e){alert('上傳失敗：'+(window.PeakFirebaseService?.getLastError?.()||e.message));}
}
async function downloadCloud(){
  if(!confirm('從雲端載入會覆蓋目前本機資料，確定繼續？'))return;
  try{
    const cloud=await window.PeakFirebaseService.download();
    if(!cloud){setCloudPanelMessage('雲端目前沒有資料，未覆蓋本機資料。');toast('雲端目前沒有資料');return;}
    state={...demo,...cloud};normalizeState();localStorage.setItem(LS_KEY,JSON.stringify(state));
    applyTheme();fillSelects();renderAll();renderAdmin();localStorage.setItem('peakCloudEnabled','1');
    setCloudPanelMessage('✅ 已載入 Firebase 雲端資料');toast('已載入 Firebase 雲端資料');
  }catch(e){alert('載入失敗：'+(window.PeakFirebaseService?.getLastError?.()||e.message));}
}
function bindNav(){document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>showPage(b.dataset.page));document.querySelectorAll('[data-admin-tab]').forEach(b=>b.onclick=()=>{showPage('admin');currentAdmin=b.dataset.adminTab;renderAdmin();});document.querySelectorAll('.admin-tab').forEach(b=>b.onclick=()=>{currentAdmin=b.dataset.admin;renderAdmin();});document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tab').forEach(x=>x.classList.remove('active'));b.classList.add('active');rankMode=b.dataset.rank;renderTop5();});document.getElementById('quickSearch').oninput=e=>quickSearch(e.target.value);}
function showPage(id){document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));document.getElementById(id)?.classList.add('active');document.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.page===id));}
function fillSelects(){
  const su=document.getElementById('saleUser'),sp=document.getElementById('saleProduct'); su.innerHTML=state.users.map(u=>`<option value="${u.id}">${u.name}</option>`).join(''); sp.innerHTML=state.products.filter(p=>p.active!==false).map(p=>`<option value="${p.id}">${p.name}｜${p.year}｜${p.currency}｜${weightText(p.contestWeight)}</option>`).join('');
  fillFilter('filterUnit',[...new Set(state.users.map(u=>u.unit).filter(Boolean))],'全部區單位');fillFilter('filterTeam',[...new Set(state.users.map(u=>u.team).filter(Boolean))],'全部隊伍');fillFilter('filterRole',[...new Set(state.users.map(u=>u.role).filter(Boolean))],'全部職級');
  document.getElementById('saleDate').value=today(); document.getElementById('filterDate').value=today();
}
function fillFilter(id,arr,label){const el=document.getElementById(id);el.innerHTML=`<option value="">${label}</option>`+arr.map(v=>`<option>${v}</option>`).join('');}
function bindForms(){
  document.getElementById('saleForm').onsubmit=e=>{e.preventDefault();try{const s=createSale(saleDate.value,saleUser.value,saleProduct.value,salePremium.value);state.sales.unshift(s);log('新增報件',`${s.userName} ${s.productName} ${fmt(s.twdPremium)}`);save();salePremium.value='';renderAll();toast('已新增報件');}catch(err){alert(err.message)}};
  ['filterDate','filterUnit','filterTeam','filterRole'].forEach(id=>document.getElementById(id).onchange=renderDaily);document.getElementById('clearFilters').onclick=()=>{filterDate.value='';filterUnit.value='';filterTeam.value='';filterRole.value='';renderDaily();};
  rankingType.onchange=renderRanking; exportSales.onclick=()=>exportRows('每日報件',getDailyAggRows().map(r=>({姓名:r.name,加權計績:r.contestWeighted,實收:r.twdPremium,AH:r.ahWeighted,原始加權:r.originalWeighted}))); exportRanking.onclick=()=>exportRows('排行榜',getRanking(rankingType.value)); printSales.onclick=()=>printReport('每日報件',getDailyAggRows().map(r=>[r.name,fmt(r.contestWeighted),fmt(r.twdPremium),fmt(r.ahWeighted),fmt(r.originalWeighted)]),['姓名','加權計績','實收','A&H','原始加權']); archiveNow.onclick=archiveCompetition;
  appIconFile.onchange=e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{state.settings.appIcon=ev.target.result;save();applyTheme();toast('App 圖示已更新；iPhone 請刪除舊捷徑後重新加入主畫面');};reader.readAsDataURL(file);}; removeAppIcon.onclick=()=>{state.settings.appIcon='';save();applyTheme();toast('已恢復預設圖示');}; saveTheme.onclick=saveThemeSettings; defaultTheme.onclick=()=>{state.settings.theme=JSON.parse(JSON.stringify(demo.settings.theme));save();applyTheme();};
}
function weightText(w){return Number(w)>=1?`${Number(w)*100}%`:`${Number(w)*100}%`;}
function renderAll(){renderDashboard();renderDaily();renderRanking();renderHistory();fillSelects();}
function salesOn(date=today()){return state.sales.filter(s=>s.date===date)}
function sum(arr,key){return arr.reduce((a,b)=>a+(Number(b[key])||0),0)}
function renderDashboard(){
  competitionSubtitle.textContent=`${state.settings.banner}｜${state.settings.period}`;
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
  const me=state.users.find(u=>u.name==='張永朋')||state.users[0];
  renderCompetitionProgress(me);
  renderBonus(mySales); renderTop5(); renderLatest(); applyDashboardWidgets(); renderCustomDashboardCards();
}
function competitionSales(c,user){
  return state.sales.filter(s=>s.userName===user?.name&&(!c.start||s.date>=c.start)&&(!c.end||s.date<=c.end));
}
function competitionMetricValue(metric,sales){
  return metric==='weighted'?sum(sales,'contestWeighted'):metric==='premium'?sum(sales,'twdPremium'):metric==='ah'?sum(sales,'ahWeighted'):0;
}
function competitionTarget(c,role,metric){
  return Number(c.targets?.[role]?.[metric]??c.targets?.['全員']?.[metric]??0);
}
function competitionStatus(c,user){
  const sales=competitionSales(c,user); const rows=[];
  ['weighted','premium','ah'].forEach(metric=>{if(!c.metrics?.[metric]?.enabled)return;const target=competitionTarget(c,user?.role,metric);const done=c.manualEnabled?Number(c.manualValues?.[metric]||0):competitionMetricValue(metric,sales);rows.push({metric,target,done,configured:target>0,rate:target?Math.min(done/target*100,100):0,met:target>0&&done>=target});});
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
function renderBonus(mySales){
  const me=state.users.find(u=>u.name==='張永朋')||state.users[0];
  bonusCards.innerHTML=state.bonus.filter(b=>b.active!==false).slice(0,6).map(b=>{
    const result=bonusValue(b,mySales,me); if(!result.eligible)return '';
    const val=result.value, unit=b.metric==='count'?'件':''; const rate=Number(b.target)?Math.min(val/Number(b.target)*100,100):0;
    const filters=[b.category,b.ahOnly?'A&H':'',b.protectionOnly?'保障型':'',b.products||b.product].filter(Boolean).join('｜')||'全部業績';
    return `<div class="bonus-item"><b>${escapeHtml(b.name)}</b><div class="bonus-line"><span>${b.start||'不限'}～${b.deadline||'不限'}</span><span>獎金 $${fmt(b.amount)}</span></div><div class="bonus-line"><span>${bonusMetricLabel(b.metric)}｜${escapeHtml(filters)}</span><span>${fmt(val)}${unit} / ${fmt(b.target)}${unit}</span></div><div class="progress small"><i style="width:${rate}%"></i></div><div class="bonus-line"><span>達成率 ${rate.toFixed(1)}%</span><span class="danger">還差 ${fmt(Math.max(Number(b.target)-val,0))}${unit}</span></div></div>`
  }).join('')||'<p class="empty">尚未設定適用的獎勵活動</p>';
}
function renderTop5(){const rows=getRanking(rankMode).slice(0,5);top5Rows.innerHTML=rows.map((r,i)=>`<tr><td>${i<3?'👑 ':''}${i+1}</td><td>${r.name}</td><td class="num">${fmt(r.contestWeighted)}</td></tr>`).join('')||'<tr><td colspan="3" class="empty">尚無資料</td></tr>';}
function renderLatest(){latestRows.innerHTML=salesOn(today()).slice(0,5).map(s=>`<tr><td>${new Date(s.createdAt).toLocaleTimeString('zh-TW',{hour:'2-digit',minute:'2-digit'})}</td><td>${s.userName}</td><td>${s.productName}</td><td class="num">${fmt(s.contestWeighted)}</td></tr>`).join('')||'<tr><td colspan="4" class="empty">今日尚無報件</td></tr>';}
function aggregate(arr,key){const map=new Map();arr.forEach(s=>{const name=s[key]||'未分類';const r=map.get(name)||{name,twdPremium:0,originalWeighted:0,contestWeighted:0,ahWeighted:0,count:0};r.twdPremium+=s.twdPremium;r.originalWeighted+=s.originalWeighted;r.contestWeighted+=s.contestWeighted;r.ahWeighted+=s.ahWeighted;r.count++;map.set(name,r)});return [...map.values()];}
function getRanking(type='person'){const key={person:'userName',unit:'unit',team:'team',group:'group',role:'role',product:'productName'}[type]||'userName';return aggregate(state.sales,key).sort((a,b)=>b.contestWeighted-a.contestWeighted);}
function getDailyFiltered(){return state.sales.filter(s=>(!filterDate.value||s.date===filterDate.value)&&(!filterUnit.value||s.unit===filterUnit.value)&&(!filterTeam.value||s.team===filterTeam.value)&&(!filterRole.value||s.role===filterRole.value));}
function getDailyAggRows(){return aggregate(getDailyFiltered(),'userName').sort((a,b)=>b.contestWeighted-a.contestWeighted)}
function renderDaily(){const rows=getDailyAggRows();dailyRows.innerHTML=rows.map(r=>`<tr><td>${r.name}</td><td class="num">${fmt(r.contestWeighted)}</td><td class="num">${fmt(r.twdPremium)}</td><td class="num">${fmt(r.ahWeighted)}</td><td class="num">${fmt(r.originalWeighted)}</td><td><button class="edit" onclick="showPersonDetail('${r.name}')">明細</button></td></tr>`).join('')||'<tr><td colspan="6" class="empty">查詢完請恢復空格</td></tr>';sumWeighted.textContent=fmt(sum(rows,'contestWeighted'));sumPremium.textContent=fmt(sum(rows,'twdPremium'));sumAH.textContent=fmt(sum(rows,'ahWeighted'));sumOriginal.textContent=fmt(sum(rows,'originalWeighted'));}
function renderRanking(){const rows=getRanking(rankingType.value);rankingRows.innerHTML=rows.map((r,i)=>`<tr><td>${i+1}</td><td>${r.name}</td><td class="num">${fmt(r.twdPremium)}</td><td class="num">${fmt(r.originalWeighted)}</td><td class="num">${fmt(r.ahWeighted)}</td><td class="num"><b>${fmt(r.contestWeighted)}</b></td></tr>`).join('')||'<tr><td colspan="6" class="empty">尚無資料</td></tr>';}
function showPersonDetail(name){const rows=state.sales.filter(s=>s.userName===name).map(s=>`${s.date}｜${s.productName}｜實收 ${fmt(s.twdPremium)}｜加權 ${fmt(s.contestWeighted)}`).join('\n');alert(rows||'尚無明細');}

function renderAdmin(){document.querySelectorAll('.admin-tab').forEach(t=>t.classList.toggle('active',t.dataset.admin===currentAdmin));const p=adminPanel;if(currentAdmin==='import'){p.innerHTML=document.getElementById('importTemplate').innerHTML;bindImport();return}
  if(currentAdmin==='dashboardSettings'){renderDashboardSettings(p);return}
  if(currentAdmin==='competitions'){renderCompetitionAdmin(p);return}
  const config={people:{title:'👤 人員管理',cols:['姓名','區單位','隊伍','組別','職級'],fields:['name','unit','team','group','role'],data:'users'},products:{title:'📦 商品管理',cols:['商品','代碼','年期','幣別','大類','次類','保障型','主/附約','原始加權','競賽加權','A&H'],fields:['name','code','year','currency','category','subcategory','protection','mainRider','originalWeight','contestWeight','ah'],data:'products'},rates:{title:'💵 匯率管理',cols:['年度','月份','美金匯率'],fields:['year','month','usd'],data:'rates'},bonus:{title:'🎁 獎勵活動',cols:['名稱','開始','結束','計算方式','目標','獎金','商品大類','指定商品','A&H','保障型','適用職級'],fields:['name','start','deadline','metric','target','amount','category','products','ahOnly','protectionOnly','roles'],data:'bonus'}}[currentAdmin];
  const data=state[config.data]||[];
  const peopleToolbar=currentAdmin==='people'?`<div class="admin-tools"><input id="peopleSearch" placeholder="搜尋姓名／區單位／隊伍／組別／職級"><button type="button" id="quickPeopleImport">匯入人員 Excel</button><button type="button" id="clearPeopleSearch" class="edit">清除</button></div><div class="summary-row"><span>人員 ${state.users.length} 位</span><span>區單位 ${new Set(state.users.map(x=>x.unit).filter(Boolean)).size} 個</span><span>隊伍 ${new Set(state.users.map(x=>x.team).filter(Boolean)).size} 個</span><span>組別 ${new Set(state.users.map(x=>x.group).filter(Boolean)).size} 個</span></div>`:'';
  const productToolbar=currentAdmin==='products'?`<div class="admin-tools"><input id="productSearch" placeholder="搜尋商品名稱／代碼／年期／幣別"><select id="productCurrencyFilter"><option value="">全部幣別</option><option value="TWD">台幣 TWD</option><option value="USD">美金 USD</option></select><button type="button" id="quickProductImport">匯入商品 Excel</button><button type="button" id="clearProductSearch" class="edit">清除</button></div><div class="summary-row"><span>商品 ${state.products.length} 項</span><span>台幣 ${state.products.filter(x=>x.currency==='TWD').length} 項</span><span>美金 ${state.products.filter(x=>x.currency==='USD').length} 項</span><span>A&H ${state.products.filter(x=>x.ah).length} 項</span></div>`:'';
  p.innerHTML=`<div class="section-head"><h2>${config.title}</h2><div><button onclick="exportRows('${config.title}',state['${config.data}'])">匯出 Excel</button></div></div>${peopleToolbar}${productToolbar}<form class="admin-form" id="adminForm">${config.fields.map(f=>inputFor(f)).join('')}<button id="adminSubmitBtn">新增</button><button type="button" id="adminCancelEdit" class="edit" style="display:none">取消編輯</button></form><table><thead><tr>${config.cols.map(c=>`<th>${c}</th>`).join('')}<th>操作</th></tr></thead><tbody id="adminRows">${renderAdminRows(data,config)}</tbody></table>`;
  if(currentAdmin==='people'){bindPeopleTools(config)}
  if(currentAdmin==='products'){bindProductTools(config)}
  adminForm.dataset.editId='';
  adminCancelEdit.onclick=()=>{adminForm.reset();adminForm.dataset.editId='';adminSubmitBtn.textContent='新增';adminCancelEdit.style.display='none'};
  adminForm.onsubmit=e=>{e.preventDefault();const fd=new FormData(adminForm);const obj={id:adminForm.dataset.editId||uid(),active:true};config.fields.forEach(f=>{let v=fd.get(f); if(['originalWeight','contestWeight'].includes(f)) v=parseWeight(v); else if(['year','month','usd','weightedTarget','premiumTarget','target','amount'].includes(f)) v=Number(v); else if(f==='currency') v=String(v||'TWD').toUpperCase(); else if(typeof v==='string') v=norm(v); if(['ah','protection','ahOnly','protectionOnly'].includes(f)) v=v==='true'; obj[f]=v;});
    if(adminForm.dataset.editId){const old=state[config.data].find(x=>x.id===adminForm.dataset.editId);Object.assign(old,obj,{id:old.id});log('修改主檔',`${config.title} ${obj.name||`${obj.year}/${obj.month}`||''}`);}
    else{let existing=null;if(config.data==='rates')existing=state.rates.find(x=>x.year===obj.year&&x.month===obj.month); if(config.data==='products')existing=state.products.find(x=>(x.code&&obj.code&&x.code===obj.code)||(!obj.code&&x.name===obj.name&&String(x.year)===String(obj.year))); if(existing){Object.assign(existing,obj,{id:existing.id});log('修改匯率',`${obj.year}/${obj.month} 美金匯率 ${obj.usd}`);}else{state[config.data].push(obj);log('新增主檔',`${config.title} ${obj.name||obj.year||''}`);}}
    save();fillSelects();renderAdmin();renderAll();};
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
  const roles=[...new Set(state.users.map(u=>u.role).filter(Boolean))];
  p.innerHTML=`<div class="section-head"><h2>🏆 競賽與目標管理</h2><button id="newCompetition">＋新增競賽</button></div><div class="notice">固定標準：加權保費、實收保費、A&H。新高峰與新極峰都保留實收保費；請在各職級列填入目標。可設定全部達成（AND）或任一達成（OR）。</div><div id="competitionEditor"></div><hr><div id="competitionList" class="stack"></div>`;
  const editor=p.querySelector('#competitionEditor'),list=p.querySelector('#competitionList');
  const renderList=()=>{list.innerHTML=state.competitions.map(c=>`<div class="bonus-item"><div class="bonus-line"><b>${escapeHtml(c.name)}</b><span>${c.scope==='office'?'通訊處':'個人'}｜${c.active!==false?'啟用':'停用'}｜${c.logic}</span></div><div class="bonus-line"><span>${c.start||'不限'}～${c.end||'不限'}</span><span>${Object.keys(c.targets||{}).length} 個職級</span></div><div><button class="edit" data-edit-comp="${c.id}">修改</button> <button class="delete" data-del-comp="${c.id}">刪除</button></div></div>`).join('')||'<p class="empty">尚無競賽</p>';list.querySelectorAll('[data-edit-comp]').forEach(b=>b.onclick=()=>openEditor(state.competitions.find(c=>c.id===b.dataset.editComp)));list.querySelectorAll('[data-del-comp]').forEach(b=>b.onclick=()=>{if(confirm('確定刪除競賽？')){state.competitions=state.competitions.filter(c=>c.id!==b.dataset.delComp);save();renderDashboard();renderList();}})};
  const openEditor=(source)=>{const c=normalizeCompetition(source?JSON.parse(JSON.stringify(source)):{id:uid(),name:'',scope:'personal',start:'',end:'',logic:'AND',active:true,reward:'',manualEnabled:false,manualValues:{weighted:0,premium:0,ah:0},metrics:{weighted:{enabled:true},premium:{enabled:true},ah:{enabled:false}},targets:{},extraConditions:[]});const targetRows=c.scope==='office'?['通訊處']:roles;targetRows.forEach(r=>{c.targets[r]=c.targets[r]||{weighted:0,premium:0,ah:0}});editor.innerHTML=`<form id="competitionForm"><div class="admin-form"><input name="name" placeholder="競賽／目標名稱" value="${escapeHtml(c.name)}" required><select name="scope"><option value="personal" ${c.scope!=='office'?'selected':''}>個人競賽</option><option value="office" ${c.scope==='office'?'selected':''}>通訊處進度</option></select><input name="start" type="date" value="${c.start}"><input name="end" type="date" value="${c.end}"><select name="logic"><option value="AND" ${c.logic==='AND'?'selected':''}>全部達成 AND</option><option value="OR" ${c.logic==='OR'?'selected':''}>任一達成 OR</option></select><input name="reward" placeholder="獎勵內容" value="${escapeHtml(c.reward)}"><label class="check-label"><input name="active" type="checkbox" ${c.active?'checked':''}> 啟用</label></div><h3>核心標準</h3><div class="core-metrics"><label><input type="checkbox" name="enable_weighted" ${c.metrics.weighted.enabled?'checked':''}> 加權保費</label><label><input type="checkbox" name="enable_premium" ${c.metrics.premium.enabled?'checked':''}> 實收保費</label><label><input type="checkbox" name="enable_ah" ${c.metrics.ah.enabled?'checked':''}> A&H</label></div><label class="check-label"><input type="checkbox" name="manualEnabled" ${c.manualEnabled?'checked':''}> 使用手動完成業績（特殊調整）</label><div class="admin-form"><label>手動加權<input type="number" name="manual_weighted" value="${Number(c.manualValues?.weighted||0)}"></label><label>手動實收<input type="number" name="manual_premium" value="${Number(c.manualValues?.premium||0)}"></label><label>手動 A&H<input type="number" name="manual_ah" value="${Number(c.manualValues?.ah||0)}"></label></div><div class="table-scroll"><table><thead><tr><th>${c.scope==='office'?'範圍':'職級'}</th><th>加權目標</th><th>實收目標</th><th>A&H目標</th></tr></thead><tbody>${targetRows.map(r=>`<tr><td>${escapeHtml(r)}</td><td><input type="number" step="1" data-role="${escapeHtml(r)}" data-metric="weighted" value="${Number(c.targets[r]?.weighted||0)}"></td><td><input type="number" step="1" data-role="${escapeHtml(r)}" data-metric="premium" value="${Number(c.targets[r]?.premium||0)}"></td><td><input type="number" step="1" data-role="${escapeHtml(r)}" data-metric="ah" value="${Number(c.targets[r]?.ah||0)}"></td></tr>`).join('')}</tbody></table></div><h3>其他條件（選填）</h3><div id="extraConditions"></div><button type="button" id="addExtra" class="edit">＋新增其他條件</button><div class="form-actions"><button type="submit">儲存競賽</button><button type="button" id="cancelCompetition" class="edit">取消</button></div></form>`;
    editor.querySelector('[name="scope"]').onchange=e=>{c.scope=e.target.value==='office'?'office':'personal';openEditor(c);};
    const extraBox=editor.querySelector('#extraConditions');const drawExtra=()=>{extraBox.innerHTML=(c.extraConditions||[]).map((x,i)=>`<div class="extra-condition"><input data-extra="label" data-index="${i}" placeholder="條件名稱" value="${escapeHtml(x.label||'')}"><select data-extra="metric" data-index="${i}"><option value="count" ${x.metric==='count'?'selected':''}>件數</option><option value="weighted" ${x.metric==='weighted'?'selected':''}>競賽加權</option><option value="premium" ${x.metric==='premium'?'selected':''}>實收</option><option value="ah" ${x.metric==='ah'?'selected':''}>A&H</option></select><input data-extra="target" data-index="${i}" type="number" placeholder="目標" value="${Number(x.target||0)}"><input data-extra="category" data-index="${i}" placeholder="商品大類" value="${escapeHtml(x.category||'')}"><input data-extra="products" data-index="${i}" placeholder="指定商品" value="${escapeHtml(x.products||'')}"><button type="button" class="delete" data-remove-extra="${i}">刪除</button></div>`).join('');extraBox.querySelectorAll('[data-remove-extra]').forEach(b=>b.onclick=()=>{c.extraConditions.splice(Number(b.dataset.removeExtra),1);drawExtra()});};drawExtra();editor.querySelector('#addExtra').onclick=()=>{c.extraConditions.push({label:'',metric:'count',target:0,category:'',products:'',enabled:true});drawExtra()};editor.querySelector('#cancelCompetition').onclick=()=>{editor.innerHTML=''};editor.querySelector('#competitionForm').onsubmit=e=>{e.preventDefault();const fd=new FormData(e.target);c.name=norm(fd.get('name'));c.scope=fd.get('scope')==='office'?'office':'personal';c.start=fd.get('start');c.end=fd.get('end');c.logic=fd.get('logic');c.reward=norm(fd.get('reward'));c.active=fd.get('active')==='on';c.manualEnabled=fd.get('manualEnabled')==='on';c.manualValues={weighted:Number(fd.get('manual_weighted'))||0,premium:Number(fd.get('manual_premium'))||0,ah:Number(fd.get('manual_ah'))||0};c.metrics.weighted.enabled=fd.get('enable_weighted')==='on';c.metrics.premium.enabled=fd.get('enable_premium')==='on';c.metrics.ah.enabled=fd.get('enable_ah')==='on';editor.querySelectorAll('[data-role][data-metric]').forEach(inp=>{const role=inp.dataset.role,metric=inp.dataset.metric;c.targets[role]=c.targets[role]||{};c.targets[role][metric]=Number(inp.value)||0});editor.querySelectorAll('[data-extra]').forEach(inp=>{const i=Number(inp.dataset.index);c.extraConditions[i][inp.dataset.extra]=inp.dataset.extra==='target'?Number(inp.value)||0:inp.value});const idx=state.competitions.findIndex(x=>x.id===c.id);if(idx>=0)state.competitions[idx]=c;else state.competitions.push(c);state.settings.banner=c.name||state.settings.banner;state.settings.period=`${c.start||'不限'} - ${c.end||'不限'}`;save();renderDashboard();renderList();editor.innerHTML='';toast('競賽設定已更新，首頁已同步');};};p.querySelector('#newCompetition').onclick=()=>openEditor();renderList();
}
function renderDashboardSettings(p){
  state.settings.dashboardWidgets=state.settings.dashboardWidgets||{}; state.settings.customCards=state.settings.customCards||[];
  const w=state.settings.dashboardWidgets;
  const labels={todayWeighted:'今日加權',todayPremium:'今日實收',dailyStar:'每日之星',todayCount:'今日件數',officeProgress:'通訊處進度',competitionProgress:'我的競賽進度',bonus:'我的獎勵活動',top5:'排行榜 Top 5',latest:'今日戰況'};
  p.innerHTML=`<div class="section-head"><h2>🏠 首頁設定</h2></div>
  <h3>首頁方塊顯示／隱藏</h3><div class="widget-toggle-grid">${Object.entries(labels).map(([k,l])=>`<label><input type="checkbox" data-widget="${k}" ${w[k]!==false?'checked':''}> ${l}</label>`).join('')}</div>
  <div class="notice">首頁設定只負責方塊顯示與自訂內容。通訊處進度、新高峰、新極峰及其他目標，請到「🏆 競賽與目標管理」統一管理。</div>
  <hr><h3>增加自訂方塊</h3><form id="customCardForm" class="admin-form"><input name="title" placeholder="方塊標題" required><input name="value" placeholder="主要內容／數字" required><input name="note" placeholder="補充說明"><button>新增方塊</button></form>
  <table><thead><tr><th>標題</th><th>內容</th><th>說明</th><th>操作</th></tr></thead><tbody>${state.settings.customCards.map(c=>`<tr><td>${escapeHtml(c.title)}</td><td>${escapeHtml(c.value)}</td><td>${escapeHtml(c.note)}</td><td><button class="delete" data-delete-card="${c.id}">刪除</button></td></tr>`).join('')||'<tr><td colspan="4" class="empty">尚未增加自訂方塊</td></tr>'}</tbody></table>`;
  p.querySelectorAll('[data-widget]').forEach(el=>el.onchange=()=>{state.settings.dashboardWidgets[el.dataset.widget]=el.checked;save();renderDashboard();});
  p.querySelector('#customCardForm').onsubmit=e=>{e.preventDefault();const fd=new FormData(e.target);state.settings.customCards.push({id:uid(),title:norm(fd.get('title')),value:norm(fd.get('value')),note:norm(fd.get('note'))});save();renderDashboard();renderDashboardSettings(p);toast('已新增首頁方塊');};
  p.querySelectorAll('[data-delete-card]').forEach(b=>b.onclick=()=>{state.settings.customCards=state.settings.customCards.filter(c=>c.id!==b.dataset.deleteCard);save();renderDashboard();renderDashboardSettings(p);});
}

function inputFor(f){const label={name:'名稱/姓名',unit:'區單位',team:'隊伍',group:'組別',role:'職級',code:'商品代碼',year:'年期/年度',currency:'幣別',originalWeight:'原始加權',contestWeight:'競賽加權',ah:'A&H',month:'月份',usd:'美金匯率',start:'開始日期',end:'結束日期',weightedTarget:'加權目標',premiumTarget:'實收目標',reward:'獎勵',deadline:'截止日期',metric:'計算方式',target:'目標',amount:'獎金',product:'指定商品',products:'指定商品（可多個，逗號分隔）',category:'商品大類',subcategory:'商品次類',protection:'保障型',mainRider:'主約／附約',ahOnly:'只抓 A&H',protectionOnly:'只抓保障型',roles:'適用職級（可多個）',units:'適用區單位',teams:'適用隊伍',groups:'適用組別'}[f]||f; if(f==='currency')return `<select name="${f}"><option>TWD</option><option>USD</option></select>`; if(['ah','protection','ahOnly','protectionOnly'].includes(f))return `<select name="${f}"><option value="false">否</option><option value="true">是</option></select>`; if(f==='metric')return `<select name="${f}"><option value="weighted">競賽加權</option><option value="premium">實收</option><option value="original">原始加權</option><option value="ah">A&H</option><option value="count">件數</option></select>`; if(f==='mainRider')return `<select name="${f}"><option>主約</option><option>附約</option></select>`; if(['start','end','deadline'].includes(f))return `<input name="${f}" type="date" placeholder="${label}">`; if(['originalWeight','contestWeight'].includes(f))return `<input name="${f}" placeholder="${label}，可輸入 300% / 3 / 0.05">`; if(['year','month','usd','weightedTarget','premiumTarget','target','amount'].includes(f))return `<input name="${f}" type="number" step="0.00001" placeholder="${label}">`; return `<input name="${f}" placeholder="${label}">`;}
function displayField(v,f){if(['originalWeight','contestWeight'].includes(f))return weightText(v);if(typeof v==='boolean')return v?'是':'否';if(['ahOnly','protectionOnly','protection'].includes(f))return v===true||v==='true'?'是':'否';if(f==='usd')return Number(v||0).toLocaleString('zh-TW',{minimumFractionDigits:0,maximumFractionDigits:5,useGrouping:false});if(['weightedTarget','premiumTarget','target','amount'].includes(f))return fmt(v);return v??''}
function editRow(collection,id){const row=state[collection].find(x=>x.id===id);if(!row)return;const form=document.getElementById('adminForm');form.dataset.editId=id;[...form.elements].forEach(el=>{if(!el.name)return;if(row[el.name]!==undefined)el.value=String(row[el.name]);});adminSubmitBtn.textContent='儲存修改';adminCancelEdit.style.display='inline-block';window.scrollTo({top:0,behavior:'smooth'});}
function deleteRow(collection,id){if(!confirm('確定刪除？'))return;state[collection]=state[collection].filter(x=>x.id!==id);log('刪除資料',`${collection}/${id}`);save();fillSelects();renderAdmin();renderAll();}
window.deleteRow=deleteRow; window.editRow=editRow; window.showPersonDetail=showPersonDetail;

function bindImport(){downloadTemplate.onclick=()=>downloadTemplateFile(importType.value);importFile.onchange=readImportFile;confirmImport.onclick=confirmImport;}
function readImportFile(e){const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{const wb=XLSX.read(ev.target.result,{type:'array'});const ws=wb.Sheets[wb.SheetNames[0]];pendingImport=XLSX.utils.sheet_to_json(ws,{defval:''});renderImportPreview();};reader.readAsArrayBuffer(file);}
function mapRow(row,type){const get=(...keys)=>{for(const k of keys){if(row[k]!==undefined&&row[k]!=='')return row[k]}return ''}; if(type==='people')return {id:uid(),name:norm(get('姓名','業務員','姓名(中文)')),unit:norm(get('區單位','單位')),team:norm(get('隊伍','隊名')),group:norm(get('組別','小組')),role:norm(get('職級','職稱')),active:true}; if(type==='products'){const name=norm(get('商品名稱','商品','名稱','商品名')); const code=norm(get('商品代碼','險種','險種代碼')); const category=norm(get('商品類別','類別')); const currencyRaw=norm(get('幣別','幣種')); const currency=currencyRaw||(name.includes('美元')||code.includes('(S)')||code.startsWith('U')?'USD':'TWD'); return {id:uid(),name,code,year:norm(get('年期','繳費年期','繳費年期')),currency:currency.toUpperCase(),category,subcategory:norm(get('商品次類','次類')),protection:String(get('保障型','是否保障型')).includes('是'),mainRider:norm(get('主約/附約','主附約'))||'主約',originalWeight:parseWeight(get('原始加權','原始倍率')),contestWeight:parseWeight(get('競賽加權','競賽倍率','加權')),ah:category.includes('Health')||category.includes('A&H')||String(get('A&H','AH')).includes('是'),active:true};} if(type==='rates')return {id:uid(),year:Number(get('年度','年'))||new Date().getFullYear(),month:Number(get('月份','月')),usd:Number(get('匯率','美金匯率','美元匯率'))}; if(type==='sales'){const user=state.users.find(u=>u.name===get('姓名','業務員'));const prod=state.products.find(p=>p.name===get('商品','商品名稱')||p.code===get('商品代碼','險種'));if(!user||!prod)return {error:'找不到人員或商品',raw:row};try{return createSale(toDate(get('日期','報件日')),user.id,prod.id,Number(get('保費','原始保費','實收')))}catch(err){return {error:err.message,raw:row}}} if(type==='bonus')return {id:uid(),name:get('活動名稱','名稱'),start:toDate(get('開始日期','開始')),deadline:toDate(get('截止日期','結束日期','日期')),metric:get('計算方式')||'weighted',target:Number(get('目標','達成業績')),amount:Number(get('獎金')),category:get('商品大類','商品類別'),subcategory:get('商品次類','次類'),products:get('指定商品','商品'),ahOnly:String(get('只抓A&H','A&H')).includes('是'),protectionOnly:String(get('只抓保障型','保障型')).includes('是'),roles:get('適用職級','職級'),units:get('適用區單位','區單位'),teams:get('適用隊伍','隊伍'),groups:get('適用組別','組別'),active:true}; if(type==='competitions')return {id:uid(),name:get('競賽名稱','名稱'),scope:'personal',start:toDate(get('開始日期','開始')),end:toDate(get('結束日期','結束')),role:get('職級'),weightedTarget:Number(get('加權目標')),premiumTarget:Number(get('實收目標')),ahTarget:Number(get('A&H目標','AH目標')),reward:get('獎勵')};}
function parseWeight(v){let s=String(v).replace('%','').trim();let n=Number(s);if(!n)return 0;return n>10?n/100:n}
function toDate(v){if(v instanceof Date)return v.toISOString().slice(0,10);if(typeof v==='number'){const d=XLSX.SSF.parse_date_code(v);return `${d.y}-${String(d.m).padStart(2,'0')}-${String(d.d).padStart(2,'0')}`}return String(v||today()).replaceAll('/','-')}
function renderImportPreview(){const type=importType.value;const mapped=pendingImport.map(r=>mapRow(r,type)).map(r=>(type==='products'&&!r.name)?{error:'缺少商品名稱',raw:r}:r);importPreview.innerHTML=`<h3>預覽 ${mapped.length} 筆</h3><div class="card"><table><tbody>${mapped.slice(0,8).map(r=>`<tr><td>${r.error?'⚠️ '+r.error:Object.values(r).slice(1,7).join('｜')}</td></tr>`).join('')}</tbody></table></div>`;confirmImport.disabled=!mapped.length;}
function confirmImport(){const type=importType.value;const mapped=pendingImport.map(r=>mapRow(r,type)).filter(r=>!r.error).filter(r=>type!=='people'||r.name).filter(r=>type!=='products'||r.name);const collection={people:'users',products:'products',rates:'rates',sales:'sales',bonus:'bonus',competitions:'competitions'}[type];let added=0,updated=0;mapped.forEach(item=>{let existing=null;if(type==='people')existing=state.users.find(x=>x.name===item.name);if(type==='products')existing=state.products.find(x=>(x.code&&item.code&&x.code===item.code)||(!item.code&&x.name===item.name&&String(x.year)===String(item.year)));if(type==='rates')existing=state.rates.find(x=>x.year===item.year&&x.month===item.month);if(existing){Object.assign(existing,item,{id:existing.id});updated++;}else{state[collection].push(item);added++;}});log('匯入資料',`${type} 新增 ${added} 更新 ${updated}`);if(type==='competitions')state.competitions=migrateCompetitions(state.competitions);save();fillSelects();renderAll();renderAdmin();toast(`匯入完成：新增 ${added}，更新 ${updated}`);}
function downloadTemplateFile(type){const templates={people:[{姓名:'張永朋',區單位:'素伶區',隊伍:'靛隊',組別:'永朋組',職級:'主任'}],products:[{商品名稱:'BVA',商品代碼:'BVA3',年期:'躉繳',幣別:'TWD',原始加權:'5%',競賽加權:'5%',商品類別:'ILP'},{商品名稱:'WEHS 20年',商品代碼:'20(G)WEHS',年期:'20',幣別:'TWD',原始加權:'300%',競賽加權:'300%',商品類別:'Health'}],rates:[{年度:2026,月份:7,美金匯率:31.57333}],sales:[{日期:today(),姓名:'張永朋',商品:'BVA',保費:500000}],bonus:[{活動名稱:'醫療險衝刺獎',開始日期:'2026-07-01',截止日期:'2026-07-31',計算方式:'weighted',目標:300000,獎金:5000,商品大類:'Health',指定商品:'','只抓A&H':'否',只抓保障型:'否',適用職級:'主任,業代'}],competitions:[{競賽名稱:'新高峰',開始日期:'2026-07-02',結束日期:'2026-12-15',職級:'主任',加權目標:2650000,實收目標:20000000,'A&H目標':0,獎勵:'日本關西'}]};exportRows(`${type}_template`,templates[type]);}

function exportRows(name,rows){const ws=XLSX.utils.json_to_sheet(rows);const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'資料');XLSX.writeFile(wb,`${name}.xlsx`)}
function printReport(title,rows,head){const {jsPDF}=window.jspdf;const doc=new jsPDF();doc.text(title,14,16);doc.autoTable({head:[head],body:rows,startY:24});doc.save(`${title}.pdf`)}
function archiveCompetition(){const snapshot={id:uid(),time:new Date().toLocaleString('zh-TW'),banner:state.settings.banner,ranking:getRanking('person'),sales:[...state.sales]};state.history.unshift(snapshot);log('封存競賽',snapshot.banner);save();renderHistory();toast('已封存目前競賽');}
function renderHistory(){historyList.innerHTML=state.history.map(h=>`<div class="bonus-item"><b>${h.banner}</b><div class="bonus-line"><span>${h.time}</span><span>${h.ranking.length} 人</span></div></div>`).join('')||'<p class="empty">尚無封存資料</p>';}
function applyTheme(){const t=state.settings.theme||demo.settings.theme;document.documentElement.style.setProperty('--bg',t.bg);document.documentElement.style.setProperty('--primary',t.primary);document.documentElement.style.setProperty('--text',t.text);document.documentElement.style.setProperty('--card',t.card);document.documentElement.style.setProperty('--radius',`${t.radius}px`);bgColor.value=t.bg;primaryColor.value=t.primary;textColor.value=t.text;cardColor.value=t.card;radiusRange.value=t.radius;bannerText.value=state.settings.banner;appNameInput.value=state.settings.appName||'高峰競賽';document.title=`${state.settings.appName||'高峰競賽'}｜Peak Competition Platform`;document.querySelector('meta[name="apple-mobile-web-app-title"]')?.setAttribute('content',state.settings.appName||'高峰競賽');if(state.settings.appIcon){document.querySelectorAll('link[rel="icon"],link[rel="apple-touch-icon"]').forEach(l=>l.href=state.settings.appIcon);appIconPreview.src=state.settings.appIcon;appIconPreview.style.display='block';}else{appIconPreview.style.display='none';}}

function saveThemeSettings(){state.settings.theme={bg:bgColor.value,primary:primaryColor.value,text:textColor.value,card:cardColor.value,radius:Number(radiusRange.value)};state.settings.banner=bannerText.value||state.settings.banner;state.settings.appName=appNameInput.value||'高峰競賽';save();applyTheme();renderDashboard();toast('外觀與主畫面名稱已更新');}
function quickSearch(q){document.querySelectorAll('.search-hit').forEach(x=>x.classList.remove('search-hit'));if(!q)return;const text=q.toLowerCase();[...document.querySelectorAll('td,.bonus-item,.card')].find(el=>{if(el.textContent.toLowerCase().includes(text)){el.classList.add('search-hit');el.scrollIntoView({behavior:'smooth',block:'center'});return true}})}
function toast(msg){const d=document.createElement('div');d.className='toast';d.textContent=msg;document.body.appendChild(d);setTimeout(()=>d.remove(),2200)}

init();
