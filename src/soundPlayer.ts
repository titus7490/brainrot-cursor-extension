import * as path from 'path';
import * as fs from 'fs';
import { spawn, execFile } from 'child_process';
import * as vscode from 'vscode';

const BUILT_IN_SOUNDS = [
  'faaaah', 'fatality', 'joker',
  'aaaaaaaa', 'ack', 'bone-crack', 'bruh', 'error',
  'fortnite', 'fortnite-bass-boosted', 'get-out',
  'gunshot', 'metal-pipe-clang', 'rehehehe', 'vine',
] as const;
type BuiltInSound = (typeof BUILT_IN_SOUNDS)[number];
type SoundChoice = BuiltInSound | 'random';

export class SoundPlayer {
  private readonly soundsDir: string;
  private readonly log: (msg: string) => void;
  private detectedPlayer: { cmd: string; buildArgs: (file: string, vol: number) => string[] } | null = null;

  constructor(extensionPath: string, log: (msg: string) => void) {
    this.soundsDir = path.join(extensionPath, 'sounds');
    this.log = log;
    this.log(`Sounds directory: ${this.soundsDir}`);
  }

  play(): void {
    const config = vscode.workspace.getConfiguration('brainrot');
    const volume = config.get<number>('volume', 0.7);
    const customPath = config.get<string>('customSoundPath', '');
    const soundChoice = config.get<SoundChoice>('sound', 'faaaah');

    const filePath = this.resolveSoundFile(soundChoice, customPath);
    if (!filePath) {
      return;
    }

    this.log(`Playing: ${filePath} (volume: ${volume})`);
    this.fireAndForget(filePath, volume);
  }

  private resolveSoundFile(choice: SoundChoice, customPath: string): string | null {
    if (customPath) {
      if (fs.existsSync(customPath)) {
        return customPath;
      }
      this.log(`Custom sound not found: ${customPath}`);
      return null;
    }

    const name = choice === 'random'
      ? BUILT_IN_SOUNDS[Math.floor(Math.random() * BUILT_IN_SOUNDS.length)]
      : choice;

    const filePath = path.join(this.soundsDir, `${name}.wav`);
    if (!fs.existsSync(filePath)) {
      this.log(`Built-in sound not found: ${filePath}`);
      return null;
    }
    return filePath;
  }

  private fireAndForget(filePath: string, volume: number): void {
    const platform = process.platform;

    if (platform === 'darwin') {
      this.spawnDetached('afplay', [filePath, '-v', String(Math.max(0, Math.min(volume, 1)))]);
    } else if (platform === 'win32') {
      this.spawnDetached('powershell', [
        '-NoProfile', '-NonInteractive', '-Command',
        `(New-Object Media.SoundPlayer '${filePath.replace(/'/g, "''")}').PlaySync()`,
      ]);
    } else {
      this.playLinuxParallel(filePath, volume);
    }
  }

  private spawnDetached(cmd: string, args: string[]): void {
    try {
      const child = spawn(cmd, args, {
        detached: true,
        stdio: 'ignore',
      });
      child.unref();
      this.log(`Spawned ${cmd} (pid ${child.pid})`);
    } catch (err) {
      this.log(`Failed to spawn ${cmd}: ${err}`);
    }
  }

  private playLinuxParallel(filePath: string, volume: number): void {
    if (this.detectedPlayer) {
      this.spawnDetached(this.detectedPlayer.cmd, this.detectedPlayer.buildArgs(filePath, volume));
      return;
    }

    const candidates: Array<{
      cmd: string;
      buildArgs: (file: string, vol: number) => string[];
    }> = [
      { cmd: 'paplay',  buildArgs: (f) => [f] },
      { cmd: 'ffplay',  buildArgs: (f, v) => ['-nodisp', '-autoexit', '-volume', String(Math.round(v * 100)), f] },
      { cmd: 'aplay',   buildArgs: (f) => [f] },
      { cmd: 'mpg123',  buildArgs: (f, v) => ['-f', String(Math.round(v * 32768)), f] },
    ];

    this.detectAndPlay(candidates, 0, filePath, volume);
  }

  private detectAndPlay(
    candidates: Array<{ cmd: string; buildArgs: (file: string, vol: number) => string[] }>,
    index: number,
    filePath: string,
    volume: number,
  ): void {
    if (index >= candidates.length) {
      this.log('No audio player found (tried paplay, ffplay, aplay, mpg123)');
      return;
    }

    const candidate = candidates[index];
    const args = candidate.buildArgs(filePath, volume);
    this.log(`Trying player: ${candidate.cmd}`);

    execFile(candidate.cmd, args, (err) => {
      if (err) {
        this.log(`${candidate.cmd} failed, trying next...`);
        this.detectAndPlay(candidates, index + 1, filePath, volume);
      } else {
        this.log(`Detected working player: ${candidate.cmd}`);
        this.detectedPlayer = candidate;
      }
    });
  }
}
