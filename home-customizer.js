(()=>{
  const defaults={
    kpis:[
      {id:'todayWeighted',icon:'📈',label:'今日加權',enabled:true},
      {id:'todayPremium',icon:'💰',label:'今日實收',enabled:true},
      {id:'todayCount',icon:'📦',label:'今日件數',enabled:true},
      {id:'dailyStar',icon:'⭐',label:'每日之星',enabled:true}
    ],
    sections:[
      {id:'kpis',label:'首頁統計卡',enabled:true,desc:'今日加權、今日實收、今日件數、每日之星'},
      {id:'shortcuts',label:'快捷功能',enabled:true,desc:'新增報件、排行榜等快速入口'},
      {id:'office',label:'通訊處進度',enabled:true,desc:'通訊處目標與目前達成進度'},
      {id:'competition',label:'我的競賽進度',enabled:true,desc:'依人員與職級顯示競賽進度'},
      {id:'bonus',label:'我的獎勵活動',enabled:true,desc:'獎勵活動與達成狀態'},
      {id:'top5',label:'排行榜 Top 5',enabled:true,desc:'個人與隊伍排行榜'},
      {id:'latest',label:'今日戰況',enabled:true,desc:'最新報件與業績動態'},
      {id:'custom',label:'自訂方塊',enabled:true,desc:'自行新增的首頁內容'}
    ],
    titleSize:30,titleBold:true
  };
  let cfg=merge(window.PeakHomeAPI?.get?.()||{});
  let dirty=false;
  let applying=false;
  let observerTimer=0;

  function merge(raw){
    const kp=Array.isArray(raw.kpis)?raw.kpis:[];
    const sec=Array.isArray(raw.sections)?raw.sections:[];
    return {
      ...defaults,...raw,
      kpis:[...kp,...defaults.kpis.filter(x=>!kp.some(y=>y.id===x.id))].map(x=>({...defaults.kpis.find(d=>d.id===x.id),...x})),
      sections:[...sec,...defaults.sections.filter(x=>!sec.some(y=>y.id===x.id))].map(x=>({...defaults.sections.find(d=>d.id===x.id),...x}))
    };
  }
  function persist(){
    try{
      window.PeakHomeAPI?.set?.(cfg);
      dirty=false;
      apply();
      updateSaveState();
      const btn=document.getElementById('saveHomeCustom');
      if(btn){
        const original=btn.textContent;
        btn.textContent='✅ 已儲存並同步';
        btn.disabled=true;
        setTimeout(()=>{btn.disabled=false;updateSaveState();},900);
      }
    }catch(error){
      console.error('儲存首頁配置失敗',error);
      const btn=document.getElementById('saveHomeCustom');
      if(btn){btn.textContent='⚠️ 儲存失敗，請再試一次';btn.disabled=false;}
    }
  }
  function markDirty(){dirty=true;updateSaveState();}
  function updateSaveState(){
    const btn=document.getElementById('saveHomeCustom');
    if(!btn)return;
    btn.classList.toggle('has-changes',dirty);
    btn.textContent=dirty?'💾 儲存首頁配置（尚未儲存）':'✅ 首頁配置已儲存';
  }
  function sameOrder(parent,elements){
    const wanted=elements.filter(Boolean);
    const current=[...parent.children].filter(el=>wanted.includes(el));
    return current.length===wanted.length && current.every((el,i)=>el===wanted[i]);
  }
  function apply(){
    if(applying)return;
    applying=true;
    try{
      const row=document.getElementById('dashboardKpiRow');
      if(row){
        const cards=[];
        cfg.kpis.forEach(item=>{
          const value=document.getElementById(item.id);const card=value?.closest('.kpi');if(!card)return;
          card.style.display=item.enabled===false?'none':'';
          const icon=card.querySelector('.icon'),label=card.querySelector('span');
          if(icon&&icon.textContent!==(item.icon||''))icon.textContent=item.icon||'';
          if(label&&label.textContent!==(item.label||''))label.textContent=item.label||'';
          cards.push(card);
        });
        if(!sameOrder(row,cards))cards.forEach(card=>row.appendChild(card));
      }
      const host=document.getElementById('dashboardSections');
      if(host){
        const sections=[];
        cfg.sections.forEach(item=>{
          const el=host.querySelector(`[data-home-section="${item.id}"]`);if(!el)return;
          el.style.display=item.enabled===false?'none':'';
          sections.push(el);
        });
        if(!sameOrder(host,sections))sections.forEach(el=>host.appendChild(el));
      }
      const h=document.getElementById('pageTitle');
      if(h){
        const size=`${cfg.titleSize}px`,weight=cfg.titleBold?'800':'500';
        if(h.style.fontSize!==size)h.style.fontSize=size;
        if(h.style.fontWeight!==weight)h.style.fontWeight=weight;
      }
      document.getElementById('cloudSyncStatus')?.classList.add('cloud-compact');
    }finally{applying=false;}
  }
  function inject(force=false){
    const panel=document.getElementById('adminPanel');if(!panel)return;
    if(force)panel.querySelector('#homeAdvanced')?.remove();
    if(panel.querySelector('#homeAdvanced'))return;
    const d=document.createElement('section');d.id='homeAdvanced';d.className='home-advanced';
    d.innerHTML=`
      <hr>
      <h3>🧩 首頁所有區塊排序</h3>
      <p class="notice sort-help">按住左側 <b>☰</b> 往上或往下拖曳。取消勾選即可隱藏該區塊。</p>
      <div id="sectionEditor" class="sortable-list" aria-label="首頁區塊排序"></div>
      <hr>
      <h3>📊 首頁統計卡管理</h3>
      <p class="notice sort-help">統計卡也能拖曳排序，並可修改名稱與圖示。</p>
      <div id="kpiEditor" class="sortable-list" aria-label="首頁統計卡排序"></div>
      <hr>
      <h3>🖋️ 平台抬頭</h3>
      <div class="home-title-editor"><label>平台名稱字體大小<select id="titleSize"><option value="24">小</option><option value="28">中</option><option value="30">大</option><option value="34">特大</option></select></label><label><input type="checkbox" id="titleBold"> 粗體</label></div>
      <div class="save-home-bar"><button type="button" id="saveHomeCustom">✅ 首頁配置已儲存</button></div>`;
    panel.appendChild(d);
    draw(d);
  }
  function draw(d){
    const se=d.querySelector('#sectionEditor');
    se.innerHTML=cfg.sections.map((x,i)=>`
      <div class="sort-card section-sort-row" data-sort-id="${escapeHtml(x.id)}" data-sort-type="section">
        <button type="button" class="drag-handle" aria-label="拖曳${escapeHtml(x.label)}" title="按住拖曳">☰</button>
        <label class="visibility-toggle" title="顯示或隱藏"><input type="checkbox" data-section-show="${i}" ${x.enabled!==false?'checked':''}><span></span></label>
        <div class="sort-card-copy"><b>${escapeHtml(x.label)}</b><small>${escapeHtml(x.desc||'可在首頁顯示或隱藏')}</small></div>
      </div>`).join('');
    const ke=d.querySelector('#kpiEditor');
    ke.innerHTML=cfg.kpis.map((x,i)=>`
      <div class="sort-card kpi-sort-row" data-sort-id="${escapeHtml(x.id)}" data-sort-type="kpi">
        <button type="button" class="drag-handle" aria-label="拖曳${escapeHtml(x.label)}" title="按住拖曳">☰</button>
        <label class="visibility-toggle" title="顯示或隱藏"><input type="checkbox" data-kpi-show="${i}" ${x.enabled!==false?'checked':''}><span></span></label>
        <input class="kpi-icon-input" data-kpi-icon="${i}" value="${escapeHtml(x.icon)}" maxlength="4" aria-label="圖示">
        <input class="kpi-label-input" data-kpi-label="${i}" value="${escapeHtml(x.label)}" aria-label="名稱">
      </div>`).join('');
    d.querySelector('#titleSize').value=String(cfg.titleSize);d.querySelector('#titleBold').checked=cfg.titleBold;

    d.querySelectorAll('[data-section-show]').forEach(x=>x.onchange=()=>{cfg.sections[+x.dataset.sectionShow].enabled=x.checked;markDirty();});
    d.querySelectorAll('[data-kpi-show]').forEach(x=>x.onchange=()=>{cfg.kpis[+x.dataset.kpiShow].enabled=x.checked;markDirty();});
    d.querySelectorAll('[data-kpi-icon]').forEach(x=>x.oninput=()=>{cfg.kpis[+x.dataset.kpiIcon].icon=x.value;markDirty();});
    d.querySelectorAll('[data-kpi-label]').forEach(x=>x.oninput=()=>{cfg.kpis[+x.dataset.kpiLabel].label=x.value;markDirty();});
    d.querySelector('#titleSize').onchange=e=>{cfg.titleSize=+e.target.value;markDirty();};
    d.querySelector('#titleBold').onchange=e=>{cfg.titleBold=e.target.checked;markDirty();};
    d.querySelector('#saveHomeCustom').onclick=()=>persist();

    enableSortable(se,'section');
    enableSortable(ke,'kpi');
    updateSaveState();
  }

  function enableSortable(list,type){
    if(!list)return;
    let active=null,startY=0,lastY=0,placeholder=null,raf=0;
    const getRows=()=>[...list.querySelectorAll('.sort-card:not(.drag-placeholder)')];
    const syncOrder=()=>{
      const ids=getRows().map(row=>row.dataset.sortId);
      const source=type==='section'?cfg.sections:cfg.kpis;
      const map=new Map(source.map(x=>[x.id,x]));
      const ordered=ids.map(id=>map.get(id)).filter(Boolean);
      source.forEach(x=>{if(!ids.includes(x.id))ordered.push(x);});
      if(type==='section')cfg.sections=ordered;else cfg.kpis=ordered;
      markDirty();
    };
    const cleanup=()=>{
      if(!active)return;
      active.classList.remove('is-dragging');
      active.style.transform='';active.style.width='';active.style.position='';active.style.zIndex='';
      placeholder?.replaceWith(active);
      placeholder=null;
      document.body.classList.remove('home-sort-active');
      try{active.releasePointerCapture?.(active._pointerId);}catch(_){ }
      active=null;
      syncOrder();
    };
    list.addEventListener('pointerdown',e=>{
      const handle=e.target.closest('.drag-handle');if(!handle)return;
      const row=handle.closest('.sort-card');if(!row)return;
      e.preventDefault();
      active=row;active._pointerId=e.pointerId;startY=e.clientY;lastY=e.clientY;
      const rect=row.getBoundingClientRect();
      placeholder=document.createElement('div');placeholder.className='sort-card drag-placeholder';placeholder.style.height=`${rect.height}px`;
      row.after(placeholder);
      row.classList.add('is-dragging');row.style.width=`${rect.width}px`;row.style.position='fixed';row.style.left=`${rect.left}px`;row.style.top=`${rect.top}px`;row.style.zIndex='9999';
      document.body.classList.add('home-sort-active');
      handle.setPointerCapture?.(e.pointerId);
    });
    list.addEventListener('pointermove',e=>{
      if(!active||e.pointerId!==active._pointerId)return;
      e.preventDefault();lastY=e.clientY;
      if(raf)return;
      raf=requestAnimationFrame(()=>{
        raf=0;
        active.style.transform=`translateY(${lastY-startY}px)`;
        const rows=[...list.querySelectorAll('.sort-card:not(.is-dragging):not(.drag-placeholder)')];
        let inserted=false;
        for(const row of rows){
          const r=row.getBoundingClientRect();
          if(lastY<r.top+r.height/2){list.insertBefore(placeholder,row);inserted=true;break;}
        }
        if(!inserted)list.appendChild(placeholder);
        const edge=70;
        if(lastY<edge)window.scrollBy({top:-12,behavior:'auto'});
        else if(lastY>window.innerHeight-edge)window.scrollBy({top:12,behavior:'auto'});
      });
    },{passive:false});
    list.addEventListener('pointerup',e=>{if(active&&e.pointerId===active._pointerId){e.preventDefault();cleanup();}});
    list.addEventListener('pointercancel',cleanup);

    // Desktop keyboard-friendly HTML drag fallback.
    list.querySelectorAll('.sort-card').forEach(row=>{
      row.draggable=true;
      row.addEventListener('dragstart',e=>{if(!e.target.closest('.drag-handle')){e.preventDefault();return;}active=row;row.classList.add('is-dragging');e.dataTransfer.effectAllowed='move';});
      row.addEventListener('dragover',e=>{e.preventDefault();if(!active||active===row)return;const r=row.getBoundingClientRect();list.insertBefore(active,e.clientY<r.top+r.height/2?row:row.nextSibling);});
      row.addEventListener('dragend',()=>{row.classList.remove('is-dragging');active=null;syncOrder();});
    });
  }
  function escapeHtml(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  window.addEventListener('load',()=>{
    cfg=merge(window.PeakHomeAPI?.get?.()||cfg);apply();
    document.querySelectorAll('.admin-tab').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.admin==='dashboardSettings')setTimeout(()=>inject(),80)}));
    const root=document.getElementById('dashboard')||document.body;
    new MutationObserver(()=>{
      clearTimeout(observerTimer);
      observerTimer=setTimeout(()=>apply(),80);
    }).observe(root,{childList:true,subtree:true});
  });
})();
