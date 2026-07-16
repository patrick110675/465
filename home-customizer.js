(()=>{
  const defaults={
    kpis:[
      {id:'todayWeighted',icon:'📈',label:'今日加權',enabled:true},
      {id:'todayPremium',icon:'💰',label:'今日實收',enabled:true},
      {id:'todayCount',icon:'📦',label:'今日件數',enabled:true},
      {id:'dailyStar',icon:'⭐',label:'每日之星',enabled:true}
    ],
    sections:[
      {id:'kpis',label:'首頁統計卡',enabled:true},
      {id:'shortcuts',label:'快捷功能',enabled:true},
      {id:'office',label:'通訊處進度',enabled:true},
      {id:'competition',label:'我的競賽進度',enabled:true},
      {id:'bonus',label:'我的獎勵活動',enabled:true},
      {id:'top5',label:'排行榜 Top 5',enabled:true},
      {id:'latest',label:'今日戰況',enabled:true},
      {id:'custom',label:'自訂方塊',enabled:true}
    ],
    titleSize:30,titleBold:true
  };
  let cfg=merge(window.PeakHomeAPI?.get?.()||{});
  function merge(raw){
    const kp=Array.isArray(raw.kpis)?raw.kpis:[];
    const sec=Array.isArray(raw.sections)?raw.sections:[];
    return {
      ...defaults,...raw,
      kpis:[...kp,...defaults.kpis.filter(x=>!kp.some(y=>y.id===x.id))],
      sections:[...sec,...defaults.sections.filter(x=>!sec.some(y=>y.id===x.id))]
    };
  }
  function persist(){window.PeakHomeAPI?.set?.(cfg);apply();}
  function apply(){
    const row=document.getElementById('dashboardKpiRow');
    if(row){
      cfg.kpis.forEach(item=>{
        const value=document.getElementById(item.id);const card=value?.closest('.kpi');if(!card)return;
        card.style.display=item.enabled===false?'none':'';
        const icon=card.querySelector('.icon'),label=card.querySelector('span');
        if(icon)icon.textContent=item.icon||'';if(label)label.textContent=item.label||'';
        row.appendChild(card);
      });
    }
    const host=document.getElementById('dashboardSections');
    if(host){
      cfg.sections.forEach(item=>{
        const el=host.querySelector(`[data-home-section="${item.id}"]`);if(!el)return;
        el.style.display=item.enabled===false?'none':'';host.appendChild(el);
      });
    }
    const h=document.getElementById('pageTitle');if(h){h.style.fontSize=`${cfg.titleSize}px`;h.style.fontWeight=cfg.titleBold?'800':'500';}
    document.getElementById('cloudSyncStatus')?.classList.add('cloud-compact');
  }
  function move(arr,index,to){if(to<0||to>=arr.length)return;[arr[index],arr[to]]=[arr[to],arr[index]];persist();inject(true);}
  function jump(arr,index,to){const [x]=arr.splice(index,1);arr.splice(to,0,x);persist();inject(true);}
  function controls(type,index){return `<button type="button" data-${type}-top="${index}" title="移到最上">⤒</button><button type="button" data-${type}-up="${index}" title="上移">↑</button><button type="button" data-${type}-down="${index}" title="下移">↓</button><button type="button" data-${type}-bottom="${index}" title="移到最下">⤓</button>`;}
  function inject(force=false){
    const panel=document.getElementById('adminPanel');if(!panel)return;
    if(force)panel.querySelector('#homeAdvanced')?.remove();
    if(panel.querySelector('#homeAdvanced'))return;
    const d=document.createElement('section');d.id='homeAdvanced';d.className='home-advanced';
    d.innerHTML=`<hr><h3>🧩 首頁所有區塊排序</h3><p class="notice">首頁每一區都能顯示／隱藏、上移、下移、移到最上或最下。快捷功能整區也能放在首頁任何位置。</p><div id="sectionEditor"></div><hr><h3>📊 首頁統計卡管理</h3><p class="notice">今日加權、今日實收、今日件數、每日之星可自由選擇、改名稱、改圖示與排序。</p><div id="kpiEditor"></div><hr><h3>🖋️ 平台抬頭</h3><div class="home-title-editor"><label>平台名稱字體大小<select id="titleSize"><option value="24">小</option><option value="28">中</option><option value="30">大</option><option value="34">特大</option></select></label><label><input type="checkbox" id="titleBold"> 粗體</label></div><button type="button" id="saveHomeCustom">儲存首頁配置</button>`;
    panel.appendChild(d);
    draw(d);
  }
  function draw(d){
    const se=d.querySelector('#sectionEditor');
    se.innerHTML=cfg.sections.map((x,i)=>`<div class="custom-row section-sort-row"><span class="drag-handle">☰</span><input type="checkbox" data-section-show="${i}" ${x.enabled!==false?'checked':''}><b>${escapeHtml(x.label)}</b><span class="sort-controls">${controls('section',i)}</span></div>`).join('');
    const ke=d.querySelector('#kpiEditor');
    ke.innerHTML=cfg.kpis.map((x,i)=>`<div class="custom-row"><input type="checkbox" data-kpi-show="${i}" ${x.enabled!==false?'checked':''}><input data-kpi-icon="${i}" value="${escapeHtml(x.icon)}" maxlength="4"><input data-kpi-label="${i}" value="${escapeHtml(x.label)}"><span class="sort-controls">${controls('kpi',i)}</span></div>`).join('');
    d.querySelector('#titleSize').value=String(cfg.titleSize);d.querySelector('#titleBold').checked=cfg.titleBold;
    d.onclick=e=>{
      let m=e.target.dataset;
      for(const type of ['section','kpi']){
        const arr=type==='section'?cfg.sections:cfg.kpis;
        if(m[`${type}Top`]!==undefined)return jump(arr,+m[`${type}Top`],0);
        if(m[`${type}Up`]!==undefined)return move(arr,+m[`${type}Up`],+m[`${type}Up`]-1);
        if(m[`${type}Down`]!==undefined)return move(arr,+m[`${type}Down`],+m[`${type}Down`]+1);
        if(m[`${type}Bottom`]!==undefined)return jump(arr,+m[`${type}Bottom`],arr.length-1);
      }
    };
    d.querySelector('#saveHomeCustom').onclick=()=>{
      d.querySelectorAll('[data-section-show]').forEach(x=>cfg.sections[+x.dataset.sectionShow].enabled=x.checked);
      d.querySelectorAll('[data-kpi-show]').forEach(x=>cfg.kpis[+x.dataset.kpiShow].enabled=x.checked);
      d.querySelectorAll('[data-kpi-icon]').forEach(x=>cfg.kpis[+x.dataset.kpiIcon].icon=x.value);
      d.querySelectorAll('[data-kpi-label]').forEach(x=>cfg.kpis[+x.dataset.kpiLabel].label=x.value);
      cfg.titleSize=+d.querySelector('#titleSize').value;cfg.titleBold=d.querySelector('#titleBold').checked;
      persist();alert('首頁配置已儲存並同步');
    };
  }
  function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  window.addEventListener('load',()=>{
    cfg=merge(window.PeakHomeAPI?.get?.()||cfg);apply();
    document.querySelectorAll('.admin-tab').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.admin==='dashboardSettings')setTimeout(()=>inject(),80)}));
    new MutationObserver(()=>apply()).observe(document.getElementById('dashboard')||document.body,{childList:true,subtree:true});
  });
})();
