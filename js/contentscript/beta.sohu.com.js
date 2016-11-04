var sohu = {};
//列表界面
var list_sel = "tr[id^=ul-]";
//回复列表
var htlist_sel = "div.content";

var state = -1;
//url前缀
var preforumurl = currenturl.match(/http:\/\/(\w+\.)+(\w+)/g)[0];

var pfinducturl = "";

$(function(){
	/**
	 * 0 :基域名
	 * 1 :发帖界面
	 * 2 :回帖界面
	 * 3 :列表界面
	 */
	var regArr=[
		/http:\/\/(.*)\.sohu\.com(.*)/,
		/http:\/\/club\.(.*)\.sohu\.com\/(post_art\.php\?b=(.*)&t=(.*)&k=(.*))|((.*)\/post\/)/,
		/http:\/\/club\.(.*)\.sohu\.com\/(r(.*)\.html)|((.*)\/thread\/(.*))|(read_art_sub\.new\.php(.*))/,
		/http:\/\/club\.(.*)\.sohu\.com\/(l(.*)\.html)|((.*)\/threads\/(.*))/
	];
	state = publicpfinduct.URLState(regArr,currenturl);
	console.log("sohu state:"+state);
	
	if(state==-1){ 
		return;
	}
	
	publicpfinduct.getLocalStorage(function(settings){
		var userstr=settings.user;
		var user=JSON.parse(userstr);
		
		pfinducturl = user.pfinducturl;
		var canConnect=publicpfinduct.testURL(pfinducturl);
		if(!canConnect){
			return;
		}
		var userid = user.userid;
		if(state>0){
			pageInfoData = sohu.getPageInfo();
			//检查界面登录状态
			publicpfinduct.checkPageInfo(pageInfoData);
		}
		//素材注入
		if(state==1||state==2){
			publicpfinduct.insertMaterial(pfinducturl,sohu.pageDeal,sohu.setFormValues);
		}
		
		//回传
		if(state==3||state==2){
			publicpfinduct.sendBack(pfinducturl,userid,pageInfoData,sohu.hc_button,sohu.listValue);
		}
		
		//账号选择
		if(state>=0){
			sohu.fillAccountAndPwd(pfinducturl,currenturl);
		}
		
	});
});

/**
 * 选择素材按钮注入
 */
sohu.pageDeal=function(){
	
	if(state==1){
		$("#reply .title").append("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</pbutton>");
	}else if(state==2){
		$("#editor_form .editorTitle span").append("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</pbutton>");
		$("#editor_form").insertBefore(".pageLite");
		
	}
	
};

/**
 * 发帖区域赋值
 */
sohu.setFormValues=function(title,content){
	if(state==1){
		$("#ipt_title").val(title);
		$("#editor_ifr").contents().find("#tinymce").empty().append(content);
		$("#ipt_title").click();
		setTimeout(function(){
			if($("#vcode").length>0){
				$("#vcode").focus();
			}
		},1000);
		
	}else if(state==2){
		$("#editor").val(content);
		$("#editor").click();
		setTimeout(function(){
			if($("#vcode").length>0){
				$("#vcode").focus();
			}
		},1000);
		
	}
};

/**取界面元素  **/
sohu.getPageInfo=function(){
	var userObj = $("#userCardyes li.userCard a");
	var displayname = userObj.text();
	var userurl = userObj.attr("href");
	var accountname="";
	if(userurl){
		accountname = userurl.split("=")[1];
	}
	var formnameobj = $("div.l .bbsNav a:last");
	var forumname = "搜狐论坛-"+formnameobj.text();
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
sohu.hc_button=function(page){
	var displayname=page.displayname;
	if(state==3){
		$("table tr th:first").css({width:"60px"});
		//列表界面 回传按钮
		$(list_sel).each(function(i){
			var username=$(this).find("td:eq(2) span a").text();
			//console.log(username+"~~~"+displayname);
			if(username==displayname){
				$(this).find("td:eq(0)").append("<pbutton class='pf_button pf_orange pf_small' name='btn_up'>回传</pbutton>");
			}
		});
		
		
	}else if(state==2){
		//回帖界面注入
		$(htlist_sel).each(function(i){
			var author_obj = $(this).find(".user .portrait a:eq(1)");
			var username = author_obj.text();
			//console.log(username+"~~~"+displayname);
			if(username==displayname){
				$(this).find(".user").append("<pbutton style='margin: 5px 40px' class='pf_button pf_orange pf_small' name='btn_up'>回传</pbutton>");
				
			}
		});
		
	}
};


/**
 * 列表tr以及处理
 */
sohu.listValue=function(obj){
	var trdata = new Object();
	var title = "";
	var url = "";
	var content = "";
	var posttime = "";
	var resulttype = "";
	
	if(state==3){
		resulttype = 1;
		
		var trobj = obj.parents(list_sel);
		var listobj = trobj.find("td:eq(1) a");
		url = listobj.attr("href");
		url = publicpfinduct.dealWithUrl(url,preforumurl);
		title = listobj.text();
		//posttime = trobj.find("td").eq(4).text();
	}else if(state==2){
		var trobj = obj.parents(htlist_sel);
		content = trobj.find(".threadright div.txt").text();
		url = currenturl;
		//posttime未处理
		
		//处理楼层
		var floor = trobj.find("h2.clear em:eq(1)").text();
		if(floor=="楼主"){
			resulttype = 1;
		}else{
			resulttype = 2;
		}
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
sohu.fillAccountAndPwd=function(pfinducturl,currenturl){
	$("#email,#pemail,#passport-id").unbind("click").die("click").live("click",function(){
		var obj = $(this);
		//获取taskid
		publicpfinduct.getCurrentTaskid(pfinducturl,function(taskid){
			account.selectAccount(function(username,password){
				var selector = obj.attr("id");
				if(selector=="pemail"){
					$("#pemail").val(username);
					$("#ppwd").val(password);
				}else if(selector=="email"){
					$("#email").val(username);
					$("#password").val(password);
				}else{
					$("#passport-id").val(username);
					$("#passport-pwd").val(password);
				}
				
				
			},pfinducturl,currenturl,taskid);
			
		});
	});
	
};
