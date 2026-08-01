# Phase 5: Documentation & Generation (v0.5.0)

**Goal:** Automate environment documentation generation and maintenance.

* **`.env.example` Generation:** Implement `env-sentinel generate` to create/update `.env.example` from the schema, including descriptions, safe defaults, and removing secret values.
* **Markdown Docs:** Implement `env-sentinel docs` to generate Markdown tables documenting all environment variables, their types, required status, and descriptions.
* **Outdated Detection:** Identify when `.env.example` is out of sync with the defined schema.
* **CLI Fixes:** Implement `env-sentinel fix` to safely resolve supported issues (like updating outdated examples or sorting variables).
