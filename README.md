# Rettle

Rettle is an Angular 21 single-page recreation of a Wordle-style game that uses six-letter guesses. Originally built over a few evenings in early 2022, it now serves as a playground for AI tooling. The project follows the default Angular CLI layout with all source under `src/` and is deployed via GitHub Pages at [mypojo.io/rettle](https://mypojo.io/rettle).

## Project structure
- **Bootstrap:** The app uses the standalone `bootstrapApplication` API with `provideRouter(routes, withHashLocation())`, `provideHttpClient(withInterceptorsFromDi())`, `provideAnimations()`, and `provideZonelessChangeDetection()` configured in `src/main.ts`.
- **Routing:** Route definitions live in `src/app/app-routing.module.ts` as a `routes` export (no NgModule). The root path renders a dedicated `GameComponent`, while `AppComponent` wraps the persistent `HeaderComponent` and a router outlet.
- **Core UI:** `GameComponent` builds a static 6×7 grid of `LetterComponent` tiles and hosts the on-screen `KeyboardComponent`. Each `KeyComponent` displays a label (Backspace appears as “Back”) and forwards clicks to the engine.
- **Header:** `HeaderComponent` provides the top bar with Material icons flanking the centered “RETTLE” title; the icons route to `/menu` and `/help`.
- **Styles:** Global styling lives in `src/styles.scss`, and each component has scoped SCSS (e.g., `letter.component.scss`, `key.component.scss`) for sizing and color themes.

## Game logic and data flow
- **GameEngineService:** Tracks board state, keyboard colors, current row/column, and the target word. It exposes per-cell and per-key observables, handles physical and on-screen key presses, validates guesses through `DictionaryService`, colors tiles/keys via `processGuess`, advances rows, and offers a `window.tellme` debug helper to reveal the answer.
- **DictionaryService:** Loads the word list from `assets/3of6game.txt`, provides readiness via an observable, validates guesses, and deterministically picks the “word of the day” by hashing the date into the six-letter list.
- **Data flow:** Input travels Keyboard → `GameEngineService.keyPressed` → board/keyboard subjects → `LetterComponent` and `KeyComponent` via the `async` pipe for rendering and color updates.
- **Menu/Help pages:** `/menu` and `/help` routes show placeholder pages with a back button returning to the game.

## Development
- Run `ng serve` for a dev server at `http://localhost:4200/`; the app reloads on source changes.
- Generate artifacts with `ng generate component|directive|pipe|service|class|guard|interface|enum|module`.
- Build with `ng build` (output in `dist/`).
- Run unit tests with `ng test` (Karma/Jasmine). For e2e testing, install an appropriate runner and use `ng e2e`.

## Zoneless change detection
- The app runs without ZoneJS using `provideZonelessChangeDetection()` and `ngZone: 'noop'`. Avoid adding `zone.js` imports and
  rely on Angular-managed event bindings (e.g., `@HostListener`) or explicit change detector signals when subscribing to
  observables manually.

## Learning next
- Explore Angular reactive patterns using the `BehaviorSubject` streams in `GameEngineService`.
- Extend UI/UX (animations, accessibility for keyboard input, help/settings routes) by following the existing data flow.
- Add tests around services/components using the `.spec.ts` scaffolding in `src/app`.
