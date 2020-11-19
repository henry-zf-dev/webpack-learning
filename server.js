const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const config = require('./build/webpack.dev.js');
const compile = webpack(config);

// 在 node 中使用 webpack
// 使用 express 启动自己写的 web 服务器，然后配合 webpack 进行打包，并实时监听文件变化，动态打包
const app = express();
app.use(webpackDevMiddleware(compile, {
  publicPath: config.output.publicPath
}));

app.listen(3000, () => {
  console.log('##### server is running #####');
});

