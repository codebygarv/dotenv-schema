import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

export function loadEnvFiles(cwd: string, files: string[]): Record<string, string> {
  let combinedEnv: Record<string, string> = {};

  for (const file of files) {
    const fullPath = path.resolve(cwd, file);
    if (fs.existsSync(fullPath)) {
      const parsed = dotenv.parse(fs.readFileSync(fullPath, 'utf-8'));
      combinedEnv = { ...combinedEnv, ...parsed };
    }
  }

  return combinedEnv;
}
