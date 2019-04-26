const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/js/browser.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/js'),
  },
};
