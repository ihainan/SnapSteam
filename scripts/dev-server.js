const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../webpack.config.js');

const app = express();
const compiler = webpack(config);

app.use(webpackMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true,
    chunks: false,
  },
}));

app.use(webpackHotMiddleware(compiler));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Dev server listening on port ${port}`);
}); 