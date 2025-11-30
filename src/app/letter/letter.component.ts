import { ChangeDetectorRef, Component, DestroyRef, HostBinding, Input, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GameEngineService } from '../game-engine.service';

@Component({
    selector: 'app-letter',
    templateUrl: './letter.component.html',
    styleUrls: ['./letter.component.scss'],
    standalone: false
})
export class LetterComponent implements OnInit {
  @Input() row = 0;
  @Input() position = 0;

  isGreen: boolean = false;
  isYellow: boolean = false;
  isGrey: boolean = false;
  isRed: boolean = false;

  value$: Observable<string> = of("");
  state$: Observable<string> = of("");

  private destroyRef = inject(DestroyRef);

  constructor(private gameEngine: GameEngineService, private cdr: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.value$ = this.gameEngine.registerForValue(this.row, this.position);
    this.state$ = this.gameEngine.registerForState(this.row, this.position);

    this.state$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value: string) => {
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
