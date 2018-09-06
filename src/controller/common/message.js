String.prototype.render = function (context) {
    var tokenReg = /(\\)?\{([^\{\}\\]+)(\\)?\}/g;

    return this.replace(tokenReg, function (word, slash1, token, slash2) {
        if (slash1 || slash2) {  
            return word.replace('\\', '');
        }

        var variables = token.replace(/\s/g, '').split('.');
        var currentObject = context;
        var i, length, variable;

        for (i = 0, length = variables.length; i < length; ++i) {
            variable = variables[i];
            currentObject = currentObject[variable];
            if (currentObject === undefined || currentObject === null) return '';
        }
        return currentObject;
    });
};

var re = /x/;
re.toString = function() {
    showMessage('哈哈，你打开了控制台，是想要看看我的秘密吗？', 5000, true);
    return '';
};

$(document).on('copy', function (){
    showMessage('你都复制了些什么呀，转载要记得加上出处哦', 5000, true);
});

$('.waifu-tool .icon-shouye').click(function (){
    window.location = window.location.protocol+'//'+window.location.hostname+'/8080/index.html'
});

$('.waifu-tool .icon-qunzu').click(function (){
    loadOtherModel();
});

$('.waifu-tool .icon-duihuaxinxi').click(function (){
    showHitokoto();
});

$('.waifu-tool .icon-yifu').click(function (){
    loadRandModel();
});
$('.waifu-tool .icon-dengpaotishi').click(function (){
    if((document.cookie.replace(/(?:(?:^|.*;\s*)night\s*\=\s*([^;]*).*$)|^.*$/, "$1") || '0' )== '0'){
        document.body.classList.add('night');
        document.cookie = "night=1;path=/"
        showMessage('夜间模式开启', 1000);
    }else{
        document.body.classList.remove('night');
        document.cookie = "night=0;path=/"
        showMessage('夜间模式关闭', 1000);
    }
});

$('.waifu-tool .icon-bangzhu').click(function (){
    window.open('https://chaobaba.com');
});

$('.waifu-tool .icon-cuowutishi').click(function (){
    sessionStorage.setItem('waifu-dsiplay', 'none');
    showMessage('愿你有一天能与重要的人重逢', 1300, true);
    window.setTimeout(function() {$('.waifu').hide();}, 1300);
});

$('.waifu-tool .icon-tupian').click(function (){
    showMessage('照好了嘛，是不是很可爱呢？', 5000, true);
    window.Live2D.captureName = 'Pio.png';
    window.Live2D.captureFrame = true;
});

(function (){
    var text;
    var SiteIndexUrl = window.location.protocol+'//'+window.location.hostname+'/';  // 自动获取主页
    
    if (window.location.href == SiteIndexUrl) {      // 如果是主页
        var now = (new Date()).getHours();
        if (now > 23 || now <= 5) {
            text = '你是夜猫子呀？这么晚还不睡觉，明天起的来嘛';
        } else if (now > 5 && now <= 7) {
            text = '早上好！一日之计在于晨，美好的一天就要开始了';
        } else if (now > 7 && now <= 11) {
            text = '上午好！工作顺利嘛，不要久坐，多起来走动走动哦！';
        } else if (now > 11 && now <= 14) {
            text = '中午了，工作了一个上午，现在是午餐时间！';
        } else if (now > 14 && now <= 17) {
            text = '午后很容易犯困呢，今天的运动目标完成了吗？';
        } else if (now > 17 && now <= 19) {
            text = '傍晚了！窗外夕阳的景色很美丽呢，最美不过夕阳红~';
        } else if (now > 19 && now <= 21) {
            text = '晚上好，今天过得怎么样？';
        } else if (now > 21 && now <= 23) {
            text = '已经这么晚了呀，早点休息吧，晚安~';
        } else {
            text = '嗨~ 快来逗我玩吧！';
        }
    } else {
        if(document.referrer !== ''){
            var referrer = document.createElement('a');
            referrer.href = document.referrer;
            var domain = referrer.hostname.split('.')[1];
            if (window.location.hostname == referrer.hostname) {
                text = '欢迎阅读<span style="color:#0099cc;">『' + document.title.split(' - ')[0] + '』</span>';
            } else if (domain == 'baidu') {
                text = 'Hello! 来自 百度搜索 的朋友<br>你是搜索 <span style="color:#0099cc;">' + referrer.search.split('&wd=')[1].split('&')[0] + '</span> 找到的我吗？';
            } else if (domain == 'so') {
                text = 'Hello! 来自 360搜索 的朋友<br>你是搜索 <span style="color:#0099cc;">' + referrer.search.split('&q=')[1].split('&')[0] + '</span> 找到的我吗？';
            } else if (domain == 'google') {
                text = 'Hello! 来自 谷歌搜索 的朋友<br>欢迎阅读<span style="color:#0099cc;">『' + document.title.split(' - ')[0] + '』</span>';
            } else {
                text = 'Hello! 来自 <span style="color:#0099cc;">' + referrer.hostname + '</span> 的朋友';
            }
        } else {
            text = '欢迎阅读<span style="color:#0099cc;">『' + document.title.split(' - ')[0] + '』</span>';
        }
    }
    showMessage(text, 6000);
})();

/* 检测用户活动状态，并在空闲时 定时显示一言 */
var getActed = false;
window.hitokotoTimer = 0;
var hitokotoInterval = false;
var model_list=null;

$(document).mousemove(function(e){getActed = true;}).keydown(function(){getActed = true;});
setInterval(function() { if (!getActed) ifActed(); else elseActed(); }, 1000);

function ifActed() {
    if (!hitokotoInterval) {
        hitokotoInterval = true;
        hitokotoTimer = window.setInterval(showHitokoto, 30000);
    }
}

function elseActed() {
    getActed = hitokotoInterval = false;
    window.clearInterval(hitokotoTimer);
}

function showHitokoto(){
    $.getJSON('https://v1.hitokoto.cn',function(result){
        var text = '这句一言来自 <span style="color:#0099cc;">『{source}』</span>，是 <span style="color:#0099cc;">{creator}</span> 在 hitokoto.cn 投稿的。';
        text = text.render({source: result.from, creator: result.creator});
        showMessage(result.hitokoto, 5000);
        window.setTimeout(function() {showMessage(text, 3000);}, 5000);
    });
}

function showMessage(text, timeout, flag){
    if(flag || sessionStorage.getItem('waifu-text') === '' || sessionStorage.getItem('waifu-text') === null){
        if(Array.isArray(text)) text = text[Math.floor(Math.random() * text.length + 1)-1];
        if(flag) sessionStorage.setItem('waifu-text', text);
        $('.waifu-tips').stop();
        $('.waifu-tips').html(text).fadeTo(200, 1);
        if (timeout === undefined) timeout = 5000;
        hideMessage(timeout);
    }
}

function hideMessage(timeout){
    $('.waifu-tips').stop().css('opacity',1);
    if (timeout === undefined) timeout = 5000;
    window.setTimeout(function() {sessionStorage.removeItem('waifu-text')}, timeout);
    $('.waifu-tips').delay(timeout).fadeTo(200, 0);
}

function initModel(waifuPath){
    
    if (waifuPath === undefined) waifuPath = '';
    var modelId = localStorage.getItem('modelId');
    var modelTexturesId = localStorage.getItem('modelTexturesId');
    
    if (modelId == null) {
        /* 首次访问加载 指定模型 的 指定材质 */
        var modelId = 2;            // 模型 ID
        var modelTexturesId = 18    // 材质 ID
    } loadModel(modelId, modelTexturesId);
	$.ajax({
        cache: true,
        url: waifuPath+'message.json',
        dataType: "json",
        success: function (result){
            $.each(result.mouseover, function (index, tips){
                $(document).on("mouseover", tips.selector, function (){
                    var text = tips.text;
                    if(Array.isArray(tips.text)) text = tips.text[Math.floor(Math.random() * tips.text.length + 1)-1];
                    text = text.render({text: $(this).text()});
                    showMessage(text, 3000);
                });
            });
            $.each(result.click, function (index, tips){
                $(document).on("click", tips.selector, function (){
                    var text = tips.text;
                    if(Array.isArray(tips.text)) text = tips.text[Math.floor(Math.random() * tips.text.length + 1)-1];
                    text = text.render({text: $(this).text()});
                    showMessage(text, 3000, true);
                });
            });
            $.each(result.seasons, function (index, tips){
                var now = new Date();
                var after = tips.date.split('-')[0];
                var before = tips.date.split('-')[1] || after;
                if((after.split('/')[0] <= now.getMonth()+1 && now.getMonth()+1 <= before.split('/')[0]) && 
                   (after.split('/')[1] <= now.getDate() && now.getDate() <= before.split('/')[1])){
                    var text = tips.text;
                    if(Array.isArray(tips.text)) text = tips.text[Math.floor(Math.random() * tips.text.length + 1)-1];
                    text = text.render({year: now.getFullYear()});
                    showMessage(text, 6000, true);
                }
            });
        }
    });
}
/////初始化。
function loadModel(modelId, modelTexturesId){
    localStorage.setItem('modelId', modelId);
    if (modelTexturesId === undefined) modelTexturesId =1;
    localStorage.setItem('modelTexturesId', modelTexturesId);
    $.get("lib/live2d/model_list.json",function (data) {
        model_list=data;
        if(Array.isArray(model_list.models[modelId])){
            loadlive2d('live2d', 'http://api.wegaoji.com/'+model_list.models[modelId][modelTexturesId]+'/index.json',null);
        }else{
            loadlive2d('live2d', 'http://api.wegaoji.com/'+model_list.models[modelId]+'/index-'+modelTexturesId+'.json', null);
        }
    })
}
//换皮肤
function loadRandModel(){
    var modelId = Number(localStorage.getItem('modelId'));
    var modelTexturesId = Number(localStorage.getItem('modelTexturesId'));
    if(Array.isArray(model_list.models[modelId])){
        if(model_list.models[modelId][modelTexturesId+1]==null){
            showMessage('我没有其他衣服呢', 3000, true);
            loadModel(modelId, 1);
        }else{
            showMessage('我的新衣服好看嘛', 3000, true);
            loadModel(modelId, modelTexturesId+1);
        }
    }else{
        $.get('http://api.wegaoji.com/'+model_list.models[modelId]+'/textures.cache',function (data) {
            if(data!=null){
                data=JSON.parse(data);
                if(data[modelTexturesId]==null){
                    showMessage('我没有其他衣服呢', 3000, true);
                    loadModel(modelId, 1);
                }else{
                    showMessage('我的新衣服好看嘛', 3000, true);
                    loadModel(modelId, modelTexturesId+1);
                }
            }else{
                showMessage('我没有其他衣服呢', 3000, true);
                loadModel(modelId, 1);
            }
        })
    }
}
///换人
function loadOtherModel(){
    var modelId = Number(localStorage.getItem('modelId'));
    if(model_list.models[modelId+1]==null){
        modelId=1;
    }else{
        modelId+=1;
    }
    loadModel(modelId,1);
    showMessage(model_list.messages[modelId], 3000, true);

}

function talk(){
    $.ajax({type: "GET",
        url: "https://jisuznwd.market.alicloudapi.com/iqa/query",
        data:{question:$("#msg").val()},
        beforeSend: function(request) {
            request.setRequestHeader("Authorization", "APPCODE 320c925f27df46059d0f1b28da0212a0");
        },
        success: function(result) {
            showMessage(result.result.content, 5000);
        }
    });
}

$("#msg").bind('keypress',function(event){
    if(event.keyCode == 13) {
        var msg=$('#msg').val();
        if(msg.indexOf("黄片") != -1||msg.indexOf("色情") != -1||msg.indexOf("换一个") != -1){
            showvideo();
        }
        talk();
        $('#msg').val("");
    }
});
/*function showMessage(text, timeout){
    if(Array.isArray(text)) text = text[Math.floor(Math.random() * text.length + 1)-1];
    //console.log('showMessage', text);
    $('.message').stop();
    $("#voice").attr("src","http://tsn.baidu.com/text2audio?tex="+text+
        "&pit=7&per=4&lan=zh&cuid=kdc&ctp=1&tok=24.9379420b2a35fc66ff3ee1e81476923d.2592000.1535545115.282335-11429318");
    $('.message').html(text).fadeTo(200, 1);
    if (timeout === null) timeout = 5000;
    hideMessage(timeout);
}*/

function clearmsg(){
    window.clearInterval(timeout);
    $("#clearmsg").remove();
}