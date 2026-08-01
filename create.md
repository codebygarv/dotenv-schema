# 🛡️ Env Sentinel — Complete Feature Specification

> **Validate, secure, document, audit, and manage environment variables with confidence.**

## 📖 Table of Contents

* [Project Overview](#-project-overview)
* [Project Goals](#-project-goals)
* [Core Features](#-core-features)
* [Environment Schema](#-environment-schema)
* [Supported Data Types](#-supported-data-types)
* [Validation Features](#-validation-features)
* [Type-Safe Environment Access](#-type-safe-environment-access)
* [Environment Auditing](#-environment-auditing)
* [Security Analysis](#-security-analysis)
* [Unused Variable Detection](#-unused-variable-detection)
* [Environment Documentation](#-environment-documentation)
* [CLI Features](#-cli-features)
* [Framework Support](#-framework-support)
* [Developer Experience](#-developer-experience)
* [Configuration](#-configuration)
* [Reporting System](#-reporting-system)
* [Environment Health Score](#-environment-health-score)
* [CI/CD Integration](#-cicd-integration)
* [Project Architecture](#-project-architecture)
* [Release Roadmap](#-release-roadmap)
* [Future Features](#-future-features)

---

# 🚀 Project Overview

**Env Sentinel** is a developer-focused environment variable management and security toolkit for JavaScript and TypeScript applications.

Environment variables are commonly used to store:

* Database connection URLs
* API keys
* Authentication secrets
* Application configuration
* Third-party service credentials
* Feature flags
* Deployment settings
* Application URLs
* Email configuration

However, environment variables often cause problems that are difficult to identify:

```txt
❌ Missing variables cause runtime crashes
❌ Values are stored as strings
❌ Invalid URLs are accepted
❌ Secrets are accidentally exposed
❌ Old variables remain unused
❌ .env.example files become outdated
❌ Sensitive values are hardcoded in source code
❌ Different environments use inconsistent configuration
❌ Developers do not know which variables are required
```

Env Sentinel provides a centralized system to validate, inspect, secure, document, and monitor environment variables.

```txt
┌──────────────────┐
│       .env       │
│  Environment     │
│    Variables     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Env Sentinel   │
│                  │
│ ✓ Validate       │
│ ✓ Parse          │
│ ✓ Audit          │
│ ✓ Secure         │
│ ✓ Document       │
│ ✓ Report         │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Safe, Typed and  │
│ Verified Config  │
└──────────────────┘
```

---

# 🎯 Project Goals

Env Sentinel aims to provide:

1. **Early error detection**

   Detect missing or invalid environment variables before the application starts.

2. **Type-safe configuration**

   Convert environment variables into predictable JavaScript and TypeScript values.

3. **Improved security**

   Detect exposed secrets, weak credentials, and dangerous public environment variables.

4. **Automatic documentation**

   Generate and maintain accurate `.env.example` files.

5. **Environment intelligence**

   Analyze how environment variables are used throughout a project.

6. **Better developer experience**

   Provide clear, actionable, and readable error messages.

7. **Framework compatibility**

   Work with Node.js, Express, Next.js, Vite, React, NestJS, and other JavaScript frameworks.

8. **Minimal configuration**

   Allow developers to define their environment schema using a simple API.

---

# ⚙️ Core Features

## 1. Environment Schema Definition

Developers can define all environment variables in one centralized schema.

```ts
import { defineEnv } from "env-sentinel";

export const env = defineEnv({
  PORT: {
    type: "number",
    default: 3000,
  },

  DATABASE_URL: {
    type: "url",
    required: true,
  },

  JWT_SECRET: {
    type: "string",
    required: true,
    minLength: 32,
    secret: true,
  },

  NODE_ENV: {
    type: "enum",
    values: [
      "development",
      "test",
      "staging",
      "production",
    ],
    default: "development",
  },
});
```

The schema acts as the single source of truth for:

* Variable names
* Variable types
* Required status
* Default values
* Validation rules
* Security settings
* Descriptions
* Environment-specific requirements

---

## 2. Startup Validation

Env Sentinel validates environment variables when the application starts.

```ts
const env = defineEnv({
  DATABASE_URL: {
    type: "url",
    required: true,
  },
});
```

If the variable is missing:

```txt
✗ Environment validation failed

DATABASE_URL
  Required environment variable is missing.

Add the variable to your .env file:

DATABASE_URL=your-database-url
```

The application stops before starting with invalid configuration.

This prevents runtime errors such as:

```txt
TypeError:
Cannot read properties of undefined
```

---

# 🧩 Environment Schema

Each environment variable can support the following configuration:

```ts
DATABASE_URL: {
  type: "url",
  required: true,
  description:
    "PostgreSQL database connection URL",
  secret: true,
}
```

Available schema options:

| Option        | Description                                  |
| ------------- | -------------------------------------------- |
| `type`        | Defines the expected value type              |
| `required`    | Marks the variable as mandatory              |
| `default`     | Provides a fallback value                    |
| `description` | Documents the variable                       |
| `secret`      | Marks the value as sensitive                 |
| `minLength`   | Defines the minimum string length            |
| `maxLength`   | Defines the maximum string length            |
| `values`      | Defines allowed enum values                  |
| `pattern`     | Validates a value using a regular expression |
| `deprecated`  | Marks a variable as deprecated               |
| `example`     | Provides an example value                    |
| `validate`    | Adds custom validation logic                 |

---

# 🔤 Supported Data Types

## String

```ts
APP_NAME: {
  type: "string",
  required: true,
}
```

Validation:

```env
APP_NAME=Env Sentinel
```

Result:

```ts
env.APP_NAME;
// "Env Sentinel"
```

---

## Number

```ts
PORT: {
  type: "number",
  default: 3000,
}
```

Environment value:

```env
PORT=5000
```

Result:

```ts
env.PORT;
// 5000
```

The value is automatically converted from a string into a JavaScript number.

---

## Boolean

```ts
ENABLE_CACHE: {
  type: "boolean",
  default: false,
}
```

Environment value:

```env
ENABLE_CACHE=true
```

Result:

```ts
env.ENABLE_CACHE;
// true
```

Supported values:

```txt
true
false
1
0
yes
no
on
off
```

---

## URL

```ts
DATABASE_URL: {
  type: "url",
  required: true,
}
```

Valid:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/app
```

Invalid:

```env
DATABASE_URL=not-a-valid-url
```

Error:

```txt
✗ DATABASE_URL

Expected a valid URL.

Received:
not-a-valid-url
```

---

## Email

```ts
ADMIN_EMAIL: {
  type: "email",
  required: true,
}
```

---

## Enum

```ts
NODE_ENV: {
  type: "enum",
  values: [
    "development",
    "test",
    "staging",
    "production",
  ],
  default: "development",
}
```

Invalid value:

```env
NODE_ENV=live
```

Error:

```txt
✗ NODE_ENV

Expected one of:

development
test
staging
production

Received:
live
```

---

## JSON

```ts
FEATURE_FLAGS: {
  type: "json",
  default: {},
}
```

Environment value:

```env
FEATURE_FLAGS={"payments":true}
```

Result:

```ts
env.FEATURE_FLAGS;

// {
//   payments: true
// }
```

---

## Custom Types

Developers can create custom validation rules.

```ts
APP_ID: {
  type: "string",

  validate(value) {
    if (!value.startsWith("app_")) {
      return {
        valid: false,
        message:
          "APP_ID must begin with app_",
      };
    }

    return {
      valid: true,
    };
  },
}
```

---

# ✅ Validation Features

Env Sentinel will support:

* Required variable validation
* Optional variable validation
* Default values
* String validation
* Number validation
* Boolean validation
* URL validation
* Email validation
* Enum validation
* JSON validation
* Minimum length validation
* Maximum length validation
* Regular expression validation
* Custom validation functions
* Empty value detection
* Invalid type detection
* Duplicate schema detection
* Invalid schema configuration detection

Example:

```ts
JWT_SECRET: {
  type: "string",
  required: true,
  minLength: 32,
}
```

Error:

```txt
✗ JWT_SECRET

The value is too short.

Required:
At least 32 characters

Received:
16 characters
```

---

# 🔐 Type-Safe Environment Access

Env Sentinel automatically infers TypeScript types.

```ts
const env = defineEnv({
  PORT: {
    type: "number",
    default: 3000,
  },

  ENABLE_CACHE: {
    type: "boolean",
    default: false,
  },

  DATABASE_URL: {
    type: "url",
    required: true,
  },
});
```

TypeScript understands:

```ts
env.PORT;
// number

env.ENABLE_CACHE;
// boolean

env.DATABASE_URL;
// string
```

Developers do not need to manually convert values:

```ts
// Not required

Number(process.env.PORT);

process.env.ENABLE_CACHE === "true";
```

Env Sentinel handles conversion automatically.

---

# 🔍 Environment Auditing

The audit system analyzes the entire project.

Command:

```bash
npx env-sentinel audit
```

Example output:

```txt
🛡️ Env Sentinel Audit

Environment Health:
82/100

Configuration:
✓ 18 variables detected
✓ 16 variables are valid
⚠ 2 variables need attention

Security:
✓ No hardcoded secrets detected
⚠ JWT_SECRET is shorter than recommended

Usage:
✓ 14 variables are actively used
⚠ 2 variables appear unused

Documentation:
⚠ .env.example is outdated

Recommendations:

→ Increase JWT_SECRET to 32 characters
→ Remove OLD_API_URL
→ Run:

  env-sentinel generate
```

The audit system can analyze:

* `.env`
* `.env.local`
* `.env.development`
* `.env.production`
* `.env.test`
* `.env.example`
* Source code
* Configuration files
* Environment schemas

---

# 🗑️ Unused Variable Detection

Env Sentinel scans the project and identifies environment variables that are not used.

Command:

```bash
env-sentinel audit
```

Example:

```txt
Unused Environment Variables

⚠ OLD_PAYMENT_API
⚠ LEGACY_DATABASE_URL
⚠ TEST_SERVICE_KEY
```

The scanner can detect usage patterns such as:

```ts
process.env.DATABASE_URL;
```

```ts
env.DATABASE_URL;
```

```ts
import.meta.env.VITE_API_URL;
```

```ts
process.env["DATABASE_URL"];
```

The tool should avoid automatically deleting variables because dynamic environment access may produce false positives.

---

# 🔒 Security Analysis

Env Sentinel scans for common environment security problems.

## Hardcoded Secrets

Detect code such as:

```ts
const stripeKey =
  "sk_live_example";
```

Report:

```txt
🚨 Possible Secret Detected

File:
src/services/payment.ts

Line:
12

Possible secret:
Stripe secret key

Recommendation:

Move the value into .env:

STRIPE_SECRET_KEY=
```

---

## Public Secret Detection

Detect dangerous client-side environment variables.

Example:

```env
NEXT_PUBLIC_JWT_SECRET=secret
```

Warning:

```txt
🚨 Security Warning

NEXT_PUBLIC_JWT_SECRET may be exposed
to browser users.

Do not place secrets inside public
environment variables.
```

Framework prefixes:

| Framework        | Public Prefix  |
| ---------------- | -------------- |
| Next.js          | `NEXT_PUBLIC_` |
| Vite             | `VITE_`        |
| Create React App | `REACT_APP_`   |
| Expo             | `EXPO_PUBLIC_` |
| Nuxt             | `NUXT_PUBLIC_` |

Env Sentinel should warn when potentially sensitive names use public prefixes.

Sensitive patterns include:

```txt
SECRET
PASSWORD
PRIVATE_KEY
DATABASE_URL
TOKEN
API_KEY
JWT
CREDENTIAL
```

---

## Weak Secret Detection

Example:

```env
JWT_SECRET=123456
```

Report:

```txt
⚠ Weak Secret

JWT_SECRET is only 6 characters.

Recommended minimum:
32 characters
```

The actual secret value should never be printed.

Safe output:

```txt
JWT_SECRET:
••••••••
```

---

## Secret Masking

Sensitive values are hidden in logs.

```ts
JWT_SECRET: {
  type: "string",
  secret: true,
}
```

Output:

```txt
JWT_SECRET:
••••••••••••
```

Env Sentinel must never display the complete secret unless explicitly enabled by the developer.

---

# 📄 Environment Documentation

## Generate `.env.example`

Command:

```bash
npx env-sentinel generate
```

Generated file:

```env
# Application port
PORT=3000

# PostgreSQL database connection URL
DATABASE_URL=

# Secret used to sign JWT tokens
JWT_SECRET=

# Application environment
NODE_ENV=development
```

The generated file should:

* Include descriptions
* Exclude secret values
* Include safe default values
* Preserve variable ordering
* Add helpful comments
* Support environment-specific files

---

## Schema Documentation

Generate Markdown documentation:

```bash
npx env-sentinel docs
```

Example:

```md
# Environment Variables

| Variable | Type | Required | Description |
|---|---|---:|---|
| PORT | Number | No | Application port |
| DATABASE_URL | URL | Yes | Database connection |
| JWT_SECRET | String | Yes | JWT signing secret |
```

---

# 💻 CLI Features

## Validate

```bash
env-sentinel validate
```

Validates the current environment.

---

## Audit

```bash
env-sentinel audit
```

Scans configuration, usage, documentation, and security.

---

## Generate

```bash
env-sentinel generate
```

Generates or updates `.env.example`.

---

## Docs

```bash
env-sentinel docs
```

Generates environment documentation.

---

## Check

```bash
env-sentinel check
```

Runs validation and auditing together.

---

## Fix

```bash
env-sentinel fix
```

Safely fixes supported issues.

Potential fixes:

* Add missing variables to `.env.example`
* Remove duplicate entries
* Update generated documentation
* Sort environment variables

Destructive changes should always require confirmation.

---

# 🧱 Framework Support

Env Sentinel should support:

| Platform     | Support |
| ------------ | ------: |
| Node.js      |       ✅ |
| Express      |       ✅ |
| Fastify      |       ✅ |
| NestJS       |       ✅ |
| Next.js      |       ✅ |
| Vite         |       ✅ |
| React        |       ✅ |
| Vue          |       ✅ |
| Nuxt         |       ✅ |
| Expo         |       ✅ |
| React Native |       ✅ |
| Bun          | Planned |
| Deno         |  Future |

Framework adapters may be added later:

```ts
import {
  defineNextEnv,
} from "env-sentinel/next";
```

```ts
import {
  defineViteEnv,
} from "env-sentinel/vite";
```

---

# ✨ Developer Experience

Env Sentinel should provide:

* Readable terminal output
* Clear error messages
* Actionable recommendations
* TypeScript autocomplete
* Automatic type inference
* Secret masking
* Helpful code examples
* Minimal configuration
* Fast project scanning
* Configurable output
* JSON reporting
* CI-friendly output

Example:

```txt
┌──────────────────────────────────────┐
│ 🛡️ ENV SENTINEL                     │
├──────────────────────────────────────┤
│                                      │
│ ✗ DATABASE_URL                       │
│   Missing required variable          │
│                                      │
│ ⚠ JWT_SECRET                         │
│   Secret is shorter than recommended │
│                                      │
│ ✓ PORT                               │
│   Valid number: 3000                 │
│                                      │
└──────────────────────────────────────┘

2 issues found.
```

---

# ⚙️ Configuration

Example:

```ts
export default {
  envFiles: [
    ".env",
    ".env.local",
  ],

  sourceDirectories: [
    "src",
    "app",
    "server",
  ],

  ignoredDirectories: [
    "node_modules",
    "dist",
    "build",
  ],

  security: {
    detectHardcodedSecrets: true,

    detectPublicSecrets: true,

    minimumSecretLength: 32,
  },

  reporting: {
    format: "pretty",
  },
};
```

Configuration file:

```txt
env-sentinel.config.ts
```

Alternative formats:

```txt
env-sentinel.config.js
env-sentinel.config.json
```

---

# 📊 Reporting System

Supported report formats:

```bash
env-sentinel audit
```

Pretty terminal output:

```txt
Environment Health:
88/100
```

JSON:

```bash
env-sentinel audit \
  --format json
```

Output:

```json
{
  "score": 88,
  "variables": 18,
  "valid": 16,
  "warnings": 2,
  "errors": 0
}
```

Markdown:

```bash
env-sentinel audit \
  --format markdown
```

HTML:

```bash
env-sentinel audit \
  --format html
```

---

# 💚 Environment Health Score

Env Sentinel can calculate a project environment score.

Example:

```txt
Environment Health

████████████████░░░░

82/100
```

Score categories:

| Category           | Weight |
| ------------------ | -----: |
| Required variables |    25% |
| Validation         |    20% |
| Security           |    25% |
| Documentation      |    15% |
| Usage              |    15% |

Possible score levels:

|  Score | Status          |
| -----: | --------------- |
| 90–100 | Excellent       |
|  75–89 | Healthy         |
|  60–74 | Needs Attention |
|  40–59 | At Risk         |
|   0–39 | Critical        |

The score should be configurable and should not replace detailed warnings.

---

# 🔄 CI/CD Integration

Env Sentinel should support automated checks.

GitHub Actions example:

```yaml
name: Environment Audit

on:
  pull_request:

jobs:
  env-audit:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - run: npm install

      - run: npx env-sentinel check
```

The command should return a non-zero exit code when critical issues are found.

Example:

```txt
❌ Environment check failed

Critical issues:
- DATABASE_URL is missing
- Public secret detected
- JWT_SECRET is too weak
```

---

# 🏗️ Proposed Project Architecture

```txt
env-sentinel/
│
├── src/
│   │
│   ├── index.ts
│   │
│   ├── core/
│   │   ├── define-env.ts
│   │   ├── validate-env.ts
│   │   ├── parse-value.ts
│   │   ├── resolve-env.ts
│   │   └── error-reporter.ts
│   │
│   ├── validators/
│   │   ├── string.ts
│   │   ├── number.ts
│   │   ├── boolean.ts
│   │   ├── url.ts
│   │   ├── email.ts
│   │   ├── enum.ts
│   │   └── json.ts
│   │
│   ├── audit/
│   │   ├── scan-env-files.ts
│   │   ├── scan-source-code.ts
│   │   ├── find-unused.ts
│   │   ├── detect-secrets.ts
│   │   ├── detect-public-secrets.ts
│   │   └── calculate-score.ts
│   │
│   ├── generators/
│   │   ├── env-example.ts
│   │   ├── markdown-docs.ts
│   │   └── reports.ts
│   │
│   ├── cli/
│   │   ├── index.ts
│   │   ├── validate.ts
│   │   ├── audit.ts
│   │   ├── generate.ts
│   │   ├── docs.ts
│   │   ├── check.ts
│   │   └── fix.ts
│   │
│   ├── security/
│   │   ├── secret-patterns.ts
│   │   ├── secret-masker.ts
│   │   └── security-rules.ts
│   │
│   └── types/
│       ├── schema.ts
│       ├── config.ts
│       └── reports.ts
│
├── tests/
│   ├── core/
│   ├── validators/
│   ├── audit/
│   ├── security/
│   └── cli/
│
├── examples/
│   ├── node/
│   ├── express/
│   ├── nextjs/
│   └── vite/
│
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts
├── README.md
├── FEATURES.md
├── CONTRIBUTING.md
├── SECURITY.md
├── LICENSE
└── CHANGELOG.md
```

---

# 🗺️ Release Roadmap

## Version `0.1.0` — Core Validation

* [ ] `defineEnv()`
* [ ] String validation
* [ ] Number validation
* [ ] Boolean validation
* [ ] URL validation
* [ ] Email validation
* [ ] Enum validation
* [ ] Default values
* [ ] Required variables
* [ ] Type inference
* [ ] Clear error messages
* [ ] Secret masking
* [ ] Unit tests
* [ ] TypeScript support

---

## Version `0.2.0` — CLI Foundation

* [ ] `env-sentinel validate`
* [ ] `env-sentinel check`
* [ ] Pretty terminal output
* [ ] JSON output
* [ ] Configuration file support
* [ ] Custom environment file support

---

## Version `0.3.0` — Environment Auditing

* [ ] Scan `.env` files
* [ ] Scan source code
* [ ] Detect unused variables
* [ ] Detect missing variables
* [ ] Detect undocumented variables
* [ ] Generate environment health reports
* [ ] Environment health score

---

## Version `0.4.0` — Security

* [ ] Hardcoded secret detection
* [ ] Public secret detection
* [ ] Weak secret detection
* [ ] Secret pattern rules
* [ ] Security severity levels
* [ ] Security reports

---

## Version `0.5.0` — Documentation

* [ ] Generate `.env.example`
* [ ] Generate Markdown documentation
* [ ] Detect outdated `.env.example`
* [ ] Add variable descriptions
* [ ] Add example values

---

## Version `1.0.0` — Stable Release

* [ ] Stable public API
* [ ] Complete CLI
* [ ] Full TypeScript support
* [ ] Security auditing
* [ ] Environment documentation
* [ ] CI/CD support
* [ ] Framework integrations
* [ ] Performance optimization
* [ ] Complete test coverage
* [ ] Production documentation

---

# 🔮 Future Features

Potential long-term features:

* [ ] VS Code extension
* [ ] GitHub Action
* [ ] GitHub Pull Request comments
* [ ] Web dashboard
* [ ] Environment comparison
* [ ] Development vs production comparison
* [ ] Environment migration tools
* [ ] Secret rotation reminders
* [ ] Team environment policies
* [ ] Custom security rules
* [ ] Monorepo support
* [ ] Workspace environment analysis
* [ ] Environment dependency graph
* [ ] AI-powered configuration suggestions
* [ ] Cloud environment integrations
* [ ] Docker environment support
* [ ] Kubernetes secret support
* [ ] Terraform variable support

---

# 🧠 Project Differentiation

Env Sentinel is not intended to be only another environment validation library.

The long-term product combines:

```txt
Environment Validation
          +
Type-Safe Configuration
          +
Security Analysis
          +
Codebase Scanning
          +
Unused Variable Detection
          +
Automatic Documentation
          +
Environment Health Reports
```

The goal is to provide a complete environment intelligence platform.

---

# 🏷️ Tagline

> **Env Sentinel — Your environment variables, validated and protected.**

Alternative taglines:

> **Know your environment. Secure your application.**

> **Environment variables, without hidden risks.**

> **Validate configuration. Detect risks. Ship confidently.**

> **The security and intelligence layer for your environment variables.**

---

# 🎯 Final Vision

Env Sentinel aims to become the standard environment management toolkit for modern JavaScript and TypeScript applications.

It should help developers answer:

```txt
✓ Are all required variables configured?

✓ Are environment values valid?

✓ Are secrets secure?

✓ Are sensitive values exposed publicly?

✓ Which variables are unused?

✓ Is .env.example up to date?

✓ Which configuration issues can break production?

✓ How healthy is the project's environment setup?
```

> **Env Sentinel protects the configuration layer before configuration problems reach production.**
