import type { Mock } from "vitest";
import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BehaviorSubject } from 'rxjs';

import { GameEngineService } from './game-engine.service';
import { DictionaryService } from './dictionary.service';

describe('GameEngineService', () => {
    let service: GameEngineService;
    let ready$: BehaviorSubject<boolean>;
    let mockDictionary: {
        isWord: Mock;
        dictionaryReady$: BehaviorSubject<boolean>;
        getWordOfTheDay: Mock;
        getWordBySeed: Mock;
    };

    const rowStates = (row: number): string[] => {
        return Array.from({ length: service.wordlength }, (_, index) => {
            return (service.registerForState(row, index + 1) as BehaviorSubject<string>).getValue();
        });
    };

    const enterGuess = (guess: string): void => {
        guess.split('').forEach((letter) => service.keyPressed(letter));
        service.keyPressed('Enter');
    };

    beforeEach(() => {
        ready$ = new BehaviorSubject<boolean>(false);
        mockDictionary = {
            isWord: vi.fn().mockReturnValue(true),
            dictionaryReady$: ready$,
            getWordOfTheDay: vi.fn().mockReturnValue('PLANET'),
            getWordBySeed: vi.fn().mockReturnValue('GALAXY'),
        };

        TestBed.configureTestingModule({
            providers: [
                provideHttpClientTesting(),
                {
                    provide: DictionaryService,
                    useValue: mockDictionary,
                },
            ],
        });
        service = TestBed.inject(GameEngineService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should update the answer when the dictionary becomes ready', () => {
        ready$.next(true);

        expect(mockDictionary.getWordOfTheDay).toHaveBeenCalled();
        expect(service.word).toBe('PLANET');
    });

    it('should expose tellme() for debugging the answer', () => {
        ready$.next(true);
        vi.spyOn(console, 'log');

        const answer = (window as any).tellme();

        expect(answer).toBe('PLANET');
    });

    it('should preserve cell state when registering the same position again', () => {
        const first = service.registerForValue(1, 1) as BehaviorSubject<string>;
        first.next('A');

        const values: string[] = [];
        service.registerForValue(1, 1).subscribe((value) => values.push(value));

        expect(values[0]).toBe('A');
    });

    it('should preserve key state when registering the same key again', () => {
        const first = service.registerKey('Q') as BehaviorSubject<string>;
        first.next('green');

        const states: string[] = [];
        service.registerKey('Q').subscribe((value) => states.push(value));

        expect(states[0]).toBe('green');
    });

    it('should reset state and choose a seeded word on newGame()', () => {
        ready$.next(true);
        (service.registerForValue(1, 1) as BehaviorSubject<string>).next('A');
        (service.registerForState(1, 1) as BehaviorSubject<string>).next('green');
        (service.registerKey('Q') as BehaviorSubject<string>).next('yellow');
        service.gameOutcome$.next('won');

        service.newGame(1234);

        expect(mockDictionary.getWordBySeed).toHaveBeenCalledWith(1234);
        expect(service.word).toBe('GALAXY');
        expect(service.gameOutcome$.getValue()).toBe('playing');
        expect((service.registerForValue(1, 1) as BehaviorSubject<string>).getValue()).toBe('');
        expect((service.registerForState(1, 1) as BehaviorSubject<string>).getValue()).toBe('black');
        expect((service.registerKey('Q') as BehaviorSubject<string>).getValue()).toBe('light');
    });

    it('should ignore newGame() before the dictionary is ready', () => {
        service.newGame(1234);

        expect(mockDictionary.getWordBySeed).not.toHaveBeenCalled();
        expect(service.word).toBe('');
        expect(service.gameOutcome$.getValue()).toBe('playing');
    });

    it('should mark the game as won when a correct guess is entered', () => {
        ready$.next(true);

        'PLANET'.split('').forEach((letter) => service.keyPressed(letter));
        service.keyPressed('Enter');

        expect(service.gameOutcome$.getValue()).toBe('won');
    });

    it('should mark the game as lost after the final attempt', () => {
        ready$.next(true);

        const enterGuess = (guess: string) => {
            guess.split('').forEach((letter) => service.keyPressed(letter));
            service.keyPressed('Enter');
        };

        for (let i = 0; i < service.maxAttempts; i++) {
            enterGuess('AAAAAA');
        }

        expect(service.gameOutcome$.getValue()).toBe('lost');
    });

    it('should ignore further input once the game is complete', () => {
        ready$.next(true);

        'PLANET'.split('').forEach((letter) => service.keyPressed(letter));
        service.keyPressed('Enter');
        expect(service.gameOutcome$.getValue()).toBe('won');

        const currentWord = service.currentWord;
        service.keyPressed('A');
        service.keyPressed('Enter');

        expect(service.currentWord).toBe(currentWord);
    });

    it('should report no ongoing game before the dictionary is ready', () => {
        expect(service.hasOngoingGame()).toBe(false);
    });

    it('should report no ongoing game for a ready but untouched board', () => {
        ready$.next(true);

        expect(service.hasOngoingGame()).toBe(false);
    });

    it('should report an ongoing game after input advances the cursor', () => {
        ready$.next(true);

        service.keyPressed('A');

        expect(service.hasOngoingGame()).toBe(true);
    });

    it('should report an ongoing game when a board cell is populated', () => {
        ready$.next(true);
        service.currentWord = 1;
        service.currentPosition = 1;
        (service.registerForValue(1, 1) as BehaviorSubject<string>).next('A');

        expect(service.hasOngoingGame()).toBe(true);
    });

    it('should preserve state when registering the same board state position again', () => {
        const first = service.registerForState(1, 1) as BehaviorSubject<string>;
        first.next('yellow');

        const states: string[] = [];
        service.registerForState(1, 1).subscribe((value) => states.push(value));

        expect(states[0]).toBe('yellow');
    });

    it('should initialize and update key colors directly', () => {
        expect(service.getKeyColor('X')).toBe('light');

        service.setKeyColor('X', 'yellow');

        expect(service.getKeyColor('X')).toBe('yellow');
    });

    it('should ignore Enter when the current row is incomplete', () => {
        ready$.next(true);
        service.keyPressed('A');
        service.keyPressed('B');

        service.keyPressed('Enter');

        expect(service.currentWord).toBe(1);
        expect(service.currentPosition).toBe(3);
        expect((service.registerForValue(1, 1) as BehaviorSubject<string>).getValue()).toBe('A');
        expect((service.registerForValue(1, 2) as BehaviorSubject<string>).getValue()).toBe('B');
    });

    it('should mark an invalid guess red and keep the player on the same row', () => {
        ready$.next(true);
        mockDictionary.isWord.mockReturnValue(false);
        rowStates(1);

        enterGuess('ABCDEF');

        expect(mockDictionary.isWord).toHaveBeenCalledWith('ABCDEF');
        expect(rowStates(1)).toEqual(['red', 'red', 'red', 'red', 'red', 'red']);
        expect(service.currentWord).toBe(1);
        expect(service.currentPosition).toBe(7);
    });

    it('should clear the error state and remove the last letter when backspacing a full row', () => {
        ready$.next(true);
        mockDictionary.isWord.mockReturnValue(false);
        rowStates(1);
        enterGuess('ABCDEF');

        service.keyPressed('Back');

        expect(rowStates(1)).toEqual(['clear', 'clear', 'clear', 'clear', 'clear', 'clear']);
        expect((service.registerForValue(1, 6) as BehaviorSubject<string>).getValue()).toBe('');
        expect(service.currentPosition).toBe(6);
    });

    it('should ignore non-enter input once the row is already full', () => {
        ready$.next(true);
        'ABCDEF'.split('').forEach((letter) => service.keyPressed(letter));

        service.keyPressed('Z');

        expect((service.registerForValue(1, 6) as BehaviorSubject<string>).getValue()).toBe('F');
        expect(service.currentPosition).toBe(7);
    });

    it('should color tiles for mixed guesses and preserve a green key over later grey hits', () => {
        ready$.next(true);
        rowStates(1);

        enterGuess('PEOPLE');

        expect(rowStates(1)).toEqual(['green', 'yellow', 'grey', 'grey', 'yellow', 'grey']);
        expect(service.getKeyColor('P')).toBe('green');
        expect(service.getKeyColor('E')).toBe('yellow');
        expect(service.getKeyColor('O')).toBe('dark');
        expect(service.getKeyColor('L')).toBe('yellow');
    });

    it('should handle duplicate letters without over-crediting extra guesses', () => {
        ready$.next(true);
        mockDictionary.getWordBySeed.mockReturnValue('BANANA');
        service.newGame(7);
        rowStates(1);

        enterGuess('AAAAAA');

        expect(rowStates(1)).toEqual(['grey', 'green', 'grey', 'green', 'grey', 'green']);
    });
});
