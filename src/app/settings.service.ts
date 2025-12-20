import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const STORAGE_KEY = 'rettle.colourAccessibilityMode';

function readStoredBoolean(key: string): boolean {
  try {
    const value = localStorage.getItem(key);
    if (value === null) {
      return true;
    }

    return value === 'true';
  } catch {
    return true;
  }
}

function writeStoredBoolean(key: string, value: boolean): void {
  try {
    localStorage.setItem(key, value ? 'true' : 'false');
  } catch {
    // Ignore storage failures (private mode, blocked storage, etc.)
  }
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private readonly colourAccessibilityModeSubject = new BehaviorSubject<boolean>(readStoredBoolean(STORAGE_KEY));
  readonly colourAccessibilityMode$ = this.colourAccessibilityModeSubject.asObservable();

  getColourAccessibilityMode(): boolean {
    return this.colourAccessibilityModeSubject.value;
  }

  setColourAccessibilityMode(enabled: boolean): void {
    this.colourAccessibilityModeSubject.next(enabled);
    writeStoredBoolean(STORAGE_KEY, enabled);
  }

  toggleColourAccessibilityMode(): void {
    this.setColourAccessibilityMode(!this.getColourAccessibilityMode());
  }
}
