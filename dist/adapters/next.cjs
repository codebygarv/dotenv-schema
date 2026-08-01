"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/adapters/next.ts
var next_exports = {};
__export(next_exports, {
  defineNextEnv: () => defineNextEnv
});
module.exports = __toCommonJS(next_exports);

// src/validators/validators.ts
function validateValue(key, value, schema) {
  if (value === void 0 || value === "") {
    if (schema.required) {
      return { valid: false, error: "Required environment variable is missing." };
    }
    if (schema.default !== void 0) {
      return { valid: true, parsedValue: schema.default };
    }
    return { valid: true, parsedValue: void 0 };
  }
  let parsedValue = value;
  try {
    switch (schema.type) {
      case "string":
        if (schema.minLength !== void 0 && value.length < schema.minLength) {
          return { valid: false, error: `The value is too short.
  Required: At least ${schema.minLength} characters
  Received: ${value.length} characters` };
        }
        if (schema.maxLength !== void 0 && value.length > schema.maxLength) {
          return { valid: false, error: `The value is too long.
  Maximum: ${schema.maxLength} characters
  Received: ${value.length} characters` };
        }
        if (schema.pattern && !schema.pattern.test(value)) {
          return { valid: false, error: `Value does not match required pattern.` };
        }
        break;
      case "number":
        parsedValue = Number(value);
        if (Number.isNaN(parsedValue)) {
          return { valid: false, error: `Expected a number.
  Received: ${value}` };
        }
        break;
      case "boolean":
        const lower = value.toLowerCase();
        if (["true", "1", "yes", "on"].includes(lower)) {
          parsedValue = true;
        } else if (["false", "0", "no", "off"].includes(lower)) {
          parsedValue = false;
        } else {
          return { valid: false, error: `Expected a boolean.
  Received: ${value}` };
        }
        break;
      case "url":
        try {
          new URL(value);
        } catch {
          return { valid: false, error: `Expected a valid URL.
  Received: ${value}` };
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return { valid: false, error: `Expected a valid email address.
  Received: ${value}` };
        }
        break;
      case "enum":
        if (!schema.values.includes(value)) {
          return { valid: false, error: `Expected one of:
  ${schema.values.join("\n  ")}

  Received:
  ${value}` };
        }
        break;
      case "json":
        try {
          parsedValue = JSON.parse(value);
        } catch {
          return { valid: false, error: `Expected valid JSON.
  Received: ${value}` };
        }
        break;
    }
    if (schema.validate) {
      const customValidation = schema.validate(parsedValue);
      if (!customValidation.valid) {
        return { valid: false, error: customValidation.message || "Custom validation failed." };
      }
    }
    return { valid: true, parsedValue };
  } catch (error) {
    return { valid: false, error: error.message || "Validation failed." };
  }
}

// src/core/define-env.ts
var SCHEMA_SYMBOL = /* @__PURE__ */ Symbol.for("env-sentinel-schema");
function defineEnv(schema, processEnv = process.env) {
  const result = {};
  if (process.env.ENV_SENTINEL_SKIP_VALIDATION === "true") {
    Object.defineProperty(result, SCHEMA_SYMBOL, {
      value: schema,
      enumerable: false
    });
    return result;
  }
  const errors = [];
  for (const [key, schemaOption] of Object.entries(schema)) {
    const rawValue = processEnv[key];
    const validation = validateValue(key, rawValue, schemaOption);
    if (validation.valid) {
      if (validation.parsedValue !== void 0) {
        result[key] = validation.parsedValue;
      }
    } else {
      let errorMessage = `\u2717 ${key}
  ${validation.error}`;
      if (schemaOption.secret) {
        errorMessage += `
  (Secret value hidden)`;
      }
      errors.push(errorMessage);
    }
  }
  if (errors.length > 0) {
    console.error(`
\u{1F6E1}\uFE0F Environment validation failed

${errors.join("\n\n")}
`);
    if (process.env.NODE_ENV !== "test") {
      process.exit(1);
    } else {
      throw new Error("Environment validation failed");
    }
  }
  Object.defineProperty(result, SCHEMA_SYMBOL, {
    value: schema,
    enumerable: false
  });
  return result;
}

// src/adapters/next.ts
function defineNextEnv(schema) {
  return defineEnv(schema);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  defineNextEnv
});
