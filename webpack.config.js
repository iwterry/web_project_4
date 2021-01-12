const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    main: path.join(__dirname, 'src', 'pages', 'index.js'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'main.js',
    publicPath: ''
  },
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8080,
    open: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, 
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          }, 
          'postcss-loader'
        ]
      },
      {
        test: /\.(svg|jpg|woff(2)?)$/,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({template: path.join(__dirname, 'src', 'index.html')}),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin()
  ]
};