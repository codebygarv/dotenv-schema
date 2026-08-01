import { describe, it, expect, vi } from 'vitest';
import { defineEnv } from '../src/core/define-env.js';
import { validateValue } from '../src/validators/validators.js';
import { EnvSchema } from '../src/types/schema.js';

describe('Validators', () => {
  it('should parse strings correctly', () => {
    const result = validateValue('APP', 'MyApp', { type: 'string' });
    expect(result.valid).toBe(true);
    expect(result.parsedValue).toBe('MyApp');
  });

  it('should fail on short strings', () => {
    const result = validateValue('APP', 'My', { type: 'string', minLength: 5 });
    expect(result.valid).toBe(false);
  });

  it('should parse numbers correctly', () => {
    const result = validateValue('PORT', '3000', { type: 'number' });
    expect(result.valid).toBe(true);
    expect(result.parsedValue).toBe(3000);
  });

  it('should parse booleans correctly', () => {
    const result = validateValue('ENABLE', 'true', { type: 'boolean' });
    expect(result.valid).toBe(true);
    expect(result.parsedValue).toBe(true);
  });

  it('should fail on invalid enum', () => {
    const result = validateValue('NODE_ENV', 'live', { type: 'enum', values: ['development', 'production'] });
    expect(result.valid).toBe(false);
  });

  it('should fallback to default if missing', () => {
    const result = validateValue('PORT', undefined, { type: 'number', default: 8080 });
    expect(result.valid).toBe(true);
    expect(result.parsedValue).toBe(8080);
  });
});

describe('defineEnv', () => {
  it('should return valid env object', () => {
    const env = defineEnv({
      PORT: { type: 'number', default: 3000 },
      APP_NAME: { type: 'string', required: true }
    }, { APP_NAME: 'TestApp' });

    expect(env.PORT).toBe(3000);
    expect(env.APP_NAME).toBe('TestApp');
  });

  it('should throw on validation failure', () => {
    // We suppress console.error to avoid noise in test output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    expect(() => {
      defineEnv({
        DATABASE_URL: { type: 'url', required: true }
      }, {});
    }).toThrow();
    
    consoleSpy.mockRestore();
  });
});
