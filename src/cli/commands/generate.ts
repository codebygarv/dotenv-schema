import pc from 'picocolors';
import fs from 'fs';
import path from 'path';
import { loadConfig } from '../config.js';
import createJiti from 'jiti';
import { SCHEMA_SYMBOL } from '../../core/define-env.js';
import { generateMarkdownDocs } from '../../docs/generate-markdown.js';
import { generateEnvExample } from '../../docs/generate-env-example.js';
import { EnvSchema } from '../../types/schema.js';

export async function generateCommand(options: { config?: string, format?: string }) {
  const cwd = process.cwd();
  
  try {
    const config = await loadConfig(cwd, options.config);
    const schemaPath = config.schemaPath || 'src/env.ts';
    const fullSchemaPath = path.resolve(cwd, schemaPath);
    
    if (!fs.existsSync(fullSchemaPath)) {
      console.error(pc.red(`\n✗ Could not find schema file at ${schemaPath}`));
      process.exit(1);
    }
    
    // Set validation skip flag so defineEnv does not exit
    process.env.ENV_SENTINEL_SKIP_VALIDATION = 'true';
    
    const jiti = createJiti(cwd, { interopDefault: true });
    
    let schemaObj: any;
    try {
      schemaObj = await jiti(fullSchemaPath);
    } finally {
       delete process.env.ENV_SENTINEL_SKIP_VALIDATION;
    }
    
    // Attempt to extract the schema
    let rawSchema: EnvSchema | undefined = undefined;
    
    const valuesToInspect = [
      schemaObj,
      ...(schemaObj && typeof schemaObj === 'object' ? Object.values(schemaObj) : [])
    ];
    
    for (const val of valuesToInspect) {
      if (val && typeof val === 'object' && (val as any)[SCHEMA_SYMBOL]) {
        rawSchema = (val as any)[SCHEMA_SYMBOL];
        break;
      }
    }

    if (!rawSchema) {
      console.error(pc.red(`\n✗ Could not extract schema from ${schemaPath}. Make sure you are using defineEnv() and exporting the result.`));
      process.exit(1);
    }

    const format = options.format || 'markdown';
    
    if (format === 'markdown') {
      const md = generateMarkdownDocs(rawSchema);
      fs.writeFileSync(path.join(cwd, 'env.md'), md);
      console.log(pc.green(`\n✓ Generated env.md successfully.\n`));
    } else if (format === 'example') {
      const example = generateEnvExample(rawSchema);
      fs.writeFileSync(path.join(cwd, '.env.example'), example);
      console.log(pc.green(`\n✓ Generated .env.example successfully.\n`));
    } else {
       console.error(pc.red(`\n✗ Unknown format: ${format}. Use 'markdown' or 'example'.`));
       process.exit(1);
    }

  } catch (err: any) {
    console.error(pc.red(`\nError: ${err.message}\n`));
    process.exit(1);
  }
}
