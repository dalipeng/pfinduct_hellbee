var we54 = {};
//列表界面
var list_sel = "tbody[id^=normalthread_]";
//回复列表
var htlist_sel = "div[id^=post_].kaiser_pl";

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
		/http:\/\/bbs\.we54\.com(.*)/,
		/http:\/\/bbs\.we54\.com\/forum\.php\?mod=post&action=newthread&fid=(\d+)/,
		/http:\/\/bbs\.we54\.com\/thread(.+)\.html/,
		/http:\/\/bbs\.we54\.com\/forum(.+)\.html/
	];
	state = publicpfinduct.URLState(regArr,currenturl);
	console.log("we54 state:"+state);
	
	if(state==-1){ 
		return;
	}
	if(state>0){
		pageInfoData = we54.getPageInfo();
		//检查界面登录状态
		publicpfinduct.checkPageInfo(pageInfoData);
	}

	var userstr=settings.user;
	var user=JSON.parse(userstr);
	
	var pfinducturl = user.pfinducturl;
	var userid = user.userid;
	
	//素材注入
	if(state==1||state==2){
		publicpfinduct.insertMaterial(pfinducturl,we54.pageDeal,we54.setFormValues);
	}
	
	//回传
	if(state==3||state==2){
		publicpfinduct.sendBack(pfinducturl,userid,pageInfoData,we54.hc_button,we54.listValue);
	}
	
	//账号选择
	if(state>=0){
		we54.fillAccountAndPwd(pfinducturl,currenturl,userid);
	}
	
};

/**
 * 选择素材按钮注入
 */
we54.pageDeal=function(){
	if(state==1){
		$("#postbox .pbt").append("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</pbutton>");
	}else if(state==2){
		$("#fastpostform .pls").append("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" style='margin-left:38px;margin-top:8px' >选择素材</pbutton>");
		
	}
	
};

/**
 * 发帖区域赋值
 */
we54.setFormValues=function(title,content){
	if(state==1){
		$("#subject").val(title);
		$("#e_iframe").contents().find("body").empty().append(content);
		$("input[name=seccodeverify]").click().focus();

	}else if(state==2){
		$("#fastpostmessage").val(content);
		$("input[name=seccodeverify]").click().focus();
		
	}
};

/**取界面元素  **/
we54.getPageInfo=function(){
	var displayname = "";
	var userid = "";
	var accountname = "";
	var forumname = "";
	var forumurl = "";
	var userobj = $("#um strong.vwmy a");
	if(userobj.length>0){
		displayname = userobj.text();
		var userhref = userobj.attr("href");
		userid = userhref.replace(/.*\&uid=(\d*)$/, "$1");
	}
	
	var formnameobj = $("div.kaiser_bm div.z a:eq(2)");
	if(formnameobj.length>0){
		forumname = "新青年社区-"+formnameobj.text();
		forumurl = formnameobj.attr("href");
		forumurl = publicpfinduct.dealWithUrl(forumurl,preforumurl);
	}
	
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
 */
we54.hc_button=function(page){
	var userid=page.userid;
	if(state==3){
		//列表界面 回传按钮
		$(list_sel).each(function(i){
			var userobj=$(this).find("tr td:eq(1) cite>a");
			if(userobj.size()==0){
				return true;//continue
			}
			var userhref = userobj.attr("href");
			var thisuserid = userhref.replace(/(.*)\&uid=(\d*)/, "$2");
			//console.log(thisuserid+"~~~"+userid);
			if(thisuserid==userid){
				$(this).find("th").append("<pbutton style='margin-left: 10px' class='pf_button pf_orange pf_small' name='btn_up'>回传</pbutton>");
			}
		});
		
		
	}else if(state==2){
		//回帖界面注入
		$(htlist_sel).each(function(i){
			var userobj = $(this).find("td.kaiser_pls_other_line div.authi a");
			if(userobj.size()==0){
				return true;//continue
			}
			var userhref = userobj.attr("href");
			var thisuserid = userhref.replace(/(.*)\&uid=(\d*)/, "$2");
			//console.log(thisuserid+"~~~"+userid);
			if(thisuserid==userid){
				$(this).find("td.kaiser_pls_other_line").append("<pbutton style='margin: 5px 45px' class='pf_button pf_orange pf_small' name='btn_up'>回传</pbutton>");
				
			}
		});
		
	}
};


/**
 * 列表tr以及处理
 */
we54.listValue=function(obj){
	var trdata = new Object();
	var title = "";
	var url = "";
	var content = "";
	var posttime = "";
	var resulttype = "";
	
	if(state==3){
		resulttype = 1;
		var trobj = obj.parents(list_sel);
		console.log(trobj);
		var listobj = trobj.find("th>a:eq(0)");
		url = listobj.attr("href");
		url = publicpfinduct.dealWithUrl(url,preforumurl);
		title = listobj.text();
		
	}else if(state==2){
		var trobj = obj.parents(htlist_sel);
		content = trobj.find("td.kaiser_plc_other_line td[id^=postmessage_]").text();
		url = currenturl;
		posttime=trobj.find("em[id^=authorposton]").text();
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
we54.fillAccountAndPwd=function(pfinducturl,currenturl,userid){
	$("input[name=username]").unbind("click").die("click").live("click",function(){
		var obj = $(this);
		//获取taskid
		publicpfinduct.getCurrentTaskid(pfinducturl,function(taskid){
			account.selectAccount(function(username,password){
//				publicpfinduct.switchCookies(pfinducturl,currenturl,username,password,false);
				$("input[name=username]").val(username);
				$("input[name=password]").val(password);
			},pfinducturl,currenturl,taskid);
		},userid);
	});
	
};

function autologin(username,password){
	$("input[name=username]").val(username);
	$("input[name=password]").val(password);
	$("button[name=loginsubmit]").click();
}