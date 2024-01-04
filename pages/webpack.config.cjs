const path = require('node:path');
const webpack = require('webpack');
// const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const isDevelopment = process.env.NODE_ENV === 'dev';

module.exports = {
  target: 'web',
  entry: './impl-babylonjs.ts',
  mode: isDevelopment ? 'development' : 'production',
  devtool: isDevelopment ? 'inline-source-map' : false,
  output: {
    filename: 'entry.bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    fallback: {
      vm: false,
      fs: false,
      url: require.resolve('url/'),
      buffer: require.resolve('buffer/'),
      util: require.resolve('util/'),
      path: require.resolve('path-browserify'),
      assert: require.resolve('assert-browserify'),
      'process/browser': require.resolve('process/browser'),
      '@bindings/craft3d': require.resolve('../bindings/craft3d'),
      '@bindings/taffy': require.resolve('../bindings/taffy'),
      '@bindings/noise': require.resolve('../bindings/noise'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false
        },
      },
    ]
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    new CompressionPlugin({
      test: /\.js$/,
      algorithm: 'gzip',
    }),
  ],
  // optimization: {
  //   minimizer: [new TerserPlugin()],
  // },
  devServer: {
    hot: false,
    liveReload: false,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': true,
    },
    static: [
      {
        directory: path.join(__dirname, './'),
        publicPath: '/',
      },
      {
        directory: path.join(__dirname, '../fixtures'),
        publicPath: '/',
      }
    ],
    compress: true,
    port: 3000,
    open: false,
  },
};
