import esbuild from 'esbuild';
const isEnvironment = process.env.NODE_ENV;

esbuild.build({
  entryPoints: ['./src/ts/script.ts'],
  outdir: './dist/js',
  target: 'es2015',
  platform: 'browser',
  bundle: true,
  minify: true,
  watch: isEnvironment === 'build' ? false : true,
});
