import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: true,
  entry: {
    index: 'src/index.ts',
    button: 'src/components/button/index.ts',
    input: 'src/components/input/index.ts',
    textarea: 'src/components/textarea/index.ts',
    select: 'src/components/select/index.ts',
  },
  format: ['esm', 'cjs'],
  sourcemap: true,
  splitting: false,
  target: 'es2020',
  treeshake: true,
});
