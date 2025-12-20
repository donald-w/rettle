import { TestBed } from '@angular/core/testing';

import { SettingsService } from './settings.service';

describe('SettingsService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('defaults to enabled when nothing stored', () => {
    const service = TestBed.inject(SettingsService);
    expect(service.getColourAccessibilityMode()).toBeTrue();
  });

  it('reads initial value from localStorage', () => {
    localStorage.setItem('rettle.colourAccessibilityMode', 'true');
    const service = new SettingsService();
    expect(service.getColourAccessibilityMode()).toBeTrue();
  });

  it('respects stored disabled value from localStorage', () => {
    localStorage.setItem('rettle.colourAccessibilityMode', 'false');
    const service = new SettingsService();
    expect(service.getColourAccessibilityMode()).toBeFalse();
  });

  it('persists changes to localStorage', () => {
    const service = TestBed.inject(SettingsService);
    service.setColourAccessibilityMode(true);
    expect(localStorage.getItem('rettle.colourAccessibilityMode')).toBe('true');

    service.setColourAccessibilityMode(false);
    expect(localStorage.getItem('rettle.colourAccessibilityMode')).toBe('false');
  });
});
