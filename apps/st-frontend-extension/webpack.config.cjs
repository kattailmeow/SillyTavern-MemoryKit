const path = require('path');

/** @type {import('webpack').Configuration} */
module.exports = {
  mode: 'production',
  target: 'web',
  entry: './src/index.tsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: { type: 'umd', name: 'MemoryKitExt' }
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@sillytavern-memorykit/shared': path.resolve(__dirname, '../../packages/shared/src')
    }
  },
  module: {
    rules: [
      { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
      { test: /\.css$/, use: ['style-loader','css-loader'] }
    ]
  },
  optimization: { splitChunks: false }, // Single file output for easier setup
};