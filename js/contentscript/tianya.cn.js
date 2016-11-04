var tianya = {};
//列表界面
var list_sel = "table.tab-bbs-list tr";
//回复列表
var htlist_sel = "div.atl-item";

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
		/http:\/\/(.*)\.tianya\.cn(.*)/,
		/http:\/\/bbs\.tianya\.cn\/compose\.jsp(.*)/,
		/http:\/\/bbs\.tianya\.cn\/post-(.+)\.shtml/,
		/http:\/\/bbs\.tianya\.cn\/(list-(.+)\.shtml)|(list\.jsp\?item=(.+)).+/
	];
	var url = window.location.href;
	state = publicpfinduct.URLState(regArr,url);
	console.log("tianya state:"+state);
	
	if(state==-1){ 
		return;
	}
	
	var userstr=settings.user;
	var user=JSON.parse(userstr);
	
	var pfinducturl = user.pfinducturl;
	var userid = user.userid;
	if(state>0){
		pageInfoData = tianya.getPageInfo();
		//检查界面登录状态
		publicpfinduct.checkPageInfo(pageInfoData);
	}
	//素材注入
	if(state==1||state==2){
		publicpfinduct.insertMaterial(pfinducturl,tianya.pageDeal,tianya.setFormValues);
	}
	
	//回传
	if(state==3||state==2){
		publicpfinduct.sendBack(pfinducturl,userid,pageInfoData,tianya.hc_button,tianya.listValue);
	}
	
	//账号选择
	if(state>=0){
		tianya.fillAccountAndPwd(pfinducturl,currenturl,userid);
	}
		
};

/**
 * 选择素材按钮注入
 */
tianya.pageDeal=function(){
	
	if(state==1){
		$("input.bbsTitle").css({width:"65%"});
		$(".fatieArea tr:eq(0) td:eq(1)").append("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</pbutton>");
	}else if(state==2){
		$("#editorToolBar").append("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</pbutton>");
		
	}
	
};

/**
 * 发帖区域赋值
 */
tianya.setFormValues=function(title,content){
	if(state==1){
		$("input.bbsTitle").val(title);
		$("#textAreaContainer").val(content);
		$("input:radio[name=isSelf][value=1]").attr("checked","checked");
		$('.common-submitBtn').click(function(){
			setTimeout(function(){
					if($('#validateCode').length>0){
						$('#validateCode').focus();
					}else{
					}
			},1000);
		});
		$('input.common-submitBtn').click();

	}else if(state==2){
		$("#textAreaContainer").val(content);
		$('.common-submitBtn').click(function(){
			setTimeout(function(){
					if($('#validateCode').length>0){
						$('#validateCode').focus();
					}else{
					}
			},1000);
		});
		$('input.common-submitBtn').click();
	}
};

/**取界面元素  **/
tianya.getPageInfo=function(){
	var displayname = "";
	var accountname = "";
	var forumname = "";
	var forumurl = "";
	if(state==1){
		displayname = $(".top-nav-menu-list .top-nav-menu-li:eq(2) a").text();
		accountname = displayname;
		var forumnameobj = $("#main .location div>a");
		forumname = forumnameobj.text();
		forumurl = forumnameobj.attr("href");
		forumurl = publicpfinduct.dealWithUrl(forumurl,preforumurl);
	}else if(state==2){
		displayname = $(".top-nav-menu-list .top-nav-menu-li:eq(2) a").text();
		accountname = displayname;
		var forumnameobj = $(".atl-location a:eq(1)");
		forumname = "天涯社区-"+forumnameobj.text();
		forumurl = forumnameobj.attr("href");
		forumurl = publicpfinduct.dealWithUrl(forumurl,preforumurl);
	}else if(state==3){
		displayname = $(".top-nav-menu-list .top-nav-menu-li:eq(2) a").text();
		accountname = displayname;
		var name = $("div.location div:first>strong").text();
		forumname = "天涯社区-" + name;
		forumurl = $("ul.nav_child li a.child_link:contains('"+name+"')").attr("href");
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
tianya.hc_button=function(page){
	var displayname=page.displayname;
	if(state==3){
		//列表界面 回传按钮
		$(list_sel).each(function(i){
			var username=$(this).find("td:eq(1)").text();
			//console.log(username+"~~~"+displayname);
			if(username==displayname){
				$(this).find("td:eq(0)").append("<pbutton style='margin-left: 10px' class='pf_button pf_orange pf_small' name='btn_up'>回传</pbutton>");
			}
		});
		
		
	}else if(state==2){
		//回帖界面注入
		$(htlist_sel).each(function(i){
			var author_obj = $(this).find("div.atl-head div.atl-info a");
			var username = author_obj.text();
			//console.log(username+"~~~"+displayname);
			if(username==displayname){
				$(this).find(".atl-head .atl-info").append("<pbutton style='' class='pf_button pf_orange pf_small' name='btn_up'>回传</pbutton>");
				
			}
		});
		
	}
};


/**
 * 列表tr以及处理
 */
tianya.listValue=function(obj){
	var trdata = new Object();
	var title = "";
	var url = "";
	var content = "";
	var posttime = "";
	var resulttype = "";
	
	if(state==3){
		resulttype = 1;
		var trobj = obj.parents(list_sel);
		var listobj = trobj.find("td:eq(0) a");
		url = listobj.attr("href");
		url = publicpfinduct.dealWithUrl(url,preforumurl);
		title = listobj.text();
	}else if(state==2){
		var trobj = obj.parents(htlist_sel);
		content = trobj.find("div.atl-content div.bbs-content").text();
		url = currenturl;
		
		posttime = trobj.find(".atl-info>span:eq(1)").text();
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
tianya.fillAccountAndPwd=function(pfinducturl,currenturl,userid){
	$("input[name=vwriter]").unbind("click").die("click").live("click",function(){
		var obj = $(this);
		//获取taskid
		publicpfinduct.getCurrentTaskid(pfinducturl,function(taskid){
			account.selectAccount(function(username,password){
//				publicpfinduct.switchCookies(pfinducturl,currenturl,username,password,true);
				$("input[name=vwriter]").val(username);
				$("input[name=vpassword]").val(password);
			},pfinducturl,currenturl,taskid);
			
		},userid);
	});
};

function autologin(username,password){
	$("input[type='text']").val(username);
	$("input[type='password']").val(password);
	
//	$("#text1").val(username);
//	$("#password").val(password);
//	$("input[type=submit]").click();
	$("#button1").click();
}
