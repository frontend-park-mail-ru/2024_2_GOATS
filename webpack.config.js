const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsCheckerPlugin = require('fork-ts-checker-webpack-plugin');

const buildPath = path.join(__dirname, 'dist');
const publicPath = path.join(__dirname, 'public');

module.exports = {
  entry: publicPath,
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, './public/index.html'),
    }),
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash].css',
    }),
    new TsCheckerPlugin(),
  ].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.[tj]s$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.hbs$/,
        loader: 'handlebars-loader',
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.s?css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|svg|jpg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      pages: path.join(publicPath, 'pages'),
      components: path.join(publicPath, 'components'),
      styles: path.join(publicPath, 'styles'),
      modules: path.join(publicPath, 'modules'),
      assets: path.join(publicPath, 'assets'),
      flux: path.join(publicPath, 'flux'),
      store: path.join(publicPath, 'store'),
    },
  },
  devServer: {
    port: 3000,
    historyApiFallback: true,
    watchFiles: publicPath,
    client: {
      overlay: false,
    },
  },
  performance: {
    maxAssetSize: 500 * 1024,
    maxEntrypointSize: 500 * 1024,
  },
};
