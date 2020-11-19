const webpack = require('webpack');
const {merge} = require('webpack-merge');
const baseConfig = require('./webpack.base');

const devConfig = {
  mode: "development",
  devtool: "source-map",
  entry: './src/index.js',
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
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  // development 环境下开启 tree shaking，production 环境下，tree shaking 默认开启，不需要做额外配置
  optimization: {
    usedExports: true
  },
};

module.exports = merge(baseConfig, devConfig);