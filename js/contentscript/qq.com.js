var qq_com = {};
var wblist_sel = "#talkList li div.msgBox";


var pageinit = function(settings){

	
 
	var regArr=[
		/http:\/\/news\.qq\.com\/\w\/\d+\/\d+\.htm$/,
		/http:\/\/coral\.qq\.com\/\d+/,
		/http:\/\/news\.qq\.com$/,
		/http:\/\/t\.qq\.com\/.*/
		
	];
	var url = window.location.href;
	console.log("url : " + url);
	state = publicpfinduct.URLState(regArr,url);

	console.log("qq_com state:"+state);
	
	
	
	if(state==-1){ 
		return;
	}
	var userstr=settings.user;
	var user=JSON.parse(userstr);
	
	var pfinducturl = user.pfinducturl;
	var userid = user.userid;
	
	if(state>=0){
		 //给iframe页面里面注入东西
		var iframehead = $("#commentIframe").contents().find("head")
		var maincss = pfinducturl + "/chrome/css/main.css";
		var dialogcss = pfinducturl + "/chrome/dialog/ui.css";
		var stylecss = pfinducturl + "/chrome/css/style.css";
		
		var qq_comiframejs = pfinducturl + "/chrome/js/contentscript/qq.com.iframe.js";
		 
		$("<link>") .attr({ rel: "stylesheet", type: "text/css", href: maincss }) .appendTo(iframehead);
		$("<link>") .attr({ rel: "stylesheet", type: "text/css", href: dialogcss }) .appendTo(iframehead);
		$("<link>") .attr({ rel: "stylesheet", type: "text/css", href: stylecss }) .appendTo(iframehead);
		
 
		$("#commentIframe").attr("name","induct_iframe");
		var np_frame = $("#np_frame");  
        var commentDoc = np_frame.contents().eq(0).contents(); //获得评论frame下面的document
		//(bee:修改最大高度从500改到1000) 改成没有滚动条吧，要不自动定位难
		//commentDoc.find(".np-comment-list").css({"max-height":"1000px","overflow-y":"auto"});
		commentDoc.find("#allComments").css({"position":"relative"});
		commentDoc.find(".np-title-hot").css({"position":"absolute","top":"-28px","width":"100%"});
		$(".l_qq_com").css({"display":"none"});
		if(state <= 2){
			
		 //做常规检查
			setTimeout(function(){
				pageInfoData = qq_com.getPageInfo();
				//检查界面登录状态
				publicpfinduct.checkPageInfo(pageInfoData);
				
				qq_com.sendBack(pfinducturl,userid,pageInfoData,qq_com.hc_button,qq_com.listValue);
				
				
			},3000);
			
		}else{
			pageInfoData = qq_com.getPageInfo();
				//检查界面登录状态
			publicpfinduct.checkPageInfo(pageInfoData);
				
				
		}
 
	}	
			
	var userstr=settings.user;
	var user=JSON.parse(userstr);
	
	var pfinducturl = user.pfinducturl;
	var userid = user.userid;
	
	if (state == 0 ) {
	
	
	}
	if (state == 1 || state == 0 ) {
		publicpfinduct.insertMaterial(pfinducturl,qq_com.pageDeal,qq_com.setFormValues);
		qq_com.ding(url);
		//素材注入
		
	}
	
	if ( state == 3) {
		publicpfinduct.sendBack(pfinducturl,userid,pageInfoData,qq_com.hc_button,qq_com.listValue);

	}
	
 
}

 

/**取界面元素  **/
qq_com.getPageInfo=function(){
	var displayname="";
	var accountname="";
	var forumname="";
	var forumurl="";
	var userid="";
	var resulttype = "";
	var displayname = "";
	if(state==1 || state == 0){
		
		displayname = $("#userName").text();
		forumurl = window.location.href;
		forumname = "腾讯新闻";

	} 
	
	if (state == 3) {
		displayname  = $(".text_user").text();
		forumurl = window.location.href;
		forumname = "腾讯微博";
	}
 
	accountname = displayname;
	
	var obj = new Object();
	obj.displayname=displayname;
	obj.userid=userid;
	obj.accountname=accountname;
	obj.forumname=forumname;
	obj.forumurl=forumurl;
 
	return obj;
};

 
/**
 * 回传按钮注入
//转移到内嵌的iframe中去
 */
qq_com.hc_button=function(page){
	
	 
	if (state == 0 || state == 1) {
		var ifrobj = $($("#commentIframe")[0].contentWindow.document);
		ifrobj.find("div.np-post-body").each(function(){
			$(this).find(".np-post-header").append("<pbutton style='margin-left: 10px'   class='pf_button pf_orange pf_small btn_up' style='cursor:pointer' name='btn_up'>回传</pbutton>");
		});
		ifrobj.find("#loadMore span").live("click",function(){
			setTimeout(function(){
				ifrobj.find("div.np-post-body").each(function(){
					if (!$(this).find(".pf_button").length) {
						$(this).find(".np-post-header").append("<pbutton style='margin-left: 10px'   class='pf_button pf_orange  btn_up' style='cursor:pointer' name='btn_up'>回传</pbutton>");
					}
					
				});		
				 
					
				ifrobj.find(".np-post-footer").each(function(){ 
					if (!$(this).find(".pf_button").length) {
						$(this).append('<pbutton class="pf_button pf_orange pf_small ding">顶</pbutton>');
					}
					
				});
			},2000);			
		});
	}
 
 
	
	if (state == 3) {
		console.log($(wblist_sel));
		$(wblist_sel).each(function(){
				$(this).find(".userName").append("<pbutton style='margin-left: 10px'   class='pf_button pf_orange pf_small btn_up' style='cursor:pointer' name='btn_up'>回传</pbutton>");
		});
	}
};


/** 
* 回传
* pfinducturl:导控url
* userid:用户id
* pageinfo:界面取得对象数据
* hc_button:按钮位置函数
* hc_data:行数据算法函数
* qq_com 比较作怪
*/
 qq_com.sendBack=function(pfinducturl,userid,pageinfo,hc_button,hc_data){

	var displayname = pageinfo.displayname;
	if(!displayname||displayname==''){
		console.log("displayname为空！！！");
//		return;
	}else{
		//界面已登录
		weblogin = true;
	}
	var forumname = pageinfo.forumname;
	var forumurl = pageinfo.forumurl;
	var accountname = pageinfo.accountname;
	//回传按钮位置注入
	if(typeof hc_button=='function'){
		hc_button(pageinfo,userid);
	}
	
	//qq新闻因为是内嵌的iframe所以这里做特殊处理 (bee:回传按钮点击事件绑定)
	$($("#commentIframe")[0].contentWindow.document).find(".btn_up").live("click",function(){
		
		var thisbutton = $(this);
		var trdata = new Object();
		if(typeof hc_data=='function'){
			trdata = hc_data($(this));
		}
 
		var title = trdata.title;
		var url = trdata.url;
		if(!publicpfinduct.regTestURL(url)){

			console.log("界面可能已变动！请检查！"	);
			return;
		}
		var content = trdata.content;

		var posttime = trdata.posttime;
		var resulttype = trdata.resulttype;
		//这一步是做特殊处理， 从新闻端闯过来的话，可能会附带displayname,这时候就以传过来的displayname为主
		if (!!trdata.displayname) {displayname  = trdata.displayname}
	 
		//拿导控任务后回传
		publicpfinduct.getCurrentTaskid(pfinducturl,function(taskid){
			
			var jsondata = new Object();
			jsondata.title=title;
			jsondata.url = url;
			jsondata.forumname = forumname;
			jsondata.forumurl = forumurl;
			jsondata.displayname = displayname;
	 
			jsondata.taskid = taskid;
			jsondata.userid = userid;
			jsondata.content = content;
			jsondata.heatnum = trdata.heatnum || 0;
			jsondata.ranknum = trdata.ranknum || 0;
			jsondata.posttime = posttime;
			jsondata.resulttype =resulttype;
			var param_screen = "viewport";
			jsondata.param = param_screen;
			var jsondatastr = JSON.stringify(jsondata);
			console.log('taskresult:'+jsondatastr);
			//关闭toolbar页面
			$('#floatDiv').hide();
			$(".pf_button").hide();
			//按钮屏蔽
			thisbutton.remove();
			//thisbutton.css("background", "rgb(149, 160, 237)"); //bee:不变色的，截图会露馅
			//截图
			//(bee:这句后台消息应该是信息与截图的代码)
			chrome.extension.sendMessage({method:"showinsert",key:jsondata,data:true},function(response){
				//		console.log(response);
				//thisbutton.attr("disabled","disabled");
			});
 
			
		},userid);
		
	});
};

/**
 * 列表tr以及处理
 */
qq_com.listValue=function(obj){
	var trdata = new Object();
	var title = "";
	var url = "";
	var content = "";
	var posttime = "";
	var resulttype = "";
	var displayname = "";
	var ranknum = 0;
	var heatnum = 0;
	var currurl = window.location.href;
	if(state == 0 || state == 1){//新闻
		resulttype = 2;
		var trobj = obj.parents(".np-post-body");	 
		url = currurl;
		title = $("title").text();
		content = trobj.find(".np-post-content").text();
		posttime = trobj.find(".np-time").attr("data") * 1000;
		var time = new Date(posttime);
		posttime = time.getFullYear() + "-" + (time.getMonth() - 0  + 1 ) + "-" + time.getDate() + "  " + time.getHours() + ":" +  time.getMinutes();
		displayname = trobj.find(".np-user").text();
		heatnum = obj.parent().next().next().children().eq(0).find("em").text().trim(); 
		ranknum = $("pbutton[name='btn_up']", document.getElementById('commentIframe').contentWindow.document).index(obj) + 1;  
 
	} 
	
	if (state == 3) {//微博
		var trobj = obj.parents(wblist_sel);	
		url = trobj.find(".relay").attr("href");
		displayname  = trobj.find(".userName").text();
		content = trobj.find(".msgCnt").text();
		posttime = trobj.find(".time").attr("title");
		title = $("title").text();
		if (!!posttime){
			posttime = posttime.replace("年","-").replace("月","-").replace("日","");
		}
		resulttype = 2;
	}
	trdata.title = title;
	trdata.url = url;
	trdata.content = content;
	trdata.posttime = posttime;
	trdata.resulttype = resulttype;
	trdata.displayname = displayname;
	trdata.heatnum = heatnum;
	trdata.ranknum = ranknum;  
	return trdata;
};

qq_com.pageDeal=function(){
 
	if ( state == 1) {
		var np_frame = $("#np_frame");  
        var commentDoc = np_frame.contents().eq(0).contents(); //获得评论frame下面的document
	 	//$("#commentIframe").contents().find("body").find("#top_reply").find(".np-title").append("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</pbutton>");
		//commentDoc.find("");
		$("#mainBody").prepend("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</pbutton>");
	//	commentDoc.find("#top_reply .np-title").append("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</pbutton>");
//		$("#top_reply").find(".np-title").html("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</pbutton>");
	}else if ( state == 0 ) {
		$("#tag_cmt").append("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</pbutton>");
		$("#tag_cmt").css({width:"100px", height:"30px",background:"white" })
	}
	
};

qq_com.setFormValues=function(title,content){
	if(state==1 || state == 0){
		$("#commentIframe").contents().find("body").find("#top_textarea").val(content);
	}
};


qq_com.getCookie=function(c_name){
	var cookie = document.cookie;
	if (cookie && 0 < cookie.length){
		c_start = cookie.indexOf(c_name + "=");
		if (-1 < c_start){ 
			c_start = c_start + c_name.length + 1;
			c_end   = cookie.indexOf(";", c_start);
			return unescape(cookie.substring(c_start, (-1 < c_end? c_end:cookie.length )));
		} 
	}
	
	return null;
};

//设置cookie
qq_com.setCookie=function(name,value,expiredays,domain){
	var exdate = new Date();
    exdate.setTime(exdate.getTime() + expiredays*24*60*60*1000);
	// 使设置的有效时间正确。增加toGMTString()
	document.cookie = name+"="+value+";domain="+domain+";path=/"+((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
	
};
/**
 * 选择填充账号
 */
qq_com.fillAccountAndPwd=function(pfinducturl,currenturl){
	$(".headShadow").before("<input type='button' value='切换账号' style='float:right'  id='changeAccount' />");
	$("#changeAccount").unbind("click").die("click").live("click",function(){
		//获取taskid
		publicpfinduct.getCurrentTaskid(pfinducturl,function(taskid){
			account.selectAccount(function(username,password){
				var getCookieUrl = pfinducturl+"/chrome!getCookie.action";
				var jsondata = {};
				jsondata.username = username;
				jsondata.password = password;
				jsondata.url = currenturl;
				var jsondatastr = JSON.stringify(jsondata);
				var data = {account:jsondatastr};
				$.ajax({
					type: "POST",
					async:false,
					url: getCookieUrl,
					data:data,
					success: function(str){
						if(str!=""){
							publicpfinduct.setCookie(str);
							window.location.reload();
						}
					}
				});
				
				
			},pfinducturl,currenturl,taskid);
			
		});
	});
	
};

qq_com.ding=function( ){
			//先去localstroagr 里面去找当前url是否有任务， 如果没有就在这个界面的后缀展示“顶”
	
		var ifrobj = $($("#commentIframe")[0].contentWindow.document);
		
		ifrobj.find(".np-post-footer").each(function(){ 
		
			$(this).append('<pbutton class="pf_button pf_orange pf_small ding">顶</pbutton>');
		});
		ifrobj.find(".ding").live("click",function(){  
		 
			if (!$(this).next()[0]) {
			 
				$(this).parent().append("<input type='text' style='width:30px' ><pbutton class='pf_button pf_orange pf_small back_ding'>后台顶</pbutton>");		 
			}else{
					$(this).next()[0].focus();
			}
			
		});	
		ifrobj.find(".back_ding").live("click",function(){  
			var url = $(".bigTitle").children().children().attr("href");
			
			var dingnum = $(this).prev().val();
			if (!dingnum) {
				alert("请输入需要顶的数量！！");
				return;
			}
			var nickname = $(this).parent().prev().prev().children("span").first().text();
			var cmtid = $(this).parents(".np-post").attr("id").replace("comment_","").replace("top_","");
			var targetid = window.parent.location.href.replace("http://coral.qq.com/",""); 
			var content = $(this).parents(".np-post-footer").prev().text();
			var retdata= {};
			retdata["uniquekey"] = cmtid + "," + targetid;
			retdata["num"] = dingnum;
			retdata["url"] = url;
			retdata["displayname"] = nickname;
			retdata["content"] = content; 
			chrome.extension.sendMessage({method:"backpost",key:retdata,value:""},function(){window.location.href = window.location.href;});	 
		});	
 
};

function autologin(username,password){
	$("#oneKey").click();

	setTimeout(function(){
		var frmeobj = $($("#login_one_frame")[0].contentWindow.document);
		frmeobj.find("#switcher_plogin")[0].click();
		frmeobj.find("#u").val(username);
		frmeobj.find("#p").val(password);
		frmeobj.find("#login_button")[0].click();
	},2000);
	
 
}

//小蜜蜂强势插入==============================================================
//轮循发贴函数
var PostMisc = {};
PostMisc.userCount = null; //登录QQ号的数量
PostMisc.currUserId = 0;
PostMisc.account = null; //登录帐号的具体信息句柄
PostMisc.sumPosts = 5; //本次意图发帖的数量
PostMisc.currPostNum = 0; //当前发帖数量
PostMisc.userChangePostNum = 10; //每次发多少贴后自动切换用户
PostMisc.NickNameList = new Array();

//需要3秒延迟时间得到PostMisc.userCount
function init() {
	PostMisc.sumPosts = parseInt($("#wantPostNum").val());
	PostMisc.account = qq_com.getPageInfo(); //本脚本自带的页面账户信息
	getUserCount();
}

//@param: num 就是一个用户顺序排序号  此函数登录过程可能需要等待6秒
function changeUser(num) {
	bee.UI.showMessage("更换账号中: 第"+(num+1)+"位QQ账号");
	if($("#login a:first").html().indexOf("登录") <= 0) {    //首先判断如果当前已经登录了则退出登录
		beeLogout();
	}
	setTimeout(function() {
		$("#oneKey")[0].click();
		setTimeout(function() {
			//var logBox = $("#login_one_frame").contents().find("#qlogin_show");
			var logBoxDoc = $("#login_one_frame")[0].contentWindow.document;   //bee:此处需要浏览器同源策略关闭
			var logList = $(logBoxDoc).find("#qlogin_list");
			setTimeout(function() {
				var allA = $(logList).find("a");
				$.each(allA, function(n, value) {
					if(n == num) {
						$(value)[0].click();
					}
				});
			}, 2000);
		}, 2000);
	}, 2000);
}

//得到目前已经挂上的QQ数目,并且自动退出已有登录  需要3秒时间
function getUserCount() {
	if($("#login a:first").html().indexOf("登录") <= 0) {    //首先判断如果当前已经登录了则退出登录
		beeLogout();
	}
	setTimeout(function() {
		$("#oneKey")[0].click();
		setTimeout(function() {
			//var logBox = $("#login_one_frame").contents().find("#qlogin_show");
			var logBoxDoc = $("#login_one_frame")[0].contentWindow.document;   //bee:此处需要浏览器同源策略关闭
			var logList = $(logBoxDoc).find("#qlogin_list");
			var nickNameList = $(logList).find(".nick");
			$.each(nickNameList, function (n, value) {
				PostMisc.NickNameList.push($(value).html());   //把所有登录的用户名记录到数组，以后判断是否为自己发的贴用
			});
			var allA = $(logList).find("a");
			if(allA.length == 0 ) {
				console.log("系统没有登录任何QQ账号");
				alert("系统没有登录任何QQ账号");
			}
			PostMisc.userCount = allA.length;
		}, 1000);
	}, 2000);
}
//需要1秒延迟时间
function beeLogout() {
	$(".menu-bd:first").css({
		"display":"block",
	});
	setTimeout(function() {
		$("#loginOut")[0].click();
	}, 1000);
}

function getNextUserId() {
	if(PostMisc.currUserId+1 == PostMisc.userCount) {
		PostMisc.currUserId = 0;
	}else {
		++PostMisc.currUserId;
	}
	return PostMisc.currUserId;
}

function autoPostAll(dataArr, spaceNum) {
	init();
	changeUser(0);
	setTimeout(function() {
		bee.UI.showMessage("准备开始发贴...预计"+PostMisc.sumPosts+"条");
		var $reply_page = $("#commentIframe").contents();
		var $reply_txt = $reply_page.find("#top_textarea");
		var $sub_btn = $reply_page.find("#top_post_btn");
		var i = 0, y = 0;
		var postTimer = setInterval(function() {
			bee.UI.showMessage("当前发帖: "+(PostMisc.currPostNum+1));
			$reply_txt.val(bee.randStr(dataArr[i], spaceNum));
			$sub_btn[0].click();    //提交按钮动作
			i++;
			if(i == dataArr.length) {
				i = 0;
			}
			if(PostMisc.userChangePostNum == y) {
				y = 0;
				changeUser(getNextUserId());
			}
			y++;
			PostMisc.currPostNum++;
			if(PostMisc.currPostNum == PostMisc.sumPosts) {
				clearInterval(postTimer);
				$reply_page.find("#loadMore>span")[0].click();  //点一下加载更多，用来显示各个回传按钮
				if($("#bee_autoSendBack").attr("checked") == "checked") {
					bee.UI.showMessage("准备开始回传...");
					setTimeout(function () {
						autoSendBack();
					}, 2000);
				}
			}
		}, 4500);
	}, 4500);
}
function sendOne($btn) {
	$(document.body).animate({scrollTop: $btn.offset().top-200}, 0);
	var nickname = $btn.parent().find("span:first a:first").html();
	if(PostMisc.NickNameList.toString().indexOf(nickname) < 0) {  //验证是否为自己发的帖子
		console.log(nickname+"不再昵称列表");
		return;
	}
	$btn.click();
	setTimeout(function () {
		$(".ui-dialog-buttonset button").first().click();
	}, 3000);
}
function autoSendBack() {
	bee.UI.hideUI();
	var $reply_page = $("#commentIframe").contents();
	var $btnSet = $reply_page.find("pbutton:not(.pf_small)");
	var index = 0;
	var timerOne = setInterval(function() {
		if(index == PostMisc.sumPosts) {
			clearInterval(timerOne);
			setTimeout(function () {
				bee.UI.showUI();
				bee.UI.showMessage("回传完毕！共回传" + index + "个帖子。");
			}, 3000);
			return;
		}
		sendOne($($btnSet[index++]));
		bee.UI.showMessage("回传中: "+index)
	}, 8000);
}

//小蜜蜂飞走了==================================================================