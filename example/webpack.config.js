const path = require('path');

module.exports = {
  entry: './test.js',
  output: {
    path: path.resolve(__dirname, 'testbuild'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        options:{ presets: ['es2015'] }
      }
    ]
  },
  devServer: {
    inline: true
  }
};
