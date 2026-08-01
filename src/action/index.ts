import * as core from '@actions/core';
import * as github from '@actions/github';
import { runAudit } from '../cli/commands/audit.js';

async function run() {
  try {
    const configPath = core.getInput('config-file');
    const token = core.getInput('github-token');
    
    if (!token) {
      core.warning('No github-token provided. PR comments will be skipped.');
    }

    const cwd = process.env.GITHUB_WORKSPACE || process.cwd();
    const data = await runAudit(cwd, configPath || undefined);

    let markdown = `## 🛡️ Env Sentinel Audit\n\n`;
    
    const scoreColor = data.score >= 80 ? '🟢' : data.score >= 60 ? '🟡' : '🔴';
    markdown += `**Environment Health Score:** ${scoreColor} **${data.score}/100**\n\n`;

    markdown += `### ⚙️ Configuration\n`;
    markdown += `- **Variables Detected:** ${data.definedVariables.size}\n`;
    markdown += `- **Files Scanned:** ${data.envFilesList.length}\n`;
    markdown += `- **Unused Variables:** ${data.unusedVariables.length > 0 ? `🟡 ${data.unusedVariables.length}` : '✅ 0'}\n`;
    markdown += `- **Missing Variables:** ${data.missingVariables.length > 0 ? `🔴 ${data.missingVariables.length}` : '✅ 0'}\n\n`;

    if (data.missingVariables.length > 0) {
      markdown += `### 🔴 Missing Required Variables\n`;
      data.missingVariables.forEach(v => {
        markdown += `- \`${v}\`\n`;
      });
      markdown += '\n';
    }

    if (data.unusedVariables.length > 0) {
      markdown += `### 🟡 Unused Variables\n`;
      data.unusedVariables.forEach(v => {
        markdown += `- \`${v}\`\n`;
      });
      markdown += '\n';
    }

    if (data.securityFindings.length > 0) {
      markdown += `### 🔒 Security Findings\n`;
      data.securityFindings.forEach(f => {
        const icon = f.severity === 'CRITICAL' ? '🔴' : '🟡';
        markdown += `- ${icon} **[${f.severity}]** ${f.message}\n`;
      });
      markdown += '\n';
    } else {
      markdown += `### 🔒 Security\n✅ No security issues detected.\n\n`;
    }

    core.summary.addRaw(markdown);
    await core.summary.write();

    if (token && github.context.payload.pull_request) {
      const octokit = github.getOctokit(token);
      await octokit.rest.issues.createComment({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: github.context.payload.pull_request.number,
        body: markdown
      });
    }

    if (data.missingVariables.length > 0 || data.securityCriticals > 0) {
      core.setFailed(`Audit failed: Found ${data.missingVariables.length} missing variables and ${data.securityCriticals} critical security issues.`);
    }

  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();
