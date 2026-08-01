import { describe, it, expect } from 'vitest';
import { detectPublicSecrets } from '../src/security/detect-public-secrets.js';
import { detectWeakSecrets } from '../src/security/detect-weak-secrets.js';
import { detectHardcodedSecrets } from '../src/security/detect-hardcoded.js';
import fs from 'fs';
import path from 'path';

describe('Security: Public Secrets', () => {
  it('should detect public secrets', () => {
    const defined = new Set(['NEXT_PUBLIC_JWT_SECRET', 'VITE_API_KEY', 'REACT_APP_NORMAL', 'SECRET_KEY']);
    const findings = detectPublicSecrets(defined);
    
    expect(findings.length).toBe(2);
    expect(findings[0].variable).toBe('NEXT_PUBLIC_JWT_SECRET');
    expect(findings[1].variable).toBe('VITE_API_KEY');
    expect(findings[0].severity).toBe('CRITICAL');
  });
});

describe('Security: Weak Secrets', () => {
  it('should detect weak secrets', () => {
    const env = {
      'JWT_SECRET': 'short',
      'API_PASSWORD': 'also_short',
      'NORMAL_VAR': 'short', // not flagged, not a secret keyword
      'LONG_SECRET': 'this_is_a_very_long_secret_that_should_pass_validation'
    };
    
    const findings = detectWeakSecrets(env, 32);
    
    expect(findings.length).toBe(2);
    expect(findings[0].variable).toBe('JWT_SECRET');
    expect(findings[1].variable).toBe('API_PASSWORD');
    expect(findings[0].severity).toBe('WARNING');
  });
});

describe('Security: Hardcoded Secrets', () => {
  it('should detect hardcoded secrets in source code', () => {
    const testDir = path.join(__dirname, 'temp-sec-src');
    if (!fs.existsSync(testDir)) fs.mkdirSync(testDir);
    
    const stripe = "sk_test_" + "1234567890abcdefghijklmn";
    fs.writeFileSync(path.join(testDir, 'index.ts'), 'const stripe = "' + stripe + '";\nconst other = "AKIAIOSFODNN7EXAMPLE";');
    
    const findings = detectHardcodedSecrets(__dirname, ['temp-sec-src']);
    
    expect(findings.length).toBe(2);
    expect(findings[0].severity).toBe('CRITICAL');
    expect(findings[0].message).toContain('Stripe Test Key');
    expect(findings[1].message).toContain('AWS Access Key');
    
    fs.rmSync(testDir, { recursive: true, force: true });
  });
});
