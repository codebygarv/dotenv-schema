import pc from 'picocolors';
import { validateCommand } from './validate.js';
import { auditCommand } from './audit.js';

export async function checkCommand(options: { config?: string }) {
  console.log(pc.bold(pc.blue(`\n1. Running Environment Validation...\n`)));
  await validateCommand(options);
  
  console.log(pc.bold(pc.blue(`\n2. Running Environment Audit...\n`)));
  await auditCommand(options);
}
