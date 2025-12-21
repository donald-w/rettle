# AGENTS.md

This document provides context and instructions for AI coding agents (such as GitHub Copilot, Windsurf, OpenAI Codex, or similar tools) when working in this repository.

## Project Overview

**Rettle** is an Angular 21 single-page web application word guessing game with six-letter words. The game provides seven attempts to guess the daily word. Originally built in early 2022, it now serves as a playground for AI tooling experiments.

- **Live site:** [mypojo.io/rettle](https://mypojo.io/rettle)
- **License:** Apache 2.0
- **Primary Language:** TypeScript
- **Framework:** Angular 21

## Repository Layout

```
/
├── src/
│   ├── app/
│   │   ├── game/               # Main game board component
│   │   ├── key/                # Individual keyboard key component
│   │   ├── keyboard/           # On-screen keyboard component
│   │   ├── letter/             # Grid tile component
│   │   ├── header/             # Top header bar component
│   │   ├── help/               # Help screen component
│   │   ├── menu/               # Menu screen component
│   │   ├── app.component.*     # Root app shell
│   │   ├── app-routing.module.ts # Route definitions
│   │   ├── dictionary.service.ts # Word list loading and validation
│   │   ├── settings.service.ts   # User settings + localStorage persistence
│   │   └── game-engine.service.ts # Core game logic and state
│   ├── assets/
│   │   └── 3of6game.txt        # Dictionary word list
│   ├── environments/           # Environment configs (dev/prod)
│   ├── index.html              # Entry HTML
│   ├── main.ts                 # Angular bootstrap
│   ├── polyfills.ts            # Browser polyfills
│   ├── styles.scss             # Global styles
│   └── test.ts                 # Karma test setup
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD: test → build → deploy to GitHub Pages
├── angular.json                # Angular CLI configuration
├── karma.conf.js               # Karma test runner config
├── package.json                # Dependencies and scripts
├── tsconfig.json               # Base TypeScript config
├── tsconfig.app.json           # App-specific TS config
├── tsconfig.spec.json          # Test-specific TS config
└── .editorconfig               # Editor formatting rules
```

## Development Commands

| Command | Description |
|---------|-------------|
| `npm ci` | Install dependencies (clean install) |
| `npm start` or `ng serve` | Start dev server at `http://localhost:4200/` |
| `npm run build` | Production build (output to `dist/rettle/browser/`) |
| `npm test` | Run unit tests with Karma/Jasmine (no watch) |
| `ng generate component <name>` | Scaffold a new component |
| `ng generate service <name>` | Scaffold a new service |

### Running Tests

```bash
npm test
```

Prefer not to pass `--browsers` (let `karma.conf.js` pick the correct launcher for the environment).

To run once (no watch):

```bash
npm test -- --watch=false
```

Troubleshooting / forcing a browser (avoid unless needed):
- Local/Linux (non-container): `npm test -- --browsers=ChromeHeadless`
- Devcontainer: use `npm test -- --browsers=ChromeHeadlessNoSandbox` (sandboxed `ChromeHeadless` may fail with "Operation not permitted")

All 53 tests should pass. Tests use:
- **Jasmine** for assertions and test structure
- **Karma** as the test runner
- **HttpClientTestingModule** for mocking HTTP requests
- **RouterTestingModule** for routing tests

## Architecture

### Core Data Flow

```
User Input (keyboard/click)
        ↓
KeyboardComponent / KeyComponent
        ↓
GameEngineService.keyPressed(key)
        ↓
Observable updates (gameBoard, gameState, keyboardState)
        ↓
LetterComponent / KeyComponent (via async pipe)
        ↓
UI renders tile colors and letters
```

### Key Services

- **GameEngineService** (`game-engine.service.ts`)
  - Tracks board state, current row/column, and target word
  - Exposes `BehaviorSubject` observables for each cell and key
  - Handles input via `keyPressed(key)`, validates guesses, colors tiles/keys
  - Provides `window.tellme()` debug helper to reveal the answer

- **DictionaryService** (`dictionary.service.ts`)
  - Loads word list from `assets/3of6game.txt` on initialization
  - Filters to six-letter alphabetic words
  - Provides `isWord(word)` for guess validation
  - Provides `getWordOfTheDay(date)` using deterministic date-based hashing

### Components

All app components are standalone (`standalone: true`) and declare their own `imports`.

| Component | Selector | Purpose |
|-----------|----------|---------|
| AppComponent | `app-root` | Root shell with header and router outlet |
| GameComponent | `app-game` | Renders 6×7 grid of letter tiles + keyboard |
| LetterComponent | `app-letter` | Individual tile displaying letter and color state |
| KeyboardComponent | `app-keyboard` | On-screen QWERTY keyboard, handles physical key events |
| KeyComponent | `app-key` | Individual keyboard key with click handler |
| HeaderComponent | `app-header` | Top bar with centered title and surrounding icons |
| HelpComponent | `app-help` | Placeholder help page with back-to-game control |
| MenuComponent | `app-menu` | Placeholder menu/settings page with back-to-game control |

### Routing

Routes are exported from `src/app/app-routing.module.ts` as `routes` (no NgModule); `provideRouter(routes, withHashLocation())` is configured in `src/main.ts`.

- `/` → redirects to `/game`
- `/game` → `GameComponent`
- `/help` → `HelpComponent`
- `/menu` → `MenuComponent`

## Code Style & Conventions

### TypeScript

- **Strict mode enabled** (`strict: true` in tsconfig)
- Use **single quotes** for strings
- Use **2-space indentation**
- **No trailing whitespace** (except in `.md` files)
- Insert **final newline** in all files
- Follow Angular style guide naming conventions:
  - `*.component.ts`, `*.service.ts`, `*.spec.ts`
  - PascalCase for classes, camelCase for methods/properties

### Angular

- Standalone bootstrap via `bootstrapApplication` in `src/main.ts`; no `AppModule`.
- Routes are provided with `provideRouter(routes, withHashLocation())`.
- Zoneless change detection enabled with `provideZonelessChangeDetection()`; avoid reintroducing `zone.js`.
- HTTP via `provideHttpClient(withInterceptorsFromDi())`.
- Use `@Input()` decorators for component inputs
- Use RxJS `BehaviorSubject` for state management
- Subscribe to observables in `ngOnInit()`, display via `async` pipe when possible
- Use SCSS for component styles (scoped per component)

### Testing

- Each component/service has a corresponding `.spec.ts` file
- Use `TestBed.configureTestingModule()` for test setup
- Mock services with `jasmine.createSpy()` and custom mock objects
- Use `HttpClientTestingModule` for HTTP mocking
- Prefer `expect(...).toBeTrue()`, `expect(...).toBeFalse()` for booleans

## Common Tasks

### Adding a New Component

```bash
ng generate component component-name
```

Then:
1. Add it to a consuming standalone component's `imports: []` (or to `routes` if it is routed)
2. Add styles in `component-name.component.scss`
3. Create/update tests in `component-name.component.spec.ts`

### Adding a New Service

```bash
ng generate service service-name
```

Services are `providedIn: 'root'` by default (singleton).

### Modifying Game Logic

- Edit `GameEngineService` for core logic changes
- The `processGuess()` function handles letter coloring (green/yellow/grey)
- State is managed via RxJS subject maps (`gameBoard`, `gameState`, `keyboardState`)

### Updating the Word List

- Edit `src/assets/3of6game.txt`
- One word per line, only alphabetic characters
- `DictionaryService` filters to 6-letter words automatically

## Dos and Don'ts

### Do

- ✅ Run `npm test` before committing to ensure tests pass
- ✅ Follow existing patterns for components and services
- ✅ Use RxJS observables and the `async` pipe for reactive state
- ✅ Keep component logic minimal; delegate to services
- ✅ Add corresponding `.spec.ts` tests for new code
- ✅ Use strict TypeScript typing

### Don't

- ❌ Don't bypass TypeScript strict mode or add `any` types unnecessarily
- ❌ Don't commit build artifacts (`dist/`) or `node_modules/`
- ❌ Don't add inline styles; use component SCSS files
- ❌ Don't modify `angular.json` without understanding build implications
- ❌ Don't hardcode environment-specific values; use `src/environments/`

## CI/CD

The GitHub Actions workflow (`.github/workflows/deploy.yml`) runs on push to `main`:

1. **Checkout** the repository
2. **Setup Node.js 22** with npm cache
3. **Install dependencies** with `npm ci`
4. **Run lint** with `npm run lint`
5. **Run tests** with `npm test -- --watch=false --browsers=ChromeHeadless`
6. **Build for production** with `npm run build:prod`
7. **Deploy to GitHub Pages** (output at `dist/rettle/browser`)

## Environment Configuration

| File | Purpose |
|------|---------|
| `src/environments/environment.ts` | Local development settings |
| `src/environments/environment.prod.ts` | Production settings (baseHref: `/rettle/`) |

## Dependencies

### Runtime
- Angular 21 (core, router, forms, animations, http)
- RxJS 7.x
- normalize.css

### Development
- TypeScript 5.9
- Karma + Jasmine (testing)
- Angular CLI

## Additional Notes

- The game uses a deterministic "word of the day" based on date hashing
- Debug helper: In browser console, call `window.tellme()` to reveal the answer
- The grid is 6 columns (letters) × 7 rows (attempts)

---

## TBD (To Be Determined)

The following items may need to be added when information becomes available:

- **Contributing Guidelines:** Contribution workflow, PR requirements
- **Code Review Requirements:** Required approvals, automated checks
- **Browser Support Matrix:** Officially supported browsers
- **Accessibility Guidelines:** WCAG compliance requirements
- **Performance Budgets:** Beyond Angular defaults
- **E2E Testing Setup:** End-to-end test framework (currently not configured)
- **Feature Flags:** Feature toggle system (if any)
- **Internationalization:** i18n support status
- **Error Monitoring:** Error tracking/logging services
- **Analytics:** Usage tracking implementation
- **Zoneless Runtime:** The app runs without ZoneJS via `provideZonelessChangeDetection()`; avoid reintroducing
  the `zone.js` polyfill and prefer Angular-managed event bindings or explicit change detection cues when wiring new
  subscriptions.
