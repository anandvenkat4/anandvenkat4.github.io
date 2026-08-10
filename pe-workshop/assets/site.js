/* site.js — shared workshop behaviour (student-safe).
   Concept-check peer-instruction protocol, workbook (localStorage), facilitator
   toggle + inline notes rendered from script-data.js. */
(function(){
  const FAC='mlops_fac', WB='mlops_workbook';
  const esc=(s)=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/\n/g,'<br>');
  const wbGet=()=>{try{return JSON.parse(localStorage.getItem(WB))||{}}catch(e){return{}}};
  const wbSet=(o)=>localStorage.setItem(WB,JSON.stringify(o));
  const wbMark=(k,v)=>{const w=wbGet();w[k]=v;wbSet(w);};
  const facOn=()=>localStorage.getItem(FAC)==='1';
  function applyFac(){document.body.classList.toggle('fac',facOn());const b=document.getElementById('factoggle');if(b){b.classList.toggle('on',facOn());b.textContent=facOn()?'Facilitator: ON':'Facilitator';}}

  function renderNotes(){
    if(!window.SCRIPT_DATA)return;
    document.querySelectorAll('[data-notes]').forEach(el=>{
      const seg=SCRIPT_DATA.find(s=>s.id===el.getAttribute('data-notes')); if(!seg)return;
      let h=`<div class="lbl">Facilitator · ${esc(seg.title)} · ${seg.clock} · ${seg.min} min</div>`;
      h+=`<div style="font-size:12px;color:#9A6B12;margin-bottom:6px">Goal: ${esc(seg.goal)}</div>`;
      seg.beats.forEach(b=>{h+=`<div class="beat ${b.t}"><b>${b.t}</b>${esc(b.x)}</div>`;});
      el.className='facnote'; el.innerHTML=h;
    });
  }

  function wireChecks(){
    document.querySelectorAll('.check').forEach(c=>{
      const ans=c.getAttribute('data-answer'), id=c.getAttribute('data-check');
      const opts=[...c.querySelectorAll('.opt')]; let sel=null, committed=false;
      opts.forEach(o=>o.addEventListener('click',()=>{
        if(c.classList.contains('revealed'))return;
        opts.forEach(x=>x.classList.remove('sel')); o.classList.add('sel'); sel=o.getAttribute('data-opt');
      }));
      const row=document.createElement('div'); row.className='row';
      row.innerHTML='<button class="btn sm" data-r="commit">Commit</button>'+
        '<button class="btn sm turq" data-r="disc">Discuss with a neighbour</button>'+
        '<button class="btn sm" data-r="reveal" style="background:var(--ink)">Reveal answer</button>'+
        '<span class="status"></span>';
      c.appendChild(row);
      const st=row.querySelector('.status');
      row.querySelector('[data-r="commit"]').addEventListener('click',()=>{
        if(!sel){st.textContent='Pick an option first.';st.className='status';return;}
        committed=true; st.textContent=committed&&!c.dataset.round2?'Committed. Now discuss, then commit again.':'Committed again — reveal when ready.';
        c.dataset.round2=committed?'1':''; st.className='status';
      });
      row.querySelector('[data-r="disc"]').addEventListener('click',()=>{st.textContent='Turn to your neighbour: say what you picked and why. 90 seconds.';st.className='status';});
      row.querySelector('[data-r="reveal"]').addEventListener('click',()=>{
        c.classList.add('revealed');
        opts.forEach(o=>{const k=o.getAttribute('data-opt');if(k===ans)o.classList.add('correct');else if(k===sel)o.classList.add('wrong');});
        const ok=sel===ans;
        st.textContent=sel?(ok?'Correct':'Not quite — the highlighted one is right'):'Answer shown';
        st.className='status '+(ok?'ok':'no');
        if(id)wbMark('check:'+id,{picked:sel,correct:ok,at:Date.now()});
        badge();
      });
    });
  }

  function wireLabChecks(){
    document.querySelectorAll('[data-lab]').forEach(b=>{
      const id=b.getAttribute('data-lab'); const w=wbGet();
      if(w['lab:'+id]) b.classList.add('done');
      b.addEventListener('click',()=>{const done=!wbGet()['lab:'+id];wbMark('lab:'+id,done?{done:true,at:Date.now()}:false);b.classList.toggle('done',done);b.textContent=done?'✓ Marked done':b.getAttribute('data-label')||'Mark done';badge();});
    });
  }

  function badge(){const w=wbGet();const checks=Object.keys(w).filter(k=>k.startsWith('check:')&&w[k]).length;
    const el=document.getElementById('progress'); if(el)el.textContent=checks+' checks';}

  // reveal-on-scroll for .reveal blocks (no-op if IntersectionObserver missing)
  function wireReveal(){
    const els=document.querySelectorAll('.reveal'); if(!els.length) return;
    if(!('IntersectionObserver' in window)){els.forEach(e=>e.classList.add('in'));return;}
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.12});
    els.forEach(e=>io.observe(e));
  }
  // staggered pipeline strip animation
  function wirePipeAnim(){
    document.querySelectorAll('.pipe-anim').forEach(p=>{
      [...p.children].forEach((c,i)=>{c.style.animationDelay=(i*0.12)+'s';});
    });
  }

  function activeNav(){const p=location.pathname.split('/').pop()||'index.html';
    document.querySelectorAll('.navlink').forEach(a=>{if(a.getAttribute('href')===p)a.classList.add('active');});}

  // ── student identity (browser-local, no server) ──
  const STU='mlops_student';
  const studentGet=()=>{try{return JSON.parse(localStorage.getItem(STU))||null}catch(e){return null}};
  const studentSet=(o)=>localStorage.setItem(STU,JSON.stringify(o));
  function submitCode(){
    const s=studentGet()||{}, w=wbGet(); const checks={};
    Object.keys(w).filter(k=>k.startsWith('check:')).forEach(k=>checks[k.slice(6)]=w[k]&&w[k].correct?1:0);
    const labs=Object.keys(w).filter(k=>k.startsWith('lab:')&&w[k]).map(k=>k.slice(4));
    const payload={v:1,r:s.roll||'',n:s.name||'',c:checks,l:labs,q:w['quiz']||null};
    return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  }
  function injectStudentUI(){
    const nav=document.querySelector('.nav'); const badgeEl=document.getElementById('progress'); if(!nav)return;
    // Workbook link
    if(!nav.querySelector('[data-wb]')){const a=document.createElement('a');a.className='navlink';a.setAttribute('data-wb','1');a.href='my-workbook.html';a.textContent='Workbook';nav.insertBefore(a, badgeEl||null);}
    // identity chip / sign-in
    const s=studentGet(); const chip=document.createElement('span');
    if(s){chip.className='badge';chip.style.background='var(--soft)';chip.style.color='var(--coral7)';chip.textContent='● '+(s.roll||s.name||'signed in');}
    else{const a=document.createElement('a');a.className='navlink';a.href='login.html';a.textContent='Sign in';nav.insertBefore(a, badgeEl||null);return;}
    nav.insertBefore(chip, badgeEl||null);
  }

  document.addEventListener('DOMContentLoaded',()=>{
    // Student build has no script-data.js → no facilitator affordance at all.
    if(!window.SCRIPT_DATA){ localStorage.setItem(FAC,'0'); const t=document.getElementById('factoggle'); if(t)t.remove(); document.querySelectorAll('.facbar').forEach(b=>b.remove()); document.querySelectorAll('.facnote').forEach(n=>n.remove()); }
    applyFac(); renderNotes(); wireChecks(); wireLabChecks(); badge(); activeNav(); injectStudentUI(); wireReveal(); wirePipeAnim();
    const t=document.getElementById('factoggle'); if(t)t.addEventListener('click',()=>{localStorage.setItem(FAC,facOn()?'0':'1');applyFac();});
  });
  window.MLW={wbGet,wbSet,wbMark,studentGet,studentSet,submitCode};
})();
