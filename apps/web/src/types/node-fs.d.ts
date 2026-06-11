// Minimal ambient declaration: tsconfig.app deliberately keeps @types/node out
// of app code. Vitest tests run in a node runtime and may read repo files
// (e.g. the scene palette contract test); declare only what they use.
declare module "node:fs" {
  export function readFileSync(path: string, encoding: "utf8"): string;
}
