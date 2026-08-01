import {
  defineEnv
} from "../chunk-SD4MFYCM.js";

// src/adapters/vite.ts
function defineViteEnv(schema) {
  const processEnv = typeof process !== "undefined" ? process.env : typeof import.meta !== "undefined" ? import.meta.env : {};
  return defineEnv(schema, processEnv);
}
export {
  defineViteEnv
};
