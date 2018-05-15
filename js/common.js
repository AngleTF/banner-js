/**
 * Created by TF on 2018/2/26.
 */
function GetDom(dom, all) {
    return all !== true ? document.querySelector(dom) : document.querySelectorAll(dom);
}

function ajax(uData) {
    if (!uData) {
        return false;
    }

    var oXml = new XMLHttpRequest();
    oXml.open(uData.method.toLowerCase(), uData.url, true);

    oXml.addEventListener('readystatechange', function () {
        if (oXml.readyState === 4 && oXml.status === 200) {
            var_dump('----------请求成功--------');
            switch (uData.type.toLowerCase()) {
                case 'xml':
                    uData.success(oXml.responseXML);
                    break;
                case 'json':
                    uData.success(JSON.parse(oXml.responseText));
                    break;
            }
        } else if (oXml.status > 400) {
            //如果失败返回对象本身
            uData.failure(oXml);
        }

    });
    oXml.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    oXml.send(requestString(uData.data));

}
function requestString(data) {
    var str;

    for (var k in data) {
        if (typeof str === 'undefined') {
            if (data.hasOwnProperty(k)) {
                str = k + '=' + data[k];
            }
        } else {
            if (data.hasOwnProperty(k)) {
                str += '&' + k + '=' + data[k];
            }
        }
    }

    //var_dump('请求的数据:' + str, data);
    return str;
}

function var_dump($message) {
    if (typeof arguments === 'undefined') {
        return;
    }
    Array.prototype.forEach.call(arguments, function (current) {
        console.log(current);
    })
}

function random(length) {
    return Math.round(Math.random() * length)
}

function animation(node,style,fn){
    var sped;       //步进值样式值
    var current;    //当前元素样式值
    var boole;      //判断定时器flag
    var num;
    clearInterval(node.timer);
    node.timer = setInterval(function(){
        boole = true;
        for (var k in style){

            switch (k){
                case 'opacity':
                    //opacity 使用百进制传入
                    num = getStyle(node,k) * 100;
                    break;
                case 'scrollTop':
                    num = window.scrollY;
                    break;
                default:
                    num = getStyle(node,k);
            }

            current = parseInt(num);

            sped = current + (style[k] - current) * .1;

            sped = style[k] > current ? Math.ceil(sped) : Math.floor(sped);

            switch (k){
                case 'opacity':
                    node.style[k] = sped / 100;
                    node.style['filter'] = 'alpha(opacity:' + sped + ')';
                    break;
                case 'z-index':
                    node.style[k] = style[k];
                    break;
                case 'scrollTop':
                    document.body[k] = sped;
                    document.documentElement[k] = sped;
                    break;
                default:
                    node.style[k] = sped + 'px';
            }

            if(style[k] !== sped){
                boole = false;
            }
        }
        if(boole){
            clearInterval(node.timer);
            fn ? fn.call(node) : null;
        }
    },30);
}
/**
 * 获取非行间样式
 * @param ele
 * @param style
 * @returns {*}
 * @constructor
 */
function getStyle(ele,style){
    return ele.currentStyle ? ele.currentStyle[style] : getComputedStyle(ele,null)[style];
}

function in_array(str,arr){
    var flag = false;
    for(var i = 0,a;a = arr[i];i++ ){
        if(a === str){
            flag = true;
            break;
        }
    }
    return flag;
}

function GetImage(e,limit,check,obj,fn){
    obj.innerHTML = '';
    var files = e.target.files || e.dataTransfer.files;
    var_dump('img-max-length:' + limit);
    limit = files.length < limit ? files.length : limit;
    var_dump('img-current-length:' + limit);

    for(var i = 0;i < limit; i++){
        var reader = new FileReader();
        if(!in_array(files[i].type,check)){
            alert('请传入正确的图片');
            continue;
        }

        reader.readAsDataURL(files[i]);
        reader.onload = fn;
    }
}

function DOM(){

   //调用时用来区分的元素名称
   this.ElementName = 'tag';

   //创建出来的新元素列表
   this.newElement = [];

   //单例toEnd对象
   this.toEndElement = {};

    //创建元素
    this.create = function (ElementArray){
        //清空创建的新元素
        this.newElement = [];

        ElementArray.forEach(function(current){
            var dom = document.createElement(current.tag);
            for (var key in current){
                if(current.hasOwnProperty(key) && key !== this.ElementName && key !== 'style'){
                    dom[key] = current[key];
                }
                if(key === 'style'){
                    var style = current['style'];
                    for (var sKey in style){
                        if(style.hasOwnProperty(sKey)){
                            dom.style[sKey] = style[sKey]
                        }
                    }
                }

            }
            this.newElement.push(dom);
        },this);

        return this;
    };

    this.toEnd = function(toEle){
        if(typeof toEle === 'string'){
            if (this.toEndElement[toEle]){
                //返回旧对象
                toEle = this.toEndElement[toEle];
            }else{
                //生成新对象
                this.toEndElement[toEle] = GetDom(toEle,true);
                toEle = this.toEndElement[toEle];
            }
        }

        this.newElement.forEach(function(current){
            if(toEle.length === undefined){
                toEle.appendChild(current);
            }else{
                //数组对象
                toEle[0].appendChild(current);
            }
        });

        return this;
    };
}

function emailCheck(emailVal){

    var pattern = /^[0-9a-zA-Z\-_]+@[0-9a-zA-Z\-_]+\.[0-9a-zA-Z\-_]+$/;

    if(!pattern.test(emailVal)){
        return alert("你的邮箱格式不正确");
    }
    return true;
}

function passwordCheck($pwd){

    var pattern = /([a-zA-Z0-9!@#$%^&*()\-+_?/:<>{.,}]){8,18}/;

    if(!pattern.test($pwd)){
        return alert('密码长度需要8-18');
    }
    return true;
}