import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { DictionaryService } from './dictionary.service';

describe('DictionaryService', () => {
    let service: DictionaryService;
    let httpMock: HttpTestingController;
    const mockDictionary = [
        'hello',
        'return',
        'planet',
        'butter',
        'sail',
        'candle',
        'world',
        'bad$word',
        '123word',
    ].join('\n');

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClientTesting()],
        });
        service = TestBed.inject(DictionaryService);
        httpMock = TestBed.inject(HttpTestingController);

        httpMock.expectOne('assets/3of6game.txt').flush(mockDictionary);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should detect words from the mocked dictionary', () => {
        expect(service.isWord('HELLO')).toBe(true);
        expect(service.isWord('PLANET')).toBe(true);
        expect(service.isWord('WORLD')).toBe(true);
        expect(service.isWord('MISSING')).toBe(false);
        expect(service.isWord('BAD$WORD')).toBe(false);
        expect(service.isWord('123WORD')).toBe(false);
    });

    it('should mark the dictionary as ready once loaded', () => {
        let ready: boolean | undefined;
        service.dictionaryReady$.subscribe(value => ready = value);

        expect(ready).toBe(true);
    });

    it('should pick a deterministic word of the day', () => {
        const date = new Date('2023-01-03T00:00:00Z');

        expect(service.getWordOfTheDay(date)).toBe('PLANET');
    });

    it('should wrap around when hashing near the end of the list', () => {
        (service as any).sixLetterWords = ['ALPHAS', 'BRAVOS'];

        expect(service.getWordOfTheDay(new Date('2023-01-03T00:00:00Z'))).toBe('BRAVOS');
        expect(service.getWordOfTheDay(new Date('2030-12-31T00:00:00Z'))).toBe('ALPHAS');
    });
});
