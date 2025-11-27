import { Component, OnInit } from '@angular/core';
import { GameEngineService } from '../game-engine.service';

@Component({
    selector: 'app-keyboard',
    templateUrl: './keyboard.component.html',
    styleUrls: ['./keyboard.component.scss'],
    standalone: false
})
export class KeyboardComponent implements OnInit {

  constructor(private gameEngine: GameEngineService) { }

  ngOnInit(): void {
    document.addEventListener("keyup", event => {
      if ("abcdefghijklmnopqrstuvwxyz".includes(event.key)) {
        this.gameEngine.keyPressed(event.key.toUpperCase());
      }

      if (event.key === "Enter") {
        this.gameEngine.keyPressed("Enter");
      }

      if (event.key === "Backspace") {
        this.gameEngine.keyPressed("Back");
      }
    });
  }
}
