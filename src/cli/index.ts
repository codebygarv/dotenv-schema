#!/usr/bin/env node
import { cac } from 'cac';
import { validateCommand } from './commands/validate.js';
import { checkCommand } from './commands/check.js';

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

cli.help();
// Note: real version reading will be added in production build step
cli.version('0.2.0');

cli.parse();
