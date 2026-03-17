import { TestBed } from '@angular/core/testing';
import { BUILD_INFO, BuildInfo } from './build-info';
import { BuildInfoService } from './build-info.service';

describe('BuildInfoService', () => {
  function createService(buildInfo: BuildInfo): BuildInfoService {
    TestBed.configureTestingModule({
      providers: [{ provide: BUILD_INFO, useValue: buildInfo }]
    });

    return TestBed.inject(BuildInfoService);
  }

  it('should format build metadata for display', () => {
    const service = createService({
      hash: 'abc1234',
      builtAtUtc: '2026-03-17T14:22:00.000Z'
    });

    expect(service.available).toBe(true);
    expect(service.displayText).toBe('(c) Donald W - abc1234 - 2026-03-17 14:22 UTC');
  });

  it('should fall back to placeholders when hash is missing', () => {
    const service = createService({
      hash: '',
      builtAtUtc: '2026-03-17T14:22:00.000Z'
    });

    expect(service.available).toBe(true);
    expect(service.displayText).toBe('(c) Donald W - HASH - 2026-03-17 14:22 UTC');
  });

  it('should keep placeholder text when timestamp is not a date', () => {
    const service = createService({
      hash: 'abc1234',
      builtAtUtc: 'BUILD TIME'
    });

    expect(service.available).toBe(true);
    expect(service.displayText).toBe('(c) Donald W - abc1234 - BUILD TIME');
  });
});
