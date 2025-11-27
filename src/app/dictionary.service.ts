import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {
  private words: Set<string> = new Set<string>();

  constructor(private httpClient: HttpClient) {
    this.getTextFile("assets/3of6game.txt").subscribe(
      {
        next: (data: string) => {
          console.log("Dictionary received");

          data.split(/\r?\n/).forEach(
            word => this.words.add(word.toUpperCase())
          );

          console.log("count: " + this.words.size);

        },
        error: (error: unknown) => console.error("Could not load dictionary " + error)
      }
    )
  }

  isWord(word: string) : boolean {
    return this.words.has(word);
  }

  private getTextFile(filename: string) {
    // The Observable returned by get() is of type Observable<string>
    // because a text response was specified.
    // There's no need to pass a <string> type parameter to get().
    return this.httpClient.get(filename, {responseType: 'text'});
  }
}
