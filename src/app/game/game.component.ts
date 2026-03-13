import { Component } from '@angular/core';
import { LetterComponent } from '../letter/letter.component';
import { KeyboardComponent } from '../keyboard/keyboard.component';
import { GameCompleteComponent } from '../game-complete/game-complete.component';
import { GameEngineService } from '../game-engine.service';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss'],
    standalone: true,
  imports: [LetterComponent, KeyboardComponent, GameCompleteComponent]
})
export class GameComponent {
  constructor(private readonly gameEngine: GameEngineService) { }

  protected readonly gameOutcome = this.gameEngine.gameOutcome;
}
