import { Component } from '@angular/core';
import { GameEngineService, GameOutcome } from '../game-engine.service';

@Component({
  selector: 'app-game-complete',
  templateUrl: './game-complete.component.html',
  styleUrls: ['./game-complete.component.scss'],
  standalone: true,
  imports: []
})
export class GameCompleteComponent {
  constructor(private readonly gameEngine: GameEngineService) {}

  getMessage(outcome: GameOutcome): string {
    return outcome === 'won' ? 'Well done' : 'Better luck next time';
  }

  onTryDifferentWord(): void {
    this.gameEngine.newGame();
  }

  protected readonly gameOutcome = this.gameEngine.gameOutcome;
}
