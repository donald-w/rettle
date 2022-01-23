import { Component, Input, OnInit } from '@angular/core';
import { GameEngineService } from '../game-engine.service';

@Component({
  selector: 'app-key',
  templateUrl: './key.component.html',
  styleUrls: ['./key.component.scss']
})
export class KeyComponent implements OnInit {

  @Input() label: string = "";

  public display: string = "";

  constructor(private gameEngine: GameEngineService) { }

  ngOnInit(): void {
    if (this.label === "Backspace") {
      this.display = "Back";
    } else {
      this.display = this.label;
    }
  }

  onClick(): void {
    this.gameEngine.keyPressed(this.display);
  }
}
