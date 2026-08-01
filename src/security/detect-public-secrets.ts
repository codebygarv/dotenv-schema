export interface SecurityFinding {
  type: 'public_secret' | 'weak_secret' | 'hardcoded_secret';
  severity: 'CRITICAL' | 'WARNING';
  message: string;
  variable?: string;
  file?: string;
}

const PUBLIC_PREFIXES = ['NEXT_PUBLIC_', 'VITE_', 'REACT_APP_', 'EXPO_PUBLIC_', 'NUXT_PUBLIC_'];
const SENSITIVE_KEYWORDS = ['SECRET', 'PASSWORD', 'KEY', 'TOKEN', 'CREDENTIAL', 'PRIVATE'];

export function detectPublicSecrets(definedVariables: Set<string>): SecurityFinding[] {
  const findings: SecurityFinding[] = [];

  for (const variable of definedVariables) {
    const isPublic = PUBLIC_PREFIXES.some(prefix => variable.startsWith(prefix));
    if (isPublic) {
      const isSensitive = SENSITIVE_KEYWORDS.some(keyword => variable.includes(keyword));
      if (isSensitive) {
        findings.push({
          type: 'public_secret',
          severity: 'CRITICAL',
          variable,
          message: `Variable ${variable} appears to contain sensitive information but is prefixed with a public framework identifier. This will leak secrets to the client side.`,
        });
      }
    }
  }

  return findings;
}
