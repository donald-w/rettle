import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LetterComponent } from '../letter/letter.component';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
  standalone: true,
  imports: [RouterLink, LetterComponent]
})
export class HelpComponent { }
