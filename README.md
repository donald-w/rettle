# Rettle

Rettle is an Angular 21 single-page web application word guessing game with six-letter words. Originally built over a few evenings in early 2022, it now serves as a playground for AI tooling. The project follows the default Angular CLI layout with all source under `src/` and is deployed via GitHub Pages at [rettle.me](https://rettle.me/).

## Prerequisites and setup
- **Node.js 22** (see `.nvmrc`); `npm` ships with Node and is used for all scripts.
- Install dependencies with `npm ci`.

## Runbook
- **Start dev server:** `npm start` (runs `ng serve --host 0.0.0.0 --port 4200 --allowed-hosts`).
- **Lint:** `npm run lint` (ESLint) or `npm run lint:fix` to auto-fix.
- **Unit tests:** `npm test` (Karma/Jasmine, `--watch=false` by default). CI pins ChromeHeadless; local runs generally work with the default launcher.
- **Build:** `npm run build` (production build via `build:prod`, output to `dist/rettle/browser`).

## Game flow
- Six-letter word, seven attempts. The on-screen keyboard and physical keyboard both route through `GameEngineService.keyPressed`.
- Guesses are validated against `assets/3of6game.txt`; invalid entries flash tiles red. The “word of the day” is deterministic from the current date, and `window.tellme()` reveals it for debugging.
- Completing the game shows `GameCompleteComponent` with a win/lose message and a “Try a different word” button that seeds a fresh randomized word.
- The menu page offers a **New game** button (with confirmation if a game is in progress) and toggles **Colour accessibility mode**, which swaps to an alternate palette and patterned tiles; the preference persists in `localStorage`. Help provides a legend for tile colors.

## Architecture and files to know
- **Bootstrap:** Standalone `bootstrapApplication` in `src/main.ts` with `provideRouter(routes, withHashLocation())`, `provideHttpClient(withInterceptorsFromDi())`, and `provideZonelessChangeDetection()`.
- **Routing:** `src/app/app-routing.module.ts` exports `routes` mapping `/game`, `/help`, and `/menu`. `AppComponent` wraps the persistent `HeaderComponent` plus `router-outlet`.
- **State and logic:** `GameEngineService` manages board/keyboard subjects, row/column tracking, guess validation, and win/loss detection. `DictionaryService` streams readiness, builds the dictionary, and exposes deterministic selection helpers.
- **UI composition:** `GameComponent` renders a static 7×6 grid of `LetterComponent` tiles, switching between `KeyboardComponent` (while playing) and `GameCompleteComponent` (after completion). `KeyComponent` handles press events, and `KeyboardComponent` listens for physical keyup events. Styles live in `src/styles.scss` and per-component SCSS files.
- **Components at a glance:** `HeaderComponent` routes to `/menu` and `/help`; `MenuComponent` drives new games plus colour-accessibility toggles; `HelpComponent` shows a tile-state legend; `GameCompleteComponent` renders win/lose messaging and offers “Try a different word.”

## Zoneless change detection
The app runs without ZoneJS using `provideZonelessChangeDetection()`. Avoid adding `zone.js` imports and rely on Angular-managed event bindings (e.g., `@HostListener`) or explicit change detector cues when managing manual subscriptions.

## Contributing ideas
- Extend UI/UX by following the keyboard → engine → observable → component flow.
- Add tests alongside new components/services with the existing `.spec.ts` patterns under `src/app`.
