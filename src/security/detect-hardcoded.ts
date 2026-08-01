import fs from 'fs';
import path from 'path';
import { SecurityFinding } from './detect-public-secrets.js';

const SECRET_PATTERNS = [
  { name: 'Stripe Secret Key', regex: /sk_live_[0-9a-zA-Z]{24}/g },
  { name: 'Stripe Test Key', regex: /sk_test_[0-9a-zA-Z]{24}/g },
  { name: 'AWS Access Key ID', regex: /AKIA[0-9A-Z]{16}/g },
  { name: 'GitHub Personal Access Token', regex: /ghp_[0-9a-zA-Z]{36}/g }
];

export function detectHardcodedSecrets(cwd: string, sourceDirectories: string[], ignoredDirectories: string[] = ['node_modules', 'dist', 'build']): SecurityFinding[] {
  const findings: SecurityFinding[] = [];

  function scanDir(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (ignoredDirectories.includes(entry.name)) continue;

      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.isFile() && /\.(js|ts|jsx|tsx)$/.test(entry.name)) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        
        for (const pattern of SECRET_PATTERNS) {
          const matches = content.match(pattern.regex);
          if (matches && matches.length > 0) {
            findings.push({
              type: 'hardcoded_secret',
              severity: 'CRITICAL',
              file: fullPath.replace(cwd + path.sep, ''),
              message: `Possible hardcoded ${pattern.name} found in source code.`,
            });
          }
        }
      }
    }
  }

  for (const srcDir of sourceDirectories) {
    const fullPath = path.join(cwd, srcDir);
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath);
    }
  }

  return findings;
}
