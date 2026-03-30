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

    vscode.commands.registerCommand('brainrot.openGames', async () => {
      const pick = await vscode.window.showQuickPick(
        [
          { label: '$(keyboard) Typing Game', description: 'Learn 10-finger typing with fun!', id: 'typing' },
          { label: '$(heart) Cookie Clicker', description: 'Click cookies, buy upgrades, waste time!', id: 'cookie' },
        ],
        { placeHolder: 'Pick a Brainrot Game 🎮' }
      );
      if (pick?.id === 'typing') {
        vscode.commands.executeCommand('brainrot.typingGame');
      } else if (pick?.id === 'cookie') {
        vscode.commands.executeCommand('brainrot.cookieClicker');
      }
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
  statusBarItem.command = 'brainrot.testSound';
  context.subscriptions.push(statusBarItem);
  updateStatusBar();

  gamesStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 99);
  gamesStatusBarItem.text = '$(sparkle) Brainrot';
  gamesStatusBarItem.tooltip = 'Open Brainrot Games 🎮';
  gamesStatusBarItem.command = 'brainrot.openGames';
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

function handleFailure(kind: FailureKind, soundPlayer: SoundPlayer): void {
  const config = vscode.workspace.getConfiguration('brainrot');

  if (!config.get<boolean>('enabled', true)) {
    log(`Failure (${kind}) ignored — extension disabled`);
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
  statusBarItem.text = enabled ? '$(megaphone) FAAH' : '$(mute) FAAH';
  statusBarItem.tooltip = enabled ? 'Brainrot is active — click to test sound' : 'Brainrot is muted — click to test sound';
  statusBarItem.show();
}

export function deactivate(): void {
  // cleanup handled by disposables
}
