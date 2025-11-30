import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
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
  };

  beforeEach(() => {
    ready$ = new BehaviorSubject<boolean>(false);
    mockDictionary = {
      isWord: () => true,
      dictionaryReady$: ready$.asObservable(),
      getWordOfTheDay: jasmine.createSpy('getWordOfTheDay').and.returnValue('PLANET'),
    };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
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
    expect(console.log).toHaveBeenCalledWith('Answer is: ' + 'PLANET');
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
});
