import { SecurityFinding } from './detect-public-secrets.js';
export declare function detectWeakSecrets(parsedEnv: Record<string, string>, minLength?: number): SecurityFinding[];
