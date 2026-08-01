import pc from 'picocolors';
import { loadConfig } from '../config.js';
import { loadEnvFiles } from '../env-parser.js';
import createJiti from 'jiti';
import { resolve } from 'path';
import fs from 'fs';

export async function validateCommand(options: { config?: string, format?: string }) {
  const cwd = process.cwd();
  
  try {
    const config = await loadConfig(cwd, options.config);
    const envFiles = config.envFiles || ['.env', '.env.local'];
    
    // 1. Load env files
    const parsedEnv = loadEnvFiles(cwd, envFiles);
    
    // 2. Load schema
    const schemaPath = config.schemaPath || 'src/env.ts';
    const fullSchemaPath = resolve(cwd, schemaPath);
    
    if (!fs.existsSync(fullSchemaPath)) {
      console.error(pc.red(`\n✗ Could not find schema file at ${schemaPath}`));
      console.log(pc.yellow(`Please create one or update 'schemaPath' in your config.\n`));
      process.exit(1);
    }
    
    const jiti = createJiti(cwd, { interopDefault: true });
    
    const originalEnv = { ...process.env };
    Object.assign(process.env, parsedEnv);
    
    try {
      jiti(fullSchemaPath);
      console.log(pc.green(`\n✓ Environment validation passed successfully.\n`));
    } finally {
      process.env = originalEnv;
    }

  } catch (err: any) {
    console.error(pc.red(`\nError: ${err.message}\n`));
    process.exit(1);
  }
}
