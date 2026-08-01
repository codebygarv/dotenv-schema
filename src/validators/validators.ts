import { SchemaOption } from '../types/schema.js';

export function validateValue(key: string, value: string | undefined, schema: SchemaOption): { valid: boolean, parsedValue?: any, error?: string } {
  // Handle missing required value
  if (value === undefined || value === '') {
    if (schema.required) {
      return { valid: false, error: 'Required environment variable is missing.' };
    }
    if (schema.default !== undefined) {
      return { valid: true, parsedValue: schema.default };
    }
    return { valid: true, parsedValue: undefined };
  }

  let parsedValue: any = value;

  try {
    switch (schema.type) {
      case 'string':
        if (schema.minLength !== undefined && value.length < schema.minLength) {
          return { valid: false, error: `The value is too short.\n  Required: At least ${schema.minLength} characters\n  Received: ${value.length} characters` };
        }
        if (schema.maxLength !== undefined && value.length > schema.maxLength) {
          return { valid: false, error: `The value is too long.\n  Maximum: ${schema.maxLength} characters\n  Received: ${value.length} characters` };
        }
        if (schema.pattern && !schema.pattern.test(value)) {
          return { valid: false, error: `Value does not match required pattern.` };
        }
        break;

      case 'number':
        parsedValue = Number(value);
        if (Number.isNaN(parsedValue)) {
          return { valid: false, error: `Expected a number.\n  Received: ${value}` };
        }
        break;

      case 'boolean':
        const lower = value.toLowerCase();
        if (['true', '1', 'yes', 'on'].includes(lower)) {
          parsedValue = true;
        } else if (['false', '0', 'no', 'off'].includes(lower)) {
          parsedValue = false;
        } else {
          return { valid: false, error: `Expected a boolean.\n  Received: ${value}` };
        }
        break;

      case 'url':
        try {
          new URL(value);
        } catch {
          return { valid: false, error: `Expected a valid URL.\n  Received: ${value}` };
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return { valid: false, error: `Expected a valid email address.\n  Received: ${value}` };
        }
        break;

      case 'enum':
        if (!schema.values.includes(value as any)) {
          return { valid: false, error: `Expected one of:\n  ${schema.values.join('\n  ')}\n\n  Received:\n  ${value}` };
        }
        break;

      case 'json':
        try {
          parsedValue = JSON.parse(value);
        } catch {
          return { valid: false, error: `Expected valid JSON.\n  Received: ${value}` };
        }
        break;
    }

    if (schema.validate) {
      const customValidation = schema.validate(parsedValue);
      if (!customValidation.valid) {
        return { valid: false, error: customValidation.message || 'Custom validation failed.' };
      }
    }

    return { valid: true, parsedValue };
  } catch (error: any) {
    return { valid: false, error: error.message || 'Validation failed.' };
  }
}
