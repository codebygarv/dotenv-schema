import fs from 'fs';
import path from 'path';

export function scanSourceCode(cwd: string, sourceDirectories: string[], ignoredDirectories: string[] = ['node_modules', 'dist', 'build']): Set<string> {
  const variables = new Set<string>();
  const envRegex = /(?:process\.env\.|import\.meta\.env\.|env\.)([a-zA-Z_][a-zA-Z0-9_]*)/g;

  function scanDir(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (ignoredDirectories.includes(entry.name)) continue;

      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.isFile() && /\.(js|ts|jsx|tsx)$/.test(entry.name)) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        let match;
        while ((match = envRegex.exec(content)) !== null) {
          variables.add(match[1]);
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

  return variables;
}
