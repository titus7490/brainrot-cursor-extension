import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { SoundPlayer } from './soundPlayer';
import { FailureDetector, FailureKind } from './failureDetector';

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.bmp'];

const FAILURE_MESSAGES: Record<FailureKind, string[]> = {
  test: [
    'FAAH! Your tests called in sick today.',
    'FAAH! Looks like someone forgot to test their test.',
    'FAAH! That test had one job... ONE JOB.',
    'FAAH! Test failed. Have you tried turning it off and on again?',
    'FAAH! Another test bites the dust.',
    'FAAH! Your test suite needs a hug.',
  ],
  build: [
    'FAAH! The compiler is disappointed in you.',
    'FAAH! Build failed. Semicolons are hard.',
    'FAAH! Your code refused to compile out of protest.',
    'FAAH! The build broke. Time for coffee.',
    'FAAH! Compilation error. The computer says no.',
  ],
  runtime: [
    'FAAH! Your app just rage-quit.',
    'FAAH! Runtime error. It worked on my machine...',
    'FAAH! The program has left the building.',
    'FAAH! Crash detected. Have you tried blaming DNS?',
    'FAAH! Your process exited dramatically.',
  ],
  any: [
    'FAAH! Something went wrong. Classic.',
    'FAAH! Non-zero exit code. Not ideal.',
    'FAAH! Failure detected. Sending thoughts and prayers.',
    'FAAH! That command did not spark joy.',
    'FAAH! Error. But hey, at least the sound works.',
  ],
};

let statusBarItem: vscode.StatusBarItem;
let outputChannel: vscode.OutputChannel;
let extensionPath: string;

function log(msg: string): void {
  const ts = new Date().toLocaleTimeString();
  outputChannel.appendLine(`[${ts}] ${msg}`);
}

export function activate(context: vscode.ExtensionContext): void {
  outputChannel = vscode.window.createOutputChannel('FAAH');
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
    vscode.commands.registerCommand('faah.enable', () => {
      vscode.workspace.getConfiguration('faah').update('enabled', true, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage('FAAH sound enabled!');
    }),

    vscode.commands.registerCommand('faah.disable', () => {
      vscode.workspace.getConfiguration('faah').update('enabled', false, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage('FAAH sound disabled.');
    }),

    vscode.commands.registerCommand('faah.testSound', () => {
      log('Test sound triggered via command');
      soundPlayer.play();
      vscode.window.showInformationMessage('FAAH! (test sound)');
    }),
  );

  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.command = 'faah.testSound';
  context.subscriptions.push(statusBarItem);
  updateStatusBar();

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration('faah')) {
        updateStatusBar();
      }
    }),
  );

  log('Extension activated successfully');
}

function handleFailure(kind: FailureKind, soundPlayer: SoundPlayer): void {
  const config = vscode.workspace.getConfiguration('faah');

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
    showRandomFailureImage(config);
  }
}

function showRandomFailureImage(config: vscode.WorkspaceConfiguration): void {
  const customDir = config.get<string>('failureImagesPath', '');
  const imagesDir = customDir || path.join(extensionPath, 'failure-images');

  if (!fs.existsSync(imagesDir)) {
    log(`Failure images directory not found: ${imagesDir}`);
    return;
  }

  let files: string[];
  try {
    files = fs.readdirSync(imagesDir)
      .filter(f => IMAGE_EXTENSIONS.includes(path.extname(f).toLowerCase()));
  } catch (err) {
    log(`Failed to read failure images directory: ${err}`);
    return;
  }

  if (files.length === 0) {
    log(`No images found in: ${imagesDir}`);
    return;
  }

  const picked = files[Math.floor(Math.random() * files.length)];
  const imagePath = path.join(imagesDir, picked);
  log(`Showing failure image: ${imagePath}`);

  const uri = vscode.Uri.file(imagePath);
  vscode.commands.executeCommand('vscode.open', uri, {
    viewColumn: vscode.ViewColumn.Beside,
    preview: true,
  });
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
  const enabled = vscode.workspace.getConfiguration('faah').get<boolean>('enabled', true);
  statusBarItem.text = enabled ? '$(megaphone) FAAH' : '$(mute) FAAH';
  statusBarItem.tooltip = enabled ? 'FAAH is active — click to test sound' : 'FAAH is muted — click to test sound';
  statusBarItem.show();
}

export function deactivate(): void {
  // cleanup handled by disposables
}
