### 适用
移动端的(无缝/响应式/滑动)轮播

### 效果
![](https://github.com/AngleTF/banner-js/blob/master/src/images/demo.gif)


### demo
```
npm install
npm run dev
```
___ 
### ES6 或 CommonJs使用
```js
import './css/phone-slider.scss';
import i1 from './images/banner-1.jpg';
import i2 from './images/banner-2.jpg';
import i3 from './images/banner-3.jpg';
//ES6
//import PhoneSlider from './lib/PhoneSlider';

//CommonJs
const PhoneSlider = require('./lib/PhoneSlider');

new PhoneSlider(
    {
        target: '.phone-slider',          //对象元素支持c3选择器
        fun: 'ease',                //动态曲线 , 默认值ease , 可选择 linear | ease | ease-in | ease-in-out
        moveTime: .5,               //移动时间 单位s
        runTime: 3,                 //总耗时   单位s
        list: [
            {img: i1,},
            {img: i2, href: 'https://baidu.com'},
            {img: i3, href: 'https://baidu.com'},
        ],
        btnClick: true              //是否开启点击小圆点进行切换
    }
);
```

### script使用
声明视口
```html
<meta name="viewport"
content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
```
引入css
```html
<link rel="stylesheet" href="./dist/css/phone-slider.min.css">
```

reset代码

```css
body, html{
    margin:0;padding:0;
}
ul{
    margin:0; padding:0; list-style: none;
}
```

声明html代码
```html
<div class="phone-slider">
</div>
```

引入banner.js
```html
<script src="./dist/PhoneSlider.js"></script>
```

调用函数, 设置参数
```js
window.onload = function () {
        console.log(PhoneSlider);
        new PhoneSlider({
            target: '.phone-slider',          //对象元素支持c3选择器
            fun: 'ease',                //动态曲线 , 默认值ease , 可选择 linear | ease | ease-in | ease-in-out
            moveTime: .5,               //移动时间 单位s
            runTime: 3,                 //总耗时   单位s
            list: [
                {img:'./images/banner-1.jpg', },
                {img:'./images/banner-2.jpeg', href:'https://baidu.com'},
                {img:'./images/banner-3.jpg', href:'https://baidu.com'},
                ],
            btnClick:true              //是否开启点击小圆点进行切换
        });
    }
```


