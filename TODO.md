# TODO

## Angular Modernization

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

- Status: Completed
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
- Notes:
  - Added `provideZonelessChangeDetection()` explicitly to component specs that create Angular components through TestBed.
  - Replaced `fixture.whenStable()` in router-driven component tests with `vi.waitFor(...)` assertions on navigation outcomes.
  - Kept the change local to specs rather than introducing a shared global test setup.

## Notes

- The codebase is already on a current Angular version. The main value now is simplification and alignment with current Angular patterns, not a framework-version upgrade.
- The high-value changes are architectural rather than cosmetic.
- Do not batch all of this into one change. The signal-state migration should land separately from test-runner or routing decisions.
- The order is intentional:
  - Early tasks remove low-risk legacy carryover and force explicit tooling decisions.
  - The signal-store migration comes before typing and presentational cleanup because it defines the new state shape.
  - Component modernization follows once the state API is stable.
  - Test alignment comes last so it validates the final architecture rather than forcing repeated spec churn mid-migration.
