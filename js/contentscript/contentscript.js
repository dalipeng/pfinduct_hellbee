var referurl = document.referrer;
console.log("referurl:"+referurl);
var currenturl = window.location.href;
var pageInfoData = {};//界面元素
var weblogin = false;//界面登录状态
var cookielogin = false;//cookie登录状态
var userid = null;

//访问记录入库
//chrome.extension.sendMessage({method:"saveToDB",key:currenturl},function(){});
$(function(){

	
	
	publicpfinduct.getLocalStorage(function(settings){
		if(!settings){
			return;
		}
		var userstr=settings.user;
//		var taskstr = settings.task;
		
		if(!userstr){
			console.log("客户端尚未登录！");
			return;
		}
		var user=JSON.parse(userstr);
		userid = user.userid;
		var authkey = user.authkey;
		if(authkey==""){
			console.log("客户端尚未登录！");
			return;
		}
		
		var pfinducturl = user.pfinducturl;
		//判断pfinducturl是否能访问(考虑调整访问策略，考虑从后台获取)
		canConnect=publicpfinduct.testURL(pfinducturl);
		console.log("canConnect:"+canConnect);
		if(!canConnect){
			return;
		}
		
//		var daokongurl = pfinducturl.match(/http:\/\/(\w+\.)+(\w+)/g)[0];
//		//导控系统的界面部不需要注入(已在manifest中配置)
//		if(currenturl.startWith(daokongurl)){
//			return;
//		}
		//toolbar注入
		publicpfinduct.initToolBar(pfinducturl,userid);
		//注入账号和内容
		publicpfinduct.initInsertAccountAndContent();
		//样式
		publicpfinduct.insertCss(pfinducturl);
		//保存素材
		publicpfinduct.materialSelect(pfinducturl);
		//姐妹(bee:界面)初始化
		if(typeof pageinit=='function'){
			
			pageinit(settings);
		
		}
		
		if (typeof pageinit2 == 'function') {
			
			pageinit2(settings);
		}
		
	});
});
