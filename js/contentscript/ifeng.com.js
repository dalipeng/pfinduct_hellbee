var ifeng = {};
//列表界面
var list_sel = "table.postTable tr";
//回复列表
var htlist_sel = ".left_reply";
//
var displayname_sel = ".w-username";

var ding_sel = ".w-bottomBar .w-reply";


var state = -1;

//url前缀
var preforumurl = currenturl.match(/http:\/\/(\w+\.)+(\w+)/g)[0];
 
//重写界面的alert方法  
publicpfinduct.executeScript("function alert(mess){ console.log(mess); }");

var pageinit = function(settings){
	/**
	 * 0 :基域名
	 * 1 :发帖界面
	 * 2 :回帖界面
	 * 3 :列表界面
	 */
	var regArr=[
		/http:\/\/bbs(.*)\.ifeng\.com(.*)/,
		/http:\/\/bbs(.*)\.ifeng\.com\/post\.php\?action=newthread(.+)/,
		/http:\/\/bbs(.*)\.ifeng\.com\/viewthread\.php\?tid=(\d+)/,
		/http:\/\/bbs(.*)\.ifeng\.com\/forumdisplay\.php\?fid=(\d+)/,
		/http:\/\/gentie\.ifeng\.com\/(.*)/, 
		/http:\/\/news\.ifeng\.com\/a\/\d+\/\d+_\d+\.shtml/   //新闻界面
	];
	state = publicpfinduct.URLState(regArr,currenturl);
	console.log("ifeng state:"+state);
	
	if(state==-1){ 
		return;
	}
	
	var userstr=settings.user;
	var user=JSON.parse(userstr);
	
	var pfinducturl = user.pfinducturl;
	var userid = user.userid;
	var url = window.location.href;
	if(state>0){
		pageInfoData = ifeng.getPageInfo();
		//检查界面登录状态
		publicpfinduct.checkPageInfo(pageInfoData);
	}
	//素材注入
	if(state==1||state==2 || state == 5  || state == 4){
		publicpfinduct.insertMaterial(pfinducturl,ifeng.pageDeal,ifeng.setFormValues);
	}
			
	//回传
	if(state==3||state==2 || state == 4 || state == 5 ){
		publicpfinduct.sendBack(pfinducturl,userid,pageInfoData,ifeng.hc_button,ifeng.listValue);
	}

		
	//账号选择
	if(state>=0){
		ifeng.fillAccountAndPwd(pfinducturl,currenturl,userid);
	}
	if (state == 4) {
		$(".mod-commentHeader").next().children(".ad_01").remove();
		$(".mod-commentTextarea").first().remove();
		$("#commentHotDiv").css({"height":"500px","overflow-y":"auto"});
		ifeng.ding(url);

		
		
	}
	if (state == 5) {
 
		
		
	}
};


ifeng.pageDeal=function(){
 
	if(state==1){
		$("#newpost").find("tbody:first tr:contains('标题') td").append("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</pbutton>");
	}else if(state==2){
		$("#postform").find("table tr td:first").append("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" style=\"margin-left: 15px;\" >选择素材</pbutton>");
	}else if (state == 5 || state == 4) {
		$(".mod-commentTextareaTitle").prepend("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" style=\"margin-left: 15px;\" >选择素材</pbutton>");
		
		
		
	}
	
};

ifeng.setFormValues=function(title,content){

	if(state==1){
		$("#subject").val(title);
		$("#posteditor_iframe").contents().find("body").empty().append(content);
		$("input[name=newseccode]").focus();

	}else if(state==2){
		$("#fastpostmessage").val(content);
		$("input[name=newseccode]").focus();
	}else if (state == 5 || state == 4){
		$("#defaultCommentText1").val(content);	
		$("#defaultCommentText2").val(content);
	}
};

/**取界面元素  **/
ifeng.getPageInfo=function(){
	var displayname="";
	var accountname="";
	var forumname="";
	var forumurl="";
	var userid="";
	if(state==1){
		displayname = $("#userX a:first").text();
		forumname = $("#nav a:eq(1)").text();
	}else if(state==2){
		var nav = $("div.tool02");
		var forumobj = nav.find(".frameswitch a:eq(2)");
		forumurl = forumobj.attr("href");
		forumurl = publicpfinduct.dealWithUrl(forumurl,preforumurl);
		forumname = "凤凰论坛-"+forumobj.text();
		var userobj = nav.find("ul li.cDGray a");
		if(userobj.length>0){
			displayname = userobj.text();
			var userhref = userobj.attr("href");
			userid = userhref.replace(/(.*)\&uid=(\d*)/, "$2");
		}
		
	}else if(state==3){
		var nav = $("#userX");
		var forumobj = nav.find(".frameswitch a:eq(2)");
		forumurl = forumobj.attr("href");
		forumurl = publicpfinduct.dealWithUrl(forumurl,preforumurl);
		var forumstr = forumobj.text();
		forumname = "凤凰论坛-"+forumstr.substr(3);
		var userobj = nav.find("ul li:first a");
		displayname = userobj.text();
		var userhref = userobj.attr("href");
		userid = userhref.replace(/(.*)\&uid=(\d*)/, "$2");
	}else if (state == 4 ){
		displayname = $(".w-name:first").text();
		forumname = "凤凰新闻";
		forumurl = window.location.href;
		
	}else if (state ==5){
		displayname = $(".user").text();
		forumname = "凤凰新闻";
		forumurl = window.location.href;
		
	}
	
	if(displayname=="注册"){
		displayname = "";
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
 */
ifeng.hc_button=function(page){
	var userid=page.userid;
	if(state==3){
		//列表界面 回传按钮
		$(list_sel).each(function(i){
			var userobj=$(this).find("td:eq(2) cite>a");
			if(userobj.size()==0){
				return true;//continue
			}
			var userhref = userobj.attr("href");
			var thisuserid = userhref.replace(/(.*)\&uid=(\d*)/, "$2");
			//console.log(thisuserid+"~~~"+userid);
			if(thisuserid==userid){
				$(this).find("td:eq(1)").append("<pbutton style='margin-left: 10px' class='pf_button pf_orange pf_small' name='btn_up'>回传</pbutton>");
			}
		});
		
		
	}else if(state==2){
		//回帖界面注入
		$(htlist_sel).each(function(i){
			var userobj = $(this).find("table tr td:first div.box108 h3 a");
			var userhref = userobj.attr("href");
			if(userobj.size()==0){
				return true;//continue
			}
			var thisuserid = userhref.replace(/(.*)\&uid=(\d*)/, "$2");
			//console.log(thisuserid+"~~~"+userid);
			if(thisuserid==userid){
				$(this).find("table tr td:first").append("<pbutton style='margin: 5px 20px' class='pf_button pf_orange pf_small' name='btn_up'>回传</pbutton>");
			}
		});
		
	} else if (state == 4) {
		var backTimer = setInterval(function(){
			if ($(displayname_sel).length) {
				$(displayname_sel).each(function(){
					if (!$(this).children("pbutton").length){
						$(this).append("<pbutton style='margin: 5px 20px' class='pf_button pf_orange pf_small' name='btn_up'>回传</pbutton>");
					}
				});
			} else {
				clearInterval(backTimer);
			}
		},1000);
		
		/*		
		$(displayname_sel).each(function(i){
			$(this).append("<pbutton style='margin: 5px 20px' class='pf_button pf_orange pf_small' name='btn_up'>回传</pbutton>");
		});
		*/
	} 
};


/**
 * 列表tr以及处理
 */
ifeng.listValue=function(obj){
	var trdata = new Object();
	var title = "";
	var url = "";
	var content = "";
	var posttime = "";
	var resulttype = "";
	var displayname = "";
	var ranknum = 0;
	var heatnum = 0;
	
	if(state==3){
		resulttype = 1;
		var trobj = obj.parents(list_sel);
		var listobj = trobj.find("td:eq(1) a");
		url = listobj.attr("href");
		url = publicpfinduct.dealWithUrl(url,preforumurl);
		title = listobj.text();
		
		posttime = trobj.find("td:eq(2) em").text();
		posttime = posttime+" 00:00";
		posttime = publicpfinduct.dealWithTime(posttime);
		
	}else if(state==2){
		var trobj = obj.parents(htlist_sel);
		var contentObj = trobj.find("table tr td:eq(1) div.box853");
		content = contentObj.find("table:first").text();
		posttime = contentObj.find("h2.tit04 ul:eq(0) li:eq(3)").text();
		posttime = publicpfinduct.dealWithTime(posttime);
		url = currenturl;
		//处理
		resulttype = 2;
	}else if (state == 4){//新闻网站
		var trobj = obj.parents(displayname_sel);
		displayname = obj.prev().prev().text();
		console.log(displayname); 
		if (displayname) {
			displayname = displayname.trim();
		}
		content = trobj.next().text();
		posttime = $.trim(trobj.next().next().children(".w-commentTime").text());
		posttime = publicpfinduct.dealWithTime(posttime);
		url = currenturl;
		
		heatnum = obj.parent().next().next().children().eq(0).find(".w-rep-num").text().trim();  
		//ranknum = $("pbutton[name='btn_up']").index(obj) + 1;  
        var currobj = obj.parents(".mod-articleCommentList");
        ranknum = $(".mod-articleCommentList").index(currobj) + 1; 
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

/**
 * 选择填充账号
 */
ifeng.fillAccountAndPwd=function(pfinducturl,currenturl,userid){
	$("#username,#h_uname,input[name=username]").unbind("click").die("click").live("click",function(){
		var obj = $(this);
		//获取taskid
		publicpfinduct.getCurrentTaskid(pfinducturl,function(taskid){
			account.selectAccount(function(username,password){
//				publicpfinduct.switchCookies(pfinducturl,currenturl,username,password,true);
				var selector = obj.attr("id");
				if(selector=="h_uname"){
					$("#h_uname").val(username);
					$("#h_pass").val(password);
				}else if(selector=="username"){
					$("#username").val(username);
					$("#password").val(password);
				}else {
					$("input[name=username]").val(username);
					$("input[name=password]").val(password);
				}
			},pfinducturl,currenturl,taskid);
			
		},userid);
	});
	
};
/**
*新闻顶贴
*/
ifeng.ding = function(url){

			//先去localstroagr 里面去找当前url是否有任务， 如果没有就在这个界面的后缀展示“顶”
		var induct_config = localStorage[url];
		if (!!induct_config && "undefined" != induct_config) {
			induct_config = JSON.parse(induct_config);
		}
		
	 
		//如果非空 ， 就去拿出配置开始准备做好顶贴工作
		if (!!induct_config &&  induct_config["target"] > 0) {
 
			if ((induct_config["target"]-0) < induct_config["now"]){
		 
				localStorage[url] = "";
				setTimeout(window.location.reload(), 1000);
				
			}else{
				$(displayname_sel).each(function(){
					var nickname = $.trim($(this).children("a").text());
					var content  = $.trim($(this).next().text());
					var now =$(this).next().next().children(".w-reply").eq(0).children(".w-rep-rec").text().replace(/\[|\]|推荐|\n/g,"");
					  
					if (induct_config["nickname"] == nickname && induct_config["content"] == content) {
						induct_config["now"] = now;
						localStorage[url] = JSON.stringify(induct_config);
		 
						a = $(this); 
						console.log(a.next().next().children(".w-reply").first().children(".w-rep-rec")[0].click()); 
						var now2 =$(this).next().next().children(".w-reply").eq(0).children(".w-rep-rec").text().replace(/\[|\]|推荐|\n/g,"");
			 
			 
						console.log("now :" + now + " now2 : " + now2);
						setTimeout(window.location.reload(), 2000);
						return false;
					}
				});
			}
			
			
		
		}else{
			localStorage[url] = "";
			//如果为空， 就在每一个后面加上按钮
			/*$(ding_sel).each(function(){
			 
				$(this).append('<pbutton class="pf_button pf_orange pf_small ding">顶</pbutton>')
			});
			*/
			
			var dingTimer = setInterval(function(){
				if ($(ding_sel).length) {
					$(ding_sel).each(function(){
						if (!$(this).children("pbutton").length){
							$(this).append('<pbutton class="pf_button pf_orange pf_small ding">顶</pbutton>');
						}
					});
				} else {
					clearInterval(dingTimer);
				}
			},1000);
			
			
			$(".ding").live("click",function(){
				if (!$(this).next()[0]) {
					$(this).parent().append("<input type='text' style='width:30px' ><pbutton class='pf_button pf_orange pf_small'><span class='induct_ok'>前台顶</span>|<span class='back_ding'>后台顶</span></pbutton>");
				}else{
					$(this).next()[0].focus();
				}
				
			
			});
		//前台顶
			$(".induct_ok").live("click",function(){
				var obj = {};
				var parentObj = $(this).parents(".w-bottomBar");
				var target = $.trim($(this).parent().prev().val());
				var nickname = $.trim(parentObj.prev().prev().children("a").text());
				var content = $.trim(parentObj.prev().text());
				var now = $.trim($(this).parents(".w-reply").children(".w-rep-rec").text().replace(/\[|\]|推荐|\n/g,"")); 
				if (!target && !"\d".test(target)) {
					alert("请正确输入需要顶的数量！！");
					return;
				}
				obj.target = target - 0 + now;
				obj.nickname = nickname;
				obj.content = content;
				obj.now = now;
				localStorage[url] = JSON.stringify(obj);
				setTimeout(window.location.reload(), 1000);
 
			});
		//后台顶
		$(".back_ding").live("click",function(){
			var url = $(".i-commentArticleTitle a").attr("href"); 
			var parentObj = $(this).parents(".w-bottomBar");
			var nickname = $.trim(parentObj.prev().prev().prev().children("a").text());
			var content = $.trim(parentObj.prev().text());
			var dingnum = $.trim($(this).parent().prev().val());
			if (!dingnum && !"\d".test(dingnum)) {
				alert("请正确输入需要顶的数量！！");
				return;
			}
		 //找到需要顶贴的标示
			var uniquekey = $(this).parents(".w-reply").children("a").first().attr("data-quoteid");
			if (typeof uniquekey === "undefined") {
				alert("数据获取异常,请联系管理员");
				return ;
			}
		 	var retdata= {};
			retdata["uniquekey"] = uniquekey;
			retdata["num"] = dingnum;
			retdata["url"] = url;
			retdata["displayname"] = nickname;
			retdata["content"] = content; 
			console.log(retdata);
			chrome.extension.sendMessage({method:"backpost",key:retdata,value:""},function(){window.location.href = window.location.href;});
			 
				
		 
		});
			
		}

}

function autologin(username,password){
	document.getElementById("js_login_btn").click();
	setTimeout(function(){
		var logindoc = document.getElementById("login_iframe").contentWindow.document;
		console.log(logindoc.getElementById("login_form"));
		logindoc.getElementById("loginName").value = username;
		logindoc.getElementById("loginPwd").value = password;
		logindoc.getElementById("loginbtn").click();
	},1000);
 
	
}