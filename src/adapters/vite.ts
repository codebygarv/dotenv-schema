import { defineEnv } from '../core/define-env.js';
import { EnvSchema } from '../types/schema.js';

export function defineViteEnv<T extends EnvSchema>(schema: T) {
  // Vite adapter - checks for import.meta.env when process is undefined
  const processEnv = typeof process !== 'undefined' ? process.env : (typeof (import.meta as any) !== 'undefined' ? (import.meta as any).env : {});
  return defineEnv(schema, processEnv);
}
