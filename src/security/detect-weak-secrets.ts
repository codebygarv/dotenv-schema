import { SecurityFinding } from './detect-public-secrets.js';

export function detectWeakSecrets(parsedEnv: Record<string, string>, minLength: number = 32): SecurityFinding[] {
  const findings: SecurityFinding[] = [];
  const SENSITIVE_KEYWORDS = ['SECRET', 'PASSWORD', 'TOKEN', 'PRIVATE'];

  for (const [key, value] of Object.entries(parsedEnv)) {
    const isSensitive = SENSITIVE_KEYWORDS.some(keyword => key.includes(keyword));
    
    if (isSensitive && value && value.length > 0 && value.length < minLength) {
      findings.push({
        type: 'weak_secret',
        severity: 'WARNING',
        variable: key,
        message: `Secret ${key} is only ${value.length} characters long. A minimum of ${minLength} is recommended for high entropy.`,
      });
    }
  }

  return findings;
}
