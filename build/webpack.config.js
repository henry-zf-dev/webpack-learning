const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const webpack = require('webpack');

// webpack 默认只能打包 .js 的文件，其他格式的文件都需要引入 loader 来进行处理

// plugin 可以在 webpack 运行到某个时刻的时候，帮你做一些事情，
// 这些时刻可以理解为 webpack 的生命周期，比如打包前、打包后等

module.exports = {
  mode: "development",

  // 手动开启 sourceMap，则代码出错后，提示出错不会映射到源码中，只会映射到目标代码 bundle.js 中
  // 在 mode: "development" 模式下，sourceMap 默认会打开
  // sourceMap 是一种映射关系，比如，dist 目录下 bundle.js 的第60行映射到 src 目录下 index.js 的第20行
  // 开启 sourceMap 会影响打包的速度，因为需要构建映射关系，并生成 main.js.map 文件
  devtool: "source-map",
  // inline-source-map 不会生成 main.js.map 文件，而是把映射关系作为 base64 的格式，嵌入到 main.js 文件中
  // devtool: "inline-source-map",
  // 当代码量很大时，可以指定为 cheap，这样代码出错时，只需要提示到哪一行，不需要具体到哪一列，从而提高打包速度
  // devtool: "cheap-inline-source-map",
  // 指定 module 表示不仅我们自己写的源码需要做映射，对于第三方的模块也做映射
  // devtool: "cheap-module-inline-source-map",
  // eval 表示以 js eval 的方式生成 sourceMap，执行效率是最高的，但提示的内容相对不全面
  // devtool: "eval",
  // 推荐：
  // development: cheap-module-eval-source-map
  // production: cheap-module-source-map

  // 对 entry: {main: './src/index.js'} 的简写，
  // 如果没有指定 output.filename，则会生成 main.js 作为最终打包的目标文件
  // 此路径是基于运行命令的目录为参考点的，所以即使配置文件放置 build 文件夹了，但运行命令的目录还是根目录，所以还是不需要将其更改为 './../src/index.js'
  entry: './src/index.js',
  // 如果想一次打包生成两个目标文件，则可以分开指定，
  // 同时需要在 output.filename 中做占位符处理 {output{filename: [name].js}}
  // entry: {
  //   main: './src/index.js',
  //   sub: './src/index.js'
  // },

  // 利用 webpack-dev-server 开启 web 服务，让代码部署在服务器上，才能进行 ajax 请求
  // 因为 ajax 请求必须在 http:// 协议下才能进行，而如果只通过 file:// 协议，是无法进行的
  // 另外，通过 webpack-dev-server 打包生成的目标文件会在保存内存中，来提高打包速度
  devServer: {
    contentBase: './dist', // 服务器的根路径
    open: false, // 在启动 webpack-dev-server 后，自动打开一个浏览器，并访问配置的服务地址
    // 跨域代理转发配置
    // proxy: {
    //   '/api': 'http://localhost:3000'
    // },
    port: 8090, // 配置服务端口
    // 开启 Hot Module Replacement 热模块更新
    // 在代码更改后，只会动态更改 css 样式文件，而不会重新刷新页面
    hot: true,
    hotOnly: true, // 如果编译发生错误，则不自动刷新页面
  },

  module: {
    rules: [
      // {
      //   test: /\.(jpg|png|gif)$/,
      //   use: {
      //     loader: 'file-loader', // 当遇到 .jpg 文件时，会将该文件移动到 dist 目录，并给文件命名，并将文件名返回给引入图片文件的变量
      //     options: {
      //       // placeholder 占位符，比如 文件名：[name]，后缀：[ext]，路径：[path]，hash：[hash]
      //       name: '[name]_[hash].[ext]', // 以源文件的文件名和后缀打包
      //       outputPath: 'images/', // 指定图片打包地址
      //     }
      //   },
      // },
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
          // babel 配置放到 .babelrc 中后，就不需要写 options 了
          // options: {
          // preset-env 中包含了所有 ES6 转化为 ES5 的翻译规则
          // 但是 preset-env 只是做语法的转换
          // ES6 新增的语言特性，比如 Promise 的具体实现等，需要借助 babel-polyfill 进行补充
          // 注意：使用 presets 以及 import "@babel/polyfill"; 的写法适合单纯的业务代码
          // 而如果写组件库，则需要使用 @babel/plugin-transform-runtime
          // 因为全局 import "@babel/polyfill"; 会给 window 对象增加诸如 window.Promise 的方法，从而造成全局污染，
          // 而 @babel/plugin-transform-runtime 则是在闭包中补充这些方法，不会造成全局污染
          // presets: [
          //   [
          //     '@babel/preset-env',
          //     {
          //       // 表示按需打包，即只打包当前项目使用到的 ES6 语法，进行转化
          //       useBuiltIns: 'usage',
          //       // 指定最终打包运行的浏览器环境，如果浏览器本身已经支持 ES6 语法，则 babel 不会为其转化，提高打包效率
          //       targets: {
          //         "edge": "17",
          //         "firefox": "60",
          //         "chrome": "67",
          //         "safari": "11.1"
          //       },
          //       "corejs": 2 // 此处只能设置 corejs 2
          //     }
          //   ]
          // ],
          // plugins: [
          //   [
          //     "@babel/plugin-transform-runtime",
          //     {
          //       "absoluteRuntime": false,
          //       "corejs": 3,
          //       "helpers": true,
          //       "regenerator": true,
          //       "useESModules": false,
          //       "version": "7.0.0-beta.0"
          //     }
          //   ]
          // ]
          // }
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
    // 在 development 环境下，使用 webpack-dev-sever 打包目标文件是生成在内存中的，所以 development 环境其实不需要这个插件
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  // development 环境下开启 tree shaking，production 环境下，tree shaking 默认开启，不需要做额外配置
  optimization: {
    usedExports: true
  },
  output: {
    // publicPath: "http://cdn.com.cn", // 指定打包后 引入 js 文件前默认添加的地址
    publicPath: "/",
    filename: "[name].js",
    // 指定打包文件生成的目录地址
    path: path.resolve(__dirname, 'dist'),
  }
};