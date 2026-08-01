export interface SecurityFinding {
    type: 'public_secret' | 'weak_secret' | 'hardcoded_secret';
    severity: 'CRITICAL' | 'WARNING';
    message: string;
    variable?: string;
    file?: string;
}
export declare function detectPublicSecrets(definedVariables: Set<string>): SecurityFinding[];
