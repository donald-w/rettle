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
      const key = event.key.toUpperCase();

      if (/^[A-Z]$/.test(key)) {
        this.gameEngine.keyPressed(key);
      }

      if (key === "ENTER") {
        this.gameEngine.keyPressed("Enter");
      }

      if (key === "BACKSPACE") {
        this.gameEngine.keyPressed("Back");
      }
    });
  }
}
