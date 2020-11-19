const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.(jpg|png|gif)$/,
        use: {
          // url-loader 涵盖了 file-loader 全部的功能
          // url-loader 在打包图片文件时，会把图片转换为 base64 的字符串，
          // 然后直接放到 bundle.js 中，而不会单独生成一个图片文件
          // 适用于小文件，大文件还是使用 file-loader
          loader: 'url-loader',
          options: {
            // placeholder 占位符，比如 文件名：[name]，后缀：[ext]，路径：[path]，hash：[hash]
            name: '[name]_[hash].[ext]', // 以源文件的文件名和后缀打包
            outputPath: 'images/', // 指定图片打包地址
            limit: 20480, // 如果文件大小小于 2kb，则打包成 base64，否则就生成单独的图片文件到 dist/images 目录下
          }
        },
      },
      {
        test: /\.scss$/,
        // style-loader 在得到 css-loader 生成的 css 样式段之后，把样式挂载到页面的 <head></head> 部分
        // css-loader 会分析所有的 css 文件的关系，把所有 css 文件合并成一段 css
        // sass-loader 把 scss 翻译成 css，然后递交给 css-loader 处理，最后经由 style-loader 统一挂载
        // 三个 loader 的执行顺序是数组逆序
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2, // 确保所有的 scss 文件打包都会走以下的 sass-loader 和 postcss-loader 进行处理
              modules: true, // 开启 css 模块化打包，可以让 css 只在指定的模块中有效
            }
          },
          'sass-loader',
          // 给样式自动加厂商前缀，用于浏览器兼容
          // 注：高级浏览器已不需要加这些前缀，如果要兼容老版本浏览器，需要在 package.json 中配置 browserslist
          'postcss-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          // babel-loader 只是 webpack 和 babel 做通信的桥梁，真正做 ES6 语法转化工作的是 preset-env
          loader: "babel-loader",
        }
      }
    ]
  },
  plugins: [
    // HtmlWebpackPlugin 会在打包结束后，
    // 以 template 配置的文件作为模板自动生成一个 html 文件，
    // 并把打包生成的 js 自动引入到这个 html 文件中
    new HtmlWebpackPlugin({
      template: "src/index.html",
      cache: false
    }),
    // CleanWebpackPlugin 会在打包之前把 output.filename 目录中的文件删除掉，再执行打包，避免打包生成无用的文件
    new CleanWebpackPlugin(),
  ],
  output: {
    // publicPath: "http://cdn.com.cn", // 指定打包后 引入 js 文件前默认添加的地址
    publicPath: "/",
    filename: "[name].js",
    // 指定打包文件生成的目录地址
    path: path.resolve(__dirname, '../dist'),
  }
};