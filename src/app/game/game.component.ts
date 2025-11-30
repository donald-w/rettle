import { Component, OnInit } from '@angular/core';
import { LetterComponent } from '../letter/letter.component';
import { KeyboardComponent } from '../keyboard/keyboard.component';

@Component({
    selector: 'app-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss'],
    standalone: true,
    imports: [LetterComponent, KeyboardComponent]
})
export class GameComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }
}
