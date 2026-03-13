import { ChangeDetectorRef, Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GameEngineService } from '../game-engine.service';
import { NgClass } from '@angular/common';
import { KeyState } from '../game-state.types';

@Component({
    selector: 'app-key',
    templateUrl: './key.component.html',
    styleUrls: ['./key.component.scss'],
    standalone: true,
    imports: [NgClass]
})
export class KeyComponent implements OnInit {

  @Input() label: string = "";

  public display: string = "";
  private keyColor$: Observable<KeyState> = of('light');

  isLight: boolean = false;
  isDark: boolean = false;
  isGreen: boolean = false;
  isYellow: boolean = false;

  private destroyRef = inject(DestroyRef);

  constructor(private gameEngine: GameEngineService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    if (this.label === "Backspace") {
      this.display = "Back";
    } else {
      this.display = this.label;
    }

    this.keyColor$ = this.gameEngine.registerKey(this.display);

    this.keyColor$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value: KeyState) => {
      if (value === "light") {
        this.isLight = true;
        this.isDark = false;
        this.isGreen = false;
        this.isYellow = false;
      } else if (value === "dark") {
        this.isLight = false;
        this.isDark = true;
        this.isGreen = false;
        this.isYellow = false;
      } else if (value === "green") {
        this.isLight = false;
        this.isDark = false;
        this.isGreen = true;
        this.isYellow = false;
      } else if (value === "yellow") {
        this.isLight = false;
        this.isDark = false;
        if (this.isGreen) {
          this.isGreen = true;
          this.isYellow = false;
        } else {
          this.isGreen = false;
          this.isYellow = true;
        }
      }

      this.cdr.markForCheck();
    })
  }

  onClick(): void {
    this.gameEngine.keyPressed(this.display);
  }
}
