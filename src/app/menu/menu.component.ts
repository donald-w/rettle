import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { SettingsService } from '../settings.service';
import { GameEngineService } from '../game-engine.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [RouterLink, AsyncPipe]
})
export class MenuComponent {
  constructor(readonly settingsService: SettingsService, private readonly gameEngine: GameEngineService) {}

  onColourAccessibilityModeChanged(checked: boolean): void {
    this.settingsService.setColourAccessibilityMode(checked);
  }

  onNewGame(): void {
    if (this.gameEngine.hasOngoingGame()) {
      const confirmed = window.confirm('Start a new game? Your current progress will be lost.');

      if (!confirmed) {
        return;
      }
    }

    this.gameEngine.newGame();
  }
}
