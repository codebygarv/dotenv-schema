import { EnvSchema, InferEnv } from '../types/schema.js';
import { validateValue } from '../validators/validators.js';

export const SCHEMA_SYMBOL = Symbol.for('env-sentinel-schema');

export function defineEnv<T extends EnvSchema>(schema: T, processEnv: NodeJS.ProcessEnv = process.env): InferEnv<T> {
  const result: Record<string, any> = {};
  
  if (process.env.ENV_SENTINEL_SKIP_VALIDATION === 'true') {
    Object.defineProperty(result, SCHEMA_SYMBOL, {
      value: schema,
      enumerable: false,
    });
    return result as InferEnv<T>;
  }

  const errors: string[] = [];

  for (const [key, schemaOption] of Object.entries(schema)) {
    const rawValue = processEnv[key];
    const validation = validateValue(key, rawValue, schemaOption);

    if (validation.valid) {
      if (validation.parsedValue !== undefined) {
        result[key] = validation.parsedValue;
      }
    } else {
      let errorMessage = `✗ ${key}\n  ${validation.error}`;
      if (schemaOption.secret) {
        errorMessage += `\n  (Secret value hidden)`;
      }
      errors.push(errorMessage);
    }
  }

  if (errors.length > 0) {
    console.error(`\n🛡️ Environment validation failed\n\n${errors.join('\n\n')}\n`);
    
    // Only exit in production/development, not testing
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    } else {
      throw new Error('Environment validation failed');
    }
  }

  // Attach schema to the result even if validated (useful for runtime introspection)
  Object.defineProperty(result, SCHEMA_SYMBOL, {
    value: schema,
    enumerable: false,
  });

  return result as InferEnv<T>;
}
