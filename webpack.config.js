const path = require('path');

module.exports = {
  entry: './src/index.js', // Точка входу
  output: {
    path: path.resolve(__dirname, 'dist'), // Вихідна папка
    filename: 'bundle.js', // Вихідний файл
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Обробка JavaScript
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/, // Обробка CSS
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  target: 'electron-renderer', // Для Electron
};