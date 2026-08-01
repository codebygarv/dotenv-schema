export interface EnvSentinelConfig {
    envFiles?: string[];
    sourceDirectories?: string[];
    ignoredDirectories?: string[];
    security?: {
        detectHardcodedSecrets?: boolean;
        detectPublicSecrets?: boolean;
        minimumSecretLength?: number;
    };
    reporting?: {
        format?: 'pretty' | 'json' | 'markdown' | 'html';
    };
    schemaPath?: string;
}
