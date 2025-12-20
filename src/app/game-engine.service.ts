import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { DictionaryService } from './dictionary.service';

@Injectable({
  providedIn: 'root'
})
export class GameEngineService {
  word: string = "";
  wordlength = 6;
  currentWord = 1;
  currentPosition = 1;

  gameBoard = new Map<string, BehaviorSubject<string>>();
  gameState = new Map<string, Subject<string>>();
  keyboardState = new Map<string, BehaviorSubject<string>>();
  private dictionaryReady = false;

  constructor(private dictionary: DictionaryService) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).tellme = () => {
      return this.word;
    };

    this.dictionary.dictionaryReady$.subscribe((ready) => {
      if (ready) {
        this.dictionaryReady = true;
        this.word = this.dictionary.getWordOfTheDay(new Date());
      }
    });
  }

  newGame(seed?: number): void {
    if (!this.dictionaryReady) {
      return;
    }

    const randomSeed = seed ?? Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    this.word = this.dictionary.getWordBySeed(randomSeed);
    this.resetBoardState();
  }

  keyPressed(key: string): void {

    if (key === "Enter") {
      if (this.currentPosition === this.wordlength + 1) {
        let guess = "";

        for (let i = 1; i < this.wordlength + 1; i++) {
          const sub = this.gameBoard.get(this.currentWord + "-" + i);

          const letter = sub?.getValue();

          if (letter === undefined) {
            return; // TODO fix typing
          }

          guess += letter;
        }

        // eslint-disable-next-line no-console
        console.log("guess was: " + guess);

        if (!this.dictionary.isWord(guess)) {
          this.setWordColor("red");

          return;
        }

        const result = processGuess(this.word, guess);

        for (let i = 1; i < this.wordlength + 1; i++) {
          const sub = this.gameBoard.get(this.currentWord + "-" + i);
          const state = this.gameState.get(this.currentWord + "-" + i);


          const letter = sub?.getValue();

          if (letter === undefined) {
            return; // TODO fix typing
          }

          if (result[i-1] === 'grey') {
            if (this.getKeyColor(letter) === 'light') {
              this.setKeyColor(letter,'dark');
            }
          }
          if (result[i-1] === 'green') {
            this.setKeyColor(letter,'green');
          }
          if (result[i-1] === 'yellow') {
            if (!(this.getKeyColor(letter) === 'green')) {
              this.setKeyColor(letter,'yellow');
            }
          }


          state?.next(result[i-1]);
        }

        this.currentPosition = 1;
        this.currentWord++;
      } else {
        // Ignore since it's not the last entry in the word
      }
    } else if (key === "Back") {
      if (this.currentPosition === this.wordlength + 1) {
        this.setWordColor("clear");
      }

      if (this.currentPosition > 1) {
        this.currentPosition--;
        const sub = this.gameBoard.get(this.currentWord + "-" + this.currentPosition);
        sub?.next("");
      }
    } else {
      if (this.currentPosition == this.wordlength + 1) {
        // Ignore.  Last position, and not enter
      } else {
        // Normal key.  Advance
        const sub = this.gameBoard.get(this.currentWord + "-" + this.currentPosition++);
        sub?.next(key);
      }
    }
  }

  private shareResult() {
    navigator.share({text: "Failed guess! http://www.google.com/search?q=" + ""})
  }

  private setWordColor(colour: string) {
    for (let i = 1; i < this.wordlength + 1; i++) {
      const state = this.gameState.get(this.currentWord + "-" + i);
      state?.next(colour);
    }
  }

  registerForValue(word: number, position: number): Observable<string> {
    const key = word + "-" + position;
    const existing = this.gameBoard.get(key);
    if (existing) {
      return existing;
    }

    const sub = new BehaviorSubject<string>("");
    this.gameBoard.set(key, sub);
    return sub;
  }

  registerForState(word: number, position: number): Observable<string> {
    const key = word + "-" + position;
    const existing = this.gameState.get(key);
    if (existing) {
      return existing;
    }

    const sub = new BehaviorSubject<string>("black");
    this.gameState.set(key, sub);
    return sub;
  }

  registerKey(key: string): Observable<string> {
    const existing = this.keyboardState.get(key);
    if (existing) {
      return existing;
    }

    const sub = new BehaviorSubject<string>("light");
    this.keyboardState.set(key, sub);
    return sub;
  }

  setKeyColor(key: string, color: string) {
    const sub = this.keyboardState.get(key);
    sub?.next(color)
  }

  getKeyColor(key: string) {
    const sub = this.keyboardState.get(key);
    return sub?.getValue();
  }

  private resetBoardState(): void {
    this.currentWord = 1;
    this.currentPosition = 1;

    for (const cell of this.gameBoard.values()) {
      cell.next("");
    }

    for (const state of this.gameState.values()) {
      state.next("black");
    }

    for (const key of this.keyboardState.values()) {
      key.next("light");
    }
  }
}

function processGuess(word: string, guess: string) : string[] {
  const wordArray = word.split('');
  const guessArray = guess.split('');

  const result : Array<string> = [];

  for(let i = 0; i < wordArray.length; i++) {
    const greenOrGrey = (wordArray[i] === guessArray[i]);
    result.push(greenOrGrey ? 'green' : 'grey');

    if (greenOrGrey) {
      guessArray[i] = '.';
      wordArray[i] = ',';
    }
  }

  for(let i = 0; i < guessArray.length; i++) {
    for(let j = 0; j < wordArray.length; j++) {
      if (guessArray[i] === wordArray[j]) {
        wordArray[j] = ',';
        result[i] = 'yellow';
      }
    }
  }

  // console.log(guessArray);
  // console.log(wordArray);
  // console.log(result);

  return result;

}
