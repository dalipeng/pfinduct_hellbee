/**
 * Created by lipeng on 2016/9/10.
 */
$(function() {
    setTimeout(function() {
        new bee();
    }, 700);
});

var bee = function () {
    bee.verify(function() {
        new bee.UI();
    });
}
//==========================================================================
bee.UI = function () {
    this.createUI();
    this.createMessageBox();
}
bee.UI.hideUI = function() {
    $("#tool_box_dlg").hide(500);
    $("#bee_message_box").fadeOut(500);
}
bee.UI.showUI = function () {
    $("#tool_box_dlg").show(500);
    $("#bee_message_box").fadeIn(500);
}
bee.UI.showMessageBox = function () {
    $("#bee_message_box").fadeIn(500);
}
bee.UI.hideMessageBox = function () {
    $("#bee_message_box").fadeOut(500);
}
bee.UI.showMessage = function (message) {
    $("#bee_message_box").html(message);
    // if(!$("#bee_message_box").is(":visible")) {
    //     bee.UI.showMessageBox();
    // }
}
bee.UI.prototype = {
    createUI: function() {
        var midHeight = Math.round($(window).innerHeight()/2);
        var menuHeight = 200;
        $("<div id=\"tool_box_dlg\"></div>").css({
            "height": menuHeight+"px",
            "position": "fixed",
            "top": (midHeight-menuHeight/2)+"px",
        }).appendTo($(document.body));
        $("<span>随机空格数: </span>").appendTo($("#tool_box_dlg"));
        $("<input type=\"text\" id=\"spacNumText\" value=\"3\" /><br />").appendTo($("#tool_box_dlg"));
        $("<span>是否自动回传&nbsp;</span>").appendTo($("#tool_box_dlg"));
        $("<input id=\"bee_autoSendBack\" type=\"checkbox\" checked=\"checked\" />").appendTo($("#tool_box_dlg"));
        $("<input type=\"button\" id=\"autoPostBtn\" value=\"开始回帖\" />").appendTo($("#tool_box_dlg"));
        $("<div class=\"bee_tip\">M键显示/隐藏菜单</div>").appendTo($("#tool_box_dlg"));

        $("#autoPostBtn").bind("click", function() {
            var spaceNum = parseInt($("#spacNumText").val());
            //if(isNaN(spaceNum) || spaceNum<0 || spaceNum>100) {spaceNum = 0}
            autoPostAll(bee.getData(), spaceNum);   //自动回帖:针对每个网站脚本都需要实现这个函数
        });

        $(document).bind("keyup", function(e) {
            if("M" == String.fromCharCode(e.which)) {       //M键位显示或隐藏菜单的快捷键
                $("#tool_box_dlg").is(":visible") ? bee.UI.hideUI() : bee.UI.showUI();
            }
        });
    },
    createMessageBox: function() {
        var bodyW = $(document.body).outerWidth(true);
        var mBoxW = 2000;
        var centerPos = bodyW/2-mBoxW/2;
        $("<div id=\"bee_message_box\"><span id=\"bee_message_box_right\" style=\"float:right\"></span></div>").css({
            "left": centerPos+"px",
            "width": mBoxW+"px",
        }).appendTo($(document.body));
    },
};
//=====================================================================================
//helperFunc每个帖子随机插入空格函数
//@spaceNum:插入的空格数
bee.randStr = function(postStr, spaceNum) {
    //spaceNum = spaceNum ? spaceNum : 1;
    for(var i=0; i<spaceNum; ++i) {
        var spacePos = Math.round(Math.random()*postStr.length);
        var str1 = postStr.slice(0, spacePos);
        var str2 = postStr.slice(spacePos, postStr.length);
        postStr = str1+" "+str2;
    }
    return postStr;
}

bee.getData = function() {
    return inductData;
}
//同步sleep函数,不太好用,浪费资源
//@sec 睡眠秒数
bee.sleep = function(millsec) {
    var curr = new Date().getTime();
    var tar = curr + millsec;
    while(new Date().getTime() < tar) {
    }
}
//@callbackFunc:验证成功回调函数
bee.verify = function (callbackFunc) {
    // var d1 = new Date();
    // var d2 = new Date("2017-1-1");
    // if(d1.getTime() < d2.getTime()) {
    //     return true;
    // }else {
    //     return false;
    // }
    // return false;
    var verifyURL = "http://blog.sina.com.cn/s/blog_59d6c98b0102whkh.html";
    $.ajax({
        type: "get",
        url: verifyURL,
        success: function (data) {
            if(data.indexOf("bee.sad") != -1) {
                return false;
            }
            if(data.indexOf("bee.happy") != -1) {
                callbackFunc();
            }
        }
    });
}
//===============================================================================
//处理后台回传是否成功的前台显示
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    bee.UI.showMessage(request.info);
});