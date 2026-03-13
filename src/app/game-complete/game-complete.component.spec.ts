import { signal } from '@angular/core';
import type { Mock } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameCompleteComponent } from './game-complete.component';
import { GameOutcome } from '../game-engine.service';
import { GameEngineService } from '../game-engine.service';

describe('GameCompleteComponent', () => {
  let fixture: ComponentFixture<GameCompleteComponent>;
  let outcome: ReturnType<typeof signal<GameOutcome>>;
  let mockGameEngine: {
    gameOutcome: ReturnType<typeof signal<GameOutcome>>;
    newGame: Mock;
  };

  beforeEach(async () => {
    outcome = signal<GameOutcome>('won');
    mockGameEngine = {
      gameOutcome: outcome,
      newGame: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [GameCompleteComponent],
      providers: [
        {
          provide: GameEngineService,
          useValue: mockGameEngine
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GameCompleteComponent);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show "Well done" when won', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Well done');
  });

  it('should show "Better luck next time" when lost', () => {
    outcome.set('lost');
    fixture.detectChanges();

    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Better luck next time');
  });

  it('should start a new game on button click', () => {
    const button = (fixture.nativeElement as HTMLElement).querySelector('button') as HTMLButtonElement;
    button.click();

    expect(mockGameEngine.newGame).toHaveBeenCalled();
  });
});
