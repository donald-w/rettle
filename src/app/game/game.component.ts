import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  private dictionary = new Set<string>();

  constructor(private httpClient: HttpClient) {

   }

  ngOnInit(): void {
    this.getTextFile("assets/3of6game.txt").subscribe(
      {
        next: (data: string) => {
          console.log("Dictionary received");

          data.split(/\r?\n/).forEach(
            word => this.dictionary.add(word)
          )

          console.log("count: " + this.dictionary.size)

        },
        error: (error) => console.error("Could not load dictionary " + error)
      }
    )

  }

  getTextFile(filename: string) {
    // The Observable returned by get() is of type Observable<string>
    // because a text response was specified.
    // There's no need to pass a <string> type parameter to get().
    return this.httpClient.get(filename, {responseType: 'text'});
  }

}
