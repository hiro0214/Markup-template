import cp from 'child_process';

const isEnvironment = process.env.NODE_ENV as 'build' | 'start';
const start = new Date();
const inputDir = 'src';
const outputDir = 'dist';
const port = '8080';
const scripts = {
  pug: `pug ${inputDir}/pug/ -o ${outputDir}/ --hierarchy -P`,
  sass: `sass ${inputDir}/scss/style.scss:${outputDir}/css/style.css -s compressed --no-source-map`,
  postcss: `postcss ${outputDir}/css/style.css -o ${outputDir}/css/style.css`,
  ts: 'node --loader ts-node/esm esbuild.ts',
  img: 'node imagemin.js',
  tsc: `tsc ${inputDir}/ts/*.ts --noEmit`,
  eslint: `eslint '${inputDir}/ts/*.ts' --fix`,
  stylelint: `stylelint '${inputDir}/scss/**/*.{css,scss,sass}' --fix`,
  server: `browser-sync start -s ${outputDir} -f ${outputDir} --port ${port} --no-notify`,
};

const scriptExec = (script: string): Promise<void> => {
  return new Promise((res) => {
    cp.exec(script, (err) => {
      if (err) {
        throw new Error(err.message);
      } else {
        res();
      }
    });
  });
};

const build = async () => {
  if (isEnvironment === 'build') {
    const lint = async () => await scriptExec(`${scripts.stylelint} && ${scripts.tsc} && ${scripts.eslint}`);
    const pug = async () => await scriptExec(`${scripts.pug}`);
    const scss = async () => await scriptExec(`${scripts.sass} && ${scripts.postcss}`);
    const ts = async () => await scriptExec(`NODE_ENV=build ${scripts.ts}`);
    const img = async () => await scriptExec(`${scripts.img}`);

    await lint().then(() => Promise.all([pug(), scss(), ts(), img()]));
  } else {
    console.log(`\n===== Oepn Web Server. Access to \x1b[36mhttp://localhost${port}/ \x1b[0m=====\n`);
    const pug = async () => await scriptExec(`${scripts.pug} -w`);
    const scss = async () => await scriptExec(`${scripts.sass} -w`);
    const ts = async () => await scriptExec(`NODE_ENV=start ${scripts.ts}`);
    const img = async () => await scriptExec(`watch '${scripts.img}' src/images/`);
    const server = cp.exec(`${scripts.server}`);

    return Promise.all([pug(), scss(), ts(), img(), server]);
  }
};

/**
 * Remove dist
 */
cp.exec(`rimraf ${outputDir}`);

/**
 * Exec Build
 */
build()
  .then(() => {
    const timeDiff = (new Date().getTime() - start.getTime()) / 1000;
    console.log(`\n===== \x1b[34mBuild Success!\x1b[0m [time: \x1b[32m${timeDiff.toFixed(1)}s\x1b[0m] =====\n`);
  })
  .finally(() => {
    //
  });
