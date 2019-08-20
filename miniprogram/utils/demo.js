// 只能是相对路径啊.草!!!
import {
  config
} from '../config.js';

// 定义一个类;
//类名Demo要和文件名demo.js保持一致哦.
//文件名可以不用大写.类名最好用大写
class Demo {

  // 定义类的方法
  getKey() {
    return config.key;
  }
}
export {
  Demo
}