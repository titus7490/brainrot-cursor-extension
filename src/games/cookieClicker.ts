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
  body {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    background: #1a0a2e;
    color: #efeff1;
    display: flex;
    min-height: 100vh;
    overflow: hidden;
  }

  .game-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
    position: relative;
    overflow: hidden;
  }

  .cookie-count {
    text-align: center;
    margin-bottom: 16px;
    z-index: 2;
  }
  .cookie-count .amount {
    font-size: 42px;
    font-weight: 800;
    background: linear-gradient(135deg, #f7971e, #ffd200);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .cookie-count .label {
    font-size: 14px;
    color: #adadb8;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
  .cps-info {
    font-size: 13px;
    color: #8a8a9a;
    margin-top: 4px;
    z-index: 2;
    text-align: center;
  }
  .click-power {
    font-size: 12px;
    color: #48dbfb;
    z-index: 2;
    margin-top: 2px;
    text-align: center;
  }

  .golden-timer {
    display: none;
    background: linear-gradient(135deg, #ffd700, #ffaa00);
    color: #1a0a2e;
    padding: 6px 16px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 13px;
    margin-top: 8px;
    z-index: 2;
    animation: goldenPulse 0.5s infinite alternate;
  }
  .golden-timer.visible { display: inline-block; }

  .cookie-wrapper {
    position: relative;
    z-index: 2;
    cursor: pointer;
    margin: 16px 0;
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
    font-size: 90px;
    transition: transform 0.1s;
    position: relative;
  }
  .cookie:hover { transform: scale(1.05); }
  .cookie:active { transform: scale(0.92); }
  .cookie.golden {
    background: radial-gradient(circle at 35% 35%, #ffd700, #ffaa00 60%, #cc8800 100%);
    box-shadow: 0 0 60px rgba(255,215,0,0.6), inset 0 -8px 16px rgba(0,0,0,0.2);
  }
  @keyframes goldenPulse {
    from { box-shadow: 0 0 40px rgba(255,215,0,0.4); }
    to { box-shadow: 0 0 80px rgba(255,215,0,0.8); }
  }

  .chip {
    position: absolute;
    width: 18px;
    height: 14px;
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
    font-weight: 800;
    font-size: 22px;
    color: #ffd200;
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
    position: absolute;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    pointer-events: none;
    z-index: 5;
  }
  @keyframes particleFly {
    0% { opacity: 1; transform: translate(0,0) scale(1); }
    100% { opacity: 0; transform: translate(var(--px), var(--py)) scale(0); }
  }

  .shop-panel {
    width: 340px;
    background: #12071f;
    border-left: 1px solid #2a1a4a;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
  }
  .shop-title {
    font-size: 18px;
    font-weight: 700;
    color: #ff9ff3;
    margin-bottom: 12px;
    text-align: center;
    letter-spacing: 1px;
  }
  .shop-tabs {
    display: flex;
    gap: 4px;
    margin-bottom: 12px;
  }
  .shop-tab {
    flex: 1;
    padding: 8px;
    border: 1px solid #2a1a4a;
    border-radius: 8px;
    background: #1e0f38;
    color: #8a8a9a;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    text-align: center;
    transition: all 0.2s;
  }
  .shop-tab:hover { border-color: #ff9ff3; color: #efeff1; }
  .shop-tab.active { background: #ff9ff3; color: #1a0a2e; border-color: #ff9ff3; }

  .shop-content { flex: 1; overflow-y: auto; }

  .upgrade-card {
    background: #1e0f38;
    border: 1px solid #2a1a4a;
    border-radius: 12px;
    padding: 12px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }
  .upgrade-card:hover:not(.locked) {
    border-color: #ff9ff3;
    transform: translateX(-3px);
    background: #281248;
  }
  .upgrade-card.locked {
    opacity: 0.4;
    cursor: not-allowed;
  }
  .upgrade-card.maxed {
    border-color: #feca57;
    opacity: 0.6;
  }
  .upgrade-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }
  .upgrade-name {
    font-weight: 700;
    font-size: 13px;
  }
  .upgrade-count {
    background: #3a1a6a;
    border-radius: 8px;
    padding: 2px 8px;
    font-size: 11px;
    font-weight: 700;
    color: #ff9ff3;
  }
  .upgrade-desc {
    font-size: 11px;
    color: #8a8a9a;
    margin-bottom: 4px;
  }
  .upgrade-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .upgrade-cost {
    font-size: 13px;
    font-weight: 700;
    color: #ffd200;
  }
  .upgrade-cps {
    font-size: 11px;
    color: #48dbfb;
  }

  .achievements-bar {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #2a1a4a;
  }
  .achievements-title {
    font-size: 14px;
    font-weight: 700;
    color: #feca57;
    margin-bottom: 10px;
    text-align: center;
  }
  .achievement {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: #1e0f38;
    border: 1px solid #2a1a4a;
    border-radius: 8px;
    padding: 5px 8px;
    margin: 2px;
    font-size: 11px;
    transition: all 0.2s;
  }
  .achievement.unlocked {
    border-color: #feca57;
    background: #2a1a00;
  }
  .achievement.locked { opacity: 0.3; }

  .achievement-popup {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%) translateY(-100px);
    background: linear-gradient(135deg, #feca57, #f7971e);
    color: #1a0a2e;
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 700;
    font-size: 14px;
    z-index: 200;
    transition: transform 0.4s ease;
    pointer-events: none;
  }
  .achievement-popup.visible {
    transform: translateX(-50%) translateY(0);
  }

  .reset-btn {
    margin-top: 8px;
    padding: 6px 12px;
    border: 1px solid #ff6b6b44;
    border-radius: 8px;
    background: transparent;
    color: #ff6b6b;
    font-size: 11px;
    cursor: pointer;
    width: 100%;
    transition: all 0.2s;
  }
  .reset-btn:hover { background: #ff6b6b22; border-color: #ff6b6b; }

  .bg-cookie {
    position: absolute;
    font-size: 40px;
    opacity: 0.03;
    pointer-events: none;
    animation: bgFloat 20s linear infinite;
  }
  @keyframes bgFloat {
    0% { transform: translateY(100vh) rotate(0deg); }
    100% { transform: translateY(-100px) rotate(360deg); }
  }

  .golden-spawn {
    position: absolute;
    width: 55px;
    height: 55px;
    border-radius: 50%;
    background: radial-gradient(circle at 35% 35%, #ffd700, #ffaa00 60%, #cc8800 100%);
    box-shadow: 0 0 30px rgba(255,215,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    cursor: pointer;
    z-index: 20;
    animation: goldenFloat 2s ease-in-out infinite alternate, goldenPulse 0.5s infinite alternate;
  }
  @keyframes goldenFloat {
    0% { transform: translateY(0); }
    100% { transform: translateY(-10px); }
  }
</style>
</head>
<body>
  <div class="game-area" id="gameArea">
    <div class="cookie-count">
      <div class="amount" id="cookieCount">0</div>
      <div class="label">Cookies</div>
    </div>
    <div class="cps-info">per second: <span id="cpsDisplay">0</span></div>
    <div class="click-power">per click: <span id="clickPower">1</span></div>
    <div class="golden-timer" id="goldenTimer">⚡ Golden Rush! 0s</div>

    <div class="cookie-wrapper" id="cookieWrapper">
      <div class="cookie" id="cookie">
        <div class="chip"></div>
        <div class="chip"></div>
        <div class="chip"></div>
        <div class="chip"></div>
        <div class="chip"></div>
        <div class="chip"></div>
      </div>
    </div>
  </div>

  <div class="shop-panel">
    <div class="shop-title">🛒 Upgrade Shop</div>
    <div class="shop-tabs">
      <div class="shop-tab active" data-tab="buildings">🏗️ Buildings</div>
      <div class="shop-tab" data-tab="power">⚡ Click Power</div>
    </div>
    <div class="shop-content" id="shopContent"></div>

    <div class="achievements-bar">
      <div class="achievements-title">🏆 Achievements (<span id="achieveCount">0</span>/<span id="achieveTotal">0</span>)</div>
      <div id="achievementsList"></div>
    </div>

    <button class="reset-btn" id="resetBtn">🗑️ Reset Game</button>
  </div>

  <div class="achievement-popup" id="achievePopup"></div>

<script>
let cookies = 0;
let cookiesPerClick = 1;
let cookiesPerSecond = 0;
let totalCookies = 0;
let totalClicks = 0;
let goldenActive = false;
let goldenMultiplier = 1;
let goldenEndTime = 0;
let activeTab = 'buildings';
let shopDirty = true;

const BUILDINGS = [
  { id: 'cursor',       name: '🖱️ Auto Cursor',        desc: 'Clicks for you automatically',         baseCost: 15,      cps: 0.1,   count: 0 },
  { id: 'intern',       name: '👶 Coding Intern',       desc: 'Writes bugs that produce cookies',     baseCost: 100,     cps: 1,     count: 0 },
  { id: 'semicolon',    name: '⌨️ Semicolon Farm',      desc: 'Harvests forgotten semicolons',         baseCost: 500,     cps: 5,     count: 0 },
  { id: 'stackoverflow',name: '📚 StackOverflow Bot',   desc: 'Copy-pastes cookie recipes',           baseCost: 2000,    cps: 20,    count: 0 },
  { id: 'compiler',     name: '⚙️ Cookie Compiler',     desc: 'Compiles raw dough into cookies',      baseCost: 7500,    cps: 75,    count: 0 },
  { id: 'ai',           name: '🤖 AI Cookie Model',     desc: 'Generates cookies with deep learning', baseCost: 30000,   cps: 300,   count: 0 },
  { id: 'quantum',      name: '⚛️ Quantum Baker',       desc: 'Bakes in parallel universes',           baseCost: 100000,  cps: 1000,  count: 0 },
  { id: 'blockchain',   name: '🔗 Cookie Blockchain',   desc: 'Mines cookies on the chain',           baseCost: 400000,  cps: 4000,  count: 0 },
  { id: 'singularity',  name: '🌀 Cookie Singularity',  desc: 'Infinite cookies from the void',       baseCost: 1500000, cps: 15000, count: 0 },
  { id: 'multiverse',   name: '🌌 Multiverse Bakery',   desc: 'Bakes across all realities',           baseCost: 5000000, cps: 50000, count: 0 },
];

const CLICK_UPGRADES = [
  { id: 'click1',  name: '👆 Better Finger',        desc: '+1 cookie per click',          cost: 50,       bonus: 1,   bought: false },
  { id: 'click2',  name: '🖐️ Whole Hand',           desc: '+3 cookies per click',         cost: 300,      bonus: 3,   bought: false },
  { id: 'click3',  name: '💪 Strong Click',          desc: '+5 cookies per click',         cost: 1500,     bonus: 5,   bought: false },
  { id: 'click4',  name: '🔨 Hammer Click',          desc: '+15 cookies per click',        cost: 8000,     bonus: 15,  bought: false },
  { id: 'click5',  name: '⚡ Lightning Fingers',     desc: '+50 cookies per click',        cost: 50000,    bonus: 50,  bought: false },
  { id: 'click6',  name: '🌟 Star Touch',            desc: '+150 cookies per click',       cost: 250000,   bonus: 150, bought: false },
  { id: 'click7',  name: '☄️ Meteor Strike',         desc: '+500 cookies per click',       cost: 1000000,  bonus: 500, bought: false },
  { id: 'click8',  name: '🌊 Tsunami Click',         desc: '+2000 cookies per click',      cost: 5000000,  bonus: 2000,bought: false },
  { id: 'click9',  name: '💥 Big Bang Click',        desc: '+10000 cookies per click',     cost: 25000000, bonus: 10000, bought: false },
];

const ACHIEVEMENTS = [
  { id: 'first',      name: '🍪 First Cookie',       desc: 'Click the cookie',             check: () => totalClicks >= 1 },
  { id: 'clicker10',  name: '👆 Clicker',             desc: '10 clicks',                    check: () => totalClicks >= 10 },
  { id: 'clicker100', name: '👆 Fast Clicker',        desc: '100 clicks',                   check: () => totalClicks >= 100 },
  { id: 'clicker500', name: '👆 Speed Demon',         desc: '500 clicks',                   check: () => totalClicks >= 500 },
  { id: 'maniac',     name: '🔥 Click Maniac',        desc: '1,000 clicks',                 check: () => totalClicks >= 1000 },
  { id: 'hundred',    name: '💯 Century',              desc: '100 cookies total',            check: () => totalCookies >= 100 },
  { id: 'thousand',   name: '🏪 Cookie Shop',         desc: '1,000 cookies total',          check: () => totalCookies >= 1000 },
  { id: 'tenk',       name: '🏭 Cookie Factory',      desc: '10,000 cookies total',         check: () => totalCookies >= 10000 },
  { id: 'hundredk',   name: '🌍 Cookie Empire',       desc: '100,000 cookies total',        check: () => totalCookies >= 100000 },
  { id: 'million',    name: '🚀 Cookie Millionaire',  desc: '1,000,000 cookies',            check: () => totalCookies >= 1000000 },
  { id: 'tenmil',     name: '💎 Cookie Billionaire',  desc: '10,000,000 cookies',           check: () => totalCookies >= 10000000 },
  { id: 'buyer',      name: '🛒 First Purchase',      desc: 'Buy a building',               check: () => BUILDINGS.some(u => u.count > 0) },
  { id: 'collector',  name: '📦 Collector',            desc: 'Own 5 different buildings',    check: () => BUILDINGS.filter(u => u.count > 0).length >= 5 },
  { id: 'mogul',      name: '🏛️ Cookie Mogul',        desc: 'Own all building types',       check: () => BUILDINGS.filter(u => u.count > 0).length >= BUILDINGS.length },
  { id: 'cps10',      name: '⏱️ Cookie Stream',       desc: '10 CPS',                       check: () => cookiesPerSecond >= 10 },
  { id: 'cps100',     name: '⏱️ Cookie River',        desc: '100 CPS',                      check: () => cookiesPerSecond >= 100 },
  { id: 'cps1000',    name: '👑 Cookie Tycoon',       desc: '1,000 CPS',                    check: () => cookiesPerSecond >= 1000 },
  { id: 'cps10000',   name: '🌟 Cookie God',          desc: '10,000 CPS',                   check: () => cookiesPerSecond >= 10000 },
  { id: 'golden',     name: '✨ Lucky Find',           desc: 'Click a golden cookie',        check: () => false },
  { id: 'powerup',    name: '⚡ Power Up',             desc: 'Buy a click upgrade',          check: () => CLICK_UPGRADES.some(u => u.bought) },
];
let unlockedAchievements = new Set();

function formatNumber(n) {
  if (n >= 1e15) return (n/1e15).toFixed(1) + 'Qa';
  if (n >= 1e12) return (n/1e12).toFixed(1) + 'T';
  if (n >= 1e9) return (n/1e9).toFixed(1) + 'B';
  if (n >= 1e6) return (n/1e6).toFixed(1) + 'M';
  if (n >= 1e3) return (n/1e3).toFixed(1) + 'K';
  return Math.floor(n).toString();
}

function getBuildingCost(b) {
  return Math.ceil(b.baseCost * Math.pow(1.15, b.count));
}

function recalcCPS() {
  cookiesPerSecond = 0;
  for (const b of BUILDINGS) {
    cookiesPerSecond += b.cps * b.count;
  }
}

function recalcClickPower() {
  cookiesPerClick = 1;
  for (const u of CLICK_UPGRADES) {
    if (u.bought) cookiesPerClick += u.bonus;
  }
}

function renderShop() {
  const container = document.getElementById('shopContent');
  container.innerHTML = '';

  if (activeTab === 'buildings') {
    for (const b of BUILDINGS) {
      const cost = getBuildingCost(b);
      const locked = cookies < cost;
      const card = document.createElement('div');
      card.className = 'upgrade-card' + (locked ? ' locked' : '');
      card.innerHTML =
        '<div class="upgrade-header">' +
          '<span class="upgrade-name">' + b.name + '</span>' +
          '<span class="upgrade-count">' + b.count + '</span>' +
        '</div>' +
        '<div class="upgrade-desc">' + b.desc + '</div>' +
        '<div class="upgrade-bottom">' +
          '<span class="upgrade-cost">🍪 ' + formatNumber(cost) + '</span>' +
          '<span class="upgrade-cps">+' + b.cps + ' CPS</span>' +
        '</div>';
      if (!locked) {
        card.addEventListener('click', () => buyBuilding(b));
      }
      container.appendChild(card);
    }
  } else {
    for (const u of CLICK_UPGRADES) {
      const card = document.createElement('div');
      const locked = u.bought || cookies < u.cost;
      card.className = 'upgrade-card' + (u.bought ? ' maxed' : locked ? ' locked' : '');
      card.innerHTML =
        '<div class="upgrade-header">' +
          '<span class="upgrade-name">' + u.name + '</span>' +
          '<span class="upgrade-count">' + (u.bought ? '✓' : '') + '</span>' +
        '</div>' +
        '<div class="upgrade-desc">' + u.desc + '</div>' +
        '<div class="upgrade-bottom">' +
          '<span class="upgrade-cost">' + (u.bought ? 'OWNED' : '🍪 ' + formatNumber(u.cost)) + '</span>' +
          '<span class="upgrade-cps">+' + u.bonus + '/click</span>' +
        '</div>';
      if (!locked && !u.bought) {
        card.addEventListener('click', () => buyClickUpgrade(u));
      }
      container.appendChild(card);
    }
  }
  shopDirty = false;
}

function buyBuilding(b) {
  const cost = getBuildingCost(b);
  if (cookies < cost) return;
  cookies -= cost;
  b.count++;
  recalcCPS();
  shopDirty = true;
  updateDisplay();
  checkAchievements();
}

function buyClickUpgrade(u) {
  if (u.bought || cookies < u.cost) return;
  cookies -= u.cost;
  u.bought = true;
  recalcClickPower();
  shopDirty = true;
  updateDisplay();
  checkAchievements();
}

function spawnFloatText(x, y, text) {
  const el = document.createElement('div');
  el.className = 'float-text';
  el.textContent = text;
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  document.getElementById('gameArea').appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

function spawnParticles(x, y) {
  const colors = ['#ffd200','#f7971e','#ff6b6b','#ff9ff3','#48dbfb'];
  for (let i = 0; i < 5; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const angle = Math.random() * Math.PI * 2;
    const dist = 30 + Math.random() * 50;
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.setProperty('--px', Math.cos(angle) * dist + 'px');
    p.style.setProperty('--py', Math.sin(angle) * dist + 'px');
    p.style.animation = 'particleFly 0.6s ease-out forwards';
    document.getElementById('gameArea').appendChild(p);
    setTimeout(() => p.remove(), 600);
  }
}

function updateDisplay() {
  document.getElementById('cookieCount').textContent = formatNumber(cookies);
  document.getElementById('cpsDisplay').textContent = formatNumber(cookiesPerSecond * goldenMultiplier);
  document.getElementById('clickPower').textContent = formatNumber(cookiesPerClick * goldenMultiplier);
  if (shopDirty) renderShop();
}

function onCookieClick(e) {
  const gained = cookiesPerClick * goldenMultiplier;
  cookies += gained;
  totalCookies += gained;
  totalClicks++;

  const gameRect = document.getElementById('gameArea').getBoundingClientRect();
  const x = e.clientX - gameRect.left;
  const y = e.clientY - gameRect.top;

  spawnFloatText(x - 10, y - 20, '+' + formatNumber(gained));
  spawnParticles(x, y);
  shopDirty = true;
  updateDisplay();
  checkAchievements();
}

document.getElementById('cookieWrapper').addEventListener('click', onCookieClick);

function showAchievementPopup(name) {
  const popup = document.getElementById('achievePopup');
  popup.textContent = '🏆 ' + name;
  popup.classList.add('visible');
  setTimeout(() => popup.classList.remove('visible'), 2500);
}

function checkAchievements() {
  let newUnlock = false;
  for (const a of ACHIEVEMENTS) {
    if (!unlockedAchievements.has(a.id) && a.check()) {
      unlockedAchievements.add(a.id);
      newUnlock = true;
      showAchievementPopup(a.name);
    }
  }
  if (newUnlock) renderAchievements();
}

function renderAchievements() {
  const container = document.getElementById('achievementsList');
  container.innerHTML = '';
  for (const a of ACHIEVEMENTS) {
    const unlocked = unlockedAchievements.has(a.id);
    const el = document.createElement('div');
    el.className = 'achievement ' + (unlocked ? 'unlocked' : 'locked');
    el.innerHTML = '<span>' + (unlocked ? a.name : '❓') + '</span>';
    el.title = unlocked ? a.desc : '???';
    container.appendChild(el);
  }
  document.getElementById('achieveCount').textContent = unlockedAchievements.size;
  document.getElementById('achieveTotal').textContent = ACHIEVEMENTS.length;
}

function spawnGoldenCookie() {
  if (goldenActive) return;
  if (document.querySelector('.golden-spawn')) return;

  const el = document.createElement('div');
  el.className = 'golden-spawn';
  el.textContent = '🍪';

  const area = document.getElementById('gameArea');
  const maxX = Math.max(60, area.clientWidth - 80);
  const maxY = Math.max(60, area.clientHeight - 80);
  el.style.left = (30 + Math.random() * maxX) + 'px';
  el.style.top = (30 + Math.random() * maxY) + 'px';

  el.addEventListener('click', (ev) => {
    ev.stopPropagation();
    el.remove();
    activateGolden();
    if (!unlockedAchievements.has('golden')) {
      unlockedAchievements.add('golden');
      showAchievementPopup('✨ Lucky Find');
      renderAchievements();
    }
  });

  area.appendChild(el);
  setTimeout(() => { if (el.parentNode) el.remove(); }, 10000);
}

function activateGolden() {
  goldenActive = true;
  goldenMultiplier = 7;
  goldenEndTime = Date.now() + 15000;
  document.getElementById('cookie').classList.add('golden');
  document.getElementById('goldenTimer').classList.add('visible');
  shopDirty = true;
  updateDisplay();
}

function updateGoldenTimer() {
  if (!goldenActive) return;
  const remaining = Math.max(0, Math.ceil((goldenEndTime - Date.now()) / 1000));
  document.getElementById('goldenTimer').textContent = '⚡ Golden Rush! x7 — ' + remaining + 's';
  if (remaining <= 0) {
    goldenActive = false;
    goldenMultiplier = 1;
    document.getElementById('cookie').classList.remove('golden');
    document.getElementById('goldenTimer').classList.remove('visible');
    shopDirty = true;
    updateDisplay();
  }
}

function spawnBgCookie() {
  const el = document.createElement('div');
  el.className = 'bg-cookie';
  el.textContent = '🍪';
  el.style.left = Math.random() * 100 + '%';
  el.style.animationDuration = (15 + Math.random() * 15) + 's';
  document.getElementById('gameArea').appendChild(el);
  setTimeout(() => el.remove(), 30000);
}

document.querySelectorAll('.shop-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeTab = tab.dataset.tab;
    shopDirty = true;
    renderShop();
  });
});

document.getElementById('resetBtn').addEventListener('click', () => {
  cookies = 0; totalCookies = 0; totalClicks = 0;
  cookiesPerClick = 1; cookiesPerSecond = 0;
  goldenActive = false; goldenMultiplier = 1;
  document.getElementById('cookie').classList.remove('golden');
  document.getElementById('goldenTimer').classList.remove('visible');
  BUILDINGS.forEach(b => b.count = 0);
  CLICK_UPGRADES.forEach(u => u.bought = false);
  unlockedAchievements = new Set();
  shopDirty = true;
  updateDisplay();
  renderAchievements();
});

let lastShopRender = 0;
setInterval(() => {
  const gained = (cookiesPerSecond / 20) * goldenMultiplier;
  if (gained > 0) {
    cookies += gained;
    totalCookies += gained;
  }
  updateGoldenTimer();

  const now = Date.now();
  if (now - lastShopRender > 1000) {
    shopDirty = true;
    lastShopRender = now;
  }
  updateDisplay();
  checkAchievements();
}, 50);

setInterval(() => {
  if (Math.random() < 0.1) spawnGoldenCookie();
}, 6000);

setInterval(spawnBgCookie, 4000);

renderShop();
renderAchievements();
updateDisplay();
</script>
</body>
</html>`;
}
