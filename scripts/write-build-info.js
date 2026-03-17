const { execSync } = require('node:child_process');
const { writeFileSync } = require('node:fs');
const { resolve } = require('node:path');

function readShortHash() {
  const githubSha = process.env.GITHUB_SHA?.trim();

  if (githubSha) {
    return githubSha.slice(0, 7);
  }

  try {
    return execSync('git rev-parse --short HEAD', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
  }
  catch {
    return 'unknown';
  }
}

const outputPath = resolve(__dirname, '../src/app/build-info.generated.ts');
const shortHash = readShortHash();
const builtAtUtc = new Date().toISOString();

const fileContents = `import { InjectionToken } from '@angular/core';

export interface BuildInfo {
  hash: string;
  builtAtUtc: string;
}

export const buildInfo: BuildInfo = {
  hash: '${shortHash}',
  builtAtUtc: '${builtAtUtc}'
};

export const BUILD_INFO = new InjectionToken<BuildInfo>('BUILD_INFO', {
  factory: () => buildInfo
});
`;

writeFileSync(outputPath, fileContents, 'utf8');
