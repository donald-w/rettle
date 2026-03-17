import { Injectable, inject } from '@angular/core';
import { BUILD_INFO } from './build-info';

@Injectable({ providedIn: 'root' })
export class BuildInfoService {
  private readonly buildInfo = inject(BUILD_INFO);

  readonly displayText = this.createDisplayText();
  readonly available = true;

  private createDisplayText(): string {
    const hash = this.formatHash(this.buildInfo.hash);
    const formattedBuiltAt = this.formatBuiltAtUtc(this.buildInfo.builtAtUtc);

    return `(c) Donald W - ${hash} - ${formattedBuiltAt}`;
  }

  private formatHash(hash: string): string {
    const trimmedHash = hash.trim();

    return trimmedHash || 'HASH';
  }

  private formatBuiltAtUtc(builtAtUtc: string): string {
    const trimmedBuiltAt = builtAtUtc.trim();

    if (!trimmedBuiltAt) {
      return 'BUILD TIME';
    }

    const parsedDate = new Date(trimmedBuiltAt);

    if (Number.isNaN(parsedDate.getTime())) {
      return trimmedBuiltAt;
    }

    return `${parsedDate.toISOString().slice(0, 16).replace('T', ' ')} UTC`;
  }
}
