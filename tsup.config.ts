import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    cli: 'src/cli/index.ts',
    'adapters/next': 'src/adapters/next.ts',
    'adapters/vite': 'src/adapters/vite.ts'
  },
  format: ['cjs', 'esm'],
  dts: false,
  clean: true,
});
