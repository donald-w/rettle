import { Component, HostListener } from '@angular/core';
import { GameEngineService } from '../game-engine.service';
import { KeyComponent } from '../key/key.component';

@Component({
    selector: 'app-keyboard',
    templateUrl: './keyboard.component.html',
    styleUrls: ['./keyboard.component.scss'],
    standalone: true,
    imports: [KeyComponent]
})
export class KeyboardComponent {

  constructor(private gameEngine: GameEngineService) { }

  @HostListener('document:keyup', ['$event'])
  handlePhysicalKey(event: KeyboardEvent): void {
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
  }
}
