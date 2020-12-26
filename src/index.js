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