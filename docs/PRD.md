PRD: Asteroids v2 React Shell (Parity Rebuild) — updated for mouse aim and assets

Objective

Rebuild the current Three.js Asteroids MVP inside a React app with exact parity. Behavior, visuals, controls, pacing, numbers, and assets must match the vanilla HTML version. The React layer supplies bootstrapping, UI, state transitions, input dispatch, and build tooling. The Three.js simulation and rendering are modularized but must reproduce the same outputs.

Current repo layout

/AsteroidsV2/vanillaHTML/ contains the reference build: index.html, styles.css, and src/main.js with the entire game. This folder remains untouched and is the gold standard for parity checks.

Deliverable layout

Create the React shell at /AsteroidsV2/reactShell/ using Vite + React. Keep a clean separation so parity can be tested against /vanillaHTML/.

/AsteroidsV2/
  /vanillaHTML/
  /reactShell/
    index.html
    package.json
    vite.config.ts
    /public/                ← static assets for exact path parity
      start_screen.png
      gameEnd.png
      hanger.png
      ship.png
      /assets/...           ← copy any subfolders from vanilla here
    /src/
      main.tsx
      App.tsx
      /ui/
        Hud.tsx
        UpgradeMenu.tsx
        StatusOverlay.tsx
        PauseOverlay.tsx
      /game/
        GameCanvas.tsx
        GameLoop.ts
        GameState.ts
        Input.ts
        rng/SeededRng.ts
        /render/
          Scene.ts
          PostFX.ts
          Materials.ts
        /systems/
          Physics.ts
          Collision.ts
          Spawning.ts
          Upgrades.ts
        /entities/
          Ship.ts
          Asteroid.ts
          Bullet.ts
          EnemyHunter.ts
          Particles.ts
          Debris.ts
        /assets/shaders/     ← if any GLSL is used

Controls and input

Keyboard must remain unchanged. Mouse control is required:
	1.	The ship faces the mouse pointer at all times while in gameplay. Compute the ship heading by unprojecting the screen-space mouse to world space in the gameplay plane, then set rotation to atan2(target.y - ship.y, target.x - ship.x). Use the same smoothing or snap the vanilla uses. Do not alter acceleration or turn rate feel.
	2.	Left mouse button fires. Respect existing fire rate, edge-trigger behavior, and auto-repeat semantics from the vanilla build. Holding the button should behave exactly like holding Space in vanilla if that is current behavior.
	3.	Pointer handling must ignore inputs while menus or overlays are active. On resume, re-sync the aim vector to the current mouse position. Pointer lock is optional; if used, pressing Escape must cleanly release it and pause input until focus returns.
	4.	Mouse wheel, right click, or middle click have no side effects unless the vanilla version already maps them.

Asset handling

Copy all user-facing images and other static assets from /vanillaHTML/ into /reactShell/public/ so the asset paths match the vanilla references. If the vanilla references start_screen.png at the root, place it at /reactShell/public/start_screen.png. If the vanilla uses a subfolder such as assets/bg/starfield.png, mirror that under /reactShell/public/assets/bg/starfield.png. Keep filenames identical. Do not compress, rename, or transform at this stage. Reference images in React or Three as absolute paths off the Vite public root, for example /start_screen.png or /assets/....

Rendering and loop

Mount a WebGLRenderer in GameCanvas with the same orthographic camera framing, tone mapping, and color space as vanilla. Use a fixed simulation timestep with render interpolation only if the vanilla effectively used a fixed dt; otherwise preserve dt behavior to avoid feel drift. Recreate the composer chain with RenderPass, UnrealBloomPass, outline, and vignette to match thresholds and intensities.

Systems and entities

Split the monolith into modules without changing behavior. Keep numeric constants identical. Physics, collision, spawning, asteroid splitting, bullets with ship-velocity inheritance, hunters with strafing and fire, particles and debris, upgrade effects, invulnerability windows, and HUD logic must all match. The between-wave upgrade picker offers the same choices and stacking rules: Spread, Pierce, Rapid Fire, Engine Boost, Shield.

UI

Render the Three canvas full screen behind React UI. Hud shows score, wave, and combo. UpgradeMenu pauses simulation and presents choices. StatusOverlay toggles with the same key used in vanilla and prints the same diagnostics. PauseOverlay handles restart and resume. Mirror the look of styles.css for typography, spacing, and colors.

State model

Centralize game state in GameState.ts. The simulation writes snapshots. React reads via memoized selectors. UI invokes explicit commands such as start, select upgrade, and restart. Keep React components purely declarative with no simulation logic inside them.

Dependencies

React 18, Vite, Three pinned to the exact version matching the vanilla import map. Import examples modules from the same Three tag for EffectComposer, UnrealBloomPass, OutlinePass. Commit the lockfile. No SSR. No Next.js in this pass.

Build and dev

Provide npm run dev, npm run build, and npm run preview. Both dev server and built preview must render identically on the same machine.

Acceptance criteria

Launching /reactShell/ starts wave 1 with the same asteroid counts, sizes, speeds, and spawn variance as /vanillaHTML/. Pressing W, A, D, or arrow keys produces the same motion and turn feel. Moving the mouse rotates the ship to face the pointer at the same apparent latency and precision seen in vanilla. Left click fires with the same cadence, muzzle origin, and inheritance of ship velocity as Space in vanilla. Asteroids split into the same fragment counts and velocities. Hunters appear at wave 3 with the same telegraph, movement, and fire timing. Particles and debris match in density, lifetime, and fade. The HUD shows the same values at all points. Between waves, the upgrade picker shows the same options and applies identical effects. Shield and spawn invulnerability windows look and time the same. Status overlay toggles with the same hotkey and shows the same diagnostics. Restart returns to wave 1 and fully resets state. start_screen.png, gameEnd.png, hanger.png, ship.png, and every other vanilla asset are present in /reactShell/public/ at paths that produce identical visuals. A back-to-back test against /vanillaHTML/ shows no perceivable difference in control feel, visuals, or pacing.

Risks

Input latency can drift if event processing differs between React and vanilla. Keep input sampling on each frame and avoid React re-render coupling. Visual drift can occur if Three example modules are not matched to the core version. Timestep changes can alter fire cadence or AI timing. Asset path mismatches will break splash screens; mirror paths exactly.

Done means

Players cannot distinguish the React shell from the vanilla version in a side-by-side comparison. Mouse aim and left-click fire behave exactly like the vanilla experience. All assets load from identical paths and produce identical screens. Dev server and production preview both run locally without any web push.