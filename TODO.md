# TODO

## Angular Modernization

### 3. Decide whether to keep Karma/Jasmine or migrate to Vitest

- Status: Completed
- Priority: Medium
- Files:
  - `package.json`
  - `angular.json`
  - `tsconfig.spec.json`
  - `vitest-base.config.ts`
  - CI workflow
- Goal:
  - Make an explicit tooling decision instead of carrying forward the default test runner by inertia.
- Decision:
  - Migrate to Vitest using Angular's `@angular/build:unit-test` builder.
- Notes:
  - Removed Karma/Jasmine dependencies and config files.
  - Converted specs to Vitest mocks and expectations.
  - Updated CI to run the default `npm test` command without browser-specific flags.
- Acceptance criteria:
  - A documented decision exists.
  - CI and local test commands work end to end.

### 4. Replace subject-map game state with a typed signal-based store

- Status: Completed
- Priority: High
- Files:
  - `src/app/game-engine.service.ts`
  - Related specs under `src/app/*.spec.ts`
- Goal:
  - Replace the current `Map<string, BehaviorSubject<string>>` / `Map<string, Subject<string>>` model with a typed state model built around Angular signals.
- Scope:
  - Introduce typed state for board cells, keyboard state, current row/column, target word, and outcome.
  - Remove lazy subject creation and string-composed map keys where practical.
  - Keep existing gameplay behavior unchanged.
  - Preserve `newGame()`, `hasOngoingGame()`, and guess processing behavior.
- Suggested approach:
  - Model board state as arrays or records with explicit types instead of string keys such as `"1-3"`.
  - Use `signal()` for writable state and `computed()` for derived state.
  - Keep imperative methods for user actions, but have them update typed signal state directly.
  - Expose read-only state to components.
- Acceptance criteria:
  - No gameplay regression.
  - Existing tests still pass after being updated for the new state model.
  - No component needs to cast observables back to `BehaviorSubject` in tests.
  - Board, key colors, and win/loss states render exactly as before.
- Notes:
  - Replaced the lazy `Map<string, BehaviorSubject<string>>` state with signal-backed board, keyboard, cursor, target-word, and outcome state.
  - Kept `registerForValue()`, `registerForState()`, and `registerKey()` as observable adapters so existing presentational components can migrate incrementally while game-complete state now reads from a signal directly.
  - Added typed state readers used by the updated specs instead of mutating subjects directly.

### 5. Introduce typed tile and key state unions

- Status: Completed
- Priority: Medium
- Files:
  - `src/app/game-engine.service.ts`
  - `src/app/letter/letter.component.ts`
  - `src/app/key/key.component.ts`
  - Related specs
- Goal:
  - Replace loose string values for visual state with explicit TypeScript unions or enums.
- Scope:
  - Define types for tile state and keyboard key state.
  - Replace ad hoc values such as `'black'`, `'light'`, `'dark'`, `'green'`, `'yellow'`, `'grey'`, `'red'`, and `'clear'` with typed state handling.
- Acceptance criteria:
  - Compiler catches invalid state values.
  - Components and service use the shared types consistently.
  - Tests no longer rely on untyped string conventions.
- Notes:
  - Added shared `TileState` and `KeyState` unions in `src/app/game-state.types.ts`.
  - Updated the game engine, letter component, and key component APIs to use the shared types and defaults.
  - Tightened affected specs so test doubles return valid typed state values.

### 6. Convert presentational component inputs to signal inputs where useful

- Status: Not started
- Priority: High
- Files:
  - `src/app/letter/letter.component.ts`
  - `src/app/key/key.component.ts`
  - Potentially `src/app/game-complete/game-complete.component.ts`
- Goal:
  - Replace legacy `@Input()` usage with Angular signal inputs in components that are primarily presentational.
- Scope:
  - Convert simple inputs such as row, position, label, static value, and static state to `input()`.
  - Simplify initialization logic that currently depends on `OnInit`.
- Suggested approach:
  - Use `input()` for incoming values.
  - Replace `ngOnInit()`-driven setup with direct initialization or `computed()` state where possible.
  - Keep the public API of the components stable from the template consumer perspective.
- Acceptance criteria:
  - Components no longer depend on `OnInit` purely to wire inputs into local state.
  - Inputs remain strongly typed.
  - Templates and tests continue to behave the same way.

### 7. Move presentational components to `OnPush` and remove manual change detection

- Status: Not started
- Priority: High
- Files:
  - `src/app/letter/letter.component.ts`
  - `src/app/key/key.component.ts`
- Goal:
  - Align rendering with modern Angular component patterns by using `ChangeDetectionStrategy.OnPush` and removing manual `ChangeDetectorRef.markForCheck()` usage.
- Scope:
  - Remove `ChangeDetectorRef` injection where no longer needed.
  - Remove manual subscriptions used only to toggle CSS booleans.
  - Drive classes directly from typed state or computed values.
- Suggested approach:
  - After signal migration, bind class state from `computed()` values or direct template expressions.
  - Eliminate duplicated booleans like `isGreen`, `isYellow`, `isGrey`, `isRed` when a single typed state is enough.
- Acceptance criteria:
  - No `markForCheck()` calls remain in these components.
  - Rendering stays correct in zoneless mode.
  - Component tests cover the final render state.

### 9. Replace hard-coded board markup with `@for`

- Status: Not started
- Priority: Medium
- Files:
  - `src/app/game/game.component.ts`
  - `src/app/game/game.component.html`
- Goal:
  - Replace the repeated board markup with Angular’s built-in `@for` control flow.
- Scope:
  - Generate 7 rows and 6 columns from component data instead of hard-coded markup.
  - Keep the rendered DOM and styling behavior stable.
- Suggested approach:
  - Add row/column arrays or ranges in the component.
  - Use nested `@for` blocks with tracking.
- Acceptance criteria:
  - The board still renders 42 tiles in the same layout.
  - No visual regression.
  - Template size is materially reduced.

### 10. Remove debug-only and dead code from the game engine

- Status: Not started
- Priority: Low
- Files:
  - `src/app/game-engine.service.ts`
  - Related tests if updated
- Items identified in current scan:
  - `window.tellme`
  - `shareResult()`
  - Console logging of guesses
- Goal:
  - Remove browser-global debug hooks and dead methods that are no longer part of the product behavior.
- Scope:
  - Delete dead code or gate debug helpers behind a dev-only strategy if you still want them.
  - Remove console logging that is not useful in production.
- Acceptance criteria:
  - No dead private methods remain.
  - No browser-global debug API is installed by default.
  - Tests are updated to reflect the intended debug story.

### 11. Align tests with zoneless runtime

- Status: Not started
- Priority: Medium
- Files:
  - Relevant `*.spec.ts` files
  - Potentially shared test setup
- Goal:
  - Ensure component and service tests reflect the production zoneless setup.
- Scope:
  - Add `provideZonelessChangeDetection()` where appropriate in TestBed configuration.
  - Remove assumptions in tests that depend on legacy change-detection behavior.
- Suggested approach:
  - Start with component specs that render state-driven UI.
  - Keep the migration incremental if a shared setup file is not worth introducing.
- Acceptance criteria:
  - Test suite passes under the zoneless configuration.
  - No flaky specs caused by implicit ZoneJS-era assumptions.

## Notes

- The codebase is already on a current Angular version. The main value now is simplification and alignment with current Angular patterns, not a framework-version upgrade.
- The high-value changes are architectural rather than cosmetic.
- Do not batch all of this into one change. The signal-state migration should land separately from test-runner or routing decisions.
- The order is intentional:
  - Early tasks remove low-risk legacy carryover and force explicit tooling decisions.
  - The signal-store migration comes before typing and presentational cleanup because it defines the new state shape.
  - Component modernization follows once the state API is stable.
  - Test alignment comes last so it validates the final architecture rather than forcing repeated spec churn mid-migration.
