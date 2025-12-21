import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { GameCompleteComponent } from './game-complete.component';
import { GameOutcome } from '../game-engine.service';
import { GameEngineService } from '../game-engine.service';

describe('GameCompleteComponent', () => {
  let fixture: ComponentFixture<GameCompleteComponent>;
  let outcome$: BehaviorSubject<GameOutcome>;
  let mockGameEngine: { gameOutcome$: BehaviorSubject<GameOutcome>; newGame: jasmine.Spy };

  beforeEach(async () => {
    outcome$ = new BehaviorSubject<GameOutcome>('won');
    mockGameEngine = {
      gameOutcome$: outcome$,
      newGame: jasmine.createSpy('newGame')
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
    outcome$.next('lost');
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
