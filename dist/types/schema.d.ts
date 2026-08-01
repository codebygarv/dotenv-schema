export type SchemaType = 'string' | 'number' | 'boolean' | 'url' | 'email' | 'enum' | 'json';
export interface BaseSchemaOption {
    type: SchemaType;
    required?: boolean;
    default?: any;
    description?: string;
    secret?: boolean;
    deprecated?: boolean;
    example?: string;
    validate?: (value: any) => {
        valid: boolean;
        message?: string;
    };
}
export interface StringSchemaOption extends BaseSchemaOption {
    type: 'string';
    default?: string;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
}
export interface NumberSchemaOption extends BaseSchemaOption {
    type: 'number';
    default?: number;
}
export interface BooleanSchemaOption extends BaseSchemaOption {
    type: 'boolean';
    default?: boolean;
}
export interface UrlSchemaOption extends BaseSchemaOption {
    type: 'url';
    default?: string;
}
export interface EmailSchemaOption extends BaseSchemaOption {
    type: 'email';
    default?: string;
}
export interface EnumSchemaOption<T extends string = string> extends BaseSchemaOption {
    type: 'enum';
    values: readonly T[] | T[];
    default?: T;
}
export interface JsonSchemaOption extends BaseSchemaOption {
    type: 'json';
    default?: Record<string, any> | any[];
}
export type SchemaOption = StringSchemaOption | NumberSchemaOption | BooleanSchemaOption | UrlSchemaOption | EmailSchemaOption | EnumSchemaOption | JsonSchemaOption;
export type EnvSchema = Record<string, SchemaOption>;
export type InferType<T extends SchemaOption> = T extends StringSchemaOption ? string : T extends NumberSchemaOption ? number : T extends BooleanSchemaOption ? boolean : T extends UrlSchemaOption ? string : T extends EmailSchemaOption ? string : T extends EnumSchemaOption<infer E> ? E : T extends JsonSchemaOption ? any : never;
export type InferEnv<T extends EnvSchema> = {
    [K in keyof T]: T[K]['required'] extends true ? InferType<T[K]> : T[K]['default'] extends undefined ? InferType<T[K]> | undefined : InferType<T[K]>;
};
