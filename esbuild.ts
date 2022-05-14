import esbuild from 'esbuild';
import glob from 'glob';
const isEnvironment = process.env.NODE_ENV;

esbuild.build({
  entryPoints: glob.sync('./src/assets/js/**/*.ts'),
  outdir: './dist/js',
  target: 'es2015',
  platform: 'browser',
  bundle: true,
  minify: true,
  watch: isEnvironment === 'build' ? false : true,
});
