import fs from 'fs';
import path from 'path';

export function scanEnvFiles(cwd: string): string[] {
  const envFiles: string[] = [];
  const entries = fs.readdirSync(cwd);

  for (const entry of entries) {
    if (entry.startsWith('.env')) {
      const fullPath = path.join(cwd, entry);
      if (fs.statSync(fullPath).isFile()) {
        envFiles.push(entry);
      }
    }
  }

  return envFiles;
}
