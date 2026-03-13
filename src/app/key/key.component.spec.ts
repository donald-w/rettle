import type { MockedObject } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import { KeyComponent } from './key.component';
import { GameEngineService } from '../game-engine.service';
import { KeyState } from '../game-state.types';

describe('KeyComponent', () => {
    let component: KeyComponent;
    let fixture: ComponentFixture<KeyComponent>;
    let keyColor$: BehaviorSubject<KeyState>;
    let gameEngineSpy: MockedObject<Pick<GameEngineService, 'registerKey' | 'keyPressed'>>;

    beforeEach(async () => {
        keyColor$ = new BehaviorSubject<KeyState>('light');
        gameEngineSpy = {
            registerKey: vi.fn().mockName('GameEngineService.registerKey'),
            keyPressed: vi.fn().mockName('GameEngineService.keyPressed')
        };
        gameEngineSpy.registerKey.mockReturnValue(keyColor$.asObservable());

        await TestBed.configureTestingModule({
            imports: [KeyComponent],
            providers: [{ provide: GameEngineService, useValue: gameEngineSpy }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(KeyComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        component.label = 'Q';
        fixture.detectChanges();
        expect(component).toBeTruthy();
    });

    it('should display Back for Backspace and register key', () => {
        component.label = 'Backspace';
        fixture.detectChanges();

        expect(component.display).toBe('Back');
        expect(gameEngineSpy.registerKey).toHaveBeenCalledWith('Back');
    });

    it('should display label and register key for regular labels', () => {
        component.label = 'A';
        fixture.detectChanges();

        expect(component.display).toBe('A');
        expect(gameEngineSpy.registerKey).toHaveBeenCalledWith('A');
    });

    it('should set classes based on key color stream', () => {
        component.label = 'Q';
        fixture.detectChanges();
        const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;

        keyColor$.next('light');
        fixture.detectChanges();
        expect(button.classList.contains('light')).toBe(true);
        expect(button.classList.contains('dark')).toBe(false);

        keyColor$.next('dark');
        fixture.detectChanges();
        expect(button.classList.contains('dark')).toBe(true);
        expect(button.classList.contains('light')).toBe(false);

        keyColor$.next('green');
        fixture.detectChanges();
        expect(button.classList.contains('green')).toBe(true);

        keyColor$.next('yellow');
        fixture.detectChanges();
        // When already green, yellow should not override.
        expect(button.classList.contains('green')).toBe(true);
        expect(button.classList.contains('yellow')).toBe(false);
    });

    it('should call game engine on click with display label', () => {
        component.label = 'Q';
        fixture.detectChanges();
        const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
        button.click();

        expect(gameEngineSpy.keyPressed).toHaveBeenCalledWith('Q');
    });
});
