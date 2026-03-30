# Brainrot - Sound & Image on Failure

Brainrot is a Cursor/VS Code extension that plays a sound and optionally shows a random meme whenever your tests, builds, or programs fail in the terminal.

## Features

- Plays a sound on terminal failures (test, build, runtime, or any non-zero exit code)
- Shows a random image from a customizable folder on failure
- Multiple built-in sounds: FAAAAH, Fatality, Joker, or random
- Custom sound support (.wav files)
- Volume control
- Random comedic failure notifications
- Multi-framework support (Jest, Vitest, pytest, Go, Rust, Flutter, and 20+ more)
- Cross-platform (macOS, Windows, Linux)

## Installation

Download the latest `.vsix` from the [releases](https://github.com/titus7490/brainrot-cursor-extension/releases) page, then:

1. Open Cursor/VS Code
2. `Ctrl+Shift+P` → **"Extensions: Install from VSIX..."**
3. Select the downloaded `.vsix` file

## Commands

| Command | Description |
|---|---|
| Brainrot: Enable Sound on Failure | Turn it on |
| Brainrot: Disable Sound on Failure | Turn it off |
| Brainrot: Test the Sound | Preview the sound |
| Brainrot: Test Failure Image | Preview a random failure image |

## Settings

All settings are under the `brainrot.*` prefix in your editor settings.

### Triggers

| Setting | Default | Description |
|---|---|---|
| `brainrot.enabled` | `true` | Master switch |
| `brainrot.onTestFailure` | `true` | Sound on test failure |
| `brainrot.onBuildFailure` | `false` | Sound on build failure |
| `brainrot.onRuntimeFailure` | `false` | Sound on runtime crash |
| `brainrot.onAnyFailure` | `true` | Sound on ANY non-zero exit |

### Sound

| Setting | Default | Description |
|---|---|---|
| `brainrot.sound` | `"faaaah"` | Built-in sound (faaaah, fatality, joker, random) |
| `brainrot.volume` | `0.7` | Volume (0.1 – 1.0) |
| `brainrot.customSoundPath` | `""` | Path to a custom .wav file |
| `brainrot.showNotification` | `true` | Show a notification message |

### Images

| Setting | Default | Description |
|---|---|---|
| `brainrot.showFailureImage` | `false` | Show a random image on failure |
| `brainrot.failureImagesPath` | `""` | Custom path to failure images folder |

Put your images (png, jpg, gif, webp) in a `failure-images/` folder in your workspace root, or set a custom path.

## License

MIT — Titus Gaubatz
