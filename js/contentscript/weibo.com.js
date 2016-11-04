var weibo = {};
//发帖区域
var fatie_sel="#tb_rich_poster_container";
//附加选择素材区域
var material_sel = ".poster_head";
//发帖区域标题
var title_sel = "#tb_rich_poster_container .editor_title";
//发帖区域内容
var content_sel = "#tb_rich_poster_container #ueditor_replace";
//昵称
var displayname_sel=".gn_name .S_txt1";
//列表界面
var list_sel = "div.WB_detail";
//回复列表
var htlist_sel = "div.WB_detail";
//回帖标题
var ht_title_sel = "div.left_section h1.thread_title_txt";
//获取版块名称
var forum_sel = "#j_core_title_wrap .core_title h1";

var state = -1;
//url前缀
var preforumurl = currenturl.match(/http:\/\/(\w+\.)+(\w+)/g)[0];

var pageinit = function(settings){
	/**
	 * 0 :基域名
	 * 1 :发帖界面
	 * 2 :回帖界面
	 * 3 :列表界面
	 */
	var regArr=[
		/http:\/\/weibo\.com\/(.*)/,
		/http:\/\/weibo\.com\/u\/(.*)/,
		/http:\/\/weibo\.com\/p\/(.*)/,
		/http:\/\/weibo\.com\/\d+\/(.*)/, //个人主页
		
	];
	var url = window.location.href;
	state = publicpfinduct.URLState(regArr,url);
	console.log("weibo.com state:"+state);
	
	
	if(state==-1){
		return;
	}

	
	var userstr=settings.user;
	var user=JSON.parse(userstr);
	
	var pfinducturl = user.pfinducturl;
	var userid = user.userid;
	if(state>0){
		pageInfoData = weibo.getPageInfo();
		//检查界面登录状态
		publicpfinduct.checkPageInfo(pageInfoData);
		//素材注入(1,2,3都需要注入)
	}
	
	/*
	if(state==1||state==2||state==3){
		publicpfinduct.insertMaterial(pfinducturl,weibo.pageDeal,weibo.setFormValues);
	}
	*/
	//回传
	if(state==1 || state==2 || state ==3){
		setTimeout(function(){
			publicpfinduct.sendBack(pfinducturl,userid,pageInfoData,weibo.hc_button,weibo.listValue);
		},500);
		
	}
	
 
 


	
	//weibo.mutitask(pfinducturl,settings);
	
	
};

weibo.pageDeal=function(){
	//位置翻转
	$(fatie_sel).insertAfter("#head");
	if(state==1||state==3){
		$(material_sel).html("<div class='editor_title_txt' style='float: left;'>发表新贴</div><span id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</span>");
	}else if(state==2){
		$(material_sel).html("<div class='editor_title_txt' style='float: left;'>发表回复</div><span id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</span>");
		$(fatie_sel).removeClass("editor_theme_2");
		$(fatie_sel).addClass("search_theme_2");
	}
	
};

weibo.setFormValues=function(title,content){
	$(title_sel).val(title);
	$(content_sel).text(content);
	$(content_sel).focus();
	setTimeout(function(){
		$(".c_captcha_input_normal").focus();
		},1000);
};

/**取界面元素  **/
weibo.getPageInfo=function(){
	var displayname = $(displayname_sel).text();
	var accountname = "";
 
	var forumname = "新浪微博";
	var forumurl = window.location.href.url;
	var obj = new Object();
	obj.displayname=displayname;
	obj.accountname=accountname;
	obj.forumname=forumname;
	obj.forumurl=forumurl;
	
	return obj;
};

/**
 * 
 */
weibo.hc_button=function(page){

	var displayname=page.displayname;
	console.log(displayname);
	if(state==1 || state == 2 || state == 3){
		//微博界面回传按钮
		$(list_sel).each(function(i){
			var username=$(this).find("div.WB_info").eq(0).text().trim();
			 console.log($(this).find(".WB_text"));
//			if(username==displayname){
//				$(this).find("div.WB_info").append("<pbutton style='margin-left: 10px' class='pf_button pf_orange pf_small' name='btn_up'>回传</span>");
				$(this).find(".WB_text").append("<pbutton style='margin-left: 10px' class='pf_button pf_orange pf_small' name='btn_up'>回传</span>");
//			}
		});
 
	} 
};

/**
 * 列表tr以及处理
 */
weibo.listValue=function(obj){
	var trdata = new Object();
	var title = "";
	var url = "";
	var content = "";
	var posttime = "";
	var resulttype = "";
	
    if(state == 1){
		resulttype = 2;
		var trobj = obj.parents(htlist_sel);
		content = trobj.find("div.WB_text").text();
		var timeobj = trobj.find("a.WB_time"); 
		
		var time = new Date(timeobj.attr("date"));
		posttime = time.getFullYear() + "-" + (time.getMonth() - 0  + 1 ) + "-" + time.getDate() + "  " + time.getHours() + ":" +  time.getMinutes();
		posttime = publicpfinduct.dealWithTime(posttime);
		
		url = "http://weibo.com/u"+timeobj.attr("href");
		
		
		if (!!content) title = content.substring(0,40) + "...";
		
	}
	if (state == 3) {
		resulttype = 2;
		var trobj = obj.parents(htlist_sel);
		content = $.trim(trobj.find("div.WB_text").text()).replace(/\n/gi,"");
		var timeobj = trobj.find("a.WB_time"); 
		
		var time = new Date(timeobj.attr("date"));
		posttime = time.getFullYear() + "-" + (time.getMonth() - 0  + 1 ) + "-" + time.getDate() + "  " + time.getHours() + ":" +  time.getMinutes();
		posttime = publicpfinduct.dealWithTime(posttime);
		
		url = "http://weibo.com/u"+timeobj.attr("href");
	//	url = window.location.href;
		
		if (!!content) title = content.substring(0,40) + "...";
	}
	trdata.title = title;
	trdata.url = url;
	trdata.content = content;
	trdata.posttime = posttime;
	trdata.resulttype = resulttype;
	return trdata;
};

 