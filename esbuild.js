import { build } from 'esbuild';

build({
  entryPoints: ['./src/ts/script.ts'],
  outdir: './dist/js',
  target: 'es2015',
  platform: 'browser',
  bundle: true,
  minify: true,
  watch: true,
});
