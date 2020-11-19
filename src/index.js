// 在业务代码最开始，引入 babel polyfill
// 将 ES6 的新增特性使用 ES5 的写法进行实现补充
// 使用 useBuiltIns 或者 @babel/plugin-transform-runtime 后，不需要显性地 import "@babel/polyfill"
// import "@babel/polyfill";

const Header = require('./header.js');
const Sidebar = require('./sidebar.js');
const Content = require('./content.js');
// const jpg = require('./webpack.jpg'); // jpg 返回的是打包后的文件名称
import jpg from './webpack.jpg'; // jpg 是打包后文件相对于项目根目录的地址

// import './index.scss'; // 此方式为全局引用，会影响以下创建的两张图片的样式，这样很容易造成样式冲突
import style from './index.scss'; // 此方式为模块化引入，只会影响当前文件，而不会影响 createImage
import './style.css';
import counter from "./counter";
import number from "./number";
import createImage from './createImage';

import {add} from "./math";

createImage();

const img = new Image();
img.src = jpg;
img.classList.add(style['test-image']);

const root = document.getElementById('root');
root.append(img);

new Header();
new Sidebar();
new Content();

/*  HMR 相关  */
const btn = document.createElement('button');
btn.innerHTML = '新增';
document.body.append(btn);
btn.onclick = function() {
  const div = document.createElement('div');
  div.innerHTML = 'item';
  document.body.append(div);
};

counter();
number();

// 在 js 中实现 Hot Module Replacement，必须要手写热更新代码
// 而 更改 css 就不需要，原因是 css-loader 已经内置了如下的处理，我们不需要额外的编写
// 在 Vue 中，vue-loader 为 .vue 文件也内置了热更新处理，我们也不需要些额外的处理
// 但如果我们使用到比较不常见的文件类型，其对应的 loader 没有做热更新处理，那么需要我们手动进行处理
if (module.hot) {
  module.hot.accept('./number', () => {
    const lastNumber = document.getElementById('number');
    document.body.removeChild(lastNumber);
    number();
  });
}

/*  babel 相关  */
const arr = [
  new Promise(() => {}),
  new Promise(() => {}),
];
arr.map(item => {
  console.log('##### item #####', item);
});

// 对于 Chrome 来说，其本身非常与时俱进，ES6 的写法都支持，不需要额外的转化
// 而一些老版本的浏览器，比如 IE 等，需要使用 babel 进行语法的转化，将 ES6 换换为 ES5

console.log('##### hello world henry !!!!!!! #####');

// tree shaking 相关
// tree shaking 只能作用于 ES Module（静态引入），不支持 commonJS（动态引入）
// 使用 tree shaking 后，对于同一个模块，只会打包使用到的 export，而未使用的不会打包到目标文件中
// 注：在 development 环境下，即使开启了 tree shaking 一个模块中的代码依然会全部被打包，只是会给未使用的 export 写上注释：unused，原因是需要做 source-map 用于调试
// development 环境下，需要配置 webpack: optimization.usedExports = true, package.json: sideEffects: ['*.css']
// sideEffects: ['*.css'] 是为了防止开启 tree shaking 后，而一些模块没有任何 export，比如 css 文件，导致 webpack 打包直接过滤掉这些模块
// 设置 sideEffects，让 webpack 不对数组中的文件进行 tree shaking，但 sideEffects 对 production 没有作用
// 而在 production 环境下，webpack 会自动开启 tree shaking，不需要做额外的 webpack 配置
add(1, 2);

// development 和 production 相关
// 区别
// 1.source-map 不同
// 2.是否会被压缩