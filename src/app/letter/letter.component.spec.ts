import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { LetterComponent } from './letter.component';
import { GameEngineService } from '../game-engine.service';

describe('LetterComponent', () => {
  let component: LetterComponent;
  let fixture: ComponentFixture<LetterComponent>;
  let value$: BehaviorSubject<string>;
  let state$: BehaviorSubject<string>;
  let gameEngineSpy: jasmine.SpyObj<GameEngineService>;

  beforeEach(async () => {
    value$ = new BehaviorSubject<string>('A');
    state$ = new BehaviorSubject<string>('grey');
    gameEngineSpy = jasmine.createSpyObj<GameEngineService>(
      'GameEngineService',
      ['registerForValue', 'registerForState'],
    );
    gameEngineSpy.registerForValue.and.returnValue(value$.asObservable());
    gameEngineSpy.registerForState.and.returnValue(state$.asObservable());

    await TestBed.configureTestingModule({
      imports: [LetterComponent],
      providers: [{ provide: GameEngineService, useValue: gameEngineSpy }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterComponent);
    component = fixture.componentInstance;
    component.row = 2;
    component.position = 3;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register with game engine using row and position', () => {
    expect(gameEngineSpy.registerForValue).toHaveBeenCalledWith(2, 3);
    expect(gameEngineSpy.registerForState).toHaveBeenCalledWith(2, 3);
  });

  it('should render the current value', () => {
    const div = fixture.nativeElement.querySelector('div') as HTMLDivElement;
    expect(div.textContent?.trim()).toBe('A');

    value$.next('B');
    fixture.detectChanges();
    expect(div.textContent?.trim()).toBe('B');
  });

  it('should set classes based on state stream', () => {
    const div = fixture.nativeElement.querySelector('div') as HTMLDivElement;

    state$.next('green');
    fixture.detectChanges();
    expect(div.classList.contains('green')).toBeTrue();
    expect(div.classList.contains('yellow')).toBeFalse();
    expect(div.classList.contains('grey')).toBeFalse();
    expect(div.classList.contains('red')).toBeFalse();

    state$.next('yellow');
    fixture.detectChanges();
    expect(div.classList.contains('yellow')).toBeTrue();

    state$.next('red');
    fixture.detectChanges();
    expect(div.classList.contains('red')).toBeTrue();

    state$.next('grey');
    fixture.detectChanges();
    expect(div.classList.contains('grey')).toBeTrue();
  });

  it('should support static mode without registering with game engine', () => {
    gameEngineSpy.registerForValue.calls.reset();
    gameEngineSpy.registerForState.calls.reset();

    const staticFixture = TestBed.createComponent(LetterComponent);
    const staticComponent = staticFixture.componentInstance;
    staticComponent.useStatic = true;
    staticComponent.value = 'Z';
    staticComponent.state = 'green';
    staticFixture.detectChanges();

    expect(gameEngineSpy.registerForValue).not.toHaveBeenCalled();
    expect(gameEngineSpy.registerForState).not.toHaveBeenCalled();

    const div = staticFixture.nativeElement.querySelector('div') as HTMLDivElement;
    expect(div.textContent?.trim()).toBe('Z');
    expect(div.classList.contains('green')).toBeTrue();
  });
});
