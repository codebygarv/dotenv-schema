import { EnvSchema } from '../types/schema.js';
export declare function defineNextEnv<T extends EnvSchema>(schema: T): import("../index.js").InferEnv<T>;
