const path = require('path');
const webpack = require('webpack');
const NpmDtsPlugin = require('npm-dts-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const Plugins = {
  Progress: new webpack.ProgressPlugin(),
  Define: new webpack.DefinePlugin({
    'process.env.JSARDOM_VERSION': JSON.stringify(require('./package.json').version),
  }),
  Provide: new webpack.ProvidePlugin({
    process: 'process/browser',
    Buffer: ['buffer', 'Buffer'],
  }),
  LimitChunkCount: new webpack.optimize.LimitChunkCountPlugin({
    maxChunks: 1,
  }),
  FrameworkDts: new NpmDtsPlugin({
    entry: './src/index.ts',
    output: './dist/jsardom.d.ts',
    force: true,
    tsc: '--extendedDiagnostics',
  }),
  ApiDts: new NpmDtsPlugin({
    entry: './src/living/script-context.ts',
    output: './dist/jsar-api.d.ts',
    force: true,
    tsc: '--extendedDiagnostics',
  }),
  Compression: new CompressionPlugin({
    test: /\.js$/,
    algorithm: 'gzip',
  }),
  BundleAnalyzer: new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    openAnalyzer: false,
    reportFilename: 'bundle-report.html',
  }),
};

/** @type {import('webpack').Configuration} */
const sharedConfig = {
  entry: './src/index.ts',
  mode: 'production',
  devtool: false,
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
  externals: {
    babylonjs: {
      module: 'babylonjs',
      commonjs: 'babylonjs',
      commonjs2: 'babylonjs',
      amd: 'babylonjs',
      root: 'BABYLON',
    },
  },
  optimization: {
    minimizer: [new TerserPlugin()],
  },
  experiments: {
    outputModule: true,
  },
};

const distPath = path.resolve(__dirname, 'dist');
const distLibrary = { type: 'module' };

/** @type {import('webpack').Configuration[]} */
module.exports = [
  {
    ...sharedConfig,
    target: 'web',
    output: {
      path: distPath,
      library: distLibrary,
      filename: 'jsardom.browser.js',
    },
    resolve: {
      extensions: ['.ts', '.js'],
      fallback: {
        vm: false,
        fs: false,
        url: require.resolve('url/'),
        buffer: require.resolve('buffer'),
        util: require.resolve('util/'),
        path: require.resolve('path-browserify'),
        assert: require.resolve('assert-browserify'),
        'process/browser': require.resolve('process/browser'),
        '@bindings/taffy': require.resolve('./bindings/taffy'),
      },
    },
    plugins: [
      Plugins.Progress,
      Plugins.Define,
      Plugins.Provide,
      Plugins.LimitChunkCount,
      Plugins.Compression,
    ],
  },
  {
    ...sharedConfig,
    target: 'node18.16',
    node: {
      __dirname: true,
      __filename: true,
    },
    output: {
      path: distPath,
      library: distLibrary,
      filename: 'jsardom.node.js',
    },
    resolve: {
      extensions: ['.ts', '.js'],
      fallback: {
        '@bindings/taffy': require.resolve('./bindings/taffy'),
      }
    },
    plugins: [
      Plugins.Progress,
      Plugins.Define,
      Plugins.LimitChunkCount,
      Plugins.FrameworkDts,
      Plugins.ApiDts,
      Plugins.Compression,
      Plugins.BundleAnalyzer,
    ],
  },
  {
    ...sharedConfig,
    experiments: {
      outputModule: false,
    },
    target: 'node18.16',
    node: {
      __dirname: true,
      __filename: true,
    },
    output: {
      path: distPath,
      library: {
        type: 'commonjs2',
      },
      filename: 'jsardom.node.cjs',
    },
    resolve: {
      extensions: ['.ts', '.js'],
      fallback: {
        '@bindings/taffy': require.resolve('./bindings/taffy'),
      }
    },
    plugins: [
      Plugins.Progress,
      Plugins.Define,
      Plugins.LimitChunkCount,
      Plugins.Compression,
    ],
  },
];
