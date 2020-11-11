// const jpg = require('./webpack.jpg'); // jpg 返回的是打包后的文件名称
import jpg from './webpack.jpg'; // jpg 是打包后文件相对于项目根目录的地址

function createImage() {
  const img = new Image();
  img.src = jpg;
  img.classList.add('test-image'); // index.scss 中定义的样式将不会全局地影响此处创建的 image

  const root = document.getElementById('root');
  root.append(img);
}

export default createImage