import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { GameEngineService, GameOutcome } from '../game-engine.service';

@Component({
  selector: 'app-game-complete',
  templateUrl: './game-complete.component.html',
  styleUrls: ['./game-complete.component.scss'],
  standalone: true,
  imports: [AsyncPipe]
})
export class GameCompleteComponent {
  readonly outcome$ = this.gameEngine.gameOutcome$;

  constructor(private readonly gameEngine: GameEngineService) {}

  getMessage(outcome: GameOutcome): string {
    return outcome === 'won' ? 'Well done' : 'Better luck next time';
  }

  onTryDifferentWord(): void {
    this.gameEngine.newGame();
  }
}
