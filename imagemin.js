import fs from 'fs';
import glob from 'glob';
import imageminGifsicle from 'imagemin-gifsicle';
import imagemin from 'imagemin-keep-folder';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminSvgo from 'imagemin-svgo';
import sharp from 'sharp';

const inputDir = 'src/assets/images';
const outputDir = 'dist/images/';

const imageBuild = () => {
  imagemin([`${inputDir}/**/*.{jpg,png,gif,svg,ico}`], {
    plugins: [
      imageminMozjpeg({ quality: 80 }),
      imageminPngquant({ quality: [0.65, 0.8] }),
      imageminGifsicle(),
      imageminSvgo(),
    ],
    replaceOutputDir: (output) => {
      return output.replace(/images\//, `../../${outputDir}`);
    },
  });
};

const webpConvert = () => {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const entries = glob.sync(`${inputDir}/**/*.{jpg,png}`);
  for (let i = 0; i < entries.length; i++) {
    const entry = entries[i];
    const file = entry.split('/').slice(-1)[0];
    const fileName = file.slice(0, -4);
    sharp(entry)
      .webp({ quality: 50 })
      .toFile(`${outputDir + fileName}.webp`);
  }
};

imageBuild();
webpConvert();
