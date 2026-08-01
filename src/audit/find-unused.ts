export function findUnusedVariables(definedInEnv: Set<string>, usedInCode: Set<string>): string[] {
  const unused: string[] = [];
  
  for (const variable of definedInEnv) {
    if (!usedInCode.has(variable)) {
      unused.push(variable);
    }
  }

  return unused;
}
