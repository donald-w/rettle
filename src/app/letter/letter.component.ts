import { Component, HostBinding, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GameEngineService } from '../game-engine.service';

@Component({
  selector: 'app-letter',
  templateUrl: './letter.component.html',
  styleUrls: ['./letter.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LetterComponent implements OnInit {
  @Input() row = 0;
  @Input() position = 0;

  isGreen: boolean = false;
  isYellow: boolean = false;

  value$: Observable<string> = of("");
  state$: Observable<string> = of("");

  constructor(private gameEngine: GameEngineService) {

  }

  ngOnInit(): void {
    this.value$ = this.gameEngine.registerForValue(this.row,this.position);
    this.state$ = this.gameEngine.registerForState(this.row,this.position);

    this.state$.subscribe(value => {
      if (value === "green") {
        this.isYellow = false;
        this.isGreen = true;
      } else if (value === "yellow") {
        this.isYellow = true;
        this.isGreen = false;
      }

    })
  }

}
