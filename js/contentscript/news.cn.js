var xinhuanet = {};
//列表界面
var list_sel = "#tab3>tbody>tr";

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
		/http:\/\/forum\.home\.news\.cn(.*)/,
		/http:\/\/forum\.home\.news\.cn\/addnew\.jsp\?(.+)/,
		/http:\/\/forum\.home\.news\.cn\/detail\/(.+)/,
		/http:\/\/forum\.home\.news\.cn\/(list)|(board)\/(.+)/
	];
	state = publicpfinduct.URLState(regArr,currenturl);
	console.log("xinhuanet state:"+state);
	
	if(state==-1){ 
		return;
	}
	
	var userstr=settings.user;
	var user=JSON.parse(userstr);
	
	var pfinducturl = user.pfinducturl;
	var userid = user.userid;
	if(state>0){
		pageInfoData = xinhuanet.getPageInfo();
		//检查界面登录状态
		publicpfinduct.checkPageInfo(pageInfoData);
	}
	//素材注入
	if(state==1||state==2){
		publicpfinduct.insertMaterial(pfinducturl,xinhuanet.pageDeal,xinhuanet.setFormValues);
	}
	
	//回传
	if(state==3||state==2){
		publicpfinduct.sendBack(pfinducturl,userid,pageInfoData,xinhuanet.hc_button,xinhuanet.listValue);
	}
	
	//账号选择
	if(state>=0){
		xinhuanet.fillAccountAndPwd(pfinducturl,currenturl,userid);
	}
		
	
};

/**
 * 选择素材按钮注入
 */
xinhuanet.pageDeal=function(){
	
	if(state==1){
		$("form[name=bbsedit] table:eq(2) table:eq(2) table tr:first td:last").append("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</pbutton>");
	}else if(state==2){
		$("form[name=bbsedit] table:first tr:eq(1) td:last").append("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</pbutton>");
		
	}
	
};

/**
 * 发帖区域赋值
 */
xinhuanet.setFormValues=function(title,content){
	if(state==1){
		$("#title").val(title);
		$("#Editor").contents().find("body textarea[name=message]").val(content);
		setTimeout(function(){$("input[name=Submit]").click();},1000);

	}else if(state==2){
		$("form[name=bbsedit] #title").val(title);
		$("#Editor").contents().find("body textarea[name=message]").val(content);
		setTimeout(function(){$("input[name=Submit]").click();},1000);
	}
};

/**取界面元素  **/
xinhuanet.getPageInfo=function(){
	var frame = $("frame[name='frmmain']");
	var doc = document;
	if(frame.length>0){
		doc = frame[0].contentDocument;
	}
	var displayname = $("table.hd01 tr>td:eq(1)",$(doc))[0].childNodes[0].nodeValue;
	displayname = $.trim(displayname);
	if(displayname=="游客"){
		displayname="";
	}
	accountname = displayname;
	var formnameobj = $("td.dqwz:eq(0)>a:eq(1)",$(doc));
	var forumname = "新华网论坛-"+formnameobj.text();
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
xinhuanet.hc_button=function(page){
	var displayname=page.displayname;
	if(state==3){
		//列表界面回传按钮
		$(list_sel+":gt(0)").each(function(i){
			var username=$(this).find("table td:eq(2) a").text();
			//console.log(username+"~~~"+displayname);
			if(username==displayname){
				$(this).find("table td:eq(1) div.title_limit").append("<pbutton style='margin-left: 5px' class='pf_button pf_orange pf_small' name='btn_up'>回传</pbutton>");
			}
		});
		
		
	}else if(state==2){
		//回帖界面注入
		$("td[id^=mess_]:gt(0)").each(function(i){
			var author_obj = $(this).find("span[id^=author_] a");
			var username = author_obj.text();
			//console.log(username+"~~~"+displayname);
			if(username==displayname){
				$(this).append("<pbutton style='margin-left: 5px' class='pf_button pf_orange pf_small' name='btn_up'>回传</pbutton>");
			}
		});
		
	}
};


/**
 * 列表tr以及处理
 */
xinhuanet.listValue=function(obj){
	var trdata = new Object();
	var title = "";
	var url = "";
	var content = "";
	var posttime = "";
	var resulttype = "";
	
	if(state==3){
		resulttype = 1;
		
		var trobj = obj.parents(list_sel);
		var listobj = obj.prev();
		url = listobj.attr("href");
		url = publicpfinduct.dealWithUrl(url,preforumurl);
		title = listobj.text();
		posttime = trobj.find("table td:eq(2) font").text();
		posttime = publicpfinduct.dealWithTime(posttime);
	}else if(state==2){
		var trobj = obj.parents("table");
		var nexttable = trobj.next();
		content = nexttable.find("div[id^=message]").text();
		url = currenturl;
		posttime = trobj.find("td[id^=mess_] span.ip").text();
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
xinhuanet.fillAccountAndPwd=function(pfinducturl,currenturl,userid){
	$("#userName2,#loginUserName").unbind("click").die("click").live("click",function(){
		var obj = $(this);
		//获取taskid
		publicpfinduct.getCurrentTaskid(pfinducturl,function(taskid){
			account.selectAccount(function(username,password){
//				publicpfinduct.switchCookies(pfinducturl,currenturl,username,password,true);
				var selector = obj.attr("id");
				if(selector=="loginUserName"){
					$("#loginUserName").val(username);
					$("#loginPassWord").val(password);
				}else{
					$("#userName2").val(username);
					$("#passWord2").val(password);
				}
				
			},pfinducturl,currenturl,taskid);
			
		},userid);
	});
	
};
function autologin(username,password){
	
	window.setTimeout(function(){
			$("#loginUserName").val(username);
			$("#loginPassWord").val(password);
			$("input[type=image][name='login']").click();
	},1000);
	
	/*
	$("#loginUserName").val(username);
	$("#loginPassWord").val(password);
	$("input[type=image][name='login']").click();
*/
}