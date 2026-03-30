import * as vscode from 'vscode';
import * as path from 'path';
import { SoundPlayer } from './soundPlayer';
import { FailureDetector, FailureKind } from './failureDetector';
import { createTypingGamePanel } from './games/typingGame';
import { createCookieClickerPanel } from './games/cookieClicker';

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.bmp']);

const FAILURE_MESSAGES: Record<FailureKind, string[]> = {
  test: [
    'Brainrot! Your tests called in sick today.',
    'Brainrot! Looks like someone forgot to test their test.',
    'Brainrot! That test had one job... ONE JOB.',
    'Brainrot! Test failed. Have you tried turning it off and on again?',
    'Brainrot! Another test bites the dust.',
    'Brainrot! Your test suite needs a hug.',
  ],
  build: [
    'Brainrot! The compiler is disappointed in you.',
    'Brainrot! Build failed. Semicolons are hard.',
    'Brainrot! Your code refused to compile out of protest.',
    'Brainrot! The build broke. Time for coffee.',
    'Brainrot! Compilation error. The computer says no.',
  ],
  runtime: [
    'Brainrot! Your app just rage-quit.',
    'Brainrot! Runtime error. It worked on my machine...',
    'Brainrot! The program has left the building.',
    'Brainrot! Crash detected. Have you tried blaming DNS?',
    'Brainrot! Your process exited dramatically.',
  ],
  any: [
    'Brainrot! Something went wrong. Classic.',
    'Brainrot! Non-zero exit code. Not ideal.',
    'Brainrot! Failure detected. Sending thoughts and prayers.',
    'Brainrot! That command did not spark joy.',
    'Brainrot! Error. But hey, at least the sound works.',
  ],
};

let statusBarItem: vscode.StatusBarItem;
let gamesStatusBarItem: vscode.StatusBarItem;
let outputChannel: vscode.OutputChannel;
let extensionPath: string;
let typingGamePanel: vscode.WebviewPanel | undefined;
let cookieClickerPanel: vscode.WebviewPanel | undefined;
let snoozeUntil: number = 0;
let snoozeTimer: ReturnType<typeof setTimeout> | undefined;

function log(msg: string): void {
  const ts = new Date().toLocaleTimeString();
  outputChannel.appendLine(`[${ts}] ${msg}`);
}

export function activate(context: vscode.ExtensionContext): void {
  outputChannel = vscode.window.createOutputChannel('Brainrot');
  context.subscriptions.push(outputChannel);

  extensionPath = context.extensionPath;

  log('Extension activating...');
  log(`Extension path: ${extensionPath}`);
  log(`Platform: ${process.platform}`);

  const soundPlayer = new SoundPlayer(context.extensionPath, log);

  const detector = new FailureDetector((kind: FailureKind) => {
    handleFailure(kind, soundPlayer);
  }, log);

  detector.activate(context);

  context.subscriptions.push(
    vscode.commands.registerCommand('brainrot.enable', () => {
      vscode.workspace.getConfiguration('brainrot').update('enabled', true, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage('Brainrot sound enabled!');
    }),

    vscode.commands.registerCommand('brainrot.disable', () => {
      vscode.workspace.getConfiguration('brainrot').update('enabled', false, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage('Brainrot sound disabled.');
    }),

    vscode.commands.registerCommand('brainrot.testSound', () => {
      log('Test sound triggered via command');
      soundPlayer.play();
      vscode.window.showInformationMessage('Brainrot! (test sound)');
    }),

    vscode.commands.registerCommand('brainrot.testImage', async () => {
      log('Test image triggered via command');
      const config = vscode.workspace.getConfiguration('brainrot');
      try {
        await showRandomFailureImage(config);
      } catch (err) {
        log(`Test image failed: ${err}`);
        vscode.window.showErrorMessage(`Brainrot image test failed: ${err}`);
      }
    }),

    vscode.commands.registerCommand('brainrot.snooze', async () => {
      const picks = [
        { label: '$(clock) 15 minutes', minutes: 15 },
        { label: '$(clock) 30 minutes', minutes: 30 },
        { label: '$(clock) 1 hour', minutes: 60 },
        { label: '$(clock) 2 hours', minutes: 120 },
        { label: '$(clock) Until restart', minutes: -1 },
        { label: '$(check) Cancel snooze', minutes: 0 },
      ];

      const pick = await vscode.window.showQuickPick(picks, {
        placeHolder: isSnoozed() ? `Snoozed — pick a new duration or cancel` : 'Snooze Brainrot for...',
      });
      if (!pick) { return; }

      if (snoozeTimer) { clearTimeout(snoozeTimer); snoozeTimer = undefined; }

      if (pick.minutes === 0) {
        snoozeUntil = 0;
        vscode.window.showInformationMessage('Brainrot snooze cancelled — sounds are back!');
      } else if (pick.minutes === -1) {
        snoozeUntil = Infinity;
        vscode.window.showInformationMessage('Brainrot snoozed until restart.');
      } else {
        snoozeUntil = Date.now() + pick.minutes * 60_000;
        snoozeTimer = setTimeout(() => {
          snoozeUntil = 0;
          snoozeTimer = undefined;
          updateStatusBar();
          vscode.window.showInformationMessage('Brainrot snooze ended — sounds are back!');
        }, pick.minutes * 60_000);
        vscode.window.showInformationMessage(`Brainrot snoozed for ${pick.label.replace(/\$\(clock\) /, '')}.`);
      }
      log(`Snooze set: ${pick.minutes} minutes`);
      updateStatusBar();
    }),

    vscode.commands.registerCommand('brainrot.menu', async () => {
      const snoozed = isSnoozed();
      const enabled = vscode.workspace.getConfiguration('brainrot').get<boolean>('enabled', true);
      const items = [
        { label: '$(megaphone) Test Sound', id: 'testSound' },
        { label: '$(file-media) Test Image', id: 'testImage' },
        { label: '', id: '', kind: vscode.QuickPickItemKind.Separator } as any,
        { label: snoozed ? '$(bell-slash) Cancel Snooze' : '$(bell-slash) Snooze...', id: 'snooze', description: snoozed ? getSnoozeRemaining() : '' },
        { label: enabled ? '$(close) Disable globally' : '$(check) Enable globally', id: 'toggle' },
        { label: '', id: '', kind: vscode.QuickPickItemKind.Separator } as any,
        { label: '$(keyboard) Typing Game', id: 'typing' },
        { label: '$(heart) Cookie Clicker', id: 'cookie' },
      ];

      const pick = await vscode.window.showQuickPick(items, { placeHolder: 'Brainrot Menu' });
      if (!pick) { return; }
      switch (pick.id) {
        case 'testSound': vscode.commands.executeCommand('brainrot.testSound'); break;
        case 'testImage': vscode.commands.executeCommand('brainrot.testImage'); break;
        case 'snooze': vscode.commands.executeCommand('brainrot.snooze'); break;
        case 'toggle':
          if (enabled) { vscode.commands.executeCommand('brainrot.disable'); }
          else { vscode.commands.executeCommand('brainrot.enable'); }
          break;
        case 'typing': vscode.commands.executeCommand('brainrot.typingGame'); break;
        case 'cookie': vscode.commands.executeCommand('brainrot.cookieClicker'); break;
      }
    }),

    vscode.commands.registerCommand('brainrot.openGames', async () => {
      vscode.commands.executeCommand('brainrot.menu');
    }),

    vscode.commands.registerCommand('brainrot.typingGame', () => {
      if (typingGamePanel) {
        typingGamePanel.reveal(vscode.ViewColumn.One);
      } else {
        typingGamePanel = createTypingGamePanel(context);
        typingGamePanel.onDidDispose(() => { typingGamePanel = undefined; });
      }
    }),

    vscode.commands.registerCommand('brainrot.cookieClicker', () => {
      if (cookieClickerPanel) {
        cookieClickerPanel.reveal(vscode.ViewColumn.One);
      } else {
        cookieClickerPanel = createCookieClickerPanel(context);
        cookieClickerPanel.onDidDispose(() => { cookieClickerPanel = undefined; });
      }
    }),
  );

  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.command = 'brainrot.menu';
  context.subscriptions.push(statusBarItem);
  updateStatusBar();

  gamesStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 99);
  gamesStatusBarItem.text = '$(sparkle) Brainrot';
  gamesStatusBarItem.tooltip = 'Open Brainrot Menu';
  gamesStatusBarItem.command = 'brainrot.menu';
  gamesStatusBarItem.show();
  context.subscriptions.push(gamesStatusBarItem);

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('brainrot')) {
        updateStatusBar();
      }
    }),
  );

  log('Extension activated successfully');
}

function isSnoozed(): boolean {
  if (snoozeUntil === 0) { return false; }
  if (snoozeUntil === Infinity) { return true; }
  if (Date.now() < snoozeUntil) { return true; }
  snoozeUntil = 0;
  return false;
}

function getSnoozeRemaining(): string {
  if (snoozeUntil === Infinity) { return 'until restart'; }
  if (snoozeUntil === 0) { return ''; }
  const remaining = snoozeUntil - Date.now();
  if (remaining <= 0) { return ''; }
  const mins = Math.ceil(remaining / 60_000);
  if (mins >= 60) { return `${Math.floor(mins / 60)}h ${mins % 60}m left`; }
  return `${mins}m left`;
}

function handleFailure(kind: FailureKind, soundPlayer: SoundPlayer): void {
  const config = vscode.workspace.getConfiguration('brainrot');

  if (!config.get<boolean>('enabled', true)) {
    log(`Failure (${kind}) ignored — extension disabled`);
    return;
  }

  if (isSnoozed()) {
    log(`Failure (${kind}) ignored — snoozed (${getSnoozeRemaining()})`);
    return;
  }

  const allowed = isFailureKindAllowed(kind, config);
  if (!allowed) {
    log(`Failure (${kind}) ignored — category not enabled`);
    return;
  }

  log(`Failure (${kind}) — playing sound!`);
  soundPlayer.play();

  if (config.get<boolean>('showNotification', true)) {
    const messages = FAILURE_MESSAGES[kind];
    const message = messages[Math.floor(Math.random() * messages.length)];
    vscode.window.showWarningMessage(message);
  }

  if (config.get<boolean>('showFailureImage', false)) {
    showRandomFailureImage(config).catch(err => {
      log(`Failed to show failure image: ${err}`);
    });
  }
}

let imageShowing = false;
let autoCloseTimer: ReturnType<typeof setTimeout> | undefined;

async function showRandomFailureImage(config: vscode.WorkspaceConfiguration): Promise<void> {
  if (imageShowing) {
    log('Image already showing — skipping');
    return;
  }

  const candidates = getImageDirCandidates(config);
  log(`Image dir candidates: ${candidates.map(u => u.toString()).join(', ')}`);

  for (const dirUri of candidates) {
    let entries: [string, vscode.FileType][];
    try {
      entries = await vscode.workspace.fs.readDirectory(dirUri);
    } catch {
      log(`Cannot read dir: ${dirUri.toString()}, trying next...`);
      continue;
    }

    const imageFiles = entries
      .filter(([name, type]) =>
        type === vscode.FileType.File &&
        IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase())
      )
      .map(([name]) => name);

    if (imageFiles.length === 0) {
      log(`No images in: ${dirUri.toString()}, trying next...`);
      continue;
    }

    const picked = imageFiles[Math.floor(Math.random() * imageFiles.length)];
    const imageUri = vscode.Uri.joinPath(dirUri, picked);
    log(`Opening failure image: ${imageUri.toString()}`);

    try {
      imageShowing = true;
      await vscode.commands.executeCommand('vscode.open', imageUri, vscode.ViewColumn.Beside);
      scheduleAutoClose(imageUri, config);
      return;
    } catch (openErr) {
      imageShowing = false;
      log(`vscode.open failed: ${openErr}`);
    }
  }

  log('No failure images found in any candidate directory');
}

function scheduleAutoClose(imageUri: vscode.Uri, config: vscode.WorkspaceConfiguration): void {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer);
  }

  const seconds = config.get<number>('failureImageDuration', 5);
  log(`Auto-closing image in ${seconds}s`);

  autoCloseTimer = setTimeout(() => {
    autoCloseTimer = undefined;
    imageShowing = false;

    const uriStr = imageUri.toString();
    const tab = vscode.window.tabGroups.all
      .flatMap(g => g.tabs)
      .find(t => {
        const input = t.input;
        if (input instanceof vscode.TabInputCustom && input.uri.toString() === uriStr) { return true; }
        if (input instanceof vscode.TabInputText && input.uri.toString() === uriStr) { return true; }
        return false;
      });

    if (tab) {
      vscode.window.tabGroups.close(tab).then(
        () => log('Auto-closed failure image'),
        (err) => log(`Failed to auto-close: ${err}`)
      );
    } else {
      log('Auto-close: tab not found (may have been closed manually)');
    }
  }, seconds * 1000);
}

function getImageDirCandidates(config: vscode.WorkspaceConfiguration): vscode.Uri[] {
  const uris: vscode.Uri[] = [];
  const customDir = config.get<string>('failureImagesPath', '').trim();

  const wsFolder = vscode.workspace.workspaceFolders?.[0];

  if (customDir) {
    if (wsFolder) {
      uris.push(vscode.Uri.joinPath(wsFolder.uri, customDir));
    }
    if (customDir.startsWith('/')) {
      uris.push(vscode.Uri.file(customDir));
    }
  } else {
    if (wsFolder) {
      uris.push(vscode.Uri.joinPath(wsFolder.uri, 'failure-images'));
    }
  }

  uris.push(vscode.Uri.file(path.join(extensionPath, 'failure-images')));

  return uris;
}

function isFailureKindAllowed(kind: FailureKind, config: vscode.WorkspaceConfiguration): boolean {
  if (config.get<boolean>('onAnyFailure', true)) {
    return true;
  }

  switch (kind) {
    case 'test': return config.get<boolean>('onTestFailure', true);
    case 'build': return config.get<boolean>('onBuildFailure', false);
    case 'runtime': return config.get<boolean>('onRuntimeFailure', false);
    case 'any': return false;
  }
}

function updateStatusBar(): void {
  const enabled = vscode.workspace.getConfiguration('brainrot').get<boolean>('enabled', true);
  const snoozed = isSnoozed();

  if (snoozed) {
    statusBarItem.text = '$(bell-slash) FAAH';
    statusBarItem.tooltip = `Brainrot snoozed (${getSnoozeRemaining()}) — click to open menu`;
  } else if (enabled) {
    statusBarItem.text = '$(megaphone) FAAH';
    statusBarItem.tooltip = 'Brainrot is active — click to open menu';
  } else {
    statusBarItem.text = '$(mute) FAAH';
    statusBarItem.tooltip = 'Brainrot is disabled — click to open menu';
  }
  statusBarItem.show();
}

export function deactivate(): void {
  // cleanup handled by disposables
}
