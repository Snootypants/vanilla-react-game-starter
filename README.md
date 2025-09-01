# Vanilla React Game Starter

Minimal React + Three.js + Vite starter with:

- WebGL renderer + RAF loop (delta time)
- Resize + DPR handling 
- PostFX (EffectComposer, Bloom, Outline, Vignette) wired but toggleable
- Keyboard/mouse input scaffold
- Diff-based workflow under `/diffs/`

## Quick Start

```bash
git clone <this repo>
cd vanilla-react-game-starter/reactShell
npm install
npm run dev     # http://localhost:3000
npm run build
npm run preview # http://localhost:4173
```

## Project Layout

```
reactShell/
├── src/
│   ├── game/
│   │   ├── entities/     # Game entities (empty starter)
│   │   ├── systems/      # Game systems (empty starter)
│   │   ├── render/       # PostFX, Scene, Materials
│   │   └── Input.ts      # Keyboard/mouse input
│   ├── ui/               # React UI components
│   ├── App.tsx           # Main React app
│   └── main.tsx          # Entry point
└── diffs/                # Diff-based workflow history
```

## How to Use

Build your game on top of this starter:

1. **Add entities** under `src/game/entities/`
2. **Add systems** under `src/game/systems/`
3. **Wire into GameCanvas** update loop
4. **Keep PostFX** default on direct render; enable composer only if you want effects

## Starter TODO Checklist

- [ ] Rename package (`reactShell/package.json` → `"name": "vanilla-react-game-starter"`)
- [ ] Set your own license/owner/year in `/LICENSE`
- [ ] Add Ship entity (example)
- [ ] Add bullets/asteroids systems, collisions
- [ ] Add HUD/UI
- [ ] Add tests/lint as desired

## Parity Note

This starter ships a working renderer; gameplay is intentionally empty.