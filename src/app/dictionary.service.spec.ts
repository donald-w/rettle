import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DictionaryService } from './dictionary.service';

describe('DictionaryService', () => {
  let service: DictionaryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(DictionaryService);
    httpMock = TestBed.inject(HttpTestingController);

    httpMock.expectOne('assets/3of6game.txt').flush('hello\nworld');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should detect words from the mocked dictionary', () => {
    expect(service.isWord('HELLO')).toBeTrue();
    expect(service.isWord('WORLD')).toBeTrue();
    expect(service.isWord('MISSING')).toBeFalse();
  });
});
