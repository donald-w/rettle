import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { BehaviorSubject } from 'rxjs';

import { GameEngineService } from './game-engine.service';
import { DictionaryService } from './dictionary.service';

describe('GameEngineService', () => {
  let service: GameEngineService;
  let ready$: BehaviorSubject<boolean>;
  let mockDictionary: {
    isWord: () => boolean;
    dictionaryReady$: any;
    getWordOfTheDay: jasmine.Spy;
    getWordBySeed: jasmine.Spy;
  };

  beforeEach(() => {
    ready$ = new BehaviorSubject<boolean>(false);
    mockDictionary = {
      isWord: () => true,
      dictionaryReady$: ready$.asObservable(),
      getWordOfTheDay: jasmine.createSpy('getWordOfTheDay').and.returnValue('PLANET'),
      getWordBySeed: jasmine.createSpy('getWordBySeed').and.returnValue('GALAXY'),
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
    spyOn(console, 'log');

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
});
