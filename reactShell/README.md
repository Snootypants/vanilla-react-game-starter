# Asteroids v2 - React Shell

A React/TypeScript implementation with exact parity to the vanilla HTML version.

## Development

### Setup
```bash
npm install
```

### Commands
- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Asset Requirements

Assets must be referenced exactly as in vanilla:
- Use `assets/...` paths (no leading slash)
- Mirror `/vanillaHTML/` structure exactly
- Preserve exact filename casing (e.g., `Hanger.png` with uppercase H)

Example asset references:
```typescript
// Correct
const texture = loader.load('assets/ship/ship.png')
const img = <img src="assets/start_screen.png" />

// Incorrect
const texture = loader.load('/assets/ship/ship.png')  // No leading slash
const img = <img src="assets/hanger.png" />          // Wrong case
```

## Case Sensitivity

For consistent behavior across platforms, configure git:
```bash
git config core.ignorecase false
```

## Parity Requirements

This React shell must maintain strict parity with `/vanillaHTML/`:
- Identical visual output
- Identical gameplay mechanics
- Identical asset loading
- Identical Three.js behavior

## Development Policy

All changes must be committed as full unified diffs under `/diffs/` with timestamped filenames, ready for `git apply`.