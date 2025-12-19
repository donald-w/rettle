import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [RouterLink, AsyncPipe]
})
export class MenuComponent {
  constructor(readonly settingsService: SettingsService) {}

  onColourAccessibilityModeChanged(checked: boolean): void {
    this.settingsService.setColourAccessibilityMode(checked);
  }
}
