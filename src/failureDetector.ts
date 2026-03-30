import * as vscode from 'vscode';

export type FailureKind = 'test' | 'build' | 'runtime' | 'any';

const DEBOUNCE_MS = 2000;

const TEST_PATTERNS: RegExp[] = [
  /\bjest\b/, /\bvitest\b/, /\bmocha\b/, /\bjasmine\b/, /\bkarma\b/,
  /\bava\b/, /\bcypress\s+run\b/, /\bplaywright\b/, /\bpuppeteer\b/,
  /\bpytest\b/, /\bunittest\b/, /\bnose2?\b/, /\btox\b/, /\bnox\b/,
  /\brspec\b/, /\bminitest\b/, /\bruby\s+.*_test\.rb\b/,
  /\bexunit\b/, /\bmix\s+test\b/,
  /\bgo\s+test\b/, /\bcargo\s+test\b/, /\brust.*test\b/,
  /\bflutter\s+test\b/, /\bdart\s+test\b/,
  /\bdotnet\s+test\b/, /\bmstest\b/, /\bnunit\b/, /\bxunit\b/,
  /\bphpunit\b/, /\bpest\b/, /\bbehat\b/,
  /\bgradle\s+test\b/, /\bmvn\s+test\b/, /\bmaven\s+test\b/,
  /\bbun\s+test\b/, /\bdeno\s+test\b/,
  /\bnpm\s+test\b/, /\byarn\s+test\b/, /\bpnpm\s+test\b/,
  /\bmaestro\s+test\b/,
  /\bctest\b/,
];

const BUILD_PATTERNS: RegExp[] = [
  /\btsc\b/, /\btsc\s+-[bpw]\b/,
  /\bgcc\b/, /\bg\+\+\b/, /\bclang\b/, /\bmake\b/, /\bcmake\b/, /\bninja\b/,
  /\bcargo\s+build\b/, /\bcargo\s+check\b/,
  /\bgo\s+build\b/, /\bgo\s+install\b/,
  /\bwebpack\b/, /\bvite\s+build\b/, /\besbuild\b/, /\brollup\b/, /\bparcel\s+build\b/,
  /\bnext\s+build\b/, /\bnuxt\s+build\b/, /\bturbopack\b/, /\bturbo\s+build\b/,
  /\bdotnet\s+build\b/, /\bmsbuild\b/,
  /\bgradle\s+build\b/, /\bmvn\s+(?:compile|package|install)\b/,
  /\bflutter\s+build\b/, /\bdart\s+compile\b/,
  /\bswiftc\b/, /\bswift\s+build\b/, /\bxcodebuild\b/,
  /\bnpm\s+run\s+build\b/, /\byarn\s+build\b/, /\bpnpm\s+build\b/,
];

const RUNTIME_PATTERNS: RegExp[] = [
  /\bnode\s+\S/, /\bts-node\b/, /\btsx\b/, /\bnpx\b/,
  /\bpython3?\s+\S/, /\bflask\s+run\b/, /\buvicorn\b/, /\bgunicorn\b/, /\bdjango\b/,
  /\bgo\s+run\b/, /\bcargo\s+run\b/,
  /\bruby\s+\S/, /\brails\s+server\b/, /\bbundle\s+exec\b/,
  /\bjava\s+-/, /\bjava\s+\S/, /\bgradle\s+run\b/,
  /\bdotnet\s+run\b/,
  /\bflutter\s+run\b/, /\bdart\s+run\b/,
  /\bnpm\s+start\b/, /\byarn\s+start\b/, /\bpnpm\s+start\b/,
  /\bnpm\s+run\s+dev\b/, /\byarn\s+dev\b/, /\bpnpm\s+dev\b/,
  /\bdeno\s+run\b/, /\bbun\s+run\b/,
  /\bphp\s+\S/, /\bphp\s+artisan\b/,
];

const EXIT_CODE_OUTPUT_PATTERNS: RegExp[] = [
  /exited?\s*\((\d+)\)/i,
  /exit\s+code[:\s]+(\d+)/i,
  /process\s+exited\s+with\s+code\s+(\d+)/i,
  /exit\s+status[:\s]+(\d+)/i,
  /returned?\s+(\d+)/i,
];

export class FailureDetector {
  private lastTriggerTime = 0;
  private readonly onFailure: (kind: FailureKind) => void;
  private readonly log: (msg: string) => void;

  constructor(onFailure: (kind: FailureKind) => void, log: (msg: string) => void) {
    this.onFailure = onFailure;
    this.log = log;
  }

  activate(context: vscode.ExtensionContext): void {
    this.registerShellIntegration(context);
    this.registerTaskMonitor(context);
    this.registerDebugTracker(context);
  }

  private registerShellIntegration(context: vscode.ExtensionContext): void {
    if (typeof vscode.window.onDidEndTerminalShellExecution !== 'function') {
      this.log('WARNING: Shell integration API (onDidEndTerminalShellExecution) not available.');
      this.log('Terminal command monitoring will not work. Task and debug monitoring are still active.');
      vscode.window.showWarningMessage(
        'Brainrot: Shell integration API not available in this editor version. ' +
        'Terminal error detection may be limited. Try "Brainrot: Test the Sound" to verify audio works.'
      );
      return;
    }

    this.log('Shell integration API available — registering terminal monitor');

    const disposable = vscode.window.onDidEndTerminalShellExecution((e) => {
      const exitCode = e.exitCode;
      const cmd = e.execution.commandLine?.value ?? '(unknown)';
      this.log(`Shell execution ended: cmd="${cmd}", exitCode=${exitCode}`);

      if (exitCode !== undefined && exitCode !== 0) {
        const kind = this.classifyCommand(cmd);
        this.log(`Non-zero exit (${exitCode}) detected, classified as: ${kind}`);
        this.trigger(kind);
      }
    });

    context.subscriptions.push(disposable);
  }

  private registerTaskMonitor(context: vscode.ExtensionContext): void {
    this.log('Registering task process monitor');

    const disposable = vscode.tasks.onDidEndTaskProcess((e) => {
      const taskName = e.execution.task.name;
      this.log(`Task ended: name="${taskName}", exitCode=${e.exitCode}`);

      if (e.exitCode !== undefined && e.exitCode !== 0) {
        const kind = this.classifyTask(e.execution.task);
        this.log(`Task failure detected, classified as: ${kind}`);
        this.trigger(kind);
      }
    });

    context.subscriptions.push(disposable);
  }

  private registerDebugTracker(context: vscode.ExtensionContext): void {
    this.log('Registering debug adapter tracker');
    const detector = this;

    const disposable = vscode.debug.registerDebugAdapterTrackerFactory('*', {
      createDebugAdapterTracker(): vscode.DebugAdapterTracker {
        return {
          onDidSendMessage(message: { type?: string; event?: string; body?: Record<string, unknown> }) {
            if (message.type !== 'event') {
              return;
            }

            if (message.event === 'exited') {
              const exitCode = message.body?.exitCode as number | undefined;
              detector.log(`Debug session exited with code: ${exitCode}`);
              if (exitCode !== undefined && exitCode !== 0) {
                detector.trigger('runtime');
              }
              return;
            }

            if (message.event === 'output') {
              const text = (message.body?.output as string) ?? '';
              const code = detector.parseExitCodeFromOutput(text);
              if (code !== null && code !== 0) {
                detector.log(`Debug output contains exit code: ${code}`);
                detector.trigger('runtime');
              }
            }
          },
        };
      },
    });

    context.subscriptions.push(disposable);
  }

  private parseExitCodeFromOutput(text: string): number | null {
    for (const pattern of EXIT_CODE_OUTPUT_PATTERNS) {
      const match = pattern.exec(text);
      if (match?.[1]) {
        return parseInt(match[1], 10);
      }
    }
    return null;
  }

  private classifyCommand(cmd: string): FailureKind {
    const extra = this.getExtraPatterns();

    for (const pattern of [...extra.test, ...TEST_PATTERNS]) {
      if (pattern.test(cmd)) { return 'test'; }
    }
    for (const pattern of [...extra.build, ...BUILD_PATTERNS]) {
      if (pattern.test(cmd)) { return 'build'; }
    }
    for (const pattern of [...extra.runtime, ...RUNTIME_PATTERNS]) {
      if (pattern.test(cmd)) { return 'runtime'; }
    }

    return 'any';
  }

  private classifyTask(task: vscode.Task): FailureKind {
    if (task.group === vscode.TaskGroup.Test) { return 'test'; }
    if (task.group === vscode.TaskGroup.Build) { return 'build'; }

    const cmdString = this.extractTaskCommand(task);
    if (cmdString) {
      return this.classifyCommand(cmdString);
    }

    return 'any';
  }

  private extractTaskCommand(task: vscode.Task): string | null {
    const exec = task.execution;
    if (exec instanceof vscode.ShellExecution) {
      if (typeof exec.commandLine === 'string') {
        return exec.commandLine;
      }
      if (exec.command) {
        const cmd = typeof exec.command === 'string' ? exec.command : exec.command.value;
        const args = (exec.args ?? []).map(a => typeof a === 'string' ? a : a.value);
        return [cmd, ...args].join(' ');
      }
    }
    if (exec instanceof vscode.ProcessExecution) {
      return [exec.process, ...(exec.args ?? [])].join(' ');
    }
    return null;
  }

  private getExtraPatterns(): { test: RegExp[]; build: RegExp[]; runtime: RegExp[] } {
    const config = vscode.workspace.getConfiguration('brainrot');

    const toPatterns = (commands: string[]): RegExp[] =>
      commands
        .filter(c => c.trim().length > 0)
        .map(c => new RegExp(`\\b${escapeRegex(c.trim())}\\b`));

    return {
      test: toPatterns(config.get<string[]>('extraTestCommands', [])),
      build: toPatterns(config.get<string[]>('extraBuildCommands', [])),
      runtime: toPatterns(config.get<string[]>('extraRunCommands', [])),
    };
  }

  private trigger(kind: FailureKind): void {
    const now = Date.now();
    if (now - this.lastTriggerTime < DEBOUNCE_MS) {
      this.log(`Debounced (${now - this.lastTriggerTime}ms since last trigger)`);
      return;
    }
    this.lastTriggerTime = now;
    this.onFailure(kind);
  }
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
