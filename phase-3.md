# Phase 3: Environment Auditing (v0.3.0)

**Goal:** Implement comprehensive scanning of the project environment and source code.

* **File Scanning:** Scan and parse all `.env*` files in the project.
* **Source Code Scanning:** Parse source code (TypeScript/JavaScript) to identify environment variable usage.
* **Unused Variables:** Detect and report variables in `.env` files that are not referenced in the code.
* **Missing Variables:** Detect variables used in code but not defined in the schema or `.env` files.
* **Undocumented Variables:** Detect variables in `.env` without corresponding entries in `.env.example`.
* **Health Score:** Calculate and generate an Environment Health Score based on required variables, validation, security, and usage.
