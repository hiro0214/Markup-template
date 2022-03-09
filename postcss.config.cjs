const autoprefixer = require('autoprefixer')();
const postcssCombineMediaQuery = require('postcss-combine-media-query');

module.exports = {
  plugins: [postcssCombineMediaQuery, autoprefixer],
};
