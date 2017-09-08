window.onload = function(){
    if(data){
        makeSlide('slide');
        slider(document.getElementById('slide'));
    }else {
        alert('数据载入中。。。')
    }
};
function makeSlide(id) {
    let slide,
        height,
        width,
        viewport,
        ul,
        li,
        a,
        url,
        text,
        control,
        span,
        changeTo,
        prev,
        next;
    // 获取需要生成内容的目标元素及元素宽高
    slide = document.getElementById(id);
    height = slide.offsetHeight;
    width = slide.offsetWidth;
    // 开始创建结构
    // 创建可视区元素并设置宽高
    viewport = document.createElement('div');
    viewport.setAttribute('style', 'width:'+ width +'px; height:'+height +'px; ');
    // 创建移动元素，定义设定高度
    ul = document.createElement('ul');
    ul.style.height = height +'px';

    // 创建控制元素
    control = document.createElement('div');
    changeTo = document.createElement('div');
    prev = document.createElement('a');
    prev.innerHTML = '<';
    next = document.createElement('a');
    next.innerHTML = '>';
    changeTo.appendChild(prev).setAttribute('id', 'prev');
    changeTo.appendChild(next).setAttribute('id', 'next');

    // 按数据生成展示内容
    for(let i in data){
        li = document.createElement('li');
        a = document.createElement('a');
        text = document.createTextNode('This is '+ i);
        url = data[ i ];
        a.appendChild(text);
        li.appendChild(a).setAttribute('href', url);
        ul.appendChild(li).setAttribute('style', 'width:'+ width +'px; height:'+height +'px; ');
        li.style.backgroundColor = '#'+('00000'+((Math.random()*16777215+0.5)>>0).toString(16)).slice(-6);

        span = document.createElement('span');
        control.appendChild(span).setAttribute('class', '');
        control.children[0].setAttribute('class', 'cur');
    }
    // 将结构对应结节播入到ＤＯＭ
    viewport.appendChild(ul);
    viewport.appendChild(control).setAttribute('id', 'control');
    viewport.appendChild(changeTo).setAttribute('id', 'changeto');
    slide.appendChild(viewport).setAttribute('id','viewport');
    prev.style.top = next.style.top = (height - prev.offsetHeight)/2 +'px';
}


function slider(obj) {
    // 初始化变量
    var curr = 0;
    var delay = 5000;
    var animateTime = 500;
    var keyframe = 30;
    var slideBox = document.querySelector('ul');
    var actors = document.querySelectorAll('li');
    var singleWidth = actors[0].offsetWidth;
    var buttons = document.querySelectorAll('span');
    var changes = document.getElementById('changeto').querySelectorAll('a');

    // 为实现无缝滚动，复制第一帧（移动盒子内第一个子元素）到最后一帧
    slideBox.prepend(slideBox.children[actors.length-1].cloneNode(true));
    slideBox.appendChild(slideBox.children[1].cloneNode(true));

    slideBox.style.width = singleWidth * (actors.length+2) +'px';
    slideBox.style.left = -singleWidth +'px';
    // click事件监听
    obj.addEventListener('click', function (e) {
        let index = Array.prototype.indexOf.call(buttons, e.target) ;
        let changeto = Array.prototype.indexOf.call(changes, e.target);
        if(changeto >= 0){
            let change = (changeto > 0) ? 1 : -1;
            autoPlay(obj, curr+change);
        }

        if(index >= 0){autoPlay(obj, index);}

    }, false);

    autoPlay(obj);

    function autoPlay(obj, index) {
        clearInterval(obj.autoTimer);
        // 验证是否有目标传入
        if(index!==undefined){animatePlay(index)};

        obj.autoTimer = setInterval(function () {
            animatePlay(curr + 1);
        }, delay);
    }
    function animatePlay(target) {
        //  声明动画所需变量
        let newLeft = -(target+1)*singleWidth;
        let nowLeft = slideBox.offsetLeft;
        let stepLength = parseInt((newLeft - nowLeft)/keyframe);
        //  计数器归0
        let i = 0;
        //  设定定时器
        let animateTimer = setInterval(function () {
            if(i===keyframe){
                clearInterval(animateTimer);
                if (target < 0){
                    slideBox.style.left = -(actors.length)*singleWidth +'px';
                    target = actors.length-1;
                }else if(target===actors.length){
                    slideBox.style.left = -singleWidth +'px';
                    target = 0;
                }else {
                    if(slideBox.offsetLeft!==newLeft){
                        slideBox.style.left = newLeft +'px';
                    }
                }
                buttons[curr].setAttribute('class', ' ');
                buttons[target].setAttribute('class', 'cur');
                curr = target;
            }else {
                slideBox.style.left = slideBox.offsetLeft + stepLength +'px';
                i++;
            }
        }, animateTime/keyframe);

    }
}

//