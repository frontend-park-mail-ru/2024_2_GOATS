const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// const buildPath = path.resolve(__dirname, 'dist');
// const publicPath = path.resolve(__dirname, 'public');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: path.join(__dirname, 'public'),
  output: {
    path: path.join(__dirname, 'dist'),
    assetModuleFilename: path.join('images', '[name].[contenthash][ext]'),
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html'),
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.hbs$/,
        use: 'handlebars-loader',
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.(css)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      // {
      //   test: /\.(png|svg|jpg)$/,
      //   type: 'asset',
      //   parser: {
      //     dataUrlCondition: {
      //       maxSize: 10 * 1024,
      //     },
      //   },
      // },
      {
        test: /\.(png|svg|jpg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
          mimetype: 'image/svg+xml',
        },
      },
      // {
      //   test: /\.svg$/,
      //   type: 'asset/resource',
      //   generator: {
      //     filename: path.join('images', '[name].[contenthash][ext]'),
      //   },
      // },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  devServer: {
    port: 3000,
    watchFiles: path.join(__dirname, 'public'),
    client: {
      overlay: false,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
    },
  },
  performance: {
    maxAssetSize: 500 * 1024,
    maxEntrypointSize: 500 * 1024,
  },
};
