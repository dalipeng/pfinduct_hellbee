﻿var sina = {};
var pageinit = function(settings){
 
	var regArr=[
		/http:\/\/comment5\.news\.sina\.com\.cn\/(.*)/,
		/http:\/\/news\.sina\.com.cn\/\w\/\d+-\d+-\d+\/\d+\.shtml/,
		/http:\/\/news\.sina\.com\.cn/
	];
	
	var url = window.location.href;
	console.log("url : " + url);
	state = publicpfinduct.URLState(regArr,url);

	console.log("sina state:"+state);
	

	if(state==-1){ 
		return;
	}
	if(state>=0){
		setTimeout(function(){
			pageInfoData = sina.getPageInfo();
			//检查界面登录状态
			publicpfinduct.checkPageInfo(pageInfoData);
			
			publicpfinduct.sendBack(pfinducturl,userid,pageInfoData,sina.hc_button,sina.listValue);
		},3000);
	}	

	var userstr=settings.user;
	var user=JSON.parse(userstr);
	
	var pfinducturl = user.pfinducturl;
	var userid = user.userid;
	
	if (state == 0 ) {
		//$(".ml").css({"height":"600px"});
		$(".ml #J_Comment_List_Hot").css({"max-height":"500px","overflow":"auto"});
		$(".ml .blkCommentBoxFix").css({"display":"none"});
		$(".ml #J_Comment_Form_B").css({"position":"relative"});
        $(".ml #J_Comment_Form_B").insertAfter("#J_Comment_End");
		sina.ding(url);
	}
	if (state == 1 || state == 0 ) {
		publicpfinduct.insertMaterial(pfinducturl,sina.pageDeal,sina.setFormValues);
			//素材注入

	}
	
 
}


/**取界面元素  **/
sina.getPageInfo=function(){
	var displayname="";
	var accountname="";
	var forumname="";
	var forumurl="";
	var userid="";
	if(state==1 || state == 0){	 
		displayname = $(".J_Name").text().replace("\"","").replace("用户名","");

		forumname = "新浪新闻";
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
sina.hc_button=function(page){
	if (state == 0) {
		/*
		setTimeout(function(){
			$("div.t_content").each(function(){
			 
				$(this).find(".t_info").append("<pbutton style='margin-left: 10px' class='pf_button pf_orange pf_small' name='btn_up'>回传</pbutton>");
			});
		},1000);
		*/
		
		var timer = setInterval(function(){
			if ($("div.t_content").length) {
				//clearInterval(timer);
				$("div.t_content").each(function(){
					if (!$(this).find(".t_info").children("pbutton").length){
						$(this).find(".t_info").append("<pbutton style='margin-left: 10px' class='pf_button pf_orange pf_small' name='btn_up'>回传</pbutton>");
					}
				});
			} else {
				clearInterval(timer);
			}
			
		},1000);
		
		$(document).on("click","a.cmnt-reflash-btn",function(){
			setTimeout(function(){
				$("div.t_content").each(function(){
					$(this).find(".t_info").append("<pbutton style='margin-left: 10px' class='pf_button pf_orange pf_small' name='btn_up'>回传</pbutton>");
				});
		},1000);
		})	
	}
	
	if (state == 1) {
		
		var timer = setInterval(function(){
			if ($("div.t_content").length) {
				//clearInterval(timer);
				$("div.t_content").each(function(){
					if (!$(this).find(".t_info").children("pbutton").length){
					$(this).find(".t_info").append("<pbutton style='margin-left: 10px' class='pf_button pf_orange pf_small' name='btn_up'>回传</pbutton>");}
				});
			}
			
		},1000);
	}
};



/**
 * 列表tr以及处理
 */
sina.listValue=function(obj){
	var trdata = new Object();
	var title = "";
	var url = "";
	var content = "";
	var posttime = "";
	var resulttype = "";
	var displayname = "";
	var currurl = window.location.href;
	var heatnum = 0;
	var ranknum = 0;
	if(state == 0 || state == 1){
		resulttype = 2;
		var trobj = obj.parents(".t_content");	 
		url = currurl;
		title = $("title").text();
		content = trobj.find(".t_txt").text();
		posttime = trobj.find(".J_Comment_Time").attr("date")/1000;
		var time = new Date(posttime);
		posttime = time.getFullYear() + "-" + (time.getMonth() - 0  + 1 ) + "-" + time.getDate() + "  " + time.getHours() + ":" +  time.getMinutes();
		displayname = trobj.find(".t_username").text();
		heatnum = obj.parents(".J_Comment_Info").next().next().children().eq(1).find(".comment_ding_link span em").text().replace(/\(|\)/g,"").trim();  
        var currobj = obj.parents(".comment_item");	 
        ranknum = $(".comment_item").index(currobj);
		//ranknum = $("pbutton[name='btn_up']").index(obj) + 1;  
        
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

sina.pageDeal=function(){
	if ( state == 1 || state == 0) {
	 
		$("#J_Post_Box_Count").append("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</pbutton>");
	}
};

sina.setFormValues=function(title,content){
	if(state==1 || state == 0){
		$("textarea.J_Comment_Content").first().val(content);
		$("textarea.J_Comment_Content").first().focus();

	}
};

sina.ding=function(url){
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
				var inter = setInterval(function(){
					if (!!$(".reply-right").length) {
						clearInterval(inter);
						
						$(".reply-right").each(function(){
							var nickname = $(this).parent().parent().prev().prev().children(".t_info").children(".t_username").text();
							var content  = $(this).parent().prev().text().replace(/\n|\r|"/g,"");
							var now = $(this).children().eq(0).text().replace(/\(|\)|支持|\n/g,"");
							 console.log("nickname: " + nickname  + "content: " + content + "now : " + now);
							if (induct_config["nickname"].replace("回传","") == nickname && induct_config["content"] == content) {
							
								induct_config["now"] = now;
								localStorage[url] = JSON.stringify(induct_config);
								$(this).children().eq(0)[0].click();
								setTimeout(window.location.reload(), 1000);
							}
						});
					}
				
				},1000);

			}
		}else{
			localStorage[url] = "";
			var inter = setInterval(function(){
				if ($(".reply-right").length) {
					$(".reply-right").each(function(){
						if (!$(this).children("pbutton").length) {
							$(this).append('<pbutton class="pf_button pf_orange pf_small ding">顶</pbutton>');
						}
						//clearInterval(inter);
					});
				} else {
					clearInterval(inter);
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
				var target = $(this).parent().prev().val();
				var nickname = $(this).parents(".t_content").children(".J_Comment_Info").children(".t_info").children(".t_username").text();
				var content = $(this).parent().parent().parent().prev().text().replace(/\n|\r|"/g,"");
				var now = $(this).parent().prev().prev().prev().prev().prev().text().replace(/\(|\)|支持|\n/g,"");
				obj.target = target;
				obj.nickname = nickname;
				obj.content = content;
				obj.now = now;
				localStorage[url] = JSON.stringify(obj);
				setTimeout(window.location.reload(), 1000);
			});
			//后台台顶
		$(".back_ding").live("click",function(){
			var url = $("#J_NewsTitle").children().attr("href");
			
			
			var mainpage = $("#mainReplies .current").first().text();
			var dingnum = $(this).parent().prev().val();
			if (!dingnum) {
				alert("请输入需要顶的数量！！");
				return;
			}
			var nickname = $(this).parents(".t_content").children(".J_Comment_Info").children(".t_info").children(".t_username").text();
			var content = $(this).parents(".reply").prev().text();
		 
			//找到需要顶贴的标示
			var dinginfo = $(this).parents(".reply-right").children().first().attr("action-data");
			var dinginfo = dinginfo.split("&");
			var  dingarray = []; 
			dingarray.push(dinginfo[0].substring(dinginfo[0].indexOf("=")+1,dinginfo[0].length));
			dingarray.push(dinginfo[1].substring(dinginfo[1].indexOf("=")+1,dinginfo[1].length));
			dingarray.push(dinginfo[2].substring(dinginfo[2].indexOf("=")+1,dinginfo[2].length)); 
			var retdata= {};
			retdata["uniquekey"] = dingarray.join(",");;
			retdata["num"] = dingnum;
			retdata["url"] = url;
			retdata["displayname"] = nickname;
			retdata["content"] = content;
		 
		 
			chrome.extension.sendMessage({method:"backpost",key:retdata,value:""},function(){window.location.href = window.location.href;});
			 
				
		 
		});
			
			
		}
};




function autologin(username,password){
	setTimeout(function(){
		$("a.tn-tab-custom-login")[0].click();
		$("input[name='loginname']").val(username);
		$("input[name='password']").val(password);
	 
		$("a.login_btn")[0].click();
		
	},2000);

}