import { describe, it, expect } from 'vitest';
import { loadEnvFiles } from '../src/cli/env-parser.js';
import path from 'path';
import fs from 'fs';

describe('CLI Env Parser', () => {
  it('should parse dotenv files correctly', () => {
    const testDir = path.join(__dirname, 'temp-env-test');
    if (!fs.existsSync(testDir)) fs.mkdirSync(testDir);
    
    fs.writeFileSync(path.join(testDir, '.env'), 'APP_NAME=Test\nPORT=4000\n');
    fs.writeFileSync(path.join(testDir, '.env.local'), 'PORT=5000\nSECRET=123\n');
    
    const parsed = loadEnvFiles(testDir, ['.env', '.env.local']);
    
    expect(parsed.APP_NAME).toBe('Test');
    expect(parsed.PORT).toBe('5000'); // .env.local overrides .env
    expect(parsed.SECRET).toBe('123');
    
    fs.rmSync(testDir, { recursive: true, force: true });
  });
});
