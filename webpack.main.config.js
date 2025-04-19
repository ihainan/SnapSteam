const path = require('path');

module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: './src/main/main.ts',
  target: 'electron-main',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist/main'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  externals: {
    electron: 'require("electron")',
    'electron-store': 'require("electron-store")',
    jimp: 'require("jimp")',
    fs: 'require("fs")',
    path: 'require("path")',
    os: 'require("os")'
  },
  node: {
    __dirname: false,
    __filename: false,
  },
}; 