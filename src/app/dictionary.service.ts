import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {
  private words: Set<string> = new Set<string>();
  private sixLetterWords: string[] = [];
  private dictionaryReadySubject = new BehaviorSubject<boolean>(false);
  dictionaryReady$ = this.dictionaryReadySubject.asObservable();

  constructor(private httpClient: HttpClient) {
    this.getTextFile("assets/3of6game.txt").subscribe(
      {
        next: (data: string) => {
          console.log("Dictionary received");

          data.split(/\r?\n/).forEach(
            word => {
              const cleanWord = word.trim().toUpperCase();
              const isAlphaOnly = /^[A-Z]+$/.test(cleanWord);

              if (!cleanWord || !isAlphaOnly) {
                return;
              }

              this.words.add(cleanWord);

              if (cleanWord.length === 6) {
                this.sixLetterWords.push(cleanWord);
              }
            }
          );

          console.log("count: " + this.words.size);
          this.dictionaryReadySubject.next(true);

        },
        error: (error: unknown) => console.error("Could not load dictionary " + error)
      }
    )
  }

  isWord(word: string) : boolean {
    return this.words.has(word);
  }

  getWordOfTheDay(date: Date): string {
    if (this.sixLetterWords.length === 0) {
      throw new Error("Dictionary not ready");
    }

    const dateKey = date.toISOString().slice(0, 10);
    const hash = this.hashString(dateKey);
    const index = hash % this.sixLetterWords.length;

    return this.sixLetterWords[index];
  }

  private hashString(input: string): number {
    let hash = 0;

    for (const char of input) {
      hash = ((hash << 5) - hash) + char.charCodeAt(0);
      hash |= 0;
    }

    return hash >>> 0;
  }

  private getTextFile(filename: string) {
    // The Observable returned by get() is of type Observable<string>
    // because a text response was specified.
    // There's no need to pass a <string> type parameter to get().
    return this.httpClient.get(filename, {responseType: 'text'});
  }
}
