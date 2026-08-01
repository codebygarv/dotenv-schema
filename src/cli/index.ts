#!/usr/bin/env node
import { cac } from 'cac';
import { validateCommand } from './commands/validate.js';
import { checkCommand } from './commands/check.js';
import { auditCommand } from './commands/audit.js';
import { generateCommand } from './commands/generate.js';
import fs from 'fs';
import { resolve } from 'path';

// Get version from package.json
const pkgPath = resolve(new URL('.', import.meta.url).pathname, '../../package.json');
let version = 'unknown';
try {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  version = pkg.version;
} catch {}

const cli = cac('env-sentinel');

cli
  .command('validate', 'Validate the current environment')
  .option('-c, --config <file>', 'Path to config file')
  .option('-f, --format <format>', 'Output format (pretty or json)', { default: 'pretty' })
  .action(validateCommand);

cli
  .command('check', 'Run combined checks')
  .option('-c, --config <file>', 'Path to config file')
  .action(checkCommand);

cli
  .command('audit', 'Scan environment files and source code for issues')
  .option('-c, --config <file>', 'Path to config file')
  .action(auditCommand);

cli
  .command('generate', 'Generate environment variable documentation')
  .option('-c, --config <file>', 'Path to config file')
  .option('-f, --format <format>', 'Output format (markdown or example)', { default: 'markdown' })
  .action(generateCommand);

cli.help();
cli.version(version);

cli.parse();
