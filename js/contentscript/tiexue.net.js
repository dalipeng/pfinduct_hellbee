var tiexue = {};
//列表界面
var list_sel = "div.contens";
//回复列表
var htlist_sel = "div.postStart";
//获取版块名称
var forum_sel = "ul.nav_left li a";

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
		/http:\/\/bbs\.tiexue\.net(.*)/,
		/http:\/\/bbs\.tiexue\.net\/(AddPost)|(addpost)\.aspx(.*)/,
		/http:\/\/bbs\.tiexue\.net\/post_(.+)\.html/,
		/http:\/\/bbs\.tiexue\.net\/default\.htm\?ListUrl=(.+)/
	];
	state = publicpfinduct.URLState(regArr,currenturl);
	console.log("tiexue state:"+state);
	
	if(state==-1){ 
		return;
	}
	
	var userstr=settings.user;
	var user=JSON.parse(userstr);
	
	var pfinducturl = user.pfinducturl;
	var userid = user.userid;
	if(state>0){
		pageInfoData = tiexue.getPageInfo();
		//检查界面登录状态
		publicpfinduct.checkPageInfo(pageInfoData);
	}
	//素材注入
	if(state==1||state==2){
		publicpfinduct.insertMaterial(pfinducturl,tiexue.pageDeal,tiexue.setFormValues);
	}
	
	//回传(发帖回传无法做)
	if(state==2){
		publicpfinduct.sendBack(pfinducturl,userid,pageInfoData,tiexue.hc_button,tiexue.listValue);
	}
	
	//账号选择
	if(state>=0){
		tiexue.fillAccountAndPwd(pfinducturl,currenturl,userid);
	}
		
};

/**
 * 选择素材按钮注入
 */
tiexue.pageDeal=function(){
	
	if(state==1){
		$("#postform table:eq(1) tr:first td:last #PostSubject").after("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</pbutton>");
	}else if(state==2){
		$("#postform p.replyTit").append("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</pbutton>");
		
	}
	
};

/**
 * 发帖区域赋值
 */
tiexue.setFormValues=function(title,content){
	if(state==1){
		$("#PostSubject").val(title);
		$("#Content").val(content);
		$("#ValidateCode").focus();

	}else if(state==2){
		$("#Content").val(content);
	}
};

/**取界面元素  **/
tiexue.getPageInfo=function(){
	var displayname = "";
	var accountname = "";
	var forumname = "";
	var forumurl = "";
	if(state==1){
		displayname = $("#bbs_author").text();
		var forumnameobj = $("#DisplayPathInfo a:last");
		forumname = "铁血论坛-"+forumnameobj.text();
		forumurl = forumnameobj.attr("href");
		forumurl = publicpfinduct.dealWithUrl(forumurl,preforumurl);
	}if(state==3){
		displayname = $("#myName").text();
		var forumnameobj = $(".positons a:eq(2)");
		forumname = "铁血论坛-"+forumnameobj.text();
		forumurl = forumnameobj.attr("href");
		forumurl = publicpfinduct.dealWithUrl(forumurl,preforumurl);
	}else if(state==2){
		displayname = $("#myName").text();
		var forumnameobj = $(".dir a:eq(2)");
		forumname = "铁血论坛-"+forumnameobj.text();
		forumurl = forumnameobj.attr("href");
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
tiexue.hc_button=function(page){
	var displayname=page.displayname;
	if(state==3){
		//列表界面 回传按钮
		$(list_sel).each(function(i){
			var username=$(this).find("div.cel_03").text();
			//console.log(username+"~~~"+displayname);
			if(username==displayname){
				$(this).find("div.cel_02 ").append("<pbutton style='margin-left: 10px' class='pf_button pf_orange pf_small' name='btn_up'>回传</pbutton>");
			}
		});
		
		
	}else if(state==2){
		//回帖界面注入
		$(htlist_sel).each(function(i){
			var username=$(this).find("li.userName strong a").text();
			//console.log(username+"~~~"+displayname);
			if(username==displayname){
				$(this).find("div.float_L").append("<pbutton style='margin: 5px 55px' class='pf_button pf_orange pf_small' name='btn_up'>回传</pbutton>");
				
			}
		});
		
	}
};


/**
 * 列表tr以及处理
 */
tiexue.listValue=function(obj){
	var trdata = new Object();
	var title = "";
	var url = "";
	var content = "";
	var posttime = "";
	var resulttype = "";
	
	if(state==3){
		resulttype = 1;
		content = "";
		var trobj = obj.parents(list_sel);
		var listobj = trobj.find("td").eq(2).find("a");
		url = listobj.attr("href");
		title = listobj.text();
		posttime = trobj.find("td").eq(4).text();
	}else if(state==2){
		var trobj = obj.parents(htlist_sel);
		var islouzhu = $.contains(trobj[0], $("#postform")[0]);
		if(islouzhu){
			resulttype=1;
			content = trobj.find("#postContent").text();
		}else{
			resulttype = 2;
			content = trobj.find("div.contents div.bbsp2").text();
		}
		url = currenturl;
		
		posttime = trobj.find("div.date").text();
		posttime = $.trim(posttime).replace(/\//g,"-");
		posttime = publicpfinduct.dealWithTime(posttime);
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
tiexue.fillAccountAndPwd=function(pfinducturl,currenturl,userid){
	$("#userName").unbind("click").die("click").live("click",function(){
		var obj = $(this);
		//获取taskid
		publicpfinduct.getCurrentTaskid(pfinducturl,function(taskid){
			account.selectAccount(function(username,password){
//				publicpfinduct.switchCookies(pfinducturl,currenturl,username,password,false);
				$("#userName").val(username);
				$("#passWord").val(password);
			},pfinducturl,currenturl,taskid);
			
		},userid);
	});
	
};

function autologin(username,password){
	$("#userName").val(username);
	$("#passWord").val(password);
	$("input.TxPublic_PostLogin_img:eq(0)").click();
}