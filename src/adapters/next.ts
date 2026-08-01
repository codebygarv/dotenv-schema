import { defineEnv } from '../core/define-env.js';
import { EnvSchema } from '../types/schema.js';

export function defineNextEnv<T extends EnvSchema>(schema: T) {
  // Next.js adapter - wraps defineEnv
  return defineEnv(schema);
}
