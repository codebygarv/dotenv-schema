# 🛡️ Env Sentinel (dotenv-schema)

> **Validate, secure, document, audit, and manage environment variables with confidence.**

Env Sentinel is a complete environment variable toolkit for modern JavaScript and TypeScript applications. It ensures your application never starts with invalid configuration, warns you about leaked secrets, and generates beautiful documentation automatically.

## ✨ Features

- **Type-Safe Validation**: Define your schema once and get fully typed `env` objects anywhere.
- **Fail Fast**: Stops your application instantly if required variables are missing or invalid.
- **Security Audits**: Detects hardcoded secrets in source code, weak passwords, and public leaks.
- **Automated Documentation**: Generates `.env.example` and `env.md` directly from your schema.
- **Framework Adapters**: First-class support for Next.js, Vite, Node, and more.

## 📦 Installation

```bash
npm install dotenv-schema
```

## 🚀 Getting Started

Create your environment schema in `src/env.ts`:

```ts
import { defineEnv } from 'dotenv-schema';

export const env = defineEnv({
  PORT: {
    type: 'number',
    default: 3000,
    description: 'The server port to bind to',
  },
  DATABASE_URL: {
    type: 'url',
    required: true,
    description: 'PostgreSQL connection string',
    secret: true,
  },
  JWT_SECRET: {
    type: 'string',
    required: true,
    minLength: 32,
    secret: true,
  }
});
```

Now use the typed `env` object anywhere in your app:

```ts
import { env } from './env';

console.log(`Starting server on port ${env.PORT}`);
```

## 🛠 CLI Usage

Env Sentinel comes with a powerful CLI (`env-sentinel`) to audit your environment setup:

### Validate Setup
Check if the current environment matches the schema:
```bash
npx env-sentinel validate
```

### Audit Configuration and Security
Scan all `.env` files and source code for missing variables, unused variables, and security leaks:
```bash
npx env-sentinel audit
```

### Generate Documentation
Generate `.env.example` and markdown documentation:
```bash
npx env-sentinel generate --format example
npx env-sentinel generate --format markdown
```

## 🧱 Framework Integrations

Env Sentinel provides framework-specific adapters out of the box:

### Next.js
```ts
import { defineNextEnv } from 'dotenv-schema/next';

export const env = defineNextEnv({ ... });
```

### Vite
```ts
import { defineViteEnv } from 'dotenv-schema/vite';

export const env = defineViteEnv({ ... });
```

## 🔄 CI/CD Integration

You can easily integrate Env Sentinel into your GitHub Actions pipeline to prevent misconfigured environments from merging into production:

```yaml
steps:
  - run: npm install
  - run: npx env-sentinel check
```
If `check` (which runs `audit`) detects missing variables or CRITICAL security flaws (like a hardcoded Stripe key), it will fail the build with exit code 1.

## License
MIT
