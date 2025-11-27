import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { GameEngineService } from '../game-engine.service';

@Component({
  selector: 'app-key',
  templateUrl: './key.component.html',
  styleUrls: ['./key.component.scss']
})
export class KeyComponent implements OnInit {

  @Input() label: string = "";

  public display: string = "";
  private keyColor$: Observable<string> = of("");

  isLight: boolean = false;
  isDark: boolean = false;
  isGreen: boolean = false;
  isYellow: boolean = false;

  constructor(private gameEngine: GameEngineService) { }

  ngOnInit(): void {
    if (this.label === "Backspace") {
      this.display = "Back";
    } else {
      this.display = this.label;
    }

    this.keyColor$ = this.gameEngine.registerKey(this.display);

    this.keyColor$.subscribe((value: string) => {
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
    })
  }

  onClick(): void {
    this.gameEngine.keyPressed(this.display);
  }
}
