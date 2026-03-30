import * as vscode from 'vscode';

const WORD_LISTS: Record<string, Record<string, string[]>> = {
  en: {
    easy: [
      'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had',
      'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his',
      'how', 'its', 'may', 'new', 'now', 'old', 'see', 'way', 'who', 'did',
      'let', 'say', 'she', 'too', 'use', 'code', 'bug', 'fix', 'run', 'test',
      'app', 'web', 'dev', 'git', 'npm', 'css', 'html', 'log', 'api', 'key',
      'map', 'set', 'put', 'red', 'big', 'top', 'end', 'add', 'try', 'ask',
      'own', 'off', 'low', 'bit', 'far', 'lot', 'yet', 'ago', 'boy', 'car',
      'dog', 'eat', 'fly', 'hot', 'job', 'kid', 'man', 'pay', 'six', 'ten',
      'win', 'yes', 'age', 'air', 'art', 'bad', 'bag', 'bed', 'box', 'bus',
      'cat', 'cup', 'cut', 'dry', 'ear', 'egg', 'eye', 'fat', 'fee', 'fun',
      'gas', 'gun', 'hat', 'ice', 'ill', 'jam', 'joy', 'lab', 'law', 'leg',
      'lie', 'lip', 'mix', 'mud', 'net', 'nor', 'nut', 'odd', 'oil', 'pan',
      'pet', 'pie', 'pin', 'pop', 'pot', 'raw', 'rid', 'row', 'sad', 'sea',
      'sir', 'sit', 'sky', 'son', 'sum', 'sun', 'tea', 'tie', 'tip', 'toe',
      'toy', 'van', 'war', 'wet', 'win', 'won', 'zoo', 'arm', 'bar', 'bat',
    ],
    medium: [
      'function', 'variable', 'console', 'return', 'import', 'export', 'module',
      'promise', 'async', 'await', 'class', 'const', 'debug', 'error', 'event',
      'fetch', 'filter', 'global', 'index', 'input', 'interface', 'object',
      'package', 'private', 'public', 'render', 'server', 'string', 'switch',
      'template', 'typeof', 'update', 'value', 'while', 'yield', 'array',
      'boolean', 'buffer', 'callback', 'compile', 'delete', 'docker', 'element',
      'format', 'handler', 'iterate', 'lambda', 'method', 'number', 'option',
      'commit', 'branch', 'merge', 'remote', 'deploy', 'build', 'route',
      'state', 'props', 'hooks', 'store', 'query', 'model', 'table',
      'schema', 'token', 'cache', 'proxy', 'queue', 'stack', 'graph',
      'admin', 'panel', 'login', 'modal', 'toast', 'badge', 'theme',
      'pixel', 'width', 'mouse', 'focus', 'click', 'hover', 'style',
      'color', 'image', 'video', 'audio', 'frame', 'block', 'float',
      'space', 'reset', 'timer', 'watch', 'scope', 'chain', 'parse',
      'print', 'split', 'shift', 'slice', 'super', 'throw', 'catch',
      'break', 'param', 'apply', 'bound', 'trait', 'flags', 'guard',
      'patch', 'clone', 'mutex', 'yield', 'limit', 'count', 'chunk',
      'label', 'field', 'panel', 'radio', 'range', 'track', 'layer',
      'scene', 'light', 'depth', 'point', 'angle', 'curve', 'noise',
      'abort', 'watch', 'spawn', 'flush', 'drain', 'retry', 'batch',
    ],
    hard: [
      'javascript', 'typescript', 'middleware', 'dependency', 'abstraction',
      'polymorphism', 'inheritance', 'encapsulation', 'asynchronous', 'authentication',
      'authorization', 'configuration', 'concatenation', 'declaration', 'destructuring',
      'environment', 'implementation', 'optimization', 'serialization', 'vulnerability',
      'architecture', 'microservice', 'performance', 'refactoring', 'infrastructure',
      'deployment', 'kubernetes', 'algorithm', 'recursion', 'transpiler',
      'interpreter', 'compilation', 'abstraction', 'polymorphism', 'composition',
      'aggregation', 'orchestration', 'virtualization', 'containerization', 'provisioning',
      'scaffolding', 'bootstrapping', 'serialization', 'deserialization', 'normalization',
      'denormalization', 'idempotent', 'deterministic', 'asynchronous', 'synchronous',
      'multithreading', 'concurrency', 'parallelism', 'deadlock', 'semaphore',
      'middleware', 'interceptor', 'transformation', 'transactional', 'referential',
      'declarative', 'imperative', 'functional', 'procedural', 'observable',
      'subscription', 'propagation', 'interpolation', 'extrapolation', 'approximation',
      'enumeration', 'instantiation', 'initialization', 'finalization', 'deprecation',
      'obfuscation', 'minification', 'concatenation', 'interpolation', 'compression',
      'decompression', 'encryption', 'decryption', 'hashing', 'tokenization',
      'sanitization', 'validation', 'verification', 'authentication', 'authorization',
      'pagination', 'throttling', 'debouncing', 'memoization', 'caching',
      'prefetching', 'preloading', 'lazy', 'streaming', 'buffering',
    ],
  },
  de: {
    easy: [
      'und', 'der', 'die', 'das', 'ist', 'ein', 'den', 'von', 'mit', 'auf',
      'dem', 'des', 'als', 'hat', 'sie', 'war', 'bei', 'aus', 'nur', 'wie',
      'wir', 'ich', 'mir', 'dir', 'ihm', 'uns', 'nun', 'mal', 'was', 'wer',
      'gut', 'neu', 'alt', 'rot', 'Tag', 'Weg', 'Zug', 'Hut', 'Bus', 'Rad',
      'Uhr', 'Tee', 'Eis', 'Ohr', 'Arm', 'Bub', 'Fee', 'Gas', 'Hof', 'Kuh',
      'Mut', 'Not', 'Ort', 'Reh', 'See', 'Tor', 'Wal', 'Zug', 'zum', 'zur',
      'vor', 'bis', 'seit', 'nach', 'auch', 'noch', 'denn', 'wenn', 'aber',
      'gern', 'sehr', 'viel', 'lang', 'kurz', 'warm', 'kalt', 'groß', 'nah',
      'hier', 'dort', 'dann', 'wann', 'bald', 'fast', 'kaum', 'eben', 'wohl',
      'nie', 'oft', 'ganz', 'halb', 'leer', 'voll', 'breit', 'weit', 'tief',
      'wild', 'rund', 'echt', 'fein', 'hell', 'laut', 'wach', 'link', 'quer',
      'nass', 'bunt', 'matt', 'fest', 'hart', 'mild', 'mein', 'dein', 'sein',
      'ihr', 'kein', 'alle', 'etwa', 'mehr', 'ohne', 'eine', 'oder', 'jede',
      'immer', 'gerne', 'lesen', 'laufen', 'essen', 'sehen', 'gehen',
      'haben', 'sein', 'werden', 'sagen', 'machen',
    ],
    medium: [
      'Programm', 'Fenster', 'Bildschirm', 'Tastatur', 'Ordner', 'Datei',
      'Drucker', 'Rechner', 'Speicher', 'Leitung', 'Netzwerk', 'Browser',
      'Fehler', 'Eingabe', 'Ausgabe', 'Abfrage', 'Meldung', 'Anzeige',
      'Schalter', 'Tabelle', 'Formel', 'Filter', 'Spalte', 'Zeile',
      'Benutzer', 'Antwort', 'Auswahl', 'Verlauf', 'Bericht', 'Eingang',
      'Ausgang', 'Anfang', 'Zustand', 'Entwurf', 'Vorlage', 'Auftrag',
      'Projekt', 'Sitzung', 'Aufgabe', 'Leistung', 'Wirkung', 'Handlung',
      'Versuch', 'Beispiel', 'Hinweis', 'Zeichen', 'Nachricht', 'Schrift',
      'Sprache', 'Bedeutung', 'Richtung', 'Ordnung', 'Regelung', 'Stellung',
      'Funktion', 'Variable', 'Methode', 'Klasse', 'Objekt', 'Modul',
      'Bibliothek', 'Verzeichnis', 'Datenbank', 'Schnittstelle', 'Plattform',
      'Anwendung', 'Werkzeug', 'Ergebnis', 'Fortschritt', 'Sicherheit',
      'Verbindung', 'Einstellung', 'Verwaltung', 'Verarbeitung', 'Speicherung',
      'Umgebung', 'Struktur', 'Element', 'Komponente', 'Baustein',
      'Verhalten', 'Eigenschaft', 'Kennung', 'Zugriff', 'Vorgang',
      'Protokoll', 'Standard', 'Rahmen', 'System', 'Ablauf',
      'Knoten', 'Kante', 'Stapel', 'Schlange', 'Menge',
      'Begriff', 'Merkmal', 'Faktor', 'Grenze', 'Schwelle',
      'Abschnitt', 'Bereich', 'Umfang', 'Inhalt', 'Zugang',
    ],
    hard: [
      'Programmierung', 'Softwareentwicklung', 'Betriebssystem', 'Verschlüsselung',
      'Authentifizierung', 'Autorisierung', 'Konfiguration', 'Implementierung',
      'Optimierung', 'Serialisierung', 'Infrastruktur', 'Architektur',
      'Virtualisierung', 'Containerisierung', 'Automatisierung', 'Dokumentation',
      'Fehlerbehandlung', 'Ausnahmebehandlung', 'Datenverarbeitung', 'Schnittstelle',
      'Benutzeroberflaeche', 'Zustandsverwaltung', 'Versionskontrolle', 'Abhängigkeit',
      'Zwischenspeicher', 'Pufferüberlauf', 'Rekursion', 'Algorithmus',
      'Datenstruktur', 'Vererbung', 'Kapselung', 'Polymorphismus',
      'Abstraktion', 'Entwurfsmuster', 'Refaktorisierung', 'Bereitstellung',
      'Lastenverteilung', 'Hochverfügbarkeit', 'Skalierbarkeit', 'Wartbarkeit',
      'Wiederverwendbarkeit', 'Erweiterbarkeit', 'Kompatibilität', 'Barrierefreiheit',
      'Leistungsfähigkeit', 'Zuverlässigkeit', 'Nachvollziehbarkeit', 'Testbarkeit',
      'Eingabevalidierung', 'Ausgabeformatierung', 'Speicherverwaltung', 'Nebenläufigkeit',
      'Parallelverarbeitung', 'Ereignissteuerung', 'Zustandsmaschine', 'Entkopplung',
      'Datenbankanbindung', 'Mikrodienst', 'Lastausgleich', 'Protokollierung',
      'Quellcodeverwaltung', 'Zusammenführung', 'Bereinigung', 'Kompilierung',
      'Transpilierung', 'Interpretation', 'Typsicherheit', 'Nullsicherheit',
      'Speicherbereinigung', 'Stapelüberlauf', 'Wettlaufsituation', 'Verklemmung',
      'Paketmanager', 'Rahmenwerk', 'Laufzeitumgebung', 'Entwicklungsumgebung',
    ],
  },
};

export function createTypingGamePanel(context: vscode.ExtensionContext): vscode.WebviewPanel {
  const panel = vscode.window.createWebviewPanel(
    'brainrotTypingGame',
    '⌨️ Brainrot Typing Game',
    vscode.ViewColumn.One,
    { enableScripts: true, retainContextWhenHidden: true }
  );

  const allWords = JSON.stringify(WORD_LISTS);
  panel.webview.html = getTypingGameHtml(allWords);
  return panel;
}

function getTypingGameHtml(wordListsJson: string): string {
  return /*html*/`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  :root { --accent: #e2b714; --correct: #d1d0c5; --error: #ca4754; --bg: #232831; --bg2: #2c333e; --border: #3a4150; --dim: #646669; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Segoe UI', system-ui, sans-serif;
    background: var(--bg);
    color: #d1d0c5;
    display: flex; flex-direction: column; align-items: center;
    min-height: 100vh; padding: 28px 24px; user-select: none;
  }

  .header { text-align: center; margin-bottom: 20px; }
  .header h1 { font-size: 22px; font-weight: 700; color: var(--accent); margin-bottom: 4px; }
  .header p { color: var(--dim); font-size: 13px; }

  .stats-bar {
    display: flex; gap: 20px; margin-bottom: 18px; flex-wrap: wrap; justify-content: center;
  }
  .stat { text-align: center; min-width: 70px; }
  .stat-value { font-size: 26px; font-weight: 700; color: var(--accent); }
  .stat-label { font-size: 10px; color: var(--dim); text-transform: uppercase; letter-spacing: 1px; }
  .stat.err .stat-value { color: var(--error); }

  .options-bar {
    display: flex; gap: 6px; margin-bottom: 20px; flex-wrap: wrap; justify-content: center;
  }
  .opt-btn {
    padding: 6px 16px; border-radius: 6px; border: 1px solid var(--border);
    background: var(--bg2); color: var(--dim); cursor: pointer;
    font-size: 12px; font-weight: 600; transition: all 0.15s;
  }
  .opt-btn:hover { border-color: var(--accent); color: var(--correct); }
  .opt-btn.active { background: var(--accent); color: var(--bg); border-color: var(--accent); }
  .opt-spacer { width: 10px; }

  .typing-area {
    background: var(--bg2);
    border: 2px solid var(--border);
    border-radius: 12px;
    padding: 28px 32px;
    max-width: 760px; width: 100%;
    min-height: 120px;
    margin-bottom: 20px;
    cursor: text;
    position: relative;
    outline: none;
    transition: border-color 0.15s;
    line-height: 2;
    display: flex; flex-wrap: wrap; align-content: flex-start;
  }
  .typing-area.focused { border-color: var(--accent); }
  .typing-area.has-error { border-color: var(--error); animation: shake 0.25s; }
  .typing-area .click-hint {
    position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
    color: var(--dim); font-size: 14px; pointer-events: none; opacity: 0; transition: opacity 0.2s;
  }
  .typing-area:not(.focused) .click-hint { opacity: 1; }

  @keyframes shake {
    0%,100% { transform: translateX(0); }
    25% { transform: translateX(-3px); }
    75% { transform: translateX(3px); }
  }

  .word {
    display: inline-flex; white-space: nowrap; margin-right: 0.5em;
  }
  .char {
    font-family: 'Cascadia Code', 'Fira Code', 'JetBrains Mono', monospace;
    font-size: 22px; letter-spacing: 0.5px; transition: color 0.08s;
  }
  .char.pending { color: var(--dim); }
  .char.current { color: #fff; background: #4a5568; border-radius: 3px; padding: 0 1px; }
  .char.correct { color: var(--correct); }
  .char.incorrect { color: var(--error); text-decoration: underline; }

  .keyboard {
    display: flex; flex-direction: column; align-items: center;
    gap: 5px; margin-bottom: 20px; opacity: 0.7;
  }
  .kb-row { display: flex; gap: 4px; }
  .key {
    width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
    border-radius: 6px; font-size: 12px; font-weight: 600;
    font-family: 'Cascadia Code', monospace;
    border: 1px solid var(--border); color: var(--dim); background: var(--bg2);
    transition: all 0.12s;
  }
  .key.highlight { background: var(--accent); color: var(--bg); border-color: var(--accent); transform: scale(1.1); }
  .key.space { width: 180px; }

  .controls { display: flex; gap: 10px; flex-wrap: wrap; justify-content: center; }
  .btn {
    padding: 8px 20px; border-radius: 8px; border: 1px solid var(--border);
    font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s;
    background: var(--bg2); color: var(--dim);
  }
  .btn:hover { border-color: var(--accent); color: var(--correct); }
  .btn-primary { background: var(--accent); color: var(--bg); border-color: var(--accent); }
  .btn-primary:hover { background: #c9a312; }

  .results-overlay {
    display: none; position: fixed; inset: 0; background: rgba(35,40,49,0.94);
    z-index: 100; justify-content: center; align-items: center;
  }
  .results-overlay.visible { display: flex; }
  .results-card {
    background: var(--bg2); border: 1px solid var(--border); border-radius: 16px;
    padding: 36px; text-align: center; max-width: 380px; width: 90%;
  }
  .results-card h2 { font-size: 22px; margin-bottom: 20px; color: var(--accent); }
  .result-row {
    display: flex; justify-content: space-between; padding: 8px 0;
    border-bottom: 1px solid var(--border); font-size: 14px;
  }
  .result-row:last-of-type { border-bottom: none; }
  .result-label { color: var(--dim); }
  .result-value { font-weight: 700; color: var(--correct); }
  .new-best { color: var(--accent) !important; }

  input.hidden-input {
    position: absolute; left: -9999px; opacity: 0; width: 1px; height: 1px;
  }
</style>
</head>
<body>
  <div class="header">
    <h1>⌨️ Typing Trainer</h1>
    <p>Type the words — click the box to start</p>
  </div>

  <div class="stats-bar">
    <div class="stat"><div class="stat-value" id="wpm">0</div><div class="stat-label">WPM</div></div>
    <div class="stat"><div class="stat-value" id="accuracy">100%</div><div class="stat-label">Accuracy</div></div>
    <div class="stat"><div class="stat-value" id="streak">0</div><div class="stat-label">Streak</div></div>
    <div class="stat err"><div class="stat-value" id="errorCount">0</div><div class="stat-label">Errors</div></div>
    <div class="stat"><div class="stat-value" id="wordsLeft">0</div><div class="stat-label">Left</div></div>
    <div class="stat"><div class="stat-value" id="bestWpm">-</div><div class="stat-label">Best</div></div>
  </div>

  <div class="options-bar">
    <button class="opt-btn active" data-lang="en">EN</button>
    <button class="opt-btn" data-lang="de">DE</button>
    <div class="opt-spacer"></div>
    <button class="opt-btn diff-btn active" data-diff="easy">Easy</button>
    <button class="opt-btn diff-btn" data-diff="medium">Medium</button>
    <button class="opt-btn diff-btn" data-diff="hard">Hard</button>
  </div>

  <div class="typing-area" id="typingArea" tabindex="0">
    <div class="click-hint">Click here or press any key to focus</div>
  </div>
  <input class="hidden-input" id="hiddenInput" autocomplete="off" spellcheck="false" />

  <div class="keyboard" id="keyboard"></div>

  <div class="controls">
    <button class="btn btn-primary" id="restartBtn">New Round</button>
    <button class="btn" id="wordsToggle">10 Words</button>
  </div>

  <div class="results-overlay" id="resultsOverlay">
    <div class="results-card">
      <h2 id="resultsTitle">Round Complete!</h2>
      <div class="result-row"><span class="result-label">WPM</span><span class="result-value" id="finalWpm">0</span></div>
      <div class="result-row"><span class="result-label">Accuracy</span><span class="result-value" id="finalAccuracy">100%</span></div>
      <div class="result-row"><span class="result-label">Characters</span><span class="result-value" id="finalChars">0</span></div>
      <div class="result-row"><span class="result-label">Errors</span><span class="result-value" id="finalErrors">0</span></div>
      <div class="result-row"><span class="result-label">Time</span><span class="result-value" id="finalTime">0s</span></div>
      <div class="result-row"><span class="result-label">Best Streak</span><span class="result-value" id="finalStreak">0</span></div>
      <br/>
      <button class="btn btn-primary" id="playAgainBtn">Play Again</button>
    </div>
  </div>

<script>
const WORDS = ${wordListsJson};
const FINGER_MAP = {
  'q':'l','a':'l','z':'l','w':'l','s':'l','x':'l',
  'e':'l','d':'l','c':'l','r':'l','f':'l','v':'l',
  't':'l','g':'l','b':'l','y':'r','h':'r','n':'r',
  'u':'r','j':'r','m':'r','i':'r','k':'r',',':'r',
  'o':'r','l':'r','.':'r','p':'r',';':'r','/':'r',' ':'s',
};

let language='en', difficulty='easy', wordCount=10;
let words=[], currentText='', charIndex=0, startTime=null;
let totalKeystrokes=0, errors=0, streak=0, maxStreak=0;
let wordsCompleted=0, gameActive=false, bestWpm=0, liveInterval=null;

const area = document.getElementById('typingArea');
const inp = document.getElementById('hiddenInput');

function shuffle(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}

function pickWords(){
  const pool=WORDS[language][difficulty], sh=shuffle(pool);
  if(sh.length>=wordCount) return sh.slice(0,wordCount);
  const r=[]; while(r.length<wordCount) r.push(...shuffle(pool)); return r.slice(0,wordCount);
}

function focusInput(){ inp.focus(); area.classList.add('focused'); }
area.addEventListener('click', focusInput);
inp.addEventListener('focus', ()=>area.classList.add('focused'));
inp.addEventListener('blur', ()=>area.classList.remove('focused'));
document.addEventListener('keydown',(e)=>{
  if(document.activeElement!==inp && !e.ctrlKey && !e.metaKey && !e.altKey && e.key.length===1){
    focusInput();
  }
});

function renderKeyboard(){
  const rows=[['q','w','e','r','t','y','u','i','o','p'],['a','s','d','f','g','h','j','k','l',';'],['z','x','c','v','b','n','m',',','.','/'],[ ' ']];
  const kb=document.getElementById('keyboard'); kb.innerHTML='';
  for(const row of rows){
    const rd=document.createElement('div'); rd.className='kb-row';
    for(const k of row){
      const kd=document.createElement('div');
      kd.className='key'+(k===' '?' space':'');
      kd.dataset.key=k; kd.textContent=k===' '?'SPACE':k.toUpperCase();
      rd.appendChild(kd);
    }
    kb.appendChild(rd);
  }
}

function highlightKey(ch){
  document.querySelectorAll('.key').forEach(k=>k.classList.remove('highlight'));
  const el=document.querySelector('.key[data-key="'+CSS.escape(ch.toLowerCase())+'"]');
  if(el) el.classList.add('highlight');
}

function renderWords(){
  area.innerHTML='<div class="click-hint">Click here or press any key to focus</div>';
  let pos=0;
  for(const word of words){
    const wSpan=document.createElement('span');
    wSpan.className='word';
    for(let i=0;i<word.length;i++){
      const ch=document.createElement('span');
      ch.className='char';
      ch.textContent=word[i];
      const idx=pos+i;
      if(idx<charIndex) ch.classList.add('correct');
      else if(idx===charIndex) ch.classList.add('current');
      else ch.classList.add('pending');
      wSpan.appendChild(ch);
    }
    area.appendChild(wSpan);
    pos+=word.length;
    if(pos<currentText.length){
      const sp=document.createElement('span');
      sp.className='char';
      sp.textContent=' ';
      sp.style.width='0.4em'; sp.style.display='inline-block';
      if(pos<charIndex) sp.classList.add('correct');
      else if(pos===charIndex) sp.classList.add('current');
      else sp.classList.add('pending');
      area.appendChild(sp);
      pos++;
    }
  }
  if(charIndex<currentText.length) highlightKey(currentText[charIndex]);
}

function calcWpm(){ if(!startTime)return 0; const m=(Date.now()-startTime)/60000; return m>0?Math.round((charIndex/5)/m):0; }
function updateStats(){
  document.getElementById('wpm').textContent=calcWpm();
  const acc=totalKeystrokes>0?Math.round(((totalKeystrokes-errors)/totalKeystrokes)*100):100;
  document.getElementById('accuracy').textContent=acc+'%';
  document.getElementById('streak').textContent=streak;
  document.getElementById('errorCount').textContent=errors;
  document.getElementById('wordsLeft').textContent=Math.max(0,wordCount-wordsCompleted);
  document.getElementById('bestWpm').textContent=bestWpm>0?bestWpm:'-';
}

function startGame(){
  words=pickWords(); currentText=words.join(' ');
  charIndex=0; startTime=null; totalKeystrokes=0; errors=0;
  streak=0; maxStreak=0; wordsCompleted=0; gameActive=true;
  if(liveInterval) clearInterval(liveInterval);
  liveInterval=setInterval(()=>{ if(gameActive&&startTime) updateStats(); },500);
  inp.value=''; inp.disabled=false;
  document.getElementById('resultsOverlay').classList.remove('visible');
  renderWords(); updateStats(); focusInput();
}

function showResults(){
  gameActive=false;
  if(liveInterval){clearInterval(liveInterval);liveInterval=null;}
  const elapsed=(Date.now()-startTime)/1000, min=elapsed/60;
  const wpm=min>0?Math.round((currentText.length/5)/min):0;
  const acc=totalKeystrokes>0?Math.round(((totalKeystrokes-errors)/totalKeystrokes)*100):100;
  const best=wpm>bestWpm; if(best) bestWpm=wpm;
  document.getElementById('finalWpm').textContent=wpm+(best?' NEW BEST!':'');
  document.getElementById('finalWpm').className='result-value'+(best?' new-best':'');
  document.getElementById('resultsTitle').textContent=best?'New Record!':'Round Complete!';
  document.getElementById('finalAccuracy').textContent=acc+'%';
  document.getElementById('finalChars').textContent=currentText.length;
  document.getElementById('finalErrors').textContent=errors;
  document.getElementById('finalTime').textContent=elapsed.toFixed(1)+'s';
  document.getElementById('finalStreak').textContent=maxStreak;
  document.getElementById('resultsOverlay').classList.add('visible');
  inp.disabled=true;
  document.getElementById('bestWpm').textContent=bestWpm;
}

inp.addEventListener('keydown',(e)=>{
  if(!gameActive) return;
  if(['Tab','Escape','Backspace','Shift','Control','Alt','Meta','CapsLock'].includes(e.key)) return;
  e.preventDefault();
  if(!startTime) startTime=Date.now();
  if(charIndex>=currentText.length) return;
  totalKeystrokes++;
  if(e.key===currentText[charIndex]){
    charIndex++; streak++;
    if(streak>maxStreak) maxStreak=streak;
    if(currentText[charIndex-1]===' ') wordsCompleted++;
    area.classList.remove('has-error');
  } else {
    errors++; streak=0;
    area.classList.add('has-error');
    setTimeout(()=>area.classList.remove('has-error'),250);
  }
  renderWords(); updateStats();
  if(charIndex>=currentText.length){ wordsCompleted++; showResults(); }
});

document.querySelectorAll('[data-lang]').forEach(b=>{
  b.addEventListener('click',()=>{
    document.querySelectorAll('[data-lang]').forEach(x=>x.classList.remove('active'));
    b.classList.add('active'); language=b.dataset.lang; startGame();
  });
});
document.querySelectorAll('.diff-btn').forEach(b=>{
  b.addEventListener('click',()=>{
    document.querySelectorAll('.diff-btn').forEach(x=>x.classList.remove('active'));
    b.classList.add('active'); difficulty=b.dataset.diff; startGame();
  });
});
const wc=[10,15,25,50,100]; let wci=0;
document.getElementById('wordsToggle').addEventListener('click',()=>{
  wci=(wci+1)%wc.length; wordCount=wc[wci];
  document.getElementById('wordsToggle').textContent=wordCount+' Words'; startGame();
});
document.getElementById('restartBtn').addEventListener('click', startGame);
document.getElementById('playAgainBtn').addEventListener('click', startGame);

renderKeyboard(); startGame();
</script>
</body>
</html>`;
}
