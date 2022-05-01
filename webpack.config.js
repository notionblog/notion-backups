module.exports = {
  target: 'webworker',
  context: __dirname,
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
    ],
  },
}
