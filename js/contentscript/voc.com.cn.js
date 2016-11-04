var voc = {};
//列表界面
var list_sel = "table.tbfl tr[align=middle]";
//回复列表
var htlist_sel = "div[id^=post_]";

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
		/http:\/\/bbs\.voc\.com\.cn(.*)/,
		/http:\/\/bbs\.voc\.com\.cn\/post\.php\?action=newthread(.+)/,
		/http:\/\/bbs\.voc\.com\.cn\/(topic(.+)\.html)|(viewthread\.php\?(.+))/,
		/http:\/\/bbs\.voc\.com\.cn\/forum(.+)\.html/
	];
	var url = window.location.href;
	state = publicpfinduct.URLState(regArr,url);
	console.log("voc state:"+state);
	
	if(state==-1){ 
		return;
	}
	
	var userstr=settings.user;
	var user=JSON.parse(userstr);
	
	var pfinducturl = user.pfinducturl;
	var userid = user.userid;
	if(state>0){
		pageInfoData = voc.getPageInfo();
		//检查界面登录状态
		publicpfinduct.checkPageInfo(pageInfoData);
	}
	//素材注入
	if(state==1||state==2){
		publicpfinduct.insertMaterial(pfinducturl,voc.pageDeal,voc.setFormValues);
	}
	//回传
	if(state==3||state==2){
		publicpfinduct.sendBack(pfinducturl,userid,pageInfoData,voc.hc_button,voc.listValue);
	}
	
	//账号选择
	if(state>=0){
		voc.fillAccountAndPwd(pfinducturl,currenturl,userid);
	}
		
};

/**
 * 选择素材按钮注入
 */
voc.pageDeal=function(){
	
	if(state==1){
		$("#postform table tr td.altbg2:first").append("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</pbutton>");
	}else if(state==2){
		$("#postform table tr td.altbg2:first").append("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</pbutton>");
		//$(".content02").insertBefore(".content01");
		
	}
	
};

/**
 * 发帖区域赋值
 */
voc.setFormValues=function(title,content){
	if(state==1){
		$("#subject").val(title);
		$("#posteditor_textarea").val(content);
		$('#postsubmit').click();

	}else if(state==2){
		$("#posteditor_textarea").val(content);
		$('#postsubmit').click();
	}
};

/**取界面元素  **/
voc.getPageInfo=function(){
	var displayname = $.trim($("#userinfo").text());
	var accountname=displayname;
	var formnameobj = $("div.nav a:eq(2)");
	if(formnameobj.length==0){
		formnameobj =  $("div.nav a:last");
	}
	var forumname = "华声论坛-"+formnameobj.text();
	var forumurl = formnameobj.attr("href");
	forumurl = publicpfinduct.dealWithUrl(forumurl,preforumurl);
	
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
voc.hc_button=function(page){
	var displayname=page.displayname;
	if(state==3){
		//列表界面回传按钮
		$(list_sel).each(function(i){
			var username=$(this).find("td:eq(3) a").text();
			//console.log(username+"~~~"+displayname);
			if(username==displayname){
				$(this).find("td:eq(2)").append("<pbutton style='margin-left: 10px' class='pf_button pf_orange pf_small' name='btn_up'>回传</pbutton>");
			}
		});
	}else if(state==2){
		//回帖界面注入
		$(htlist_sel).each(function(i){
			var username = $(this).find("td.t_user>div>div:eq(0)>div>a").text();
			username = username.replace(/\r|\n|\t/g,"");
			//console.log(username+"~~~"+displayname);
			if(username==displayname){
				$(this).find("td.t_user>div").append("<pbutton style='margin: 5px 35px' class='pf_button pf_orange pf_small' name='btn_up'>回传</pbutton>");
				
			}
		});
		
	}
};


/**
 * 列表tr以及处理
 */
voc.listValue=function(obj){
	var trdata = new Object();
	var title = "";
	var url = "";
	var content = "";
	var posttime = "";
	var resulttype = "";
	
	if(state==3){
		resulttype = 1;
		
		var trobj = obj.parents(list_sel);
		var listobj = trobj.find("td:eq(2) a");
		url = listobj.attr("href");
		url = publicpfinduct.dealWithUrl(url,preforumurl);
		title = listobj.text();
		//处理
	}else if(state==2){
		var trobj = obj.parents(htlist_sel);
		content = trobj.find("td:eq(1) div[id^=message]").text();
		url = currenturl;
		
		posttime = trobj.find("div[name=content-info]").text();
		posttime = publicpfinduct.dealWithTime(posttime);
		//处理
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
voc.fillAccountAndPwd=function(pfinducturl,currenturl,userid){
	$("input[name=username]").unbind("click").die("click").live("click",function(){
		var obj = $(this);
		//获取taskid
		publicpfinduct.getCurrentTaskid(pfinducturl,function(taskid){
			account.selectAccount(function(username,password){
				$("input[name=username]").val(username);
				$("input[name=password]").val(password);
				
			},pfinducturl,currenturl,taskid);
			
		},userid);
	});
	
};

function autologin(username,password){
	$("input[name=username]").val(username);
	$("input[name=password]").val(password);
	$("input[name=loginsubmit]").click();
}