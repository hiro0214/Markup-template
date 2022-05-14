import imageminGifsicle from 'imagemin-gifsicle';
import imagemin from 'imagemin-keep-folder';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminSvgo from 'imagemin-svgo';

const imageBuild = () => {
  imagemin([`src/assets/images/**/*.{jpg,png,gif,svg,ico}`], {
    plugins: [
      imageminMozjpeg({ quality: 80 }),
      imageminPngquant({ quality: [0.65, 0.8] }),
      imageminGifsicle(),
      imageminSvgo(),
    ],
    replaceOutputDir: (output) => {
      return output.replace(/images\//, `../../dist/images/`);
    },
  });
};

imageBuild();
