const Header = require('./header.js');
const Sidebar = require('./sidebar.js');
const Content = require('./content.js');
// const jpg = require('./webpack.jpg'); // jpg 返回的是打包后的文件名称
import jpg from './webpack.jpg'; // jpg 是打包后文件相对于项目根目录的地址

// import './index.scss'; // 此方式为全局引用，会影响以下创建的两张图片的样式，这样很容易造成样式冲突
import style from './index.scss'; // 此方式为模块化引入，只会影响当前文件，而不会影响 createImage

import createImage from './createImage';

createImage();

const img = new Image();
img.src = jpg;
img.classList.add(style['test-image']);

const root = document.getElementById('root');
root.append(img);

new Header();
new Sidebar();
new Content();