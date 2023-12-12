const path = require('path');
const webpack = require('webpack');
const NpmDtsPlugin = require('npm-dts-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  target: 'web',
  entry: './src/index.ts',
  mode: 'production',
  devtool: false,
  output: {
    filename: 'jsardom.js',
    path: path.resolve(__dirname, 'dist')
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
      '@bindings/taffy': require.resolve('./bindings/taffy'),
    },
  },
  externals: {
    babylonjs: {
      commonjs: 'babylonjs',
      amd: 'babylonjs',
      root: 'BABYLON',
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
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
    new NpmDtsPlugin({
      entry: './src/index.ts',
      logLevel: 'debug',
      output: './dist/jsardom.d.ts',
      force: true,
      tsc: '--extendedDiagnostics',
    }),
    new CompressionPlugin({
      test: /\.js$/,
      algorithm: 'gzip',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: 'bundle-report.html',
    }),
  ],
  optimization: {
    minimizer: [new TerserPlugin()],
  },
};
