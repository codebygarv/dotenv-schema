#!/usr/bin/env node
import {
  SCHEMA_SYMBOL
} from "./chunk-SD4MFYCM.js";

// src/cli/index.ts
import { cac } from "cac";

// src/cli/commands/validate.ts
import pc from "picocolors";

// src/cli/config.ts
import createJiti from "jiti";
import { resolve } from "path";
import fs from "fs";
async function loadConfig(cwd, customPath) {
  const jiti = createJiti(cwd, { interopDefault: true });
  const possiblePaths = customPath ? [customPath] : [
    "env-sentinel.config.ts",
    "env-sentinel.config.js",
    "env-sentinel.config.cjs",
    "env-sentinel.config.mjs"
  ];
  for (const p of possiblePaths) {
    const fullPath = resolve(cwd, p);
    if (fs.existsSync(fullPath)) {
      try {
        const config = await jiti(fullPath);
        return config;
      } catch (error) {
        throw new Error(`Failed to load config at ${fullPath}: ${error}`);
      }
    }
  }
  return {
    envFiles: [".env", ".env.local"],
    schemaPath: "src/env.ts"
  };
}

// src/cli/env-parser.ts
import dotenv from "dotenv";
import fs2 from "fs";
import path from "path";
function loadEnvFiles(cwd, files) {
  let combinedEnv = {};
  for (const file of files) {
    const fullPath = path.resolve(cwd, file);
    if (fs2.existsSync(fullPath)) {
      const parsed = dotenv.parse(fs2.readFileSync(fullPath, "utf-8"));
      combinedEnv = { ...combinedEnv, ...parsed };
    }
  }
  return combinedEnv;
}

// src/cli/commands/validate.ts
import createJiti2 from "jiti";
import { resolve as resolve2 } from "path";
import fs3 from "fs";
async function validateCommand(options) {
  const cwd = process.cwd();
  try {
    const config = await loadConfig(cwd, options.config);
    const envFiles = config.envFiles || [".env", ".env.local"];
    const parsedEnv = loadEnvFiles(cwd, envFiles);
    const schemaPath = config.schemaPath || "src/env.ts";
    const fullSchemaPath = resolve2(cwd, schemaPath);
    if (!fs3.existsSync(fullSchemaPath)) {
      console.error(pc.red(`
\u2717 Could not find schema file at ${schemaPath}`));
      console.log(pc.yellow(`Please create one or update 'schemaPath' in your config.
`));
      process.exit(1);
    }
    const jiti = createJiti2(cwd, { interopDefault: true });
    const originalEnv = { ...process.env };
    Object.assign(process.env, parsedEnv);
    try {
      jiti(fullSchemaPath);
      console.log(pc.green(`
\u2713 Environment validation passed successfully.
`));
    } finally {
      process.env = originalEnv;
    }
  } catch (err) {
    console.error(pc.red(`
Error: ${err.message}
`));
    process.exit(1);
  }
}

// src/cli/commands/check.ts
import pc3 from "picocolors";

// src/cli/commands/audit.ts
import pc2 from "picocolors";

// src/audit/scan-env-files.ts
import fs4 from "fs";
import path2 from "path";
function scanEnvFiles(cwd) {
  const envFiles = [];
  const entries = fs4.readdirSync(cwd);
  for (const entry of entries) {
    if (entry.startsWith(".env")) {
      const fullPath = path2.join(cwd, entry);
      if (fs4.statSync(fullPath).isFile()) {
        envFiles.push(entry);
      }
    }
  }
  return envFiles;
}

// src/audit/scan-source-code.ts
import fs5 from "fs";
import path3 from "path";
function scanSourceCode(cwd, sourceDirectories, ignoredDirectories = ["node_modules", "dist", "build"]) {
  const variables = /* @__PURE__ */ new Set();
  const envRegex = /(?:process\.env\.|import\.meta\.env\.|env\.)([a-zA-Z_][a-zA-Z0-9_]*)/g;
  function scanDir(dir) {
    const entries = fs5.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (ignoredDirectories.includes(entry.name)) continue;
      const fullPath = path3.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.isFile() && /\.(js|ts|jsx|tsx)$/.test(entry.name)) {
        const content = fs5.readFileSync(fullPath, "utf-8");
        let match;
        while ((match = envRegex.exec(content)) !== null) {
          variables.add(match[1]);
        }
      }
    }
  }
  for (const srcDir of sourceDirectories) {
    const fullPath = path3.join(cwd, srcDir);
    if (fs5.existsSync(fullPath) && fs5.statSync(fullPath).isDirectory()) {
      scanDir(fullPath);
    }
  }
  return variables;
}

// src/audit/find-unused.ts
function findUnusedVariables(definedInEnv, usedInCode) {
  const unused = [];
  for (const variable of definedInEnv) {
    if (!usedInCode.has(variable)) {
      unused.push(variable);
    }
  }
  return unused;
}

// src/audit/calculate-score.ts
function calculateHealthScore(options) {
  if (options.totalVariables === 0) return 100;
  let score = 100;
  const validationScore = options.validVariables / options.totalVariables * 20;
  score -= 20 - validationScore;
  score -= options.missingVariables * 5;
  score -= options.unusedVariables * 2;
  score -= options.securityWarnings * 10;
  score -= options.securityCriticals * 25;
  return Math.max(0, Math.min(100, Math.floor(score)));
}

// src/security/detect-public-secrets.ts
var PUBLIC_PREFIXES = ["NEXT_PUBLIC_", "VITE_", "REACT_APP_", "EXPO_PUBLIC_", "NUXT_PUBLIC_"];
var SENSITIVE_KEYWORDS = ["SECRET", "PASSWORD", "KEY", "TOKEN", "CREDENTIAL", "PRIVATE"];
function detectPublicSecrets(definedVariables) {
  const findings = [];
  for (const variable of definedVariables) {
    const isPublic = PUBLIC_PREFIXES.some((prefix) => variable.startsWith(prefix));
    if (isPublic) {
      const isSensitive = SENSITIVE_KEYWORDS.some((keyword) => variable.includes(keyword));
      if (isSensitive) {
        findings.push({
          type: "public_secret",
          severity: "CRITICAL",
          variable,
          message: `Variable ${variable} appears to contain sensitive information but is prefixed with a public framework identifier. This will leak secrets to the client side.`
        });
      }
    }
  }
  return findings;
}

// src/security/detect-weak-secrets.ts
function detectWeakSecrets(parsedEnv, minLength = 32) {
  const findings = [];
  const SENSITIVE_KEYWORDS2 = ["SECRET", "PASSWORD", "TOKEN", "PRIVATE"];
  for (const [key, value] of Object.entries(parsedEnv)) {
    const isSensitive = SENSITIVE_KEYWORDS2.some((keyword) => key.includes(keyword));
    if (isSensitive && value && value.length > 0 && value.length < minLength) {
      findings.push({
        type: "weak_secret",
        severity: "WARNING",
        variable: key,
        message: `Secret ${key} is only ${value.length} characters long. A minimum of ${minLength} is recommended for high entropy.`
      });
    }
  }
  return findings;
}

// src/security/detect-hardcoded.ts
import fs6 from "fs";
import path4 from "path";
var SECRET_PATTERNS = [
  { name: "Stripe Secret Key", regex: /sk_live_[0-9a-zA-Z]{24}/g },
  { name: "Stripe Test Key", regex: /sk_test_[0-9a-zA-Z]{24}/g },
  { name: "AWS Access Key ID", regex: /AKIA[0-9A-Z]{16}/g },
  { name: "GitHub Personal Access Token", regex: /ghp_[0-9a-zA-Z]{36}/g }
];
function detectHardcodedSecrets(cwd, sourceDirectories, ignoredDirectories = ["node_modules", "dist", "build"]) {
  const findings = [];
  function scanDir(dir) {
    const entries = fs6.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (ignoredDirectories.includes(entry.name)) continue;
      const fullPath = path4.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else if (entry.isFile() && /\.(js|ts|jsx|tsx)$/.test(entry.name)) {
        const content = fs6.readFileSync(fullPath, "utf-8");
        for (const pattern of SECRET_PATTERNS) {
          const matches = content.match(pattern.regex);
          if (matches && matches.length > 0) {
            findings.push({
              type: "hardcoded_secret",
              severity: "CRITICAL",
              file: fullPath.replace(cwd + path4.sep, ""),
              message: `Possible hardcoded ${pattern.name} found in source code.`
            });
          }
        }
      }
    }
  }
  for (const srcDir of sourceDirectories) {
    const fullPath = path4.join(cwd, srcDir);
    if (fs6.existsSync(fullPath) && fs6.statSync(fullPath).isDirectory()) {
      scanDir(fullPath);
    }
  }
  return findings;
}

// src/cli/commands/audit.ts
async function auditCommand(options) {
  const cwd = process.cwd();
  try {
    const config = await loadConfig(cwd, options.config);
    const envFilesList = scanEnvFiles(cwd);
    const parsedEnv = loadEnvFiles(cwd, envFilesList);
    const definedVariables = new Set(Object.keys(parsedEnv));
    const sourceDirs = config.sourceDirectories || ["src", "app", "server"];
    const ignoredDirs = config.ignoredDirectories || ["node_modules", "dist", "build"];
    const usedVariables = scanSourceCode(cwd, sourceDirs, ignoredDirs);
    const unusedVariables = findUnusedVariables(definedVariables, usedVariables);
    const missingVariables = [];
    for (const v of usedVariables) {
      if (!definedVariables.has(v) && v !== "NODE_ENV") {
        missingVariables.push(v);
      }
    }
    const publicSecrets = detectPublicSecrets(definedVariables);
    const weakSecrets = detectWeakSecrets(parsedEnv, config.security?.minimumSecretLength);
    const hardcodedSecrets = detectHardcodedSecrets(cwd, sourceDirs, ignoredDirs);
    const securityFindings = [...publicSecrets, ...weakSecrets, ...hardcodedSecrets];
    const securityCriticals = securityFindings.filter((f) => f.severity === "CRITICAL").length;
    const securityWarnings = securityFindings.filter((f) => f.severity === "WARNING").length;
    const score = calculateHealthScore({
      totalVariables: definedVariables.size,
      validVariables: definedVariables.size,
      unusedVariables: unusedVariables.length,
      missingVariables: missingVariables.length,
      securityWarnings,
      securityCriticals
    });
    console.log(pc2.bold(`
\u{1F6E1}\uFE0F Env Sentinel Audit
`));
    console.log(`Environment Health:
${pc2.bold(score >= 80 ? pc2.green(score) : score >= 60 ? pc2.yellow(score) : pc2.red(score))}/100
`);
    console.log(pc2.bold(`Configuration:`));
    console.log(`\u2713 ${definedVariables.size} variables detected in ${envFilesList.length} files`);
    if (unusedVariables.length > 0) {
      console.log(pc2.yellow(`\u26A0 ${unusedVariables.length} variables appear unused:`));
      unusedVariables.forEach((v) => console.log(pc2.dim(`  - ${v}`)));
    } else {
      console.log(pc2.green(`\u2713 All detected variables are actively used`));
    }
    if (missingVariables.length > 0) {
      console.log(pc2.red(`
\u2717 ${missingVariables.length} variables used in code but missing from environment:`));
      missingVariables.forEach((v) => console.log(pc2.dim(`  - ${v}`)));
    }
    if (securityFindings.length > 0) {
      console.log(pc2.bold(`
Security Findings:`));
      securityFindings.forEach((f) => {
        const color = f.severity === "CRITICAL" ? pc2.red : pc2.yellow;
        console.log(color(`[${f.severity}] ${f.message}`));
        if (f.file) console.log(pc2.dim(`  File: ${f.file}`));
      });
    } else {
      console.log(pc2.green(`
\u2713 No security issues detected.`));
    }
    console.log("\n");
    if (missingVariables.length > 0 || securityCriticals > 0) {
      console.error(pc2.red(`\u2717 Audit failed: Found ${missingVariables.length} missing variables and ${securityCriticals} critical security issues.`));
      process.exit(1);
    }
  } catch (err) {
    console.error(pc2.red(`
Error: ${err.message}
`));
    process.exit(1);
  }
}

// src/cli/commands/check.ts
async function checkCommand(options) {
  console.log(pc3.bold(pc3.blue(`
1. Running Environment Validation...
`)));
  await validateCommand(options);
  console.log(pc3.bold(pc3.blue(`
2. Running Environment Audit...
`)));
  await auditCommand(options);
}

// src/cli/commands/generate.ts
import pc4 from "picocolors";
import fs7 from "fs";
import path5 from "path";
import createJiti3 from "jiti";

// src/docs/generate-markdown.ts
function generateMarkdownDocs(schema) {
  let md = `# Environment Variables Documentation

`;
  md += `| Variable | Type | Required | Default | Description |
`;
  md += `| :--- | :--- | :--- | :--- | :--- |
`;
  for (const [key, opt] of Object.entries(schema)) {
    const type = `\`${opt.type}\``;
    const required = opt.required !== false ? "\u2705" : "\u274C";
    const defaultValue = opt.default !== void 0 ? `\`${JSON.stringify(opt.default)}\`` : "-";
    const description = opt.description || "-";
    md += `| **${key}** | ${type} | ${required} | ${defaultValue} | ${description} |
`;
  }
  md += `

> Auto-generated by [env-sentinel](https://github.com/dotenv-schema)
`;
  return md;
}

// src/docs/generate-env-example.ts
function generateEnvExample(schema) {
  let example = `# .env.example
# Auto-generated by env-sentinel

`;
  for (const [key, opt] of Object.entries(schema)) {
    if (opt.description) {
      example += `# ${opt.description}
`;
    }
    let defaultValue = "";
    if (opt.default !== void 0) {
      if (typeof opt.default === "string" && opt.default.includes(" ")) {
        defaultValue = `"${opt.default}"`;
      } else {
        defaultValue = String(opt.default);
      }
    } else if (opt.example !== void 0) {
      defaultValue = opt.example;
    } else if (opt.required !== false) {
      defaultValue = `your_${key.toLowerCase()}`;
    }
    example += `${key}=${defaultValue}

`;
  }
  return example.trim() + "\n";
}

// src/cli/commands/generate.ts
async function generateCommand(options) {
  const cwd = process.cwd();
  try {
    const config = await loadConfig(cwd, options.config);
    const schemaPath = config.schemaPath || "src/env.ts";
    const fullSchemaPath = path5.resolve(cwd, schemaPath);
    if (!fs7.existsSync(fullSchemaPath)) {
      console.error(pc4.red(`
\u2717 Could not find schema file at ${schemaPath}`));
      process.exit(1);
    }
    process.env.ENV_SENTINEL_SKIP_VALIDATION = "true";
    const jiti = createJiti3(cwd, { interopDefault: true });
    let schemaObj;
    try {
      schemaObj = await jiti(fullSchemaPath);
    } finally {
      delete process.env.ENV_SENTINEL_SKIP_VALIDATION;
    }
    let rawSchema = void 0;
    const valuesToInspect = [
      schemaObj,
      ...schemaObj && typeof schemaObj === "object" ? Object.values(schemaObj) : []
    ];
    for (const val of valuesToInspect) {
      if (val && typeof val === "object" && val[SCHEMA_SYMBOL]) {
        rawSchema = val[SCHEMA_SYMBOL];
        break;
      }
    }
    if (!rawSchema) {
      console.error(pc4.red(`
\u2717 Could not extract schema from ${schemaPath}. Make sure you are using defineEnv() and exporting the result.`));
      process.exit(1);
    }
    const format = options.format || "markdown";
    if (format === "markdown") {
      const md = generateMarkdownDocs(rawSchema);
      fs7.writeFileSync(path5.join(cwd, "env.md"), md);
      console.log(pc4.green(`
\u2713 Generated env.md successfully.
`));
    } else if (format === "example") {
      const example = generateEnvExample(rawSchema);
      fs7.writeFileSync(path5.join(cwd, ".env.example"), example);
      console.log(pc4.green(`
\u2713 Generated .env.example successfully.
`));
    } else {
      console.error(pc4.red(`
\u2717 Unknown format: ${format}. Use 'markdown' or 'example'.`));
      process.exit(1);
    }
  } catch (err) {
    console.error(pc4.red(`
Error: ${err.message}
`));
    process.exit(1);
  }
}

// src/cli/index.ts
import fs8 from "fs";
import { resolve as resolve3 } from "path";
var pkgPath = resolve3(new URL(".", import.meta.url).pathname, "../../package.json");
var version = "unknown";
try {
  const pkg = JSON.parse(fs8.readFileSync(pkgPath, "utf-8"));
  version = pkg.version;
} catch {
}
var cli = cac("env-sentinel");
cli.command("validate", "Validate the current environment").option("-c, --config <file>", "Path to config file").option("-f, --format <format>", "Output format (pretty or json)", { default: "pretty" }).action(validateCommand);
cli.command("check", "Run combined checks").option("-c, --config <file>", "Path to config file").action(checkCommand);
cli.command("audit", "Scan environment files and source code for issues").option("-c, --config <file>", "Path to config file").action(auditCommand);
cli.command("generate", "Generate environment variable documentation").option("-c, --config <file>", "Path to config file").option("-f, --format <format>", "Output format (markdown or example)", { default: "markdown" }).action(generateCommand);
cli.help();
cli.version(version);
cli.parse();
