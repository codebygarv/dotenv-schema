import createJiti from 'jiti';
import { resolve } from 'path';
import fs from 'fs';
import { EnvSentinelConfig } from '../types/config.js';

export async function loadConfig(cwd: string, customPath?: string): Promise<EnvSentinelConfig> {
  const jiti = createJiti(cwd, { interopDefault: true });
  
  const possiblePaths = customPath ? [customPath] : [
    'env-sentinel.config.ts',
    'env-sentinel.config.js',
    'env-sentinel.config.cjs',
    'env-sentinel.config.mjs',
  ];

  for (const p of possiblePaths) {
    const fullPath = resolve(cwd, p);
    if (fs.existsSync(fullPath)) {
      try {
        const config = await jiti(fullPath);
        return config as EnvSentinelConfig;
      } catch (error) {
        throw new Error(`Failed to load config at ${fullPath}: ${error}`);
      }
    }
  }

  // Return default config if none found
  return {
    envFiles: ['.env', '.env.local'],
    schemaPath: 'src/env.ts'
  };
}
