import * as path from 'path';
import * as fs from 'fs';
import { execFile } from 'child_process';
import * as vscode from 'vscode';

const BUILT_IN_SOUNDS = ['faaaah', 'fatality', 'joker'] as const;
type BuiltInSound = (typeof BUILT_IN_SOUNDS)[number];
type SoundChoice = BuiltInSound | 'random';

export class SoundPlayer {
  private readonly soundsDir: string;
  private readonly log: (msg: string) => void;

  constructor(extensionPath: string, log: (msg: string) => void) {
    this.soundsDir = path.join(extensionPath, 'sounds');
    this.log = log;
    this.log(`Sounds directory: ${this.soundsDir}`);
  }

  async play(): Promise<void> {
    const config = vscode.workspace.getConfiguration('brainrot');
    const volume = config.get<number>('volume', 0.7);
    const customPath = config.get<string>('customSoundPath', '');
    const soundChoice = config.get<SoundChoice>('sound', 'faaaah');

    const filePath = this.resolveSoundFile(soundChoice, customPath);
    if (!filePath) {
      return;
    }

    this.log(`Playing: ${filePath} (volume: ${volume})`);

    try {
      await this.playFile(filePath, volume);
      this.log('Playback finished');
    } catch (err) {
      this.log(`Playback FAILED: ${err}`);
    }
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

  private playFile(filePath: string, volume: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const platform = process.platform;

      if (platform === 'darwin') {
        this.playMacOS(filePath, volume, resolve, reject);
      } else if (platform === 'win32') {
        this.playWindows(filePath, resolve, reject);
      } else {
        this.playLinux(filePath, volume, resolve, reject);
      }
    });
  }

  private playMacOS(
    filePath: string,
    volume: number,
    resolve: () => void,
    reject: (err: Error) => void
  ): void {
    const afplayVolume = Math.max(0, Math.min(volume, 1)).toString();
    execFile('afplay', [filePath, '-v', afplayVolume], (err: Error | null) => {
      err ? reject(err) : resolve();
    });
  }

  private playWindows(
    filePath: string,
    resolve: () => void,
    reject: (err: Error) => void
  ): void {
    const script = `(New-Object Media.SoundPlayer $args[0]).PlaySync()`;
    execFile(
      'powershell',
      ['-NoProfile', '-NonInteractive', '-Command', script, '-SoundFile', filePath],
      (err: Error | null) => {
        err ? reject(err) : resolve();
      }
    );
  }

  private playLinux(
    filePath: string,
    volume: number,
    resolve: () => void,
    reject: (err: Error) => void
  ): void {
    const players: Array<{ cmd: string; args: string[] }> = [
      { cmd: 'aplay', args: [filePath] },
      { cmd: 'paplay', args: [filePath] },
      { cmd: 'ffplay', args: ['-nodisp', '-autoexit', '-volume', String(Math.round(volume * 100)), filePath] },
      { cmd: 'mpg123', args: ['-f', String(Math.round(volume * 32768)), filePath] },
    ];

    this.tryPlayers(players, 0, resolve, reject);
  }

  private tryPlayers(
    players: Array<{ cmd: string; args: string[] }>,
    index: number,
    resolve: () => void,
    reject: (err: Error) => void
  ): void {
    if (index >= players.length) {
      reject(new Error('No audio player found (tried aplay, paplay, ffplay, mpg123)'));
      return;
    }

    const { cmd, args } = players[index];
    this.log(`Trying player: ${cmd}`);
    execFile(cmd, args, (err: Error | null) => {
      if (err) {
        this.log(`${cmd} failed, trying next...`);
        this.tryPlayers(players, index + 1, resolve, reject);
      } else {
        resolve();
      }
    });
  }
}
