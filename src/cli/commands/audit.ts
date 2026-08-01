import pc from 'picocolors';
import { loadConfig } from '../config.js';
import { loadEnvFiles } from '../env-parser.js';
import { scanEnvFiles } from '../../audit/scan-env-files.js';
import { scanSourceCode } from '../../audit/scan-source-code.js';
import { findUnusedVariables } from '../../audit/find-unused.js';
import { calculateHealthScore } from '../../audit/calculate-score.js';

export async function auditCommand(options: { config?: string }) {
  const cwd = process.cwd();
  
  try {
    const config = await loadConfig(cwd, options.config);
    const envFilesList = scanEnvFiles(cwd);
    const parsedEnv = loadEnvFiles(cwd, envFilesList);
    
    const definedVariables = new Set(Object.keys(parsedEnv));
    const usedVariables = scanSourceCode(cwd, config.sourceDirectories || ['src', 'app', 'server'], config.ignoredDirectories);
    
    const unusedVariables = findUnusedVariables(definedVariables, usedVariables);
    
    // Check for missing (used but not defined)
    const missingVariables: string[] = [];
    for (const v of usedVariables) {
      if (!definedVariables.has(v) && v !== 'NODE_ENV') {
        missingVariables.push(v);
      }
    }

    const score = calculateHealthScore({
      totalVariables: definedVariables.size,
      validVariables: definedVariables.size, // Assuming all valid for this simple audit without schema
      unusedVariables: unusedVariables.length,
      missingVariables: missingVariables.length,
      securityWarnings: 0,
    });

    console.log(pc.bold(`\n🛡️ Env Sentinel Audit\n`));
    console.log(`Environment Health:\n${pc.bold(score >= 80 ? pc.green(score) : score >= 60 ? pc.yellow(score) : pc.red(score))}/100\n`);
    
    console.log(pc.bold(`Configuration:`));
    console.log(`✓ ${definedVariables.size} variables detected in ${envFilesList.length} files`);
    
    if (unusedVariables.length > 0) {
      console.log(pc.yellow(`⚠ ${unusedVariables.length} variables appear unused:`));
      unusedVariables.forEach(v => console.log(pc.dim(`  - ${v}`)));
    } else {
      console.log(pc.green(`✓ All detected variables are actively used`));
    }

    if (missingVariables.length > 0) {
      console.log(pc.red(`\n✗ ${missingVariables.length} variables used in code but missing from environment:`));
      missingVariables.forEach(v => console.log(pc.dim(`  - ${v}`)));
    }

    console.log('\n');

  } catch (err: any) {
    console.error(pc.red(`\nError: ${err.message}\n`));
    process.exit(1);
  }
}
