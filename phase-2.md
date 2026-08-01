# Phase 2: CLI Foundation (v0.2.0)

**Goal:** Build the command-line interface to allow developers to interact with the tool.

* **CLI Core:** Implement the basic CLI architecture (`env-sentinel`).
* **Commands:**
  * `env-sentinel validate`: Validate the current environment.
  * `env-sentinel check`: Run combined checks.
* **Output Formatting:** Implement pretty terminal output for readable developer experience.
* **Data Output:** Support JSON output for tooling integrations.
* **Configuration:** Add support for `env-sentinel.config.ts` (and other formats) to customize behavior.
* **Environment Files:** Support parsing multiple custom `.env` files (e.g., `.env.local`, `.env.test`).
