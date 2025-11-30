import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { KeyboardComponent } from './keyboard.component';
import { GameEngineService } from '../game-engine.service';

describe('KeyboardComponent', () => {
  let component: KeyboardComponent;
  let fixture: ComponentFixture<KeyboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, KeyboardComponent],
      schemas: [NO_ERRORS_SCHEMA],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeyboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should respond to uppercase keyboard events', () => {
    const engine = TestBed.inject(GameEngineService);
    spyOn(engine, 'keyPressed');

    document.dispatchEvent(new KeyboardEvent('keyup', { key: 'A' }));

    expect(engine.keyPressed).toHaveBeenCalledWith('A');
  });
});
