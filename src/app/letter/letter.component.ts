import { ChangeDetectorRef, Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GameEngineService } from '../game-engine.service';
import { NgClass, AsyncPipe } from '@angular/common';
import { TileState } from '../game-state.types';

@Component({
    selector: 'app-letter',
    templateUrl: './letter.component.html',
    styleUrls: ['./letter.component.scss'],
    standalone: true,
    imports: [NgClass, AsyncPipe]
})
export class LetterComponent implements OnInit {
  @Input() row = 0;
  @Input() position = 0;

  @Input() useStatic = false;
  @Input() value = '';
  @Input() state: TileState = 'black';

  isGreen: boolean = false;
  isYellow: boolean = false;
  isGrey: boolean = false;
  isRed: boolean = false;

  value$: Observable<string> = of('');
  state$: Observable<TileState> = of('black');

  private destroyRef = inject(DestroyRef);

  constructor(private gameEngine: GameEngineService, private cdr: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    if (this.useStatic) {
      this.value$ = of(this.value);
      this.state$ = of(this.state);
    } else {
      this.value$ = this.gameEngine.registerForValue(this.row, this.position);
      this.state$ = this.gameEngine.registerForState(this.row, this.position);
    }

    this.state$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value: TileState) => {
      this.isGreen = false;
      this.isYellow = false;
      this.isGrey = false;
      this.isRed = false;

      if (value === "green") {
        this.isGreen = true;
      } else if (value === "yellow") {
        this.isYellow = true;
      } else if (value === "grey") {
        this.isGrey = true;
      } else if (value === "red") {
        this.isRed = true;
      }

      this.cdr.markForCheck();
    })
  }

}
