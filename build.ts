import cp from 'child_process';

const isEnvironment = process.env.NODE_ENV as 'build' | 'start';
const start = new Date();
const inDir = 'src';
const outDir = 'dist';
const scripts = {
  pug: `pug ${inDir}/pug/ -o ${outDir}/ --hierarchy -P`,
  sass: `sass ${inDir}/scss/style.scss:${outDir}/css/style.css -s compressed --no-source-map`,
  postcss: `postcss ${outDir}/css/style.css -o ${outDir}/css/style.css`,
  ts: 'node --loader ts-node/esm esbuild.ts',
  tsc: `tsc ${inDir}/ts/*.ts --noemit`,
  eslint: `eslint '${inDir}/ts/*.ts' --fix`,
  stylelint: `stylelint '${inDir}/scss/**/*.scss' --fix`,
};

const build = (isEnvironment: 'build' | 'start') => {
  if (isEnvironment === 'build') {
    const lint = new Promise((res, rej) =>
      cp.exec(`${scripts.stylelint} && ${scripts.tsc} && ${scripts.eslint}`, (err) => (err ? rej(err) : res('')))
    );
    const pug = new Promise((res, rej) => cp.exec(`${scripts.pug}`, (err) => (err ? rej(err) : res(''))));
    const scss = new Promise((res, rej) =>
      cp.exec(`${scripts.sass}`, (err) => (err ? rej(err) : cp.exec(`${scripts.postcss}`), () => res('')))
    );
    const ts = new Promise((res, rej) => cp.exec(`NODE_ENV=build ${scripts.ts}`, (err) => (err ? rej(err) : res(''))));

    return lint.then(() => {
      Promise.all([pug, scss, ts]);
    });
  } else {
    const pug = new Promise((res, rej) => cp.exec(`${scripts.pug} -w`, (err) => (err ? rej(err) : res(''))));
    const scss = new Promise((res, rej) =>
      cp.exec(`${scripts.sass} -w`, (err) => (err ? rej(err) : cp.exec(`${scripts.postcss} -w`), () => res('')))
    );
    const ts = new Promise((res, rej) => cp.exec(`NODE_ENV=start ${scripts.ts}`, (err) => (err ? rej(err) : res(''))));

    return Promise.all([pug, scss, ts]);
  }
};

cp.exec(`rimraf ${outDir}`);
build(isEnvironment)
  .then(() => {
    const timeDiff = (new Date().getTime() - start.getTime()) / 1000;
    console.log(`\n===== Compile Success! [time: ${timeDiff.toFixed(1)}s] =====\n`);
  })
  .catch((err) => {
    console.log('\n', err);
    console.log('===== Compile Failed... =====\n');
  });
