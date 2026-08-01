import { EnvSchema, InferEnv } from '../types/schema.js';
export declare const SCHEMA_SYMBOL: unique symbol;
export declare function defineEnv<T extends EnvSchema>(schema: T, processEnv?: NodeJS.ProcessEnv): InferEnv<T>;
