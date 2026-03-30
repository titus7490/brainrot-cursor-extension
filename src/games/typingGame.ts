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
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    background: #0e0e10;
    color: #efeff1;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding: 24px;
    user-select: none;
  }
  h1 {
    font-size: 28px;
    font-weight: 700;
    background: linear-gradient(135deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 8px;
  }
  .subtitle { color: #adadb8; font-size: 14px; margin-bottom: 20px; }

  .stats-bar {
    display: flex;
    gap: 24px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .stat {
    background: #18181b;
    border: 1px solid #2d2d35;
    border-radius: 12px;
    padding: 12px 20px;
    text-align: center;
    min-width: 100px;
  }
  .stat-value {
    font-size: 28px;
    font-weight: 700;
    color: #48dbfb;
  }
  .stat-label {
    font-size: 11px;
    color: #adadb8;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 4px;
  }
  .stat.accuracy .stat-value { color: #1dd1a1; }
  .stat.streak .stat-value { color: #feca57; }
  .stat.errors .stat-value { color: #ff6b6b; }
  .stat.best .stat-value { color: #ff9ff3; }

  .options-bar {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .opt-btn {
    padding: 8px 20px;
    border-radius: 20px;
    border: 1px solid #2d2d35;
    background: #18181b;
    color: #adadb8;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    transition: all 0.2s;
  }
  .opt-btn:hover { border-color: #48dbfb; color: #efeff1; }
  .opt-btn.active {
    background: #48dbfb;
    color: #0e0e10;
    border-color: #48dbfb;
  }
  .opt-btn.lang-btn.active {
    background: #ff9ff3;
    border-color: #ff9ff3;
  }

  .word-display {
    background: #18181b;
    border: 1px solid #2d2d35;
    border-radius: 16px;
    padding: 24px 32px;
    margin-bottom: 24px;
    min-height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 3px;
    max-width: 750px;
    width: 100%;
    line-height: 1.6;
  }
  .word-display .char {
    font-family: 'Cascadia Code', 'Fira Code', 'JetBrains Mono', monospace;
    font-size: 26px;
    letter-spacing: 1px;
    transition: color 0.1s;
  }
  .char.pending { color: #53535f; }
  .char.current { color: #efeff1; background: #2d2d35; border-radius: 4px; padding: 0 2px; }
  .char.correct { color: #1dd1a1; }
  .char.incorrect { color: #ff6b6b; text-decoration: underline; }
  .char.space-marker { width: 8px; display: inline-block; }

  .input-area {
    width: 100%;
    max-width: 750px;
    margin-bottom: 24px;
  }
  #typingInput {
    width: 100%;
    padding: 16px 20px;
    font-size: 20px;
    font-family: 'Cascadia Code', 'Fira Code', monospace;
    background: #18181b;
    border: 2px solid #2d2d35;
    border-radius: 12px;
    color: #efeff1;
    outline: none;
    transition: border-color 0.2s;
  }
  #typingInput:focus { border-color: #48dbfb; }
  #typingInput.error { border-color: #ff6b6b; animation: shake 0.3s; }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    75% { transform: translateX(4px); }
  }

  .keyboard {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    margin-bottom: 24px;
    opacity: 0.9;
  }
  .kb-row { display: flex; gap: 5px; }
  .key {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    font-family: 'Cascadia Code', monospace;
    border: 1px solid #2d2d35;
    transition: all 0.15s;
  }
  .key.finger-left-pinky { background: #ff6b6b22; color: #ff6b6b; border-color: #ff6b6b44; }
  .key.finger-left-ring { background: #feca5722; color: #feca57; border-color: #feca5744; }
  .key.finger-left-middle { background: #1dd1a122; color: #1dd1a1; border-color: #1dd1a144; }
  .key.finger-left-index { background: #48dbfb22; color: #48dbfb; border-color: #48dbfb44; }
  .key.finger-right-index { background: #48dbfb22; color: #48dbfb; border-color: #48dbfb44; }
  .key.finger-right-middle { background: #1dd1a122; color: #1dd1a1; border-color: #1dd1a144; }
  .key.finger-right-ring { background: #feca5722; color: #feca57; border-color: #feca5744; }
  .key.finger-right-pinky { background: #ff6b6b22; color: #ff6b6b; border-color: #ff6b6b44; }
  .key.finger-thumb { background: #ff9ff322; color: #ff9ff3; border-color: #ff9ff344; }
  .key.highlight {
    transform: scale(1.15);
    box-shadow: 0 0 12px currentColor;
    z-index: 2;
  }
  .key.space { width: 200px; }

  .controls {
    display: flex; gap: 12px; flex-wrap: wrap; justify-content: center;
  }
  .btn {
    padding: 10px 24px;
    border-radius: 10px;
    border: none;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-primary { background: #48dbfb; color: #0e0e10; }
  .btn-primary:hover { background: #6ee5fd; transform: translateY(-1px); }
  .btn-secondary { background: #2d2d35; color: #efeff1; }
  .btn-secondary:hover { background: #3d3d45; }

  .results-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(14,14,16,0.92);
    z-index: 100;
    justify-content: center;
    align-items: center;
  }
  .results-overlay.visible { display: flex; }
  .results-card {
    background: #18181b;
    border: 1px solid #2d2d35;
    border-radius: 20px;
    padding: 40px;
    text-align: center;
    max-width: 420px;
    width: 90%;
  }
  .results-card h2 {
    font-size: 24px;
    margin-bottom: 24px;
    background: linear-gradient(135deg, #48dbfb, #1dd1a1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .result-row {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #2d2d35;
    font-size: 15px;
  }
  .result-row:last-of-type { border-bottom: none; }
  .result-label { color: #adadb8; }
  .result-value { font-weight: 700; }
  .new-best { color: #ff9ff3 !important; }
</style>
</head>
<body>
  <h1>⌨️ Typing Trainer</h1>
  <p class="subtitle">Learn 10-finger typing — type the words as fast and accurate as you can!</p>

  <div class="stats-bar">
    <div class="stat"><div class="stat-value" id="wpm">0</div><div class="stat-label">WPM</div></div>
    <div class="stat accuracy"><div class="stat-value" id="accuracy">100%</div><div class="stat-label">Accuracy</div></div>
    <div class="stat streak"><div class="stat-value" id="streak">0</div><div class="stat-label">Streak</div></div>
    <div class="stat errors"><div class="stat-value" id="errorCount">0</div><div class="stat-label">Errors</div></div>
    <div class="stat"><div class="stat-value" id="wordsLeft">0</div><div class="stat-label">Words Left</div></div>
    <div class="stat best"><div class="stat-value" id="bestWpm">-</div><div class="stat-label">Best WPM</div></div>
  </div>

  <div class="options-bar">
    <button class="opt-btn lang-btn active" data-lang="en">🇬🇧 English</button>
    <button class="opt-btn lang-btn" data-lang="de">🇩🇪 Deutsch</button>
    <span style="width:12px"></span>
    <button class="opt-btn diff-btn active" data-diff="easy">Easy</button>
    <button class="opt-btn diff-btn" data-diff="medium">Medium</button>
    <button class="opt-btn diff-btn" data-diff="hard">Hard</button>
  </div>

  <div class="word-display" id="wordDisplay"></div>

  <div class="input-area">
    <input type="text" id="typingInput" placeholder="Start typing here..." autocomplete="off" spellcheck="false" autofocus />
  </div>

  <div class="keyboard" id="keyboard"></div>

  <div class="controls">
    <button class="btn btn-primary" id="restartBtn">🔄 New Round</button>
    <button class="btn btn-secondary" id="wordsToggle">10 Words</button>
  </div>

  <div class="results-overlay" id="resultsOverlay">
    <div class="results-card">
      <h2 id="resultsTitle">🎉 Round Complete!</h2>
      <div class="result-row"><span class="result-label">Words per Minute</span><span class="result-value" id="finalWpm">0</span></div>
      <div class="result-row"><span class="result-label">Accuracy</span><span class="result-value" id="finalAccuracy">100%</span></div>
      <div class="result-row"><span class="result-label">Total Characters</span><span class="result-value" id="finalChars">0</span></div>
      <div class="result-row"><span class="result-label">Errors</span><span class="result-value" id="finalErrors">0</span></div>
      <div class="result-row"><span class="result-label">Time</span><span class="result-value" id="finalTime">0s</span></div>
      <div class="result-row"><span class="result-label">Best Streak</span><span class="result-value" id="finalStreak">0</span></div>
      <br/>
      <button class="btn btn-primary" id="playAgainBtn">🔄 Play Again</button>
    </div>
  </div>

<script>
const WORDS = ${wordListsJson};
const FINGER_MAP = {
  'q':'left-pinky','a':'left-pinky','z':'left-pinky',
  'w':'left-ring','s':'left-ring','x':'left-ring',
  'e':'left-middle','d':'left-middle','c':'left-middle',
  'r':'left-index','f':'left-index','v':'left-index','t':'left-index','g':'left-index','b':'left-index',
  'y':'right-index','h':'right-index','n':'right-index','u':'right-index','j':'right-index','m':'right-index',
  'i':'right-middle','k':'right-middle',',':'right-middle',
  'o':'right-ring','l':'right-ring','.':'right-ring',
  'p':'right-pinky',';':'right-pinky','/':'right-pinky',
  ' ':'thumb',
};

let language = 'en';
let difficulty = 'easy';
let wordCount = 10;
let words = [];
let currentText = '';
let charIndex = 0;
let startTime = null;
let totalKeystrokes = 0;
let errors = 0;
let streak = 0;
let maxStreak = 0;
let wordsCompleted = 0;
let gameActive = false;
let bestWpm = 0;
let liveWpmInterval = null;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickWords() {
  const pool = WORDS[language][difficulty];
  const shuffled = shuffle(pool);
  if (shuffled.length >= wordCount) return shuffled.slice(0, wordCount);
  const result = [];
  while (result.length < wordCount) {
    result.push(...shuffle(pool));
  }
  return result.slice(0, wordCount);
}

function renderKeyboard() {
  const rows = [
    ['q','w','e','r','t','y','u','i','o','p'],
    ['a','s','d','f','g','h','j','k','l',';'],
    ['z','x','c','v','b','n','m',',','.','/'],
    [' '],
  ];
  const kb = document.getElementById('keyboard');
  kb.innerHTML = '';
  for (const row of rows) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'kb-row';
    for (const key of row) {
      const keyDiv = document.createElement('div');
      const finger = FINGER_MAP[key] || '';
      keyDiv.className = 'key finger-' + finger + (key === ' ' ? ' space' : '');
      keyDiv.dataset.key = key;
      keyDiv.textContent = key === ' ' ? 'SPACE' : key.toUpperCase();
      rowDiv.appendChild(keyDiv);
    }
    kb.appendChild(rowDiv);
  }
}

function highlightKey(ch) {
  document.querySelectorAll('.key').forEach(k => k.classList.remove('highlight'));
  const target = ch.toLowerCase();
  const el = document.querySelector('.key[data-key="' + CSS.escape(target) + '"]');
  if (el) el.classList.add('highlight');
}

function renderWord() {
  const display = document.getElementById('wordDisplay');
  display.innerHTML = '';
  for (let i = 0; i < currentText.length; i++) {
    const span = document.createElement('span');
    span.className = 'char';
    if (currentText[i] === ' ') span.classList.add('space-marker');
    span.textContent = currentText[i] === ' ' ? ' ' : currentText[i];
    if (i < charIndex) {
      span.classList.add('correct');
    } else if (i === charIndex) {
      span.classList.add('current');
    } else {
      span.classList.add('pending');
    }
    display.appendChild(span);
  }
  if (charIndex < currentText.length) {
    highlightKey(currentText[charIndex]);
  }
}

function calcWpm() {
  if (!startTime) return 0;
  const elapsed = (Date.now() - startTime) / 1000 / 60;
  return elapsed > 0 ? Math.round((charIndex / 5) / elapsed) : 0;
}

function updateStats() {
  const wpm = calcWpm();
  const acc = totalKeystrokes > 0 ? Math.round(((totalKeystrokes - errors) / totalKeystrokes) * 100) : 100;

  document.getElementById('wpm').textContent = wpm;
  document.getElementById('accuracy').textContent = acc + '%';
  document.getElementById('streak').textContent = streak;
  document.getElementById('errorCount').textContent = errors;
  document.getElementById('wordsLeft').textContent = Math.max(0, wordCount - wordsCompleted);
  document.getElementById('bestWpm').textContent = bestWpm > 0 ? bestWpm : '-';
}

function startGame() {
  words = pickWords();
  currentText = words.join(' ');
  charIndex = 0;
  startTime = null;
  totalKeystrokes = 0;
  errors = 0;
  streak = 0;
  maxStreak = 0;
  wordsCompleted = 0;
  gameActive = true;

  if (liveWpmInterval) clearInterval(liveWpmInterval);
  liveWpmInterval = setInterval(() => { if (gameActive && startTime) updateStats(); }, 500);

  document.getElementById('typingInput').value = '';
  document.getElementById('typingInput').disabled = false;
  document.getElementById('typingInput').focus();
  document.getElementById('resultsOverlay').classList.remove('visible');

  renderWord();
  updateStats();
}

function showResults() {
  gameActive = false;
  if (liveWpmInterval) { clearInterval(liveWpmInterval); liveWpmInterval = null; }

  const elapsed = (Date.now() - startTime) / 1000;
  const minutes = elapsed / 60;
  const wpm = minutes > 0 ? Math.round((currentText.length / 5) / minutes) : 0;
  const acc = totalKeystrokes > 0 ? Math.round(((totalKeystrokes - errors) / totalKeystrokes) * 100) : 100;

  const isNewBest = wpm > bestWpm;
  if (isNewBest) bestWpm = wpm;

  document.getElementById('finalWpm').textContent = wpm + (isNewBest ? ' 🏆 NEW BEST!' : '');
  document.getElementById('finalWpm').className = 'result-value' + (isNewBest ? ' new-best' : '');
  document.getElementById('resultsTitle').textContent = isNewBest ? '🏆 New Record!' : '🎉 Round Complete!';
  document.getElementById('finalAccuracy').textContent = acc + '%';
  document.getElementById('finalChars').textContent = currentText.length;
  document.getElementById('finalErrors').textContent = errors;
  document.getElementById('finalTime').textContent = elapsed.toFixed(1) + 's';
  document.getElementById('finalStreak').textContent = maxStreak;
  document.getElementById('resultsOverlay').classList.add('visible');
  document.getElementById('typingInput').disabled = true;
  document.getElementById('bestWpm').textContent = bestWpm;
}

document.getElementById('typingInput').addEventListener('keydown', (e) => {
  if (!gameActive) return;
  if (e.key === 'Tab' || e.key === 'Escape') return;
  if (e.key === 'Backspace' || e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta' || e.key === 'CapsLock') return;

  e.preventDefault();
  if (!startTime) startTime = Date.now();

  if (charIndex >= currentText.length) return;

  totalKeystrokes++;
  const expected = currentText[charIndex];

  if (e.key === expected) {
    charIndex++;
    streak++;
    if (streak > maxStreak) maxStreak = streak;
    if (expected === ' ') wordsCompleted++;
    document.getElementById('typingInput').classList.remove('error');
  } else {
    errors++;
    streak = 0;
    document.getElementById('typingInput').classList.add('error');
    setTimeout(() => document.getElementById('typingInput').classList.remove('error'), 300);
  }

  const displayedText = currentText.substring(0, charIndex);
  document.getElementById('typingInput').value = displayedText.split(' ').pop() || '';

  renderWord();
  updateStats();

  if (charIndex >= currentText.length) {
    wordsCompleted++;
    showResults();
  }
});

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    language = btn.dataset.lang;
    startGame();
  });
});

document.querySelectorAll('.diff-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    difficulty = btn.dataset.diff;
    startGame();
  });
});

const wordCounts = [10, 15, 25, 50, 100];
let wordCountIdx = 0;
document.getElementById('wordsToggle').addEventListener('click', () => {
  wordCountIdx = (wordCountIdx + 1) % wordCounts.length;
  wordCount = wordCounts[wordCountIdx];
  document.getElementById('wordsToggle').textContent = wordCount + ' Words';
  startGame();
});

document.getElementById('restartBtn').addEventListener('click', startGame);
document.getElementById('playAgainBtn').addEventListener('click', startGame);

renderKeyboard();
startGame();
</script>
</body>
</html>`;
}
