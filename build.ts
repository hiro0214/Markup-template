import cp from 'child_process';

const isEnvironment = process.env.NODE_ENV as 'build' | 'start';
const start = new Date();
const inputDir = 'src';
const outputDir = 'dist';
const scripts = {
  pug: `pug ${inputDir}/pug/ -o ${outputDir}/ --hierarchy -P`,
  sass: `sass ${inputDir}/scss/style.scss:${outputDir}/css/style.css -s compressed --no-source-map`,
  postcss: `postcss ${outputDir}/css/style.css -o ${outputDir}/css/style.css`,
  ts: 'node --loader ts-node/esm esbuild.ts',
  tsc: `tsc ${inputDir}/ts/*.ts --noEmit`,
  eslint: `eslint '${inputDir}/ts/*.ts' --fix`,
  stylelint: `stylelint '${inputDir}/scss/**/*.scss' --fix`,
  server: `browser-sync start -s ${outputDir} -f ${outputDir} --port 8080 --no-notify`,
};

const scriptExec = (script: string) => {
  return new Promise((res) => {
    cp.exec(script, (err) => {
      if (err) {
        throw new Error(err.message);
      } else {
        res('done');
      }
    });
  });
};

const build = async () => {
  if (isEnvironment === 'build') {
    const lint = async () => await scriptExec(`${scripts.stylelint} && ${scripts.tsc} && ${scripts.eslint}`);
    const pug = async () => await scriptExec(`${scripts.pug}`);
    const scss = async () => await scriptExec(`${scripts.sass}`).then(() => scriptExec(`${scripts.postcss}`));
    const ts = async () => await scriptExec(`NODE_ENV=build ${scripts.ts}`);

    await lint().then(() => Promise.all([pug(), scss(), ts()]));
  } else {
    const pug = async () => await scriptExec(`${scripts.pug} -w`);
    const scss = async () => await scriptExec(`${scripts.sass} -w`);
    const ts = async () => await scriptExec(`NODE_ENV=start ${scripts.ts}`);
    const server = cp.exec(`${scripts.server}`);

    return Promise.all([pug(), scss(), ts(), server]);
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
    console.log(`\n===== Compile Success! [time: ${timeDiff.toFixed(1)}s] =====\n`);
  })
  .finally(() => {
    //
  });
