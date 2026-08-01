import { describe, it, expect } from 'vitest';
import { defineNextEnv } from '../src/adapters/next.js';
import { defineViteEnv } from '../src/adapters/vite.js';
import { EnvSchema } from '../src/types/schema.js';
import { SCHEMA_SYMBOL } from '../src/core/define-env.js';

describe('Adapters: Next.js', () => {
  it('should wrap defineEnv successfully', () => {
    const schema: EnvSchema = { NEXT_PUBLIC_TEST: { type: 'string', default: 'yes' } };
    const env = defineNextEnv(schema);
    expect(env.NEXT_PUBLIC_TEST).toBe('yes');
    expect((env as any)[SCHEMA_SYMBOL]).toBeDefined();
  });
});

describe('Adapters: Vite', () => {
  it('should wrap defineEnv successfully', () => {
    const schema: EnvSchema = { VITE_TEST: { type: 'string', default: 'yes' } };
    const env = defineViteEnv(schema);
    expect(env.VITE_TEST).toBe('yes');
    expect((env as any)[SCHEMA_SYMBOL]).toBeDefined();
  });
});
