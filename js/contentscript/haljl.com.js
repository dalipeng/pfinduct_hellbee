var haljl = {};

var state = -1;
//url前缀
var preforumurl = currenturl.match(/http:\/\/(\w+\.)+(\w+)/g)[0];

var pfinducturl = "";

var pageinit = function(settings){
	/**
	 * 0 :基域名
	 * 1 :发帖界面
	 * 2 :回帖界面
	 * 3 :列表界面
	 */
	var regArr=[
		/http:\/\/www\.haljl\.com.*/,
		/http:\/\/www\.haljl\.com\/((forum.php\?mod=post&action=newthread.+)|(forum-.+))/,
		/http:\/\/www\.haljl\.com\/((forum.php\?mod=viewthread.+)|(thread.+)|(forum\.php\?mod=post&action=reply.+))/,
		/http:\/\/www\.haljl\.com\/forum-.+/
	];
	state = publicpfinduct.URLState(regArr,currenturl);
	console.log("haljl state:"+state);
	
	if(state==-1){ 
		return;
	}
	
	var userstr=settings.user;
	var user=JSON.parse(userstr);
	
	pfinducturl = user.pfinducturl;
	var userid = user.userid;
	if(state>0){
		pageInfoData = haljl.getPageInfo();
		//console.log(pageInfoData);
		//检查界面登录状态
		publicpfinduct.checkPageInfo(pageInfoData);
	}
	//素材注入
	if(state==1||state==2){
		publicpfinduct.insertMaterial(pfinducturl,haljl.pageDeal,haljl.setFormValues);
	}
	console.log(state);
	//回传
	if(state==1||state==2){
		publicpfinduct.sendBack(pfinducturl,userid,pageInfoData,haljl.hc_button,haljl.listValue);
	}
	
	$("#fastpostsubmit").bind("click",function(){
		var interFlag = true;
		var inter = setInterval(function(){
		console.log(pageInfoData);		//回帖界面注入
		var displayname=pageInfoData.displayname;
		if($("#postlist").length>0){
			$("#postlist>div[id^=post]>div").each(function(){
		 
				var username = $(this).find("td.pls div.authi a").text();
				username = $.trim(username);
				console.log(username+"~~~"+displayname);
				if(username==displayname){
					interFlag = false;
					if (!$(this).find("td.plc div.authi pbutton").html()) {
						$(this).find("td.plc div.authi").append("<pbutton  class='pf_button pf_orange pf_small' name='btn_up'>回传</pbutton>");
					}
					
				}
			});
			if (!interFlag) {
				clearInterval(inter);
			}
			
		}},5000);
	});
	/*
	$("#fastpostsubmit").bind("click",function(){
		var interFlag = true;
		var inter = setInterval(function(){
		console.log(pageInfoData);		//回帖界面注入
		var displayname=pageInfoData.displayname;
		if($("#postlist").length>0){
			$("#postlist>div[id^=post]>div").each(function(){
				console.log($(this).html());
				var username = $(this).find("td.pls div.authi a").text();
				username = $.trim(username);
				console.log(username+"~~~"+displayname);
				if(username==displayname){
					interFlag = false;
					if (!$(this).find("td.plc div.authi pbutton").html()) {
						$(this).find("td.plc div.authi").append("<pbutton  class='pf_button pf_orange pf_small' name='btn_up'>回传</pbutton>");
					}
					
				}
			});
			if (!interFlag) {
				clearInterval(inter);
			}
			
		}},5000);
	});
	*/
//	//账号选择
	if(state>=0){
		haljl.fillAccountAndPwd(pfinducturl,currenturl,userid);
	}

};

/**
 * 选择素材按钮注入
 */
haljl.pageDeal=function(){
	
	if(state==1){
		if($("#fastpostform").length>0){
			$("div.pbt",$("#fastpostform")).append("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</pbutton>");
		}
		
		if($("#postform").length>0){
			$("div.pbt",$("#postform")).append("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</pbutton>");
		}
		
		
	}else if(state==2){
		
		if($("#fastpostform").length>0){
			$("div.avatar",$("#fastpostform")).prepend("<pbutton id='material_btn_select' style='margin: 5px 25px;' class=\"pf_button pf_orange pf_small\" >选择素材</pbutton>");
		}
		
		if($("#postform").length>0){
			$("#postbox div.pbt",$("#postform")).append("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</pbutton>");
		}
		
	}
	
};

/**
 * 发帖区域赋值
 */
haljl.setFormValues=function(title,content){
	if(state==1){
		if($("#fastpostform").length>0){
			//原创
			$("#typeid_fast").val(60);
			$("#typeid_fast_ctrl").text("原创");
			$("#subject").val(title);
			$("#fastpostmessage").val(content);
		}
		
		if($("#postform").length>0){
			//原创
			$("#typeid").val(60);
			$("#typeid_ctrl").text("原创");
			$("#subject").val(title);
			$("#e_iframe").contents().find("body").empty().append(content);
		}
		
		
	}else if(state==2){
		if($("#fastpostform").length>0){
			$("#fastpostmessage").val(content);
		}
		
		if($("#postform").length>0){
			$("#e_iframe").contents().find("body").empty().append(content);
		}
		
	}
};

/**取界面元素  **/
haljl.getPageInfo=function(){
	var userObj = $("strong.qq>a");
	if(userObj.length==0){
		userObj = $("strong.vwmy>a");
	}
	var displayname = userObj.text();
	var accountname = "";
	var formnameobj = $("#pt>.z>a:eq(3)");
	var forumname = "海安零距离-"+formnameobj.text();
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
haljl.hc_button=function(page){
	var displayname=page.displayname;
	if(state==1||state==3){
		//列表界面 回传按钮
		if(("#moderate").length>0){
			$("tbody[id^=normalthread_]").each(function(){
				var username = $(this).find("td.by:eq(0)>cite>a").text();
				username = $.trim(username);
				//console.log(username+"~~~"+displayname);
				if(username==displayname){
					$(this).find("th").append("<pbutton class='pf_button pf_orange pf_small' name='btn_up'>回传</pbutton>");
				}
			});
		}
		
		
	}else if(state==2){
		//回帖界面注入
		if($("#postlist").length>0){
			$("#postlist>div[id^=post]").each(function(){
				var username = $(this).find("td.pls div.authi a").text();
				console.log($(this).find("td.pls div.authi a").html());
				username = $.trim(username);
				console.log(username+"~~~"+displayname);
				if(username==displayname){
					$(this).find("td.plc div.authi").append("<pbutton  class='pf_button pf_orange pf_small' name='btn_up'>回传</pbutton>");
				}
			});
		}
		
	}
};


/**
 * 列表tr以及处理
 */
haljl.listValue=function(obj){
	var trdata = new Object();
	var title = "";
	var url = "";
	var content = "";
	var posttime = "";
	var resulttype = "";
	
	if(state==1||state==3){
		resulttype = 1;
		var trobj = obj.parents("tbody");
		var listobj = trobj.find("th>a");
		url = listobj.attr("href");
		url = publicpfinduct.dealWithUrl(url,preforumurl);
		title = listobj.text();
		posttime = trobj.find("td.by>em>span").text();
		posttime = publicpfinduct.dealWithTime(posttime);
		
		
	}else if(state==2){
		title = $("#thread_subject").text();
		var trobj = obj.parents("table");
		var plc = trobj.find("td.plc");
		console.log(plc.find("td.t_f").children()[0]);
		plc.find("td.t_f").children().first().remove();
		content = plc.find("td.t_f").text().trim();
		url = currenturl;
		var louzhu = plc.find("div.pi>strong:contains('楼主')");
		if(louzhu.length>0){
			resulttype = 1;
		}else{
			resulttype = 2;
		}
		posttime = plc.find("em[id^=authorposton]").text();
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
haljl.fillAccountAndPwd=function(pfinducturl,currenturl,userid){
	$("#ls_username").unbind("click").die("click").live("click",function(){
		var obj = $(this);
		//获取taskid
		publicpfinduct.getCurrentTaskid(pfinducturl,function(taskid){
			account.selectAccount(function(username,password){
				$("#ls_username").val(username);
				$("#ls_password").val(password);
				$("button[type='submit'].pn.vm").click();
			},pfinducturl,currenturl,taskid);
			
		},userid);
	});
};
