import type { MockedObject } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { KeyboardComponent } from './keyboard.component';
import { GameEngineService } from '../game-engine.service';
import { DEFAULT_KEY_STATE } from '../game-state.types';

describe('KeyboardComponent', () => {
    let component: KeyboardComponent;
    let fixture: ComponentFixture<KeyboardComponent>;
    let engineSpy: MockedObject<Pick<GameEngineService, 'registerKey' | 'keyPressed'>>;

    beforeEach(async () => {
        engineSpy = {
            keyPressed: vi.fn().mockName('GameEngineService.keyPressed'),
            registerKey: vi.fn().mockName('GameEngineService.registerKey')
        };
        engineSpy.registerKey.mockReturnValue(of(DEFAULT_KEY_STATE));

        await TestBed.configureTestingModule({
            imports: [KeyboardComponent],
            providers: [{ provide: GameEngineService, useValue: engineSpy }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(KeyboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render 3 rows with correct key count', () => {
        const rows = fixture.debugElement.queryAll(By.css('.keyboard-row'));
        const keys = fixture.debugElement.queryAll(By.css('app-key'));

        expect(rows.length).toBe(3);
        expect(keys.length).toBe(10 + 9 + 9);
    });

    it('should call keyPressed when a key is clicked', () => {
        const keyButton = fixture.debugElement.query(By.css('app-key[label="Q"] button')).nativeElement as HTMLButtonElement;
        keyButton.click();

        expect(engineSpy.keyPressed).toHaveBeenCalledWith('Q');
    });

    it('should map Enter and Backspace labels on physical keyup', () => {
        document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter' }));
        document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Backspace' }));

        expect(engineSpy.keyPressed).toHaveBeenCalledWith('Enter');
        expect(engineSpy.keyPressed).toHaveBeenCalledWith('Back');
    });

    it('should ignore non-letter keys except Enter/Backspace', () => {
        document.dispatchEvent(new KeyboardEvent('keyup', { key: 'Tab' }));
        document.dispatchEvent(new KeyboardEvent('keyup', { key: '1' }));

        expect(engineSpy.keyPressed).not.toHaveBeenCalledWith('Tab');
        expect(engineSpy.keyPressed).not.toHaveBeenCalledWith('1');
    });

    it('should forward letter keyup events uppercased', () => {
        document.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }));
        document.dispatchEvent(new KeyboardEvent('keyup', { key: 'z' }));

        expect(engineSpy.keyPressed).toHaveBeenCalledWith('A');
        expect(engineSpy.keyPressed).toHaveBeenCalledWith('Z');
    });
});
