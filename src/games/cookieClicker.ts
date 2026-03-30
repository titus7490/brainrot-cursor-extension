import * as vscode from 'vscode';

export function createCookieClickerPanel(context: vscode.ExtensionContext): vscode.WebviewPanel {
  const panel = vscode.window.createWebviewPanel(
    'brainrotCookieClicker',
    '🍪 Brainrot Cookie Clicker',
    vscode.ViewColumn.One,
    { enableScripts: true, retainContextWhenHidden: true }
  );

  panel.webview.html = getCookieClickerHtml();
  return panel;
}

function getCookieClickerHtml(): string {
  return /*html*/`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    background: #1a0a2e;
    color: #efeff1;
    height: 100vh;
    overflow: hidden;
  }
  body { display: flex; }

  .game-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    min-width: 0;
  }

  .cookie-info {
    text-align: center;
    z-index: 2;
    pointer-events: none;
  }
  .cookie-info .amount {
    font-size: 42px;
    font-weight: 800;
    background: linear-gradient(135deg, #f7971e, #ffd200);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .cookie-info .label {
    font-size: 14px;
    color: #adadb8;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
  .cookie-info .sub {
    font-size: 12px;
    color: #6a6a7a;
    margin-top: 4px;
  }
  .cookie-info .sub span { color: #8a8a9a; }

  .golden-timer {
    display: none;
    background: linear-gradient(135deg, #ffd700, #ffaa00);
    color: #1a0a2e;
    padding: 5px 14px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 12px;
    margin-top: 6px;
    z-index: 2;
    pointer-events: none;
  }
  .golden-timer.visible { display: inline-block; }

  .cookie-wrapper {
    z-index: 2;
    cursor: pointer;
    margin: 20px 0;
    flex-shrink: 0;
  }
  .cookie {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #d4943a, #8b5e28 60%, #6b4420 100%);
    box-shadow:
      0 0 40px rgba(212,148,58,0.3),
      inset 0 -8px 16px rgba(0,0,0,0.3),
      inset 0 8px 16px rgba(255,255,255,0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.08s;
    position: relative;
  }
  .cookie:hover { transform: scale(1.05); }
  .cookie:active { transform: scale(0.92); }
  .cookie.golden {
    background: radial-gradient(circle at 35% 35%, #ffd700, #ffaa00 60%, #cc8800 100%);
    box-shadow: 0 0 60px rgba(255,215,0,0.5), inset 0 -8px 16px rgba(0,0,0,0.2);
  }

  .chip {
    position: absolute;
    width: 18px; height: 14px;
    background: #5a3a18;
    border-radius: 50%;
    box-shadow: inset 0 -2px 3px rgba(0,0,0,0.3);
  }
  .chip:nth-child(1) { top: 35px; left: 55px; }
  .chip:nth-child(2) { top: 60px; right: 45px; }
  .chip:nth-child(3) { bottom: 55px; left: 70px; }
  .chip:nth-child(4) { top: 90px; left: 35px; width: 14px; height: 11px; }
  .chip:nth-child(5) { bottom: 35px; right: 55px; width: 16px; height: 12px; }
  .chip:nth-child(6) { top: 45px; left: 100px; width: 12px; height: 10px; }

  .float-text {
    position: absolute;
    font-weight: 800; font-size: 22px; color: #ffd200;
    pointer-events: none;
    animation: floatUp 1s ease-out forwards;
    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    z-index: 10;
  }
  @keyframes floatUp {
    0% { opacity: 1; transform: translateY(0) scale(1); }
    100% { opacity: 0; transform: translateY(-80px) scale(1.3); }
  }

  .particle {
    position: absolute; width: 8px; height: 8px;
    border-radius: 50%; pointer-events: none; z-index: 5;
  }
  @keyframes particleFly {
    0% { opacity: 1; transform: translate(0,0) scale(1); }
    100% { opacity: 0; transform: translate(var(--px), var(--py)) scale(0); }
  }

  .shop-panel {
    width: 320px;
    flex-shrink: 0;
    background: #12071f;
    border-left: 1px solid #2a1a4a;
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }
  .shop-header { padding: 14px 14px 0; }
  .shop-title {
    font-size: 16px; font-weight: 700; color: #ff9ff3;
    margin-bottom: 10px; text-align: center;
  }
  .shop-tabs {
    display: flex; gap: 4px; margin-bottom: 10px;
  }
  .shop-tab {
    flex: 1; padding: 7px;
    border: 1px solid #2a1a4a; border-radius: 8px;
    background: #1e0f38; color: #8a8a9a;
    cursor: pointer; font-size: 12px; font-weight: 600; text-align: center;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }
  .shop-tab:hover { border-color: #ff9ff3; color: #efeff1; }
  .shop-tab.active { background: #ff9ff3; color: #1a0a2e; border-color: #ff9ff3; }

  .shop-scroll {
    flex: 1; overflow-y: auto; padding: 0 14px;
    min-height: 0;
  }

  .upgrade-card {
    background: #1e0f38;
    border: 1px solid #2a1a4a;
    border-radius: 10px;
    padding: 10px 12px;
    margin-bottom: 6px;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
  }
  .upgrade-card:hover:not(.locked) {
    border-color: #ff9ff3;
    background: #241045;
  }
  .upgrade-card.locked { opacity: 0.35; cursor: default; }
  .upgrade-card.maxed { border-color: #feca5744; opacity: 0.55; }
  .upgrade-header {
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;
  }
  .upgrade-name { font-weight: 700; font-size: 13px; }
  .upgrade-count {
    background: #3a1a6a; border-radius: 6px; padding: 1px 7px;
    font-size: 11px; font-weight: 700; color: #ff9ff3; flex-shrink: 0;
  }
  .upgrade-desc { font-size: 11px; color: #6a6a7a; margin-bottom: 3px; }
  .upgrade-bottom { display: flex; justify-content: space-between; align-items: center; }
  .upgrade-cost { font-size: 12px; font-weight: 700; color: #ffd200; }
  .upgrade-cps { font-size: 11px; color: #8a8a9a; }

  .shop-footer { padding: 10px 14px; border-top: 1px solid #2a1a4a; }
  .achievements-title {
    font-size: 13px; font-weight: 700; color: #feca57;
    margin-bottom: 8px; text-align: center;
  }
  .achievements-wrap {
    max-height: 80px; overflow-y: auto;
    margin-bottom: 8px;
  }
  .achievement {
    display: inline-flex; align-items: center;
    background: #1e0f38; border: 1px solid #2a1a4a; border-radius: 6px;
    padding: 3px 6px; margin: 2px; font-size: 10px;
  }
  .achievement.unlocked { border-color: #feca57; background: #2a1a00; }
  .achievement.locked { opacity: 0.25; }

  .reset-btn {
    padding: 5px; border: 1px solid #ff6b6b33; border-radius: 6px;
    background: transparent; color: #ff6b6b88; font-size: 10px;
    cursor: pointer; width: 100%; transition: all 0.15s;
  }
  .reset-btn:hover { background: #ff6b6b15; color: #ff6b6b; border-color: #ff6b6b; }

  .achievement-popup {
    position: fixed; top: 16px; left: 50%;
    transform: translateX(-50%) translateY(-80px);
    background: linear-gradient(135deg, #feca57, #f7971e);
    color: #1a0a2e; padding: 10px 20px; border-radius: 10px;
    font-weight: 700; font-size: 13px; z-index: 200;
    transition: transform 0.3s ease; pointer-events: none;
  }
  .achievement-popup.visible { transform: translateX(-50%) translateY(0); }

  .bg-cookie {
    position: absolute; font-size: 36px; opacity: 0.03;
    pointer-events: none; animation: bgFloat 20s linear infinite;
  }
  @keyframes bgFloat {
    0% { transform: translateY(100vh) rotate(0deg); }
    100% { transform: translateY(-100px) rotate(360deg); }
  }

  .golden-spawn {
    position: absolute;
    width: 50px; height: 50px; border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #ffd700, #ffaa00 60%, #cc8800 100%);
    box-shadow: 0 0 24px rgba(255,215,0,0.5);
    display: flex; align-items: center; justify-content: center;
    font-size: 26px; cursor: pointer; z-index: 20;
    animation: goldenFloat 2s ease-in-out infinite alternate;
  }
  @keyframes goldenFloat {
    0% { transform: translateY(0); }
    100% { transform: translateY(-8px); }
  }
</style>
</head>
<body>
  <div class="game-area" id="gameArea">
    <div class="cookie-info">
      <div class="amount" id="cookieCount">0</div>
      <div class="label">Cookies</div>
      <div class="sub"><span id="cpsDisplay">0</span>/sec &middot; <span id="clickPower">1</span>/click</div>
    </div>
    <div class="golden-timer" id="goldenTimer"></div>

    <div class="cookie-wrapper" id="cookieWrapper">
      <div class="cookie" id="cookie">
        <div class="chip"></div><div class="chip"></div><div class="chip"></div>
        <div class="chip"></div><div class="chip"></div><div class="chip"></div>
      </div>
    </div>
  </div>

  <div class="shop-panel">
    <div class="shop-header">
      <div class="shop-title">🛒 Upgrade Shop</div>
      <div class="shop-tabs">
        <div class="shop-tab active" data-tab="buildings">🏗️ Buildings</div>
        <div class="shop-tab" data-tab="power">⚡ Click Power</div>
      </div>
    </div>
    <div class="shop-scroll" id="shopContent"></div>
    <div class="shop-footer">
      <div class="achievements-title">🏆 <span id="achieveCount">0</span>/<span id="achieveTotal">0</span></div>
      <div class="achievements-wrap" id="achievementsList"></div>
      <button class="reset-btn" id="resetBtn">Reset</button>
    </div>
  </div>

  <div class="achievement-popup" id="achievePopup"></div>

<script>
let cookies = 0, cookiesPerClick = 1, cookiesPerSecond = 0;
let totalCookies = 0, totalClicks = 0;
let goldenActive = false, goldenMultiplier = 1, goldenEndTime = 0;
let activeTab = 'buildings', shopDirty = true;

const BUILDINGS = [
  { id:'cursor',        name:'🖱️ Auto Cursor',       desc:'Clicks for you automatically',         baseCost:15,      cps:0.1,   count:0 },
  { id:'intern',        name:'👶 Coding Intern',      desc:'Writes bugs that produce cookies',     baseCost:100,     cps:1,     count:0 },
  { id:'semicolon',     name:'⌨️ Semicolon Farm',     desc:'Harvests forgotten semicolons',         baseCost:500,     cps:5,     count:0 },
  { id:'stackoverflow', name:'📚 StackOverflow Bot',  desc:'Copy-pastes cookie recipes',           baseCost:2000,    cps:20,    count:0 },
  { id:'compiler',      name:'⚙️ Cookie Compiler',    desc:'Compiles raw dough into cookies',      baseCost:7500,    cps:75,    count:0 },
  { id:'ai',            name:'🤖 AI Cookie Model',    desc:'Generates cookies with deep learning', baseCost:30000,   cps:300,   count:0 },
  { id:'quantum',       name:'⚛️ Quantum Baker',      desc:'Bakes in parallel universes',           baseCost:100000,  cps:1000,  count:0 },
  { id:'blockchain',    name:'🔗 Cookie Blockchain',  desc:'Mines cookies on the chain',           baseCost:400000,  cps:4000,  count:0 },
  { id:'singularity',   name:'🌀 Cookie Singularity', desc:'Infinite cookies from the void',       baseCost:1500000, cps:15000, count:0 },
  { id:'multiverse',    name:'🌌 Multiverse Bakery',  desc:'Bakes across all realities',           baseCost:5000000, cps:50000, count:0 },
];

const CLICK_UPGRADES = [
  { id:'click1', name:'👆 Better Finger',    desc:'+1 per click',     cost:50,       bonus:1,     bought:false },
  { id:'click2', name:'🖐️ Whole Hand',       desc:'+3 per click',     cost:300,      bonus:3,     bought:false },
  { id:'click3', name:'💪 Strong Click',      desc:'+5 per click',     cost:1500,     bonus:5,     bought:false },
  { id:'click4', name:'🔨 Hammer Click',      desc:'+15 per click',    cost:8000,     bonus:15,    bought:false },
  { id:'click5', name:'⚡ Lightning Fingers', desc:'+50 per click',    cost:50000,    bonus:50,    bought:false },
  { id:'click6', name:'🌟 Star Touch',        desc:'+150 per click',   cost:250000,   bonus:150,   bought:false },
  { id:'click7', name:'☄️ Meteor Strike',     desc:'+500 per click',   cost:1000000,  bonus:500,   bought:false },
  { id:'click8', name:'🌊 Tsunami Click',     desc:'+2000 per click',  cost:5000000,  bonus:2000,  bought:false },
  { id:'click9', name:'💥 Big Bang Click',    desc:'+10000 per click', cost:25000000, bonus:10000, bought:false },
];

const ACHIEVEMENTS = [
  { id:'first',      name:'🍪 First Cookie',      check:()=>totalClicks>=1 },
  { id:'clicker10',  name:'👆 Clicker',            check:()=>totalClicks>=10 },
  { id:'clicker100', name:'👆 Fast Clicker',       check:()=>totalClicks>=100 },
  { id:'clicker500', name:'👆 Speed Demon',        check:()=>totalClicks>=500 },
  { id:'maniac',     name:'🔥 Click Maniac',       check:()=>totalClicks>=1000 },
  { id:'hundred',    name:'💯 Century',             check:()=>totalCookies>=100 },
  { id:'thousand',   name:'🏪 Cookie Shop',        check:()=>totalCookies>=1000 },
  { id:'tenk',       name:'🏭 Cookie Factory',     check:()=>totalCookies>=10000 },
  { id:'hundredk',   name:'🌍 Cookie Empire',      check:()=>totalCookies>=100000 },
  { id:'million',    name:'🚀 Millionaire',        check:()=>totalCookies>=1000000 },
  { id:'tenmil',     name:'💎 Billionaire',        check:()=>totalCookies>=10000000 },
  { id:'buyer',      name:'🛒 First Purchase',     check:()=>BUILDINGS.some(u=>u.count>0) },
  { id:'collector',  name:'📦 Collector',           check:()=>BUILDINGS.filter(u=>u.count>0).length>=5 },
  { id:'mogul',      name:'🏛️ Cookie Mogul',       check:()=>BUILDINGS.filter(u=>u.count>0).length>=BUILDINGS.length },
  { id:'cps10',      name:'⏱️ Cookie Stream',      check:()=>cookiesPerSecond>=10 },
  { id:'cps100',     name:'⏱️ Cookie River',       check:()=>cookiesPerSecond>=100 },
  { id:'cps1000',    name:'👑 Cookie Tycoon',      check:()=>cookiesPerSecond>=1000 },
  { id:'cps10000',   name:'🌟 Cookie God',         check:()=>cookiesPerSecond>=10000 },
  { id:'golden',     name:'✨ Lucky Find',          check:()=>false },
  { id:'powerup',    name:'⚡ Power Up',            check:()=>CLICK_UPGRADES.some(u=>u.bought) },
];
let unlockedAchievements = new Set();

function fmt(n) {
  if(n>=1e15) return (n/1e15).toFixed(1)+'Qa';
  if(n>=1e12) return (n/1e12).toFixed(1)+'T';
  if(n>=1e9) return (n/1e9).toFixed(1)+'B';
  if(n>=1e6) return (n/1e6).toFixed(1)+'M';
  if(n>=1e3) return (n/1e3).toFixed(1)+'K';
  return Math.floor(n).toString();
}
function getBuildingCost(b) { return Math.ceil(b.baseCost*Math.pow(1.15,b.count)); }
function recalcCPS() { cookiesPerSecond=0; for(const b of BUILDINGS) cookiesPerSecond+=b.cps*b.count; }
function recalcClick() { cookiesPerClick=1; for(const u of CLICK_UPGRADES) if(u.bought) cookiesPerClick+=u.bonus; }

function renderShop() {
  const c = document.getElementById('shopContent');
  c.innerHTML = '';
  if (activeTab==='buildings') {
    for(const b of BUILDINGS) {
      const cost=getBuildingCost(b), locked=cookies<cost;
      const d=document.createElement('div');
      d.className='upgrade-card'+(locked?' locked':'');
      d.innerHTML='<div class="upgrade-header"><span class="upgrade-name">'+b.name+'</span><span class="upgrade-count">'+b.count+'</span></div><div class="upgrade-desc">'+b.desc+'</div><div class="upgrade-bottom"><span class="upgrade-cost">🍪 '+fmt(cost)+'</span><span class="upgrade-cps">+'+b.cps+'/s</span></div>';
      if(!locked) d.onclick=()=>{if(cookies>=getBuildingCost(b)){cookies-=getBuildingCost(b);b.count++;recalcCPS();shopDirty=true;updateDisplay();checkAchievements();}};
      c.appendChild(d);
    }
  } else {
    for(const u of CLICK_UPGRADES) {
      const locked=u.bought||cookies<u.cost;
      const d=document.createElement('div');
      d.className='upgrade-card'+(u.bought?' maxed':locked?' locked':'');
      d.innerHTML='<div class="upgrade-header"><span class="upgrade-name">'+u.name+'</span><span class="upgrade-count">'+(u.bought?'✓':'')+'</span></div><div class="upgrade-desc">'+u.desc+'</div><div class="upgrade-bottom"><span class="upgrade-cost">'+(u.bought?'OWNED':'🍪 '+fmt(u.cost))+'</span><span class="upgrade-cps">+'+u.bonus+'/click</span></div>';
      if(!locked&&!u.bought) d.onclick=()=>{if(!u.bought&&cookies>=u.cost){cookies-=u.cost;u.bought=true;recalcClick();shopDirty=true;updateDisplay();checkAchievements();}};
      c.appendChild(d);
    }
  }
  shopDirty=false;
}

function updateDisplay() {
  document.getElementById('cookieCount').textContent=fmt(cookies);
  document.getElementById('cpsDisplay').textContent=fmt(cookiesPerSecond*goldenMultiplier);
  document.getElementById('clickPower').textContent=fmt(cookiesPerClick*goldenMultiplier);
  if(shopDirty) renderShop();
}

function spawnFloat(x,y,text) {
  const el=document.createElement('div'); el.className='float-text';
  el.textContent=text; el.style.left=x+'px'; el.style.top=y+'px';
  document.getElementById('gameArea').appendChild(el);
  setTimeout(()=>el.remove(),1000);
}
function spawnParticles(x,y) {
  const cols=['#ffd200','#f7971e','#d4943a'];
  for(let i=0;i<4;i++){
    const p=document.createElement('div'); p.className='particle';
    const a=Math.random()*Math.PI*2, d=30+Math.random()*40;
    p.style.left=x+'px'; p.style.top=y+'px';
    p.style.background=cols[Math.floor(Math.random()*cols.length)];
    p.style.setProperty('--px',Math.cos(a)*d+'px');
    p.style.setProperty('--py',Math.sin(a)*d+'px');
    p.style.animation='particleFly 0.5s ease-out forwards';
    document.getElementById('gameArea').appendChild(p);
    setTimeout(()=>p.remove(),500);
  }
}

document.getElementById('cookieWrapper').addEventListener('click',(e)=>{
  const g=cookiesPerClick*goldenMultiplier;
  cookies+=g; totalCookies+=g; totalClicks++;
  const r=document.getElementById('gameArea').getBoundingClientRect();
  spawnFloat(e.clientX-r.left-10,e.clientY-r.top-20,'+'+fmt(g));
  spawnParticles(e.clientX-r.left,e.clientY-r.top);
  shopDirty=true; updateDisplay(); checkAchievements();
});

function showAchievePopup(name){
  const p=document.getElementById('achievePopup');
  p.textContent='🏆 '+name; p.classList.add('visible');
  setTimeout(()=>p.classList.remove('visible'),2500);
}
function checkAchievements(){
  let n=false;
  for(const a of ACHIEVEMENTS){if(!unlockedAchievements.has(a.id)&&a.check()){unlockedAchievements.add(a.id);n=true;showAchievePopup(a.name);}}
  if(n) renderAchievements();
}
function renderAchievements(){
  const c=document.getElementById('achievementsList'); c.innerHTML='';
  for(const a of ACHIEVEMENTS){
    const u=unlockedAchievements.has(a.id);
    const el=document.createElement('div');
    el.className='achievement '+(u?'unlocked':'locked');
    el.textContent=u?a.name:'❓';
    c.appendChild(el);
  }
  document.getElementById('achieveCount').textContent=unlockedAchievements.size;
  document.getElementById('achieveTotal').textContent=ACHIEVEMENTS.length;
}

function spawnGoldenCookie(){
  if(goldenActive||document.querySelector('.golden-spawn')) return;
  const el=document.createElement('div'); el.className='golden-spawn'; el.textContent='🍪';
  const area=document.getElementById('gameArea');
  el.style.left=(40+Math.random()*Math.max(60,area.clientWidth-100))+'px';
  el.style.top=(40+Math.random()*Math.max(60,area.clientHeight-100))+'px';
  el.addEventListener('click',(ev)=>{
    ev.stopPropagation(); el.remove();
    goldenActive=true; goldenMultiplier=7; goldenEndTime=Date.now()+15000;
    document.getElementById('cookie').classList.add('golden');
    document.getElementById('goldenTimer').classList.add('visible');
    shopDirty=true; updateDisplay();
    if(!unlockedAchievements.has('golden')){unlockedAchievements.add('golden');showAchievePopup('✨ Lucky Find');renderAchievements();}
  });
  area.appendChild(el);
  setTimeout(()=>{if(el.parentNode)el.remove();},10000);
}

function updateGoldenTimer(){
  if(!goldenActive) return;
  const s=Math.max(0,Math.ceil((goldenEndTime-Date.now())/1000));
  document.getElementById('goldenTimer').textContent='⚡ x7 Golden Rush — '+s+'s';
  if(s<=0){
    goldenActive=false; goldenMultiplier=1;
    document.getElementById('cookie').classList.remove('golden');
    document.getElementById('goldenTimer').classList.remove('visible');
    shopDirty=true; updateDisplay();
  }
}

function spawnBg(){
  const el=document.createElement('div'); el.className='bg-cookie'; el.textContent='🍪';
  el.style.left=Math.random()*100+'%';
  el.style.animationDuration=(15+Math.random()*15)+'s';
  document.getElementById('gameArea').appendChild(el);
  setTimeout(()=>el.remove(),30000);
}

document.querySelectorAll('.shop-tab').forEach(t=>{
  t.addEventListener('click',()=>{
    document.querySelectorAll('.shop-tab').forEach(x=>x.classList.remove('active'));
    t.classList.add('active'); activeTab=t.dataset.tab; shopDirty=true; renderShop();
  });
});

document.getElementById('resetBtn').addEventListener('click',()=>{
  cookies=0;totalCookies=0;totalClicks=0;cookiesPerClick=1;cookiesPerSecond=0;
  goldenActive=false;goldenMultiplier=1;
  document.getElementById('cookie').classList.remove('golden');
  document.getElementById('goldenTimer').classList.remove('visible');
  BUILDINGS.forEach(b=>b.count=0); CLICK_UPGRADES.forEach(u=>u.bought=false);
  unlockedAchievements=new Set(); shopDirty=true; updateDisplay(); renderAchievements();
});

let lastShop=0;
setInterval(()=>{
  const g=(cookiesPerSecond/20)*goldenMultiplier;
  if(g>0){cookies+=g;totalCookies+=g;}
  updateGoldenTimer();
  if(Date.now()-lastShop>1000){shopDirty=true;lastShop=Date.now();}
  updateDisplay(); checkAchievements();
},50);

setInterval(()=>{ if(Math.random()<0.03) spawnGoldenCookie(); }, 20000);
setInterval(spawnBg, 5000);

renderShop(); renderAchievements(); updateDisplay();
</script>
</body>
</html>`;
}
