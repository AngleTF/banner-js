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
 * version1.2 增加 onrezise 事件 用于重置touchBanner全局宽度 和 dom元素宽度
 * version2.0 应用npm做包管理
 * */
class PhoneSlider {
    constructor (config) {
        this.config = {
            target: '',
            fun: 'ease',
            moveTime: 0.5,
            runTime: 3,
            list: [],
            btnClick: false
        };

        this.touchData = {
            startX: 0, // 开始的坐标
            startY: 0,
            moveWid: 0, // 移动的宽度距离
            moveHei: 0
        };

        this.mergeConfig(config);
        this.slider = createObject(this.config.target);
        if (!this.slider) return;

        this.sliderCount = this.config.list.length;
        this.sliderWidth = this.slider.offsetWidth;
        this.sliderHalfWidth = this.sliderWidth / 2;
        this.transition = `all ${this.config.moveTime}s ${this.config.fun}`;
        this.currentIndex = 1;

        this.renderSlider();
        this.onDotClick();

        this.onResize();
        this.onTouchEvent();

        this.start();
    }
};

PhoneSlider.prototype.mergeConfig = function (config) {
    for (const key in config) {
        if (Object.prototype.hasOwnProperty.call(config, key)) {
            this.config[key] = config[key];
        }
    }
};

PhoneSlider.prototype.renderSlider = function () {
    const imageGroup = document.createElement('ul');
    imageGroup.className = 'banner-group-images';
    imageGroup.style.transition = this.transition;
    imageGroup.style.width = this.sliderWidth * (this.sliderCount + 2) + 'px';
    imageGroup.style.transform = `translateX(-${this.sliderWidth}px)`;

    const cursorGroup = document.createElement('ul');
    cursorGroup.className = 'banner-group-cursor';

    this.slider.appendChild(imageGroup);
    this.slider.appendChild(cursorGroup);

    const imgList = [];
    const dotList = [];
    this.config.list.forEach(function (current, index) {
        // 图片列表
        const img = document.createElement('li');
        const { img: url, href = null, click = () => {} } = current;

        img.className = 'fl';
        img.style.width = this.sliderWidth + 'px';
        img.innerHTML = href ? `<a href="${href}" style="background:url('${url}') no-repeat;background-size: cover"></a>` : `<a style="background:url('${url}') no-repeat;background-size: cover"></a>`;
        img.onclick = click;
        imageGroup.appendChild(img);

        imgList[imgList.length] = img;

        // 圆点列表
        const dot = document.createElement('li');
        dot.index = index;
        dot.className = index === 0 ? 'banner-cursor-active' : '';
        cursorGroup.appendChild(dot);

        dotList[dotList.length] = dot;
    }.bind(this));

    if (this.sliderCount !== 0) {
        // 第一个节点
        const firstNode = imgList[0].cloneNode(true);

        // 最后一个节点
        const lastNode = imgList[imgList.length - 1].cloneNode(true);

        imageGroup.appendChild(firstNode);
        imageGroup.insertBefore(lastNode, imgList[0]);
    }

    this.imageGroup = imageGroup;
    this.cursorGroup = cursorGroup;
    this.imgList = imgList;
    this.dotList = dotList;
};

/**
 * 监听圆点点击事件
 */
PhoneSlider.prototype.onDotClick = function () {
    const self = this;

    this.dotList.forEach(function (dot) {
        dot.onclick = function () {
            if (!self.config.btnClick) {
                return;
            }
            self.imageGroup.style.transition = self.transition;
            self.currentIndex = this.index + 1;
            self.move();
        };
    });
};

/**
 * 设置 cursor 的 active
 */
PhoneSlider.prototype.setCursor = function (index) {
    // 清除所有样式
    this.dotList.forEach(function (ele) {
        ele.removeAttribute('class');
    });

    // fix cursor
    index = index < 0 ? this.sliderCount - 1 : index;
    index = index >= this.sliderCount ? 0 : index;
    this.dotList[index].className = 'banner-cursor-active';
};

/**
 * 将滑块移动到当前的currentIndex
 */
PhoneSlider.prototype.move = function () {
    const distance = this.currentIndex * -this.sliderWidth;

    this.imageGroup.style.transform = `translateX(${distance}px)`;

    this.setCursor(this.currentIndex - 1);
};

/**
 * 将滑块移动到指定位置
 * @param distance
 */
PhoneSlider.prototype.moveSite = function (distance) {
    this.imageGroup.style.transform = `translateX(${distance}px)`;
};

/**
 * 定时器
 */
PhoneSlider.prototype.run = function () {
    // 开始定时器前必须开启transition
    this.imageGroup.style.transition = this.transition;

    this.currentIndex++;

    this.currentIndex = this.currentIndex > this.sliderCount ? 1 : this.currentIndex;
    this.currentIndex = this.currentIndex <= 0 ? this.sliderCount : this.currentIndex;

    this.move();
};

/**
 * 开启定时器
 */
PhoneSlider.prototype.start = function () {
    this.slider.timer = setInterval(function () {
        this.run();
    }.bind(this), this.config.runTime * 1000);
};

/*
 *   监听手指事件
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
PhoneSlider.prototype.onTouchEvent = function () {
    const self = this;

    this.imageGroup.addEventListener('touchstart', function (e) {
        // 清除定时器 , transition
        self.touchData.moveWid = 0;
        clearInterval(self.slider.timer);
        this.style.transition = '';
        const touch = e.touches[0];
        [self.touchData.startX, self.touchData.startY] = [touch.clientX, touch.clientY];
    }, false);

    this.imageGroup.addEventListener('touchmove', function (e) {
        const touch = e.touches[0];
        self.touchData.moveWid = touch.clientX - self.touchData.startX;
        self.moveSite(self.currentIndex * -self.sliderWidth + self.touchData.moveWid);
    });

    this.imageGroup.addEventListener('touchend', function (e) {
        // 开启定时器 , transition
        this.style.transition = self.transition;
        self.start();

        if (Math.abs(self.touchData.moveWid) > self.sliderHalfWidth) {
            // 用户理想方向
            if (self.touchData.moveWid > 0) {
                self.currentIndex--;
            } else {
                self.currentIndex++;
            }
            self.move();

            self.currentIndex = self.currentIndex > self.sliderCount ? 1 : self.currentIndex;
            self.currentIndex = self.currentIndex <= 0 ? self.sliderCount : self.currentIndex;
        } else {
            // 回弹
            self.moveSite(self.currentIndex * -self.sliderWidth);
        }
    });

    // 位置修复 校正
    this.imageGroup.addEventListener('webkitTransitionEnd', function () {
        self.currentIndex = self.currentIndex > self.sliderCount ? 1 : self.currentIndex;
        self.currentIndex = self.currentIndex <= 0 ? self.sliderCount : self.currentIndex;

        this.style.transition = '';
        self.move();
    });
};

/*
*  作用:重置宽度
*  想要做到响应 , 不光要重置wid 和 half , 已创建的dom元素都需要修改值
* */
PhoneSlider.prototype.onResize = function () {
    window.onresize = function () {
        this.sliderWidth = this.slider.offsetWidth;
        this.sliderHalfWidth = this.sliderWidth / 2;

        this.imageGroup.style.width = this.sliderWidth * (this.sliderCount + 2) + 'px';

        const lis = document.querySelectorAll('.banner-group-images li');

        for (let i = 0, iLen = lis.length; i < iLen; i++) {
            lis[i].style.width = this.sliderWidth + 'px';
        }
    }.bind(this);
};

function createObject (name) {
    if (!name) return null;

    if (typeof name === 'string') {
        return document.querySelector(name);
    }

    if (typeof name !== 'object') {
        return null;
    }

    if (name.nodeType === 1 && name instanceof window.HTMLElement) {
        return name;
    }

    return name[0] ? name[0] : null;
}

if (module && module.exports) {
    module.exports = PhoneSlider;
}

export default PhoneSlider;
