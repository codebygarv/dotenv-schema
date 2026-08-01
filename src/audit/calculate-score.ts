export function calculateHealthScore(options: {
  totalVariables: number;
  validVariables: number;
  unusedVariables: number;
  missingVariables: number;
  securityWarnings: number;
  securityCriticals: number;
}): number {
  if (options.totalVariables === 0) return 100;

  let score = 100;

  // Validation (valid / total) * 20
  const validationScore = (options.validVariables / options.totalVariables) * 20;
  score -= (20 - validationScore);

  // Missing variables (Heavy penalty)
  score -= (options.missingVariables * 5);

  // Unused variables (Slight penalty)
  score -= (options.unusedVariables * 2);

  // Security warnings
  score -= (options.securityWarnings * 10);
  score -= (options.securityCriticals * 25);

  return Math.max(0, Math.min(100, Math.floor(score)));
}
