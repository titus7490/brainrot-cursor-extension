import * as vscode from 'vscode';
import { SoundPlayer } from './soundPlayer';
import { FailureDetector, FailureKind } from './failureDetector';

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

export function activate(context: vscode.ExtensionContext): void {
  const soundPlayer = new SoundPlayer(context.extensionPath);

  const detector = new FailureDetector((kind: FailureKind) => {
    handleFailure(kind, soundPlayer);
  });

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
}

function handleFailure(kind: FailureKind, soundPlayer: SoundPlayer): void {
  const config = vscode.workspace.getConfiguration('faah');

  if (!config.get<boolean>('enabled', true)) {
    return;
  }

  const allowed = isFailureKindAllowed(kind, config);
  if (!allowed) {
    return;
  }

  soundPlayer.play();

  if (config.get<boolean>('showNotification', true)) {
    const messages = FAILURE_MESSAGES[kind];
    const message = messages[Math.floor(Math.random() * messages.length)];
    vscode.window.showWarningMessage(message);
  }
}

function isFailureKindAllowed(kind: FailureKind, config: vscode.WorkspaceConfiguration): boolean {
  if (config.get<boolean>('onAnyFailure', false)) {
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
