#
## 声明视口

```html
<meta name="viewport"
content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
```

### reset代码

```css
body, html{
margin:0;padding:0;
}
ul{
margin:0; padding:0; list-style: none;
}
```

### 声明html代码

```html
<div class="banner">
</div>
```

### 引入banner.js

```html
<script src="js/banner.js"></script>
```

### 调用函数, 设置参数

```js
<script>


        touchBanner({
        target: '.banner', //对象元素支持c3选择器
        fun: 'ease', //动态曲线 , 默认值ease , 可选择 linear | ease | ease-in | ease-in-out
        moveTime: .5, //移动时间 单位s
        runTime: 3, //总耗时 单位s
        image: ['image/1.jpg', 'image/2.jpeg' , 'image/3.jpg'], //有几个图片就有几个banner图
        //link:['https://baidu.com','https://baidu.com','https://baidu.com'], //banner图对应的链接 , 默认值javascript:void(0)
        btnClick:false //是否开启点击小圆点进行切换
        });


</script>
```


