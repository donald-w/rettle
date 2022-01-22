import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-key',
  templateUrl: './key.component.html',
  styleUrls: ['./key.component.scss']
})
export class KeyComponent implements OnInit {

  @Input() label: string = "";

  public display: string = "";

  constructor() { }

  ngOnInit(): void {
    this.display = this.label;
  }

}
