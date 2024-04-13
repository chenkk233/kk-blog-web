//盔盔消息框







//盔盔消息框结束
//KKJS主体
var $kk = (function() {
    let NotificationFlag=false;
    // 封装的 kkajax 函数
    function kkajax(options) {
        var xhr = new XMLHttpRequest();
        xhr.open(options.method, options.url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {

                    if (options.success) {
                        if(options.json){
                            options.success(JSON.parse(xhr.responseText));
                        }else{
                            options.success(xhr.responseText);
                        }
                    }
                } else {
                    if (options.error) {
                        options.error(xhr.status);
                    }
                }
            }
        };
        if (options.method.toUpperCase() === 'POST') {
            var data = options.data ? encodeFormData(options.data) : null;
            xhr.send(data);
        } else {
            xhr.send();
        }
    }
    function notice(message, type,time) {
        if(NotificationFlag){
            return false;
        }
        NotificationFlag=true;
        const notification = document.getElementById('notification');
        const messageElement = notification.querySelector('.message');
        messageElement.innerText = message;

        if (type === 'success') {
            notification.className = 'notification success';
        } else if (type === 'warning') {
            notification.className = 'notification warning';
        }

        setTimeout(() => {
            notification.style.top = '0';

            const overlay = document.createElement('div');
            overlay.style.position = 'absolute';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '1%';
            overlay.style.height = '100%';
            overlay.style.background = 'rgba(255,255,255,0.3)';
            notification.appendChild(overlay);
            //让进度条从 1% 变到 100% 的动画
            let width = 1;
            const timer = setInterval(() => {
                if (width >= 100) {
                    clearInterval(timer);
                }
                overlay.style.width = `${width}%`;
                width++;
            }, time/100);
        }, time/10);

        setTimeout(() => {
            notification.style.top = '-60px';
            overlay=notification.querySelector('div');
            setTimeout(() => {
                notification.removeChild(overlay);
            }, time/10);
            NotificationFlag=false;

        }, time+500);
    }
    // 编码表单数据
    function encodeFormData(data) {
        var encoded = '';
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                if (encoded.length > 0) {
                    encoded += '&';
                }
                encoded += encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
            }
        }
        return encoded;
    }
    function e(selector) {
        //判断selector的首字母是.还是#
        if(selector[0]==='.'){
            //获取元素
            return document.querySelector(selector);
        }else if(selector[0]==='#'){
            //获取元素
            return document.getElementById(selector.slice(1));
        }
    }
    function html(selector, content) {
        var elements = $(selector);
        if (elements instanceof Element) {
            if (content === undefined) {
                return elements.innerHTML;
            } else {
                elements.innerHTML = content;
            }
        } else if (elements instanceof NodeList) {
            if (content === undefined) {
                var htmlContents = [];
                elements.forEach(function(element) {
                    htmlContents.push(element.innerHTML);
                });
                return htmlContents;
            } else {
                elements.forEach(function(element) {
                    element.innerHTML = content;
                });
            }
        }
    };
    function create(name,attr,inner,addflag){
        if(attr===undefined){
            if(inner!==undefined){
                //设置元素内容
                element.innerHTML=inner;
            }
            if(addflag!==undefined){
                //添加元素
                $kk.append(addflag,element);
            }
            //创建元素
            return document.createElement(name);
        }else{
            //判断是.还是#开头
            if(attr[0]==='.'){
                //创建class元素
                var element=document.createElement(name);
                element.className=attr.slice(1);
                if(inner!==undefined){
                    //设置元素内容
                    element.innerHTML=inner;

                }
                if(addflag!==undefined){
                    //添加元素
                    $kk.append(addflag,element);
                }
                return element;
            }else if(attr[0]==='#'){
                //创建id元素
                var element=document.createElement(name);
                element.id=attr.slice(1);
                if(inner!==undefined){
                    //设置元素内容
                    element.innerHTML=inner;

                }
                if(addflag!==undefined){
                    //添加元素
                    $kk.append(addflag,element);
                }
                return element;
            }else{
                if(inner!==undefined){
                    //设置元素内容
                    element.innerHTML=inner;

                }
                if(addflag!==undefined){
                    //添加元素
                    $kk.append(addflag,element);
                }
                //创建元素
                return document.createElement(name);
            }
        }



    }
    // 将元素添加到父元素中
    function append(parent, element) {
        //判断父元素的首字母是.还是#
        if(parent[0]==='.'){
            //获取父元素
            var parentElement=document.querySelector(parent.slice(1));
            //将元素添加到父元素中
            parentElement.appendChild(element);
        }else if(parent[0]==='#'){
            //获取父元素
            var parentElement=document.getElementById(parent.slice(1));
            //将元素添加到父元素中
            parentElement.appendChild(element);
        }else{
            //例如parent是body字符串
            //获取父元素
            var parentElement=document.querySelector(parent);
            //将元素添加到父元素中
            parentElement.appendChild(element);
        }

    }
    function showlightbox(url){
        //检测是否已经存在lightbox
        if($kk.e('#lightbox')!==null){
            $kk.e('#lightbox').remove();
        }
        var lightbox=create('div','#lightbox');
        var lightboximg=create('img','.lightboximg');
        lightboximg.src=url;
        append('body',lightbox);
        append('#lightbox',lightboximg);
        //附加动画
        //禁用滚动
        document.body.style.overflow='hidden';
        lightbox.addEventListener('click',function(){
            //判断点击的是不是img
            if(event.target.className==='lightboximg'){
                return false;
            }
            //启用滚动
            document.body.style.overflow='auto';
            lightbox.remove();
        });
    }


    // 公开的接口
    return {
        ajax: kkajax,
        notice:notice,
        create:create,
        e:e,
        html:html,
        append:append,
        showlightbox:showlightbox
    };
})();





//创建消息框的div
// 当页面加载完成后执行的代码
document.addEventListener("DOMContentLoaded", function() {
    const newDiv = document.createElement("div");
    newDiv.className = "notification";
    newDiv.id = "notification";

    const newMessage = document.createElement("p");
    newMessage.className = "message";

    newDiv.appendChild(newMessage);
    document.body.appendChild(newDiv);
    //kk.showNotification("这是一个通知", "success", 3000);
});

