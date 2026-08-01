import pc from 'picocolors';
import { loadConfig } from '../config.js';
import { loadEnvFiles } from '../env-parser.js';
import { scanEnvFiles } from '../../audit/scan-env-files.js';
import { scanSourceCode } from '../../audit/scan-source-code.js';
import { findUnusedVariables } from '../../audit/find-unused.js';
import { calculateHealthScore } from '../../audit/calculate-score.js';
import { detectPublicSecrets } from '../../security/detect-public-secrets.js';
import { detectWeakSecrets } from '../../security/detect-weak-secrets.js';
import { detectHardcodedSecrets } from '../../security/detect-hardcoded.js';

export async function runAudit(cwd: string, configPath?: string) {
  const config = await loadConfig(cwd, configPath);
  const envFilesList = scanEnvFiles(cwd);
  const parsedEnv = loadEnvFiles(cwd, envFilesList);
  
  const definedVariables = new Set(Object.keys(parsedEnv));
  const sourceDirs = config.sourceDirectories || ['src', 'app', 'server'];
  const ignoredDirs = config.ignoredDirectories || ['node_modules', 'dist', 'build'];
  
  const usedVariables = scanSourceCode(cwd, sourceDirs, ignoredDirs);
  
  const unusedVariables = findUnusedVariables(definedVariables, usedVariables);
  
  const missingVariables: string[] = [];
  for (const v of usedVariables) {
    if (!definedVariables.has(v) && v !== 'NODE_ENV') {
      missingVariables.push(v);
    }
  }

  const publicSecrets = detectPublicSecrets(definedVariables);
  const weakSecrets = detectWeakSecrets(parsedEnv, config.security?.minimumSecretLength);
  const hardcodedSecrets = detectHardcodedSecrets(cwd, sourceDirs, ignoredDirs);
  
  const securityFindings = [...publicSecrets, ...weakSecrets, ...hardcodedSecrets];
  const securityCriticals = securityFindings.filter(f => f.severity === 'CRITICAL').length;
  const securityWarnings = securityFindings.filter(f => f.severity === 'WARNING').length;

  const score = calculateHealthScore({
    totalVariables: definedVariables.size,
    validVariables: definedVariables.size, 
    unusedVariables: unusedVariables.length,
    missingVariables: missingVariables.length,
    securityWarnings,
    securityCriticals
  });

  return {
    score,
    definedVariables,
    envFilesList,
    unusedVariables,
    missingVariables,
    securityFindings,
    securityCriticals
  };
}

export async function auditCommand(options: { config?: string }) {
  const cwd = process.cwd();
  
  try {
    const data = await runAudit(cwd, options.config);

    console.log(pc.bold(`\n🛡️ Env Sentinel Audit\n`));
    console.log(`Environment Health:\n${pc.bold(data.score >= 80 ? pc.green(data.score) : data.score >= 60 ? pc.yellow(data.score) : pc.red(data.score))}/100\n`);
    
    console.log(pc.bold(`Configuration:`));
    console.log(`✓ ${data.definedVariables.size} variables detected in ${data.envFilesList.length} files`);
    
    if (data.unusedVariables.length > 0) {
      console.log(pc.yellow(`⚠ ${data.unusedVariables.length} variables appear unused:`));
      data.unusedVariables.forEach(v => console.log(pc.dim(`  - ${v}`)));
    } else {
      console.log(pc.green(`✓ All detected variables are actively used`));
    }

    if (data.missingVariables.length > 0) {
      console.log(pc.red(`\n✗ ${data.missingVariables.length} variables used in code but missing from environment:`));
      data.missingVariables.forEach(v => console.log(pc.dim(`  - ${v}`)));
    }

    if (data.securityFindings.length > 0) {
      console.log(pc.bold(`\nSecurity Findings:`));
      data.securityFindings.forEach(f => {
        const color = f.severity === 'CRITICAL' ? pc.red : pc.yellow;
        console.log(color(`[${f.severity}] ${f.message}`));
        if (f.file) console.log(pc.dim(`  File: ${f.file}`));
      });
    } else {
      console.log(pc.green(`\n✓ No security issues detected.`));
    }

    console.log('\n');
    
    if (data.missingVariables.length > 0 || data.securityCriticals > 0) {
      console.error(pc.red(`✗ Audit failed: Found ${data.missingVariables.length} missing variables and ${data.securityCriticals} critical security issues.`));
      process.exit(1);
    }

  } catch (err: any) {
    console.error(pc.red(`\nError: ${err.message}\n`));
    process.exit(1);
  }
}
