import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BuildInfoService } from '../build-info.service';
import { LetterComponent } from '../letter/letter.component';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
  standalone: true,
  imports: [RouterLink, LetterComponent]
})
export class HelpComponent {
  constructor(private readonly buildInfoService: BuildInfoService) {}

  get buildInfoText(): string {
    return this.buildInfoService.displayText;
  }
}
