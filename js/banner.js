/**
 *  +-------------+-----------------+-----------+------------------+
 *  |   Author    |      Date       |  version  |   E-mail         |
 *  +-------------+-----------------+-----------+------------------+
 *  |  Tao lifeng | 2018/5/12 8:38  |   1.2     | 742592958@qq.com |
 *  +-------------+-----------------+-----------+------------------+
 *  |                       Abstract                               |
 *  +--------------------------------------------------------------+
 *  |
 *  |   Responsive seamless carousel.
 *  |
 *  +--------------------------------------------------------------+
 */

/*
 * version1.1 增加 btnClick 参数 (是否开启圆点点击事件)
 * version1.2 增加 onrezise 事件 用于重置touchBanner全局宽度 和 dom元素宽度, var 声明变为ES6 的 let 块级声明
 * */

function touchBanner(data) {

    /*
     *   1.初始化banner宽度
     *   2.创建banner内的dom元素 , 并给定样式
     *   3.clone节点 , 第一个给最后一个 , 最后一个给第一个
     *   4.开启轮播定时器
     *   5.监听用户的移动事件
     *
     * */


    let b = document.querySelector('.banner'),
        dom = new DOM(),
        num = 1,
        len = data.image.length,
        wid = b.offsetWidth,
        half = wid/2,   //一半
        imgLis = [],
        t,
        transition = 'all ' + data.moveTime + 's ' + (data.fun ? data.fun : 'ease');

    data.link = data.link ? data.link : [];

    let newEle = dom.create([
        {
            tag: 'ul',
            className: 'banner-group-images',
            style:{
                transition:transition,
                width:wid * (len + 2) + 'px',
                transform:'translateX('+ -wid +'px)'    //起始第二张图片位置
            }
        },
        {
            tag: 'ul',
            className: 'banner-group-cursor'
        }
    ]).toEnd(b).newElement;


    data.image.forEach(function (current, index) {
        //图片li
        imgLis[imgLis.length] = dom.create([
            {
                tag: 'li',
                style:{
                    width:wid + 'px'
                },
                className: 'fl',
                innerHTML:'<a href="' +(data.link[index] ? data.link[index] : 'javascript:void(0)')  + '" style="background:url(\''+ current +'\') no-repeat;background-size: cover"></a>'
            }
        ]).toEnd(newEle[0]).newElement;

        //圆点li
        dom.create([
            {
                tag: 'li',
                index:index,
                //有需求的可开启
                onclick:function () {
                    if (!data.btnClick){
                        return
                    }
                    newEle[0].style.transition = transition;
                    move(newEle[0] , (this.index+1) * -wid);
                    setClassName(newEle[1].children , 'banner-cursor-active' , this.index);
                    num = this.index + 1;
                    //console.log("点击设置圆点" + this.index);
                },
                className:index === 0 ? 'banner-cursor-active' : ''
            }
        ]).toEnd(newEle[1])
    });

    //第一个
    let firstLi = imgLis[0][0].cloneNode(true);

    //最后一个
    let lastLi = imgLis[imgLis.length-1][0].cloneNode(true);

    newEle[0].appendChild(firstLi);
    newEle[0].insertBefore(lastLi,imgLis[0][0]);

    //定时器
    function run() {
        //开始定时器前必须开启transition
        newEle[0].style.transition = transition;

        num = num <= 0 ? len : num;
        num = num > len ? 1 : num;

        //此处加1是为了起始位置进一位(x秒后移动至第三张图片开始)
        move(newEle[0] , (num+1) * -wid);

        setClassName(newEle[1].children , 'banner-cursor-active' , num);

        num++;
    }

    b.timer = setInterval(function () {
        run()
    },data.runTime * 1000);

    /**
     * 移动(瞬移)
     * @param ele
     * @param n
     */
    function move(ele , n) {
        ele.style.transform = 'translateX(' + n + 'px)';
    }

    /**
     * 设置 cursor 的 className
     * @param ele
     * @param cls
     * @param n
     */
    function setClassName(ele , cls , n) {
        for (let i = 0, lens = ele.length; i < len; i++) {
            ele[i].removeAttribute('class');
        }
        //fix cursor
        n = n < 0 ? len-1 : n;
        n = n >= len ? 0 : n;

        ele[n].className = cls
    }


    /*
     *   1.手指开始滑动事件 , 清除定时器和transition , 并且获取初始坐标
     *   2.手指移动事件 计算移动距离  moveX - startX + 初始位置 = ul 的移动距离
     *   3.手指放开时 判断滑动是否超过一半
     *   4.超过一半 吸附至下个目标 , 否则回弹
     *   5.回弹move至初始num对应的页面
     *   6.如果吸附至下个目标 , 则需要判断用户的方向 , 可以通过用户移动坐标来判断用户的移动时正还是负
     *   7.正的话(移动的x轴比初始的大) , 表示向右移动的 标识需要 -- , 反则亦之
     *   8.并且需要对用户高速切换是 对num的 位置修复(当第一张和最后一张时的位置修复)
     *   9.移动结束后 如果是第一张则瞬移到最后第二张 , 如果是最后一张则瞬移到第二张
     * */
    let touchData = {
        startX:0,    //开始的坐标
        startY:0,
        moveWid:0,   //移动的宽度距离
        moveHei:0
    };

    newEle[0].addEventListener('touchstart',function (e) {
        //清除定时器 , transition
        clearInterval(b.timer);
        this.style.transition = "";
        let touch = e.touches[0];
        [touchData.startX , touchData.startY] = [touch.clientX , touch.clientY];
    },false);

    newEle[0].addEventListener('touchmove',function (e) {
        let touch = e.touches[0];
        touchData.moveWid = touch.clientX - touchData.startX;
        move(this, num * -wid + touchData.moveWid);
        //console.log(num * -wid , num);
    });

    newEle[0].addEventListener('touchend',function (e) {
        //开启定时器 , transition
        this.style.transition = transition;
        b.timer = setInterval(function () {
            run()
        },data.runTime * 1000);

        if(Math.abs(touchData.moveWid) > half){
            //用户理想方向
            if (touchData.moveWid > 0){
                num--;
            }else{
                num++;
            }

            move(this, num * -wid);

            //防止用户高速切换操作(未触发webkitTransitionEnd)

            num = num <= 0 ? len : num;
            num = num > len ? 1 : num;

            //console.log("滑动设置圆点:" + (num - 1));
            setClassName(newEle[1].children , 'banner-cursor-active' , num - 1);
        }else{
            //回弹
            move(this, num * -wid);
        }
    });

    /*
    * 作用: 位置修复 校正
    * */
    newEle[0].addEventListener('webkitTransitionEnd',function () {

        //console.log("第"+ num +"张");

        //瞬间切换至第一张
        num = num > len ? 1 : num;
        //瞬间切换至最后一张
        num = num <= 0 ? len : num;

        this.style.transition = "";
        move(this , -wid * num);
    });


    /*
     *  作用:重置宽度
     *  想要做到响应 , 不光要重置wid 和 half , 已创建的dom元素都需要修改值
     * */
    window.onresize = function () {


        wid = b.offsetWidth;
        half = wid/2;

        newEle[0].style.width = wid * (len + 2) + 'px';

        let li = GetDom('.banner-group-images li',true);

        for (let i = 0, iLen = li.length; i < iLen; i++){
            li[i].style.width = wid + 'px';
        }


    }


}