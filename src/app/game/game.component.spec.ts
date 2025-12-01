import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { GameComponent } from './game.component';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameComponent],
      providers: [provideHttpClientTesting()],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a 7x6 grid of letters', () => {
    const rows = fixture.debugElement.queryAll(By.css('.game-row'));
    const letters = fixture.debugElement.queryAll(By.css('app-letter'));

    expect(rows.length).toBe(7);
    expect(letters.length).toBe(42);

    rows.forEach(row => {
      expect(row.queryAll(By.css('app-letter')).length).toBe(6);
    });
  });

  it('should pass row and position inputs to letters', () => {
    const letters = fixture.debugElement.queryAll(By.css('app-letter'));
    const first = letters[0].componentInstance as { row: number; position: number };
    const last = letters[letters.length - 1].componentInstance as { row: number; position: number };

    expect(first.row).toBe(1);
    expect(first.position).toBe(1);
    expect(last.row).toBe(7);
    expect(last.position).toBe(6);
  });

  it('should render the keyboard', () => {
    const keyboard = fixture.debugElement.queryAll(By.css('app-keyboard'));
    expect(keyboard.length).toBe(1);
  });
});
