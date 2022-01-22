import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-letter',
  templateUrl: './letter.component.html',
  styleUrls: ['./letter.component.scss']
})
export class LetterComponent implements OnInit {
  @Input() row = 0;
  @Input() position = 0;

  value: string = ("" + Math.random() * 10).charAt(0);

  constructor() { }

  ngOnInit(): void {
  }

}
