const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: {
    background: './src/background/background.ts',
    content: './src/content/content.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        // 暂时注释掉 public 目录的复制
        // { from: 'public', to: '.' },
        {
          from: 'src/manifest.ts',
          to: 'manifest.json',
          transform: (content) => {
            const manifest = require('./src/manifest.ts').default;
            return JSON.stringify(manifest, null, 2);
          }
        }
      ]
    })
  ]
}; 