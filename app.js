const LS_KEY='peakCompetitionV18';
const fmt=n=>(Number(n)||0).toLocaleString('zh-TW',{maximumFractionDigits:0});
const pct=n=>`${Math.round((Number(n)||0)*100)}%`;
const today=()=>new Date().toISOString().slice(0,10);
const monthKey=d=>String(d||today()).slice(0,7);
const uid=()=>Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4);
const norm=v=>String(v??'').trim();

const demo={
  settings:{banner:'115下半年 新高峰競賽',period:'2026/07/02 - 2026/12/15',officeTarget:40000000,officeDoneManual:0,officeManual:false,peakTargetManual:2650000,peakDoneManual:0,superTargetManual:4000000,superDoneManual:0,competitionManual:false,dashboardWidgets:{todayWeighted:true,todayPremium:true,dailyStar:true,todayCount:true,officeProgress:true,competitionProgress:true,bonus:true,top5:true,latest:true},customCards:[],theme:{bg:'#eef7ff',primary:'#1769e8',text:'#0b1b3d',card:'#ffffff',radius:18}},
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
    {id:uid(),name:'新極峰',start:'2026-07-02',end:'2026-12-15',role:'主任',weightedTarget:4000000,premiumTarget:0,reward:'新極峰'},
    {id:uid(),name:'新極峰',start:'2026-07-02',end:'2026-12-15',role:'業代',weightedTarget:3300000,premiumTarget:0,reward:'新極峰'}
  ],
  bonus:[
    {id:uid(),name:'BVA',deadline:'2026-07-15',metric:'weighted',target:3000000,amount:5000,product:'BVA',active:true},
    {id:uid(),name:'WEHS',deadline:'2026-07-31',metric:'count',target:3,amount:3000,product:'WEHS',active:true},
    {id:uid(),name:'主任活動',deadline:'2026-07-31',metric:'weighted',target:1350000,amount:10000,product:'',active:true}
  ],
  sales:[],history:[],audit:[]
};

demo.sales=[
  makeSale('2026-07-07','張永朋','BVA',500000),makeSale('2026-07-07','林志明','WEHS 20年',234160),makeSale('2026-07-07','蔡汪霖','ACUPL 10年',9950),makeSale('2026-07-07','陳澄任','WEHS 20年',99402),makeSale('2026-07-07','黃金鳳','WEHS 20年',90860),makeSale('2026-07-07','李雅萍','BVA',68000),makeSale('2026-07-06','王小明','WEHS 20年',200000),makeSale('2026-07-06','李大華','BVA',95000)
].filter(Boolean);

let state=load();
let pendingImport=[];
let rankMode='person';
let currentAdmin='people';

function load(){const raw=localStorage.getItem(LS_KEY); if(raw) return JSON.parse(raw); localStorage.setItem(LS_KEY,JSON.stringify(demo)); return JSON.parse(JSON.stringify(demo));}
function save(){
  localStorage.setItem(LS_KEY,JSON.stringify(state));
  if(window.PeakFirebaseService?.enabled){
    window.PeakFirebaseService.saveState(state).catch(err=>console.warn('Firestore 儲存失敗：',err));
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

async function init(){
  applyTheme(); bindNav(); fillSelects(); bindForms(); renderAll(); renderAdmin();
  const svc=window.PeakFirebaseService;
  if(svc && await svc.init()){
    try{
      const cloudState=await svc.loadState();
      if(cloudState){ state=cloudState; localStorage.setItem(LS_KEY,JSON.stringify(state)); }
      else { await svc.saveState(state); }
      applyTheme(); renderAll(); renderAdmin();
      toast('Firebase 雲端資料已同步');
    }catch(err){ console.warn('Firebase 同步失敗，繼續使用本機資料：',err); }
  }
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
  saveTheme.onclick=saveThemeSettings; defaultTheme.onclick=()=>{state.settings.theme=JSON.parse(JSON.stringify(demo.settings.theme));save();applyTheme();};
}
function weightText(w){return Number(w)>=1?`${Number(w)*100}%`:`${Number(w)*100}%`;}
function renderAll(){renderDashboard();renderDaily();renderRanking();renderHistory();fillSelects();}
function salesOn(date=today()){return state.sales.filter(s=>s.date===date)}
function sum(arr,key){return arr.reduce((a,b)=>a+(Number(b[key])||0),0)}
function renderDashboard(){
  competitionSubtitle.textContent=`${state.settings.banner}｜${state.settings.period}`;
  const t=salesOn(today()); todayWeighted.textContent=fmt(sum(t,'contestWeighted')); todayPremium.textContent=fmt(sum(t,'twdPremium')); todayCount.textContent=`${t.length} 件`;
  const star=[...aggregate(t,'userName')].sort((a,b)=>b.contestWeighted-a.contestWeighted)[0]; dailyStar.textContent=star?.name||'尚無'; dailyStarSub.textContent=star?`今日加權 ${fmt(star.contestWeighted)}`:'今日加權第一名';
  const thisMonth=state.sales.filter(s=>monthKey(s.date)===monthKey(today()));
  const autoOfficeDone=sum(thisMonth,'contestWeighted'); const done=state.settings.officeManual?Number(state.settings.officeDoneManual||0):autoOfficeDone; const target=Number(state.settings.officeTarget)||0;
  officeTarget.textContent=fmt(target); officeDone.textContent=fmt(done); officeRemain.textContent=fmt(Math.max(target-done,0)); officeRate.textContent=pct(target?done/target:0); officeBar.style.width=`${Math.min(target?done/target*100:0,100)}%`;
  const me=state.users.find(u=>u.name==='張永朋')||state.users[0]; const mySales=thisMonth.filter(s=>s.userName===me?.name); const autoMyDone=sum(mySales,'contestWeighted');
  const myDone=state.settings.competitionManual?Number(state.settings.peakDoneManual||0):autoMyDone; const superDone=state.settings.competitionManual?Number(state.settings.superDoneManual||0):autoMyDone;
  const pTarget=state.settings.competitionManual?Number(state.settings.peakTargetManual||0):((state.competitions.find(c=>c.name==='新高峰'&&c.role===me?.role)?.weightedTarget)||2650000);
  const sTarget=state.settings.competitionManual?Number(state.settings.superTargetManual||0):((state.competitions.find(c=>c.name==='新極峰'&&c.role===me?.role)?.weightedTarget)||4000000);
  peakRate.textContent=pct(pTarget?myDone/pTarget:0); peakBar.style.width=`${Math.min(pTarget?myDone/pTarget*100:0,100)}%`; peakRemain.textContent=`還差 ${fmt(Math.max(pTarget-myDone,0))}`;
  superRate.textContent=pct(sTarget?superDone/sTarget:0); superBar.style.width=`${Math.min(sTarget?superDone/sTarget*100:0,100)}%`; superRemain.textContent=`還差 ${fmt(Math.max(sTarget-superDone,0))}`;
  renderBonus(mySales); renderTop5(); renderLatest(); applyDashboardWidgets(); renderCustomDashboardCards();
}
function renderBonus(mySales){bonusCards.innerHTML=state.bonus.filter(b=>b.active!==false).slice(0,3).map(b=>{let data=mySales;if(b.product)data=data.filter(s=>s.productName.includes(b.product));let val=b.metric==='count'?data.length:sum(data,b.metric==='premium'?'twdPremium':'contestWeighted');return `<div class="bonus-item"><b>${b.name}</b><div class="bonus-line"><span>截止 ${b.deadline}</span><span>獎金 $${fmt(b.amount)}</span></div><div class="bonus-line"><span>目標 ${fmt(b.target)}${b.metric==='count'?'件':''}</span><span class="danger">還差 ${fmt(Math.max(b.target-val,0))}${b.metric==='count'?'件':''}</span></div></div>`}).join('')||'<p class="empty">尚未設定獎勵活動</p>';}
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
  const config={people:{title:'👤 人員管理',cols:['姓名','區單位','隊伍','組別','職級'],fields:['name','unit','team','group','role'],data:'users'},products:{title:'📦 商品管理',cols:['商品','代碼','年期','幣別','原始加權','競賽加權','A&H'],fields:['name','code','year','currency','originalWeight','contestWeight','ah'],data:'products'},rates:{title:'💵 匯率管理',cols:['年度','月份','美金匯率'],fields:['year','month','usd'],data:'rates'},competitions:{title:'🏆 競賽管理',cols:['競賽','開始','結束','職級','加權目標','實收目標','獎勵'],fields:['name','start','end','role','weightedTarget','premiumTarget','reward'],data:'competitions'},bonus:{title:'🎁 獎勵活動',cols:['名稱','截止日期','計算方式','目標','獎金','指定商品'],fields:['name','deadline','metric','target','amount','product'],data:'bonus'}}[currentAdmin];
  const data=state[config.data]||[];
  const peopleToolbar=currentAdmin==='people'?`<div class="admin-tools"><input id="peopleSearch" placeholder="搜尋姓名／區單位／隊伍／組別／職級"><button type="button" id="quickPeopleImport">匯入人員 Excel</button><button type="button" id="clearPeopleSearch" class="edit">清除</button></div><div class="summary-row"><span>人員 ${state.users.length} 位</span><span>區單位 ${new Set(state.users.map(x=>x.unit).filter(Boolean)).size} 個</span><span>隊伍 ${new Set(state.users.map(x=>x.team).filter(Boolean)).size} 個</span><span>組別 ${new Set(state.users.map(x=>x.group).filter(Boolean)).size} 個</span></div>`:'';
  const productToolbar=currentAdmin==='products'?`<div class="admin-tools"><input id="productSearch" placeholder="搜尋商品名稱／代碼／年期／幣別"><select id="productCurrencyFilter"><option value="">全部幣別</option><option value="TWD">台幣 TWD</option><option value="USD">美金 USD</option></select><button type="button" id="quickProductImport">匯入商品 Excel</button><button type="button" id="clearProductSearch" class="edit">清除</button></div><div class="summary-row"><span>商品 ${state.products.length} 項</span><span>台幣 ${state.products.filter(x=>x.currency==='TWD').length} 項</span><span>美金 ${state.products.filter(x=>x.currency==='USD').length} 項</span><span>A&H ${state.products.filter(x=>x.ah).length} 項</span></div>`:'';
  p.innerHTML=`<div class="section-head"><h2>${config.title}</h2><div><button onclick="exportRows('${config.title}',state['${config.data}'])">匯出 Excel</button></div></div>${peopleToolbar}${productToolbar}<form class="admin-form" id="adminForm">${config.fields.map(f=>inputFor(f)).join('')}<button id="adminSubmitBtn">新增</button><button type="button" id="adminCancelEdit" class="edit" style="display:none">取消編輯</button></form><table><thead><tr>${config.cols.map(c=>`<th>${c}</th>`).join('')}<th>操作</th></tr></thead><tbody id="adminRows">${renderAdminRows(data,config)}</tbody></table>`;
  if(currentAdmin==='people'){bindPeopleTools(config)}
  if(currentAdmin==='products'){bindProductTools(config)}
  adminForm.dataset.editId='';
  adminCancelEdit.onclick=()=>{adminForm.reset();adminForm.dataset.editId='';adminSubmitBtn.textContent='新增';adminCancelEdit.style.display='none'};
  adminForm.onsubmit=e=>{e.preventDefault();const fd=new FormData(adminForm);const obj={id:adminForm.dataset.editId||uid(),active:true};config.fields.forEach(f=>{let v=fd.get(f); if(['originalWeight','contestWeight'].includes(f)) v=parseWeight(v); else if(['year','month','usd','weightedTarget','premiumTarget','target','amount'].includes(f)) v=Number(v); else if(f==='currency') v=String(v||'TWD').toUpperCase(); else if(typeof v==='string') v=norm(v); if(f==='ah') v=v==='true'; obj[f]=v;});
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
  const map={todayWeighted:todayWeighted.closest('.kpi'),todayPremium:todayPremium.closest('.kpi'),dailyStar:dailyStar.closest('.kpi'),todayCount:todayCount.closest('.kpi'),officeProgress:officeTarget.closest('.card'),competitionProgress:peakRate.closest('.card'),bonus:bonusCards.closest('.card'),top5:top5Rows.closest('.card'),latest:latestRows.closest('.card')};
  Object.entries(map).forEach(([key,el])=>{if(el)el.style.display=w[key]===false?'none':''});
}
function renderCustomDashboardCards(){
  const box=document.getElementById('customDashboardCards'); if(!box)return;
  box.innerHTML=(state.settings.customCards||[]).map(c=>`<article class="card custom-dashboard-card"><h2>${escapeHtml(c.title||'自訂資訊')}</h2><strong>${escapeHtml(c.value||'')}</strong><small>${escapeHtml(c.note||'')}</small></article>`).join('');
  box.style.display=box.children.length?'grid':'none';
}
function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));}
function renderDashboardSettings(p){
  state.settings.dashboardWidgets=state.settings.dashboardWidgets||{}; state.settings.customCards=state.settings.customCards||[];
  const w=state.settings.dashboardWidgets;
  const labels={todayWeighted:'今日加權',todayPremium:'今日實收',dailyStar:'每日之星',todayCount:'今日件數',officeProgress:'通訊處進度',competitionProgress:'我的競賽進度',bonus:'我的獎勵活動',top5:'排行榜 Top 5',latest:'今日戰況'};
  p.innerHTML=`<div class="section-head"><h2>🏠 首頁設定</h2></div>
  <h3>首頁方塊顯示／隱藏</h3><div class="widget-toggle-grid">${Object.entries(labels).map(([k,l])=>`<label><input type="checkbox" data-widget="${k}" ${w[k]!==false?'checked':''}> ${l}</label>`).join('')}</div>
  <hr><h3>通訊處進度</h3><div class="admin-form"><label>本月目標<input id="officeTargetSetting" type="number" value="${Number(state.settings.officeTarget||0)}"></label><label>已完成（手動）<input id="officeDoneSetting" type="number" value="${Number(state.settings.officeDoneManual||0)}"></label><label class="check-label"><input id="officeManualSetting" type="checkbox" ${state.settings.officeManual?'checked':''}> 使用手動已完成業績</label></div>
  <hr><h3>我的競賽業績</h3><div class="admin-form"><label>新高峰目標<input id="peakTargetSetting" type="number" value="${Number(state.settings.peakTargetManual||0)}"></label><label>新高峰已完成<input id="peakDoneSetting" type="number" value="${Number(state.settings.peakDoneManual||0)}"></label><label>新極峰目標<input id="superTargetSetting" type="number" value="${Number(state.settings.superTargetManual||0)}"></label><label>新極峰已完成<input id="superDoneSetting" type="number" value="${Number(state.settings.superDoneManual||0)}"></label><label class="check-label"><input id="competitionManualSetting" type="checkbox" ${state.settings.competitionManual?'checked':''}> 使用手動競賽業績</label></div>
  <button id="saveDashboardSettings">儲存首頁設定</button>
  <hr><h3>增加自訂方塊</h3><form id="customCardForm" class="admin-form"><input name="title" placeholder="方塊標題" required><input name="value" placeholder="主要內容／數字" required><input name="note" placeholder="補充說明"><button>新增方塊</button></form>
  <table><thead><tr><th>標題</th><th>內容</th><th>說明</th><th>操作</th></tr></thead><tbody>${state.settings.customCards.map(c=>`<tr><td>${escapeHtml(c.title)}</td><td>${escapeHtml(c.value)}</td><td>${escapeHtml(c.note)}</td><td><button class="delete" data-delete-card="${c.id}">刪除</button></td></tr>`).join('')||'<tr><td colspan="4" class="empty">尚未增加自訂方塊</td></tr>'}</tbody></table>`;
  p.querySelectorAll('[data-widget]').forEach(el=>el.onchange=()=>{state.settings.dashboardWidgets[el.dataset.widget]=el.checked;save();renderDashboard();});
  p.querySelector('#saveDashboardSettings').onclick=()=>{state.settings.officeTarget=Number(officeTargetSetting.value)||0;state.settings.officeDoneManual=Number(officeDoneSetting.value)||0;state.settings.officeManual=officeManualSetting.checked;state.settings.peakTargetManual=Number(peakTargetSetting.value)||0;state.settings.peakDoneManual=Number(peakDoneSetting.value)||0;state.settings.superTargetManual=Number(superTargetSetting.value)||0;state.settings.superDoneManual=Number(superDoneSetting.value)||0;state.settings.competitionManual=competitionManualSetting.checked;save();renderDashboard();toast('首頁設定已儲存');};
  p.querySelector('#customCardForm').onsubmit=e=>{e.preventDefault();const fd=new FormData(e.target);state.settings.customCards.push({id:uid(),title:norm(fd.get('title')),value:norm(fd.get('value')),note:norm(fd.get('note'))});save();renderDashboard();renderDashboardSettings(p);toast('已新增首頁方塊');};
  p.querySelectorAll('[data-delete-card]').forEach(b=>b.onclick=()=>{state.settings.customCards=state.settings.customCards.filter(c=>c.id!==b.dataset.deleteCard);save();renderDashboard();renderDashboardSettings(p);});
}

function inputFor(f){const label={name:'名稱/姓名',unit:'區單位',team:'隊伍',group:'組別',role:'職級',code:'商品代碼',year:'年期/年度',currency:'幣別',originalWeight:'原始加權',contestWeight:'競賽加權',ah:'A&H',month:'月份',usd:'美金匯率',start:'開始日期',end:'結束日期',weightedTarget:'加權目標',premiumTarget:'實收目標',reward:'獎勵',deadline:'截止日期',metric:'計算方式',target:'目標',amount:'獎金',product:'指定商品'}[f]||f; if(f==='currency')return `<select name="${f}"><option>TWD</option><option>USD</option></select>`; if(f==='ah')return `<select name="${f}"><option value="false">否</option><option value="true">是</option></select>`; if(f==='metric')return `<select name="${f}"><option value="weighted">加權</option><option value="premium">實收</option><option value="count">件數</option></select>`; if(['start','end','deadline'].includes(f))return `<input name="${f}" type="date" placeholder="${label}">`; if(['originalWeight','contestWeight'].includes(f))return `<input name="${f}" placeholder="${label}，可輸入 300% / 3 / 0.05">`; if(['year','month','usd','weightedTarget','premiumTarget','target','amount'].includes(f))return `<input name="${f}" type="number" step="0.00001" placeholder="${label}">`; return `<input name="${f}" placeholder="${label}">`;}
function displayField(v,f){if(['originalWeight','contestWeight'].includes(f))return weightText(v);if(typeof v==='boolean')return v?'是':'否';if(f==='usd')return Number(v||0).toLocaleString('zh-TW',{minimumFractionDigits:0,maximumFractionDigits:5,useGrouping:false});if(['weightedTarget','premiumTarget','target','amount'].includes(f))return fmt(v);return v??''}
function editRow(collection,id){const row=state[collection].find(x=>x.id===id);if(!row)return;const form=document.getElementById('adminForm');form.dataset.editId=id;[...form.elements].forEach(el=>{if(!el.name)return;if(row[el.name]!==undefined)el.value=String(row[el.name]);});adminSubmitBtn.textContent='儲存修改';adminCancelEdit.style.display='inline-block';window.scrollTo({top:0,behavior:'smooth'});}
function deleteRow(collection,id){if(!confirm('確定刪除？'))return;state[collection]=state[collection].filter(x=>x.id!==id);log('刪除資料',`${collection}/${id}`);save();fillSelects();renderAdmin();renderAll();}
window.deleteRow=deleteRow; window.editRow=editRow; window.showPersonDetail=showPersonDetail;

function bindImport(){downloadTemplate.onclick=()=>downloadTemplateFile(importType.value);importFile.onchange=readImportFile;confirmImport.onclick=confirmImport;}
function readImportFile(e){const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>{const wb=XLSX.read(ev.target.result,{type:'array'});const ws=wb.Sheets[wb.SheetNames[0]];pendingImport=XLSX.utils.sheet_to_json(ws,{defval:''});renderImportPreview();};reader.readAsArrayBuffer(file);}
function mapRow(row,type){const get=(...keys)=>{for(const k of keys){if(row[k]!==undefined&&row[k]!=='')return row[k]}return ''}; if(type==='people')return {id:uid(),name:norm(get('姓名','業務員','姓名(中文)')),unit:norm(get('區單位','單位')),team:norm(get('隊伍','隊名')),group:norm(get('組別','小組')),role:norm(get('職級','職稱')),active:true}; if(type==='products'){const name=norm(get('商品名稱','商品','名稱','商品名')); const code=norm(get('商品代碼','險種','險種代碼')); const category=norm(get('商品類別','類別')); const currencyRaw=norm(get('幣別','幣種')); const currency=currencyRaw||(name.includes('美元')||code.includes('(S)')||code.startsWith('U')?'USD':'TWD'); return {id:uid(),name,code,year:norm(get('年期','繳費年期','繳費年期')),currency:currency.toUpperCase(),category,originalWeight:parseWeight(get('原始加權','原始倍率')),contestWeight:parseWeight(get('競賽加權','競賽倍率','加權')),ah:category.includes('Health')||category.includes('A&H')||String(get('A&H','AH')).includes('是'),active:true};} if(type==='rates')return {id:uid(),year:Number(get('年度','年'))||new Date().getFullYear(),month:Number(get('月份','月')),usd:Number(get('匯率','美金匯率','美元匯率'))}; if(type==='sales'){const user=state.users.find(u=>u.name===get('姓名','業務員'));const prod=state.products.find(p=>p.name===get('商品','商品名稱')||p.code===get('商品代碼','險種'));if(!user||!prod)return {error:'找不到人員或商品',raw:row};try{return createSale(toDate(get('日期','報件日')),user.id,prod.id,Number(get('保費','原始保費','實收')))}catch(err){return {error:err.message,raw:row}}} if(type==='bonus')return {id:uid(),name:get('活動名稱','名稱'),deadline:toDate(get('截止日期','日期')),metric:get('計算方式')||'weighted',target:Number(get('目標','達成業績')),amount:Number(get('獎金')),product:get('指定商品','商品'),active:true}; if(type==='competitions')return {id:uid(),name:get('競賽名稱','名稱'),start:toDate(get('開始日期','開始')),end:toDate(get('結束日期','結束')),role:get('職級'),weightedTarget:Number(get('加權目標')),premiumTarget:Number(get('實收目標')),reward:get('獎勵')};}
function parseWeight(v){let s=String(v).replace('%','').trim();let n=Number(s);if(!n)return 0;return n>10?n/100:n}
function toDate(v){if(v instanceof Date)return v.toISOString().slice(0,10);if(typeof v==='number'){const d=XLSX.SSF.parse_date_code(v);return `${d.y}-${String(d.m).padStart(2,'0')}-${String(d.d).padStart(2,'0')}`}return String(v||today()).replaceAll('/','-')}
function renderImportPreview(){const type=importType.value;const mapped=pendingImport.map(r=>mapRow(r,type)).map(r=>(type==='products'&&!r.name)?{error:'缺少商品名稱',raw:r}:r);importPreview.innerHTML=`<h3>預覽 ${mapped.length} 筆</h3><div class="card"><table><tbody>${mapped.slice(0,8).map(r=>`<tr><td>${r.error?'⚠️ '+r.error:Object.values(r).slice(1,7).join('｜')}</td></tr>`).join('')}</tbody></table></div>`;confirmImport.disabled=!mapped.length;}
function confirmImport(){const type=importType.value;const mapped=pendingImport.map(r=>mapRow(r,type)).filter(r=>!r.error).filter(r=>type!=='people'||r.name).filter(r=>type!=='products'||r.name);const collection={people:'users',products:'products',rates:'rates',sales:'sales',bonus:'bonus',competitions:'competitions'}[type];let added=0,updated=0;mapped.forEach(item=>{let existing=null;if(type==='people')existing=state.users.find(x=>x.name===item.name);if(type==='products')existing=state.products.find(x=>(x.code&&item.code&&x.code===item.code)||(!item.code&&x.name===item.name&&String(x.year)===String(item.year)));if(type==='rates')existing=state.rates.find(x=>x.year===item.year&&x.month===item.month);if(existing){Object.assign(existing,item,{id:existing.id});updated++;}else{state[collection].push(item);added++;}});log('匯入資料',`${type} 新增 ${added} 更新 ${updated}`);save();fillSelects();renderAll();renderAdmin();toast(`匯入完成：新增 ${added}，更新 ${updated}`);}
function downloadTemplateFile(type){const templates={people:[{姓名:'張永朋',區單位:'素伶區',隊伍:'靛隊',組別:'永朋組',職級:'主任'}],products:[{商品名稱:'BVA',商品代碼:'BVA3',年期:'躉繳',幣別:'TWD',原始加權:'5%',競賽加權:'5%',商品類別:'ILP'},{商品名稱:'WEHS 20年',商品代碼:'20(G)WEHS',年期:'20',幣別:'TWD',原始加權:'300%',競賽加權:'300%',商品類別:'Health'}],rates:[{年度:2026,月份:7,美金匯率:31.57333}],sales:[{日期:today(),姓名:'張永朋',商品:'BVA',保費:500000}],bonus:[{活動名稱:'BVA',截止日期:'2026-07-15',計算方式:'weighted',目標:3000000,獎金:5000,指定商品:'BVA'}],competitions:[{競賽名稱:'新高峰',開始日期:'2026-07-02',結束日期:'2026-12-15',職級:'主任',加權目標:2650000,實收目標:20000000,獎勵:'日本關西'}]};exportRows(`${type}_template`,templates[type]);}

function exportRows(name,rows){const ws=XLSX.utils.json_to_sheet(rows);const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'資料');XLSX.writeFile(wb,`${name}.xlsx`)}
function printReport(title,rows,head){const {jsPDF}=window.jspdf;const doc=new jsPDF();doc.text(title,14,16);doc.autoTable({head:[head],body:rows,startY:24});doc.save(`${title}.pdf`)}
function archiveCompetition(){const snapshot={id:uid(),time:new Date().toLocaleString('zh-TW'),banner:state.settings.banner,ranking:getRanking('person'),sales:[...state.sales]};state.history.unshift(snapshot);log('封存競賽',snapshot.banner);save();renderHistory();toast('已封存目前競賽');}
function renderHistory(){historyList.innerHTML=state.history.map(h=>`<div class="bonus-item"><b>${h.banner}</b><div class="bonus-line"><span>${h.time}</span><span>${h.ranking.length} 人</span></div></div>`).join('')||'<p class="empty">尚無封存資料</p>';}
function applyTheme(){const t=state.settings.theme||demo.settings.theme;document.documentElement.style.setProperty('--bg',t.bg);document.documentElement.style.setProperty('--primary',t.primary);document.documentElement.style.setProperty('--text',t.text);document.documentElement.style.setProperty('--card',t.card);document.documentElement.style.setProperty('--radius',`${t.radius}px`);bgColor.value=t.bg;primaryColor.value=t.primary;textColor.value=t.text;cardColor.value=t.card;radiusRange.value=t.radius;bannerText.value=state.settings.banner;}
function saveThemeSettings(){state.settings.theme={bg:bgColor.value,primary:primaryColor.value,text:textColor.value,card:cardColor.value,radius:Number(radiusRange.value)};state.settings.banner=bannerText.value||state.settings.banner;save();applyTheme();renderDashboard();toast('外觀已更新');}
function quickSearch(q){document.querySelectorAll('.search-hit').forEach(x=>x.classList.remove('search-hit'));if(!q)return;const text=q.toLowerCase();[...document.querySelectorAll('td,.bonus-item,.card')].find(el=>{if(el.textContent.toLowerCase().includes(text)){el.classList.add('search-hit');el.scrollIntoView({behavior:'smooth',block:'center'});return true}})}
function toast(msg){const d=document.createElement('div');d.className='toast';d.textContent=msg;document.body.appendChild(d);setTimeout(()=>d.remove(),2200)}

init();
