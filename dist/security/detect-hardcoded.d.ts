import { SecurityFinding } from './detect-public-secrets.js';
export declare function detectHardcodedSecrets(cwd: string, sourceDirectories: string[], ignoredDirectories?: string[]): SecurityFinding[];
