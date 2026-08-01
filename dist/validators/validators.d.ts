import { SchemaOption } from '../types/schema.js';
export declare function validateValue(key: string, value: string | undefined, schema: SchemaOption): {
    valid: boolean;
    parsedValue?: any;
    error?: string;
};
