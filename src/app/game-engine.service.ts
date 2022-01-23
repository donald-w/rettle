import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameEngineService {
  word = "MONKEY"
  currentWord = 1;
  currentPosition = 1;

  gameBoard = new Map<string, BehaviorSubject<string>>();
  gameState = new Map<string, Subject<string>>();

  constructor() { }

  keyPressed(key: string): void {
    console.log("Pressed " + key);

    if (this.currentPosition === 7 && key != "Enter") {
      return;
    }

    if (this.currentPosition === 7 && key === "Enter") {
      for (let i = 1; i < 7; i++) {
        const sub = this.gameBoard.get(this.currentWord + "-" + i);
        let state = this.gameState.get(this.currentWord + "-" + i);

        let letter = sub?.getValue();

        console.log("letter is " + letter)

        if (letter === undefined) {
          console.error("bad");
          return; // TODO fix typing
        }

        if (this.word.includes(letter)) {
          state?.next("yellow");
        }

        if (this.word.charAt(i - 1) === letter) {
          state?.next("green")
        }
      }

      this.currentPosition = 1;
      this.currentWord++;

      // Process move

      return;
    }

    if (key === "Back") {

      if (this.currentPosition > 1) {
        this.currentPosition--;
        const sub = this.gameBoard.get(this.currentWord + "-" + this.currentPosition);
        sub?.next("");

        return;
      }
    }

    const sub = this.gameBoard.get(this.currentWord + "-" + this.currentPosition++);

    sub?.next(key);
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
}
