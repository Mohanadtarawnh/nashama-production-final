import { SITE, squad, fixturesSeed, groupSeed } from './data.js';

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const API_BASE = window.NASHAMA_API_BASE || '';
function escapeHTML(value) {
  return String(value ?? '')
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function setActiveNav(){
  const current = location.pathname.split('/').pop() || 'index.html';
  $$('.links a').forEach(a => { if(a.getAttribute('href') === current) a.classList.add('active'); });
}
function setupMobile(){
  const btn = $('.mobile-toggle'); const links = $('.links');
  if(btn && links) btn.addEventListener('click',()=>links.classList.toggle('open'));
}
function formatAmman(iso){
  return new Intl.DateTimeFormat('ar-JO',{dateStyle:'full',timeStyle:'short',timeZone:'Asia/Amman'}).format(new Date(iso));
}
function api(path){ return fetch(`${API_BASE}${path}`,{headers:{'Accept':'application/json'}}).then(r=>r.json()); }
function positionLabel(pos){ return ({GK:'حراس المرمى',DF:'الدفاع',MF:'الوسط',FW:'الهجوم'}[pos] || pos); }

function homePage(){
  const next = fixturesSeed[0];
  const el = $('[data-home]'); if(!el) return;
  const stars = squad.filter(p=>p.star || p.goals >= 20 || p.caps >= 80).slice(0,4);
  el.innerHTML = `
    <section class="hero">
      <div class="container hero-grid">
        <div class="hero-card">
          <span class="eyebrow">المشاركة الأولى تاريخيًا • كأس العالم 2026</span>
          <h1>النشامى في المونديال — منصة بيانات حية.</h1>
          <p>واجهة احترافية تعرض قائمة الأردن الرسمية، مباريات المجموعة J، الحالة المباشرة، الإحصائيات، وقصة التأهل — مبنية من البداية على API proxy وليس تحديثًا يدويًا.</p>
          <div class="cta-row"><a class="btn primary" href="live.html">المباشر الآن</a><a class="btn" href="squad.html">القائمة النهائية</a><a class="btn green" href="api-status.html">فحص الربط</a></div>
        </div>
        <div class="side-stack">
          <div class="panel next-match">
            <span class="pill">المباراة القادمة بتوقيت عمّان</span>
            <div class="versus"><div><div class="team-dot">AUT</div><strong>${next.homeAr}</strong></div><div class="vs">VS</div><div><div class="team-dot">JOR</div><strong>${next.awayAr}</strong></div></div>
            <p class="meta">${formatAmman(next.amman)}<br>${next.venue} — ${next.city}</p>
          </div>
          <div class="metric-grid">
            <div class="metric"><strong>${squad.length}</strong><span>لاعبًا في القائمة</span></div>
            <div class="metric"><strong>${squad.filter(p=>p.pos==='FW').length}</strong><span>مهاجمين</span></div>
            <div class="metric"><strong>${Math.max(...squad.map(p=>p.caps))}</strong><span>أعلى عدد مشاركات</span></div>
            <div class="metric"><strong>J</strong><span>المجموعة</span></div>
          </div>
        </div>
      </div>
    </section>
    <section class="section"><div class="container"><div class="section-head"><div><h2>مباريات الأردن</h2><p class="lead">جدول المجموعة مضبوط بتوقيت الأردن مع دعم التحديث من API.</p></div><a class="btn" href="fixtures.html">كل المباريات</a></div><div class="grid cols-3">${fixturesSeed.map(matchCard).join('')}</div></div></section>
    <section class="section"><div class="container"><div class="section-head"><div><h2>أبرز الأسماء</h2><p class="lead">حسب القائمة الرسمية المنشورة في قائمة FIFA.</p></div></div><div class="grid cols-4">${stars.map(playerCard).join('')}</div></div></section>
  `;
}
function matchCard(m){
  return `
    <article class="match-card">
      <div class="muted">Match ${escapeHTML(m.matchNo)} • Group ${escapeHTML(m.group)}</div>
      <h3>${escapeHTML(m.homeAr)} - ${escapeHTML(m.awayAr)}</h3>
      <p>${escapeHTML(formatAmman(m.amman))}</p>
      <p>${escapeHTML(m.venue)} — ${escapeHTML(m.city)}</p>
    </article>
  `;
}
function playerCard(p){
  return `
    <article class="player-card">
      <div class="player-top">
        <span class="number">${escapeHTML(p.no)}</span>
        <span class="pill">${escapeHTML(p.posAr)}</span>
      </div>

      <h3>${escapeHTML(p.nameAr)}</h3>

      <p>${escapeHTML(p.club)} (${escapeHTML(p.country)})</p>

      <div class="mini-stats">
        <span>${escapeHTML(p.caps)} مباراة</span>
        <span>${escapeHTML(p.goals)} هدف</span>
        <span>${escapeHTML(p.height)} سم</span>
      </div>
    </article>
  `;
}

function squadPage(){
  const root = $('[data-squad]'); if(!root) return;
  root.innerHTML = `<div class="filters"><input class="search" id="q" placeholder="ابحث باسم اللاعب أو النادي..."><select class="select" id="pos"><option value="all">كل المراكز</option><option value="GK">حراس المرمى</option><option value="DF">الدفاع</option><option value="MF">الوسط</option><option value="FW">الهجوم</option></select></div><div id="squadGrid" class="grid cols-4"></div>`;
  const grid = $('#squadGrid'), q = $('#q'), pos = $('#pos');
  const render = () => {
    const term = q.value.trim().toLowerCase();
    const filtered = squad.filter(p => (pos.value==='all'||p.pos===pos.value) && [p.name,p.nameAr,p.club,p.shirt].join(' ').toLowerCase().includes(term));
    grid.innerHTML = filtered.map(playerCard).join('') || '<div class="notice">لا توجد نتائج مطابقة.</div>';
  };
  q.addEventListener('input', render); pos.addEventListener('change', render); render();
}

async function fixturesPage(){
  const root = $('[data-fixtures]'); if(!root) return;
  root.innerHTML = '<div class="loader">جاري جلب المباريات من طبقة API...</div>';
  try{
    const res = await api('/api/fixtures');
    const items = res.ok && res.data?.length ? res.data : fixturesSeed;
    const src = res.liveSource || 'seed';
    root.innerHTML = `<div class="${src==='api-football'?'success':'notice'}">مصدر البيانات: ${src==='api-football'?'API-FOOTBALL مباشر':'بيانات رسمية مخزنة كاحتياط عند عدم توفر المفتاح أو عند فشل المزود'}.</div><div class="grid cols-3" style="margin-top:16px">${items.map(normalizeFixture).map(matchCard).join('')}</div>`;
  }catch(e){root.innerHTML = `<div class="error">تعذر الاتصال بالـ API.</div><div class="grid cols-3" style="margin-top:16px">${fixturesSeed.map(matchCard).join('')}</div>`;}
}
function normalizeFixture(x){
  if(x.homeAr) return x;

  const f = x.fixture || {};
  const teams = x.teams || {};

  return {
    matchNo: f.id || '',
    group: 'J',
    home: teams.home?.name || '',
    away: teams.away?.name || '',
    homeAr: teams.home?.name || 'Home',
    awayAr: teams.away?.name || 'Away',
    amman: f.date || new Date().toISOString(),
    venue: f.venue?.name || 'TBD',
    city: f.venue?.city || '',
    status: f.status?.short || ''
  };
}

async function livePage(){
  const root = $('[data-live]'); if(!root) return;
  root.innerHTML = '<div class="loader">الاتصال بالمباشر...</div>';
  try{
    const res = await api('/api/live');
    if(!res.ok || !res.data?.length){
      root.innerHTML = `<div class="notice">لا توجد مباراة مباشرة للأردن الآن. الربط مفعّل عبر API proxy، وسيظهر السكور تلقائيًا عند وجود مباراة live لدى المزود.</div>${liveBoard(null)}`;
      return;
    }
    root.innerHTML = liveBoard(res.data[0]);
  }
  catch(e){root.innerHTML = '<div class="error">فشل الاتصال بخدمة المباشر. راجع صفحة فحص الربط.</div>';}
}
function liveBoard(match){
  if(!match){
    const n = fixturesSeed[0];

    return `
      <div class="live-board">
        <div class="team">
          <h3>${escapeHTML(n.homeAr)}</h3>
          <span>${escapeHTML(n.home)}</span>
          <strong>0</strong>
        </div>

        <div class="live-center">
          <span>لم تبدأ</span>
          <p>${escapeHTML(formatAmman(n.amman))}</p>
        </div>

        <div class="team">
          <h3>${escapeHTML(n.awayAr)}</h3>
          <span>${escapeHTML(n.away)}</span>
          <strong>0</strong>
        </div>
      </div>
    `;
  }

  const h = match.teams?.home || {};
  const a = match.teams?.away || {};
  const g = match.goals || {};
  const st = match.fixture?.status || {};

  return `
    <div class="live-board">
      <div class="team">
        <h3>${escapeHTML(h.name)}</h3>
        <strong>${escapeHTML(g.home ?? 0)}</strong>
      </div>

      <div class="live-center">
        <span>${escapeHTML(st.long || 'Live')}</span>
        <p>الدقيقة: ${escapeHTML(st.elapsed ?? '--')}</p>
      </div>

      <div class="team">
        <h3>${escapeHTML(a.name)}</h3>
        <strong>${escapeHTML(g.away ?? 0)}</strong>
      </div>
    </div>
  `;
}

function statsPage(){
  const root = $('[data-stats]'); if(!root) return;
  const totalCaps = squad.reduce((s,p)=>s+p.caps,0), goals = squad.reduce((s,p)=>s+p.goals,0);
  const byPos = ['GK','DF','MF','FW'].map(pos => ({pos, label:positionLabel(pos), count:squad.filter(p=>p.pos===pos).length}));
  const topScorers = [...squad].sort((a,b)=>b.goals-a.goals).slice(0,6);
  root.innerHTML = `<div class="grid cols-4"><div class="metric"><strong>${totalCaps}</strong><span>إجمالي المشاركات الدولية</span></div><div class="metric"><strong>${goals}</strong><span>إجمالي أهداف القائمة</span></div><div class="metric"><strong>${Math.round(totalCaps/squad.length)}</strong><span>متوسط الخبرة</span></div><div class="metric"><strong>${Math.round(squad.reduce((s,p)=>s+p.height,0)/squad.length)}</strong><span>متوسط الطول سم</span></div></div><section class="section"><div class="grid cols-4">${byPos.map(x=>`<div class="card"><h3>${x.label}</h3><strong style="font-size:42px">${x.count}</strong><div class="statbar"><i style="width:${(x.count/squad.length)*100}%"></i></div></div>`).join('')}</div></section><section class="section"><h2>الهدافون في القائمة</h2><div class="table-wrap"><table><thead><tr><th>اللاعب</th><th>المركز</th><th>مباريات</th><th>أهداف</th></tr></thead><tbody>${topScorers.map(p=>`<tr><td>${p.nameAr}</td><td>${p.posAr}</td><td>${p.caps}</td><td>${p.goals}</td></tr>`).join('')}</tbody></table></div></section>`;
}
function storyPage(){
  const root=$('[data-story]'); if(!root)return;
  root.innerHTML = `<div class="timeline"><div class="timeline-item"><time>2023-2024</time><div><strong>بداية الصعود</strong><br>منتخب أكثر نضجًا، وهوية هجومية أوضح، ونجوم محترفون يقودون المرحلة.</div></div><div class="timeline-item"><time>5 يونيو 2025</time><div><strong>التأهل التاريخي</strong><br>الأردن يحسم بطاقة الظهور الأول في كأس العالم بعد فوزه على عُمان 3-0 في التصفيات.</div></div><div class="timeline-item"><time>يونيو 2026</time><div><strong>المجموعة J</strong><br>الأردن أمام النمسا، الجزائر، والأرجنتين في أول مشاركة مونديالية.</div></div></div>`;
}
async function apiStatusPage(){
  const root=$('[data-api-status]'); if(!root)return;
  root.innerHTML='<div class="loader">فحص الربط...</div>';
  try{const res=await api('/api/health');root.innerHTML=`<div class="${res.configured?'success':'notice'}"><strong>${res.configured?'الربط جاهز':'الربط البرمجي موجود لكن المفتاح غير مضبوط'}</strong><br>${res.message}</div><div class="table-wrap" style="margin-top:16px"><table><tbody><tr><th>API Provider</th><td>${res.provider}</td></tr><tr><th>Environment Key</th><td>${res.configured?'موجود':'غير موجود'}</td></tr><tr><th>Team ID</th><td>${res.teamId}</td></tr><tr><th>League ID</th><td>${res.leagueId}</td></tr><tr><th>Season</th><td>${res.season}</td></tr></tbody></table></div>`}catch(e){root.innerHTML='<div class="error">تعذر الوصول إلى /api/health. شغّل السيرفر أو انشر المشروع على Vercel.</div>'}
}

function boot(){setActiveNav();setupMobile();homePage();squadPage();fixturesPage();livePage();statsPage();storyPage();apiStatusPage();}
boot();
