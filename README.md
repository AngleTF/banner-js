### 适用
移动端的(无缝/响应式/滑动)轮播

### 效果
![](https://raw.githubusercontent.com/AngleTF/web-banner-js/master/image/demo.png)

### 使用
声明视口
```html
<meta name="viewport"
content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
```
引入banner.css
```html
<link rel="stylesheet" href="css/banner.css">
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
<div class="banner">
</div>
```

引入banner.js
```html
<script src="js/phoneSlider.js"></script>
```

调用函数, 设置参数
```js
<script>

    new phoneSlider({
        target: '.banner',          //对象元素支持c3选择器
        fun: 'ease',                //动态曲线 , 默认值ease , 可选择 linear | ease | ease-in | ease-in-out
        moveTime: .5,               //移动时间 单位s
        runTime: 3,                 //总耗时   单位s
        list: [
            {img:'image/1.jpg'},
            {img:'image/2.jpeg', href:'https://baidu.com'},
            {img:'image/3.jpg', href:'https://baidu.com'},
            ],
        btnClick:true              //是否开启点击小圆点进行切换
    });



</script>
```


