export declare function runAudit(cwd: string, configPath?: string): Promise<{
    score: number;
    definedVariables: Set<string>;
    envFilesList: string[];
    unusedVariables: string[];
    missingVariables: string[];
    securityFindings: import("../../security/detect-public-secrets.js").SecurityFinding[];
    securityCriticals: number;
}>;
export declare function auditCommand(options: {
    config?: string;
}): Promise<void>;
