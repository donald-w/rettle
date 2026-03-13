import { provideZonelessChangeDetection } from '@angular/core';
import type { MockedObject } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { LetterComponent } from './letter.component';
import { GameEngineService } from '../game-engine.service';
import { TileState } from '../game-state.types';

describe('LetterComponent', () => {
    let component: LetterComponent;
    let fixture: ComponentFixture<LetterComponent>;
    let value$: BehaviorSubject<string>;
    let state$: BehaviorSubject<TileState>;
    let gameEngineSpy: MockedObject<Pick<GameEngineService, 'registerForValue' | 'registerForState'>>;

    beforeEach(async () => {
        value$ = new BehaviorSubject<string>('A');
        state$ = new BehaviorSubject<TileState>('grey');
        gameEngineSpy = {
            registerForValue: vi.fn().mockName('GameEngineService.registerForValue'),
            registerForState: vi.fn().mockName('GameEngineService.registerForState')
        };
        gameEngineSpy.registerForValue.mockReturnValue(value$.asObservable());
        gameEngineSpy.registerForState.mockReturnValue(state$.asObservable());

        await TestBed.configureTestingModule({
            imports: [LetterComponent],
            providers: [
                provideZonelessChangeDetection(),
                { provide: GameEngineService, useValue: gameEngineSpy }
            ],
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
        expect(div.classList.contains('green')).toBe(true);
        expect(div.classList.contains('yellow')).toBe(false);
        expect(div.classList.contains('grey')).toBe(false);
        expect(div.classList.contains('red')).toBe(false);

        state$.next('yellow');
        fixture.detectChanges();
        expect(div.classList.contains('yellow')).toBe(true);

        state$.next('red');
        fixture.detectChanges();
        expect(div.classList.contains('red')).toBe(true);

        state$.next('grey');
        fixture.detectChanges();
        expect(div.classList.contains('grey')).toBe(true);
    });

    it('should support static mode without registering with game engine', () => {
        gameEngineSpy.registerForValue.mockClear();
        gameEngineSpy.registerForState.mockClear();

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
        expect(div.classList.contains('green')).toBe(true);
    });
});
