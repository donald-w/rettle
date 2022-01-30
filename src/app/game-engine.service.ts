import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameEngineService {
  word = "MONKEY"
  wordlength = 6;
  currentWord = 1;
  currentPosition = 1;

  gameBoard = new Map<string, BehaviorSubject<string>>();
  gameState = new Map<string, Subject<string>>();
  keyboardState = new Map<string, Subject<string>>();

  constructor() { }

  keyPressed(key: string): void {

    if (key === "Enter") {
      if (this.currentPosition === this.wordlength + 1) {
        for (let i = 1; i < this.wordlength + 1; i++) {
          const sub = this.gameBoard.get(this.currentWord + "-" + i);
          let state = this.gameState.get(this.currentWord + "-" + i);

          let letter = sub?.getValue();

          if (letter === undefined) {
            return; // TODO fix typing
          }

          state?.next("grey");

          if (this.word.includes(letter)) {
            state?.next("yellow");
            this.setKeyColor(letter, "yellow");
          } else {
            this.setKeyColor(letter, "dark");
          }

          if (this.word.charAt(i - 1) === letter) {
            state?.next("green")
            this.setKeyColor(letter, "green")
          }
        }

        this.currentPosition = 1;
        this.currentWord++;
      } else {
        // Ignore since it's not the last entry in the word
      }
    } else if (key === "Back") {
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

  registerForValue(word: number, position: number): Observable<string> {
    const sub = new BehaviorSubject<string>("");
    this.gameBoard.set(word + "-" + position, sub)
    return sub;
  }

  registerForState(word: number, position: number): Observable<string> {
    const sub = new BehaviorSubject<string>("black");
    this.gameState.set(word + "-" + position, sub)
    return sub;
  }

  registerKey(key: string): Observable<string> {
    const sub = new BehaviorSubject<string>("light");
    this.keyboardState.set(key, sub);
    return sub;
  }

  setKeyColor(key: string, color: string) {
    const sub = this.keyboardState.get(key);
    sub?.next(color)
  }
}
