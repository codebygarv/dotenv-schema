import { describe, it, expect } from 'vitest';
import { findUnusedVariables } from '../src/audit/find-unused.js';
import { calculateHealthScore } from '../src/audit/calculate-score.js';
import { scanSourceCode } from '../src/audit/scan-source-code.js';
import fs from 'fs';
import path from 'path';

describe('Audit: Find Unused Variables', () => {
  it('should find unused variables', () => {
    const defined = new Set(['PORT', 'API_KEY', 'OLD_KEY']);
    const used = new Set(['PORT', 'API_KEY']);
    
    const unused = findUnusedVariables(defined, used);
    expect(unused).toContain('OLD_KEY');
    expect(unused.length).toBe(1);
  });
});

describe('Audit: Calculate Score', () => {
  it('should deduct points for missing variables', () => {
    const score = calculateHealthScore({
      totalVariables: 10,
      validVariables: 10,
      unusedVariables: 0,
      missingVariables: 2,
      securityWarnings: 0,
      securityCriticals: 0,
    });
    
    expect(score).toBe(90); // 100 - (2 * 5)
  });
});

describe('Audit: Scan Source Code', () => {
  it('should detect variables in source code', () => {
    const testDir = path.join(__dirname, 'temp-src');
    if (!fs.existsSync(testDir)) fs.mkdirSync(testDir);
    
    fs.writeFileSync(path.join(testDir, 'index.ts'), 'const port = process.env.PORT || 3000;\nconst url = import.meta.env.VITE_API_URL;');
    
    const used = scanSourceCode(__dirname, ['temp-src']);
    expect(used.has('PORT')).toBe(true);
    expect(used.has('VITE_API_URL')).toBe(true);
    
    fs.rmSync(testDir, { recursive: true, force: true });
  });
});
