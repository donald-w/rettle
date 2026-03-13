import { Injectable, Injector, computed, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { DictionaryService } from './dictionary.service';
import { DEFAULT_KEY_STATE, DEFAULT_TILE_STATE, KeyState, TileState } from './game-state.types';

export type GameOutcome = 'playing' | 'won' | 'lost';

interface BoardCell {
  value: string;
  state: TileState;
}

type BoardState = BoardCell[][];
type KeyboardState = Record<string, KeyState>;

@Injectable({
  providedIn: 'root'
})
export class GameEngineService {
  readonly wordlength = 6;
  readonly maxAttempts = 7;

  private readonly injector = inject(Injector);
  private readonly boardSignal = signal<BoardState>(this.createBoardState());
  private readonly keyboardStateSignal = signal<KeyboardState>({});
  private readonly currentWordSignal = signal(1);
  private readonly currentPositionSignal = signal(1);
  private readonly wordSignal = signal('');
  private readonly gameOutcomeSignal = signal<GameOutcome>('playing');
  readonly gameOutcome = this.gameOutcomeSignal.asReadonly();
  private dictionaryReady = false;

  constructor(private readonly dictionary: DictionaryService) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).tellme = () => this.word;

    this.dictionary.dictionaryReady$.subscribe((ready) => {
      if (!ready) {
        return;
      }

      this.dictionaryReady = true;
      this.wordSignal.set(this.dictionary.getWordOfTheDay(new Date()));
      this.resetBoardState();
    });
  }

  get word(): string {
    return this.wordSignal();
  }

  get currentWord(): number {
    return this.currentWordSignal();
  }

  get currentPosition(): number {
    return this.currentPositionSignal();
  }

  newGame(seed?: number): void {
    if (!this.dictionaryReady) {
      return;
    }

    const randomSeed = seed ?? Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    this.wordSignal.set(this.dictionary.getWordBySeed(randomSeed));
    this.resetBoardState();
  }

  hasOngoingGame(): boolean {
    if (!this.dictionaryReady) {
      return false;
    }

    if (this.currentWord > 1 || this.currentPosition > 1) {
      return true;
    }

    return this.boardSignal().some((row) => row.some((cell) => cell.value !== ''));
  }

  keyPressed(key: string): void {
    if (this.gameOutcomeSignal() !== 'playing') {
      return;
    }

    if (key === 'Enter') {
      this.handleEnter();
      return;
    }

    if (key === 'Back') {
      this.handleBackspace();
      return;
    }

    this.handleLetter(key);
  }

  registerForValue(word: number, position: number): Observable<string> {
    return toObservable(
      computed(() => this.getCell(word, position).value),
      { injector: this.injector }
    );
  }

  registerForState(word: number, position: number): Observable<TileState> {
    return toObservable(
      computed(() => this.getCell(word, position).state),
      { injector: this.injector }
    );
  }

  registerKey(key: string): Observable<KeyState> {
    return toObservable(
      computed(() => this.keyboardStateSignal()[key] ?? DEFAULT_KEY_STATE),
      { injector: this.injector }
    );
  }

  getCellValue(word: number, position: number): string {
    return this.getCell(word, position).value;
  }

  getCellState(word: number, position: number): TileState {
    return this.getCell(word, position).state;
  }

  setKeyColor(key: string, color: KeyState): void {
    this.keyboardStateSignal.update((keyboardState) => ({
      ...keyboardState,
      [key]: color,
    }));
  }

  getKeyColor(key: string): KeyState {
    return this.keyboardStateSignal()[key] ?? DEFAULT_KEY_STATE;
  }

  private handleEnter(): void {
    if (this.currentPosition !== this.wordlength + 1) {
      return;
    }

    const guess = this.getCurrentGuess();

    if (!this.dictionary.isWord(guess)) {
      this.setWordColor('red');
      return;
    }

    const result = processGuess(this.word, guess);

    for (let i = 1; i <= this.wordlength; i++) {
      const letter = this.getCellValue(this.currentWord, i);
      const state = result[i - 1];

      if (state === 'grey' && this.getKeyColor(letter) === 'light') {
        this.setKeyColor(letter, 'dark');
      }

      if (state === 'green') {
        this.setKeyColor(letter, 'green');
      }

      if (state === 'yellow' && this.getKeyColor(letter) !== 'green') {
        this.setKeyColor(letter, 'yellow');
      }

      this.setCellState(this.currentWord, i, state);
    }

    const won = result.every((state) => state === 'green');
    if (won) {
      this.gameOutcomeSignal.set('won');
    } else if (this.currentWord >= this.maxAttempts) {
      this.gameOutcomeSignal.set('lost');
    }

    this.currentPositionSignal.set(1);
    this.currentWordSignal.update((word) => word + 1);
  }

  private handleBackspace(): void {
    if (this.currentPosition === this.wordlength + 1) {
      this.setWordColor('clear');
    }

    if (this.currentPosition <= 1) {
      return;
    }

    const nextPosition = this.currentPosition - 1;
    this.currentPositionSignal.set(nextPosition);
    this.setCellValue(this.currentWord, nextPosition, '');
  }

  private handleLetter(key: string): void {
    if (this.currentPosition === this.wordlength + 1) {
      return;
    }

    const position = this.currentPosition;
    this.setCellValue(this.currentWord, position, key);
    this.currentPositionSignal.update((currentPosition) => currentPosition + 1);
  }

  private createBoardState(): BoardState {
    return Array.from({ length: this.maxAttempts }, () =>
      Array.from({ length: this.wordlength }, () => ({
        value: '',
        state: DEFAULT_TILE_STATE,
      }))
    );
  }

  private getCurrentGuess(): string {
    return this.boardSignal()[this.currentWord - 1]
      .map((cell) => cell.value)
      .join('');
  }

  private getCell(word: number, position: number): BoardCell {
    return this.boardSignal()[word - 1][position - 1];
  }

  private setCellValue(word: number, position: number, value: string): void {
    this.updateBoardCell(word, position, { value });
  }

  private setCellState(word: number, position: number, state: TileState): void {
    this.updateBoardCell(word, position, { state });
  }

  private updateBoardCell(word: number, position: number, patch: Partial<BoardCell>): void {
    this.boardSignal.update((boardState) => {
      const rowIndex = word - 1;
      const positionIndex = position - 1;
      const nextBoardState = boardState.slice();
      const nextRow = boardState[rowIndex].slice();

      nextRow[positionIndex] = {
        ...nextRow[positionIndex],
        ...patch,
      };
      nextBoardState[rowIndex] = nextRow;

      return nextBoardState;
    });
  }

  private setWordColor(colour: TileState): void {
    this.boardSignal.update((boardState) => {
      const rowIndex = this.currentWord - 1;
      const nextBoardState = boardState.slice();
      nextBoardState[rowIndex] = boardState[rowIndex].map((cell) => ({
        ...cell,
        state: colour,
      }));

      return nextBoardState;
    });
  }

  private resetBoardState(): void {
    this.currentWordSignal.set(1);
    this.currentPositionSignal.set(1);
    this.gameOutcomeSignal.set('playing');
    this.boardSignal.set(this.createBoardState());
    this.keyboardStateSignal.set({});
  }
}

function processGuess(word: string, guess: string): TileState[] {
  const wordArray = word.split('');
  const guessArray = guess.split('');
  const result: TileState[] = [];

  for (let i = 0; i < wordArray.length; i++) {
    const greenOrGrey = wordArray[i] === guessArray[i];
    result.push(greenOrGrey ? 'green' : 'grey');

    if (greenOrGrey) {
      guessArray[i] = '.';
      wordArray[i] = ',';
    }
  }

  for (let i = 0; i < guessArray.length; i++) {
    for (let j = 0; j < wordArray.length; j++) {
      if (guessArray[i] === wordArray[j]) {
        wordArray[j] = ',';
        result[i] = 'yellow';
        break;
      }
    }
  }

  return result;
}
