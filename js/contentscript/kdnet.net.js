var kdnet = {};
//列表界面
var list_sel = "tr[name^=showreply]";
//回复列表
var htlist_sel = "div.reply-box";

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
		/http:\/\/(.*)\.kdnet\.net(.*)/,
		/http:\/\/upfile\d\.kdnet\.net\/textareaeditor\/post_ubb\.asp\?action=new\&boardid=(.+)/,
		/http:\/\/club\.kdnet\.net\/dispbbs\.asp\?(.+)/,
		/http:\/\/club\.kdnet\.net\/list\.asp\?boardid=(\d+)/
	];
	var url = window.location.href;
	state = publicpfinduct.URLState(regArr,url);
	console.log("kdnet state:"+state);
	
	if(state==-1){ 
		return;
	}
	var userstr=settings.user;
	var user=JSON.parse(userstr);
	
	var pfinducturl = user.pfinducturl;
	var userid = user.userid;
	if(state>0){
		pageInfoData = kdnet.getPageInfo();
		//检查界面登录状态
		publicpfinduct.checkPageInfo(pageInfoData);
	}
	//素材注入
	if(state==1||state==2){
		publicpfinduct.insertMaterial(pfinducturl,kdnet.pageDeal,kdnet.setFormValues);
	}
	
	//回传
	if(state==3||state==2){
		publicpfinduct.sendBack(pfinducturl,userid,pageInfoData,kdnet.hc_button,kdnet.listValue);
	}
	
	//账号选择
	if(state>=0){
		kdnet.fillAccountAndPwd(pfinducturl,currenturl,userid);
	}
	
	//if(state==2){
	//	$("body").append("<script>setTimeout(function(){var obj = document.getElementById('baidu').contentWindow;console.log(obj);alert(obj.getElementById('username').value)},1000);</script>");
	//}
	
};

/**
 * 选择素材按钮注入
 */
kdnet.pageDeal=function(){
	if(state==1){
		$("div.publishreply-title>div").append("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</pbutton>");
	}else if(state==2){
		//$(".title").append("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</pbutton>");
		//$(".content02").insertBefore(".content01");
		
	}
	
};

/**
 * 发帖区域赋值
 */
kdnet.setFormValues=function(title,content){
	if(state==1){
		$("#topic").val(title);
		$("#body").val(content);
		$("#font1").val("[原创]");
		setTimeout(function(){$('#lf-btn-push a').click();},1000);

	}else if(state==2){
		//$("#baidu").contents().find("#body").val(content);
	}
};

/**取界面元素  **/
kdnet.getPageInfo=function(){
	var displayname = "";
	var accountname = "";
	var forumname = "";
	var forumurl = "";
	if(state==1){
		displayname = $("#username").val()||"";
	}else{
		var userObj = $("div.info_r div.userid a");
		displayname = userObj.text();
		accountname = displayname;
		var formnameobj = $("div.club-location div:eq(6) a");
		forumname = "凯迪社区-"+formnameobj.text();
		forumurl = formnameobj.attr("href");
		forumurl = publicpfinduct.dealWithUrl(forumurl,preforumurl);
	}
	
	var obj = new Object();
	obj.displayname=displayname;
	obj.accountname=accountname;
	obj.forumname=forumname;
	obj.forumurl=forumurl;
	return obj;
};

/**
 * 回传按钮注入
 */
kdnet.hc_button=function(page){
	var displayname=page.displayname;
	if(state==3){
		//列表界面 回传按钮
		$(list_sel).each(function(i){
			var username=$(this).find("td.author a").text();
			//console.log(username+"~~~"+displayname);
			if(username==displayname){
				$(this).find("td.subject").append("<pbutton style='margin-left: 10px' class='pf_button pf_orange pf_small' name='btn_up'>回传</pbutton>");
			}
		});
		
		
	}else if(state==2){
		//回帖界面注入
		$(htlist_sel).each(function(i){
			var author_obj = $(this).find("div.name span.name a");
			var username = author_obj.text();
			//console.log(username+"~~~"+displayname);
			if(username==displayname){
				$(this).find(".posted-box .posted-info").after("<pbutton style='margin-top: 5px' class='pf_button pf_orange pf_small' name='btn_up'>回传</pbutton>");
				
			}
		});
		
	}
};


/**
 * 列表tr以及处理
 */
kdnet.listValue=function(obj){
	var trdata = new Object();
	var title = "";
	var url = "";
	var content = "";
	var posttime = "";
	var resulttype = "";
	
	if(state==3){
		resulttype = 1;
		var trobj = obj.parents(list_sel);
		var listobj = trobj.find("td.subject span:first a");
		url = listobj.attr("href");
		url = publicpfinduct.dealWithUrl(url,preforumurl);
		title = listobj.text();
		posttime = trobj.find("td:eq(4)").text().split("|")[0];
		posttime = publicpfinduct.dealWithTime(posttime);
	}else if(state==2){
		var trobj = obj.parents(htlist_sel);
		content = trobj.find(".replycont-box div.replycont-box-r").text();
		url = currenturl;
		var tail_area = trobj.find(".posted-box .posted-info");
		posttime = tail_area.text().split("|")[3];
		posttime = posttime.replace(/\//g,"-");
		posttime = publicpfinduct.dealWithTime(posttime);
		resulttype = 2;
	}
	trdata.title = title;
	trdata.url = url;
	trdata.content = content;
	trdata.posttime = posttime;
	trdata.resulttype = resulttype;
	return trdata;
};

/**
 * 选择填充账号
 */
kdnet.fillAccountAndPwd=function(pfinducturl,currenturl,userid){
	$("#username").unbind("click").die("click").live("click",function(){
		//获取taskid
		publicpfinduct.getCurrentTaskid(pfinducturl,function(taskid){
			account.selectAccount(function(username,password){
				$("#username").val(username);
				$("#password").val(password);
				
			},pfinducturl,currenturl,taskid);
			
		},userid);
	});
	
};

//http://user.kdnet.net/login_new.asp
function autologin(username,password){
	$("#username").val(username);
	$("#password").val(password);
	$("#codestr").focus();
}