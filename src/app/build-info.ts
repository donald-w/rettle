import { InjectionToken } from '@angular/core';

export interface BuildInfo {
  hash: string;
  builtAtUtc: string;
}

export const buildInfo: BuildInfo = {
  hash: 'HASH',
  builtAtUtc: 'BUILD TIME'
};

export const BUILD_INFO = new InjectionToken<BuildInfo>('BUILD_INFO', {
  factory: () => buildInfo
});
