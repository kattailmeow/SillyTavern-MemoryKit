const path = require('path');

/** @type {import('webpack').Configuration} */
module.exports = {
  mode: 'production',
  target: 'node',
  entry: './src/index.ts',
  output: {
    filename: 'index.cjs',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@sillytavern-memorykit/shared': path.resolve(__dirname, '../../packages/shared/src')
    }
  },
  module: {
    rules: [{ test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ }]
  },
  externalsPresets: { node: true },  // node 原生模块不用打进去
  // 如果想完全零依赖部署，可不设 externals，把第三方库也一起打包
};