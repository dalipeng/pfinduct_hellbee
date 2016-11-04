var baidu = {};
//发帖区域
var fatie_sel="#tb_rich_poster_container";
//附加选择素材区域
var material_sel = ".poster_head";
//发帖区域标题
var title_sel = "#tb_rich_poster_container .editor_title";
//发帖区域内容
var content_sel = "#tb_rich_poster_container #ueditor_replace";
//昵称
var displayname_sel="#com_userbar #j_u_username .u_username_title";
//列表界面
var list_sel = "li.j_thread_list";
//回复列表
var htlist_sel = "div.l_post";
//回帖标题
var ht_title_sel = "div.left_section h1.thread_title_txt";
//获取版块名称
var forum_sel = "#j_core_title_wrap .core_title h1";

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
		/http:\/\/tieba\.baidu\.com(.*)/,
		/http:\/\/tieba\.baidu\.com\/f\?(.*)kw=(.*)/,
		/http:\/\/tieba\.baidu\.com\/(f\?ct|p\/)(.*)/,
		/http:\/\/tieba\.baidu\.com\/f\?(.*)kw=(.*)/
	];
	var url = window.location.href;
	state = publicpfinduct.URLState(regArr,url);
	console.log("baidu state:"+state);
	
	
	if(state==-1){
		return;
	}

	
	var userstr=settings.user;
	var user=JSON.parse(userstr);
	
	var pfinducturl = user.pfinducturl;
	var userid = user.userid;
	if(state>0){
		pageInfoData = baidu.getPageInfo();
		//检查界面登录状态
		publicpfinduct.checkPageInfo(pageInfoData);
		//素材注入(1,2,3都需要注入)
	}
	
	
	if(state==1||state==2||state==3){
		publicpfinduct.insertMaterial(pfinducturl,baidu.pageDeal,baidu.setFormValues);
	}
	
	//回传
	if(state==1||state==2){
		publicpfinduct.sendBack(pfinducturl,userid,pageInfoData,baidu.hc_button,baidu.listValue);
	}
	
	//账号选择
	if(state>=0){
		baidu.fillAccountAndPwd(pfinducturl,currenturl,userid);
	}
	
	if (state == 1) {
		//	alert("i'm coming");
			baidu.fillcheckbox();
	}
		


	
	//baidu.mutitask(pfinducturl,settings);
	
	
};

baidu.pageDeal=function(){
	//位置翻转
//	$(fatie_sel).eq(0).insertAfter("#head");

	$(fatie_sel).eq(0).insertAfter("#head");

	if(state==1||state==3){
		$(material_sel).html("<div class='editor_title_txt' style='float: left;'>发表新贴</div><span id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</span>");
	}else if(state==2){
		$(material_sel).html("<div class='editor_title_txt' style='float: left;'>发表回复</div><span id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</span>");
		$(fatie_sel).removeClass("editor_theme_2");
		$(fatie_sel).addClass("search_theme_2");
	}
	setTimeout(function(){
		$('html, body, .content').animate({scrollTop: $(document).height()}, 100); 
	}, 500);
	setTimeout(function(){
		$('html, body, .content').animate({scrollTop: 0}, 300); 
	},1000);

	
};

baidu.setFormValues=function(title,content){
	$(title_sel).val(title);
	$(content_sel).text(content);
	$(content_sel).focus();
	setTimeout(function(){
		$(".c_captcha_input_normal").focus();
		},1000);
};

/**取界面元素  **/
baidu.getPageInfo=function(){
	var displayname = $(displayname_sel).first().text();
	var accountname = "";
//	var formnameobj = $(forum_sel).eq(0);
//	var forumname = "百度贴吧-"+formnameobj.text();
//	var forumurl = formnameobj.attr("href");
//	forumurl = publicpfinduct.dealWithUrl(forumurl,preforumurl);

/*	
	var data_editor = $("#editor").attr("data-editor");
	var data_postor = $("#editor").attr("data-postor");
	var u_forum_name = data_editor.match(/u_forum_name:'(.+)',can_post/);
	var kw = data_postor.match(/kw:'(.+)',ie/);
	var forumname = "";
	var forumurl = "";
	if(kw&&kw.length>1){
		forumname = "百度贴吧-"+kw[1]+"吧";
	}
	if(u_forum_name&&u_forum_name.length>0){
		forumurl = preforumurl+"/f?kw="+u_forum_name[1];
	}
	*/
	var forumname = ($("#tab_forumname")||$(".card_title_fname")).text() || $(".plat_title_h3").text();
	var forumurl = preforumurl+"/f?kw="+forumname;
	var obj = new Object();
	obj.displayname=displayname;
	obj.accountname=accountname;
	obj.forumname=forumname;
	obj.forumurl=forumurl;
	
	return obj;
};

/**
 * 
 */
baidu.hc_button=function(page){
	var displayname=page.displayname;
	if(state==1){
		//贴吧界面 回传按钮
		$(list_sel).each(function(i){
			var username=$(this).find(".tb_icon_author a").text();
			if(username==displayname){
				$(this).find("div.threadlist_li_left").append("<pbutton style='margin-left: 10px' class='pf_button pf_orange pf_small' name='btn_up'>回传</span>");
			}
		});
		
		
	}else if(state==2){
		
		//回帖界面注入
		$(htlist_sel).each(function(i){
			var author_obj = $(this).find("div.d_author");
			var username = author_obj.find("a.p_author_name").text();
			console.log(username);
			if(username==displayname){
				author_obj.append("<pbutton style='margin-top: 5px' class='pf_button pf_orange pf_small' name='btn_up'>回传</span>");
			}
		});
		
	}
};


/**
 * 列表tr以及处理
 */
baidu.listValue=function(obj){
	var trdata = new Object();
	var title = "";
	var url = "";
	var content = "";
	var posttime = "";
	var resulttype = "";
	
	if(state==1||state==3){
		resulttype = 1;
		
		var trobj = obj.parents(list_sel);
		var listobj = trobj.find(".threadlist_text a");
		url = listobj.attr("href");
		url = publicpfinduct.dealWithUrl(url,preforumurl);
		title = listobj.text();
		
	}else if(state==2){
		var trobj = obj.parents(htlist_sel);
		content = trobj.find("div.d_post_content").text();
		url = currenturl;
		var tail_area = trobj.find("div.lzl_tail ul.p_tail li");
		posttime = tail_area.eq(1).text();
		posttime = publicpfinduct.dealWithTime(posttime);
		//楼层
		var floor = tail_area.eq(0).text();
		if(floor!="1楼"){
			resulttype = 2;
		}else{
			resulttype = 1;
		}
		title = $(ht_title_sel).text();
		
		
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
baidu.fillAccountAndPwd=function(pfinducturl,currenturl,userid){
	$("input[name=userName]").unbind("click").die("click").live("click",function(){
		var obj = $(this);
		//获取taskid
		publicpfinduct.getCurrentTaskid(pfinducturl,function(taskid){
			account.selectAccount(function(username,password){
//				publicpfinduct.switchCookies(pfinducturl,currenturl,username,password,true);
				var p = obj.parents("form");
				obj.val(username);
				p.find("input[name=password]").val(password);
				
			},pfinducturl,currenturl,taskid);
			
		},userid);
	});
	
};
/**
 * 用于从发帖导航进来
 * @param username
 * @param password
 */
function autologin(username,password){
	document.getElementsByClassName("u_menu_item")[0].click();
	setTimeout(function(){
		document.getElementsByName("userName")[0].value = username;
		document.getElementsByName("password")[0].value = password;
		document.getElementsByClassName("pass-button-submit")[0].click(); 
	},500); 
}


/**
 * 批量发帖
 */
baidu.mutitask=function(pfinducturl,settings){
	var url = window.location.href;
	var referurl = document.referrer;
	//验证是否要继续连续发帖；
	var currentTask = null;
	for(var obj in settings){
		if(obj==url){
			currentTask = settings[obj];
			break;
		}else if(obj==referurl){
			currentTask = settings[obj];
			break;
		}else{
			continue;
		}
	}
	
	if(currentTask==null){
		console.log("无任务需要执行！！！");
		return;
	}
	console.log("currentTask:"+currentTask);
	//当前任务
	var task = JSON.parse(currentTask);
	
	var taskurl = task.url;
	var num = task.num;
	var taskstate = task.taskstate;
	console.log("taskurl:"+taskurl);
	console.log("num:"+num);
	console.log("taskstate:"+taskstate);
	if(num>0&&taskstate==1){
		if(url==taskurl){
			var mids = task.mids;
			var mlength = mids.length;
			//从数组的后面向前面遍历（考虑存储的时候反过来存，保持一致）
			var index = num>mlength?0:num-1;
			var mid = mids[index];
			console.log("mid:"+mid);
			
			var materials = baidu.getSingleMaterial(pfinducturl,mid);
			var material = materials[0];
			if(!material){
				alert("未选择素材！！！");
				return;
			}
			
			//var title = "我就遇到过这么极品的医生，还跟他们吵了一架";
			//var content = "小病别往大医院跑，就近选择口碑好的小诊所、小医院里面热心负责的医生，大人不受累，孩子不遭罪。我曾经屡次感受到这些医生的温暖，有个头痛脑热的就顺路去咨询一下，有时候医生一分钱没挣，还很热心的告诉我一些护理的注意事项，比大医院那些收高价还不关心病患疾苦的医生强多了。"+num;
			
			var title = material.TITLE;
			var content = material.CONTENT;
			
			if(state==1){//发帖
				$(title_sel).val(title);
				$(content_sel).text(content);
				$(content_sel).focus();
				setTimeout(function(){
					$(".c_captcha_input_normal").focus();
					},1000);
				
			}else if(state==2){//回帖
				//$(title_sel).val(title);
				$(content_sel).text(content);
				$(content_sel).focus();
				setTimeout(function(){
					$(".c_captcha_input_normal").focus();
					},1000);
				
			}
			//任务数自减
			num--;
			task.num = num;
			if(num==0){
				//删除任务（状态设置为0，停用状态），如果是删除，修改下代码
				task.taskstate = 0;
				//chrome.extension.sendMessage({method:"delLocalStorage",key:url},function(){});
			}
			
			taskStr = JSON.stringify(task);
			
			chrome.extension.sendMessage({method:"setLocalStorage",key:url,value:taskStr},function(){});
			
			setTimeout(function(){
				if(state==1){
					$(".subbtn_bg").click();
				}else if(state==2){
					$(".subbtn_bg").click();
				}
			},10000);
			
		}else{
			window.location.href = taskurl;
		}
	}
};

baidu.getSingleMaterial=function(pfinducturl,mid){
	var data=null;
	var url=pfinducturl+"/chrome!getMaterial.action";
	$.ajax({
		type: "POST",
		async:false,
		url: url,
		data:"mid="+mid,
		success: function(datastr){
			console.log("datastr:"+datastr);
			data = JSON.parse(datastr);
		}
	});
	return data;
};
/*
baidu.fillcheckbox=function(){
	$("div.threadlist_title").each(function(){
		$(this).prepend("<input type='checkbox' name='_induct_batch' style='margin-right:5px;'>");
	});
	
	
	
	$("body").append("<div id='_induct_muti' style='position:absolute;z-index: 99;left:-30px;top:-30px'><input type='button' attr='up' id='_induct_muti_up' value='置顶' class='induct_u_btn' style='border-radius: 5px 0 0 5px;'>" +
			"<input type='button' id='_induct_muti_down' attr='down' value='置沉'  class='induct_u_btn' style='border-radius: 0 5px 5px 0;'></div>");
	
	$("div.threadlist_title input[type='checkbox'][name='_induct_batch']").live("click",function(e){
		var obj = $(this);
		e = e || window.event;
		var sh = Math.max(document.documentElement.scrollTop, document.body.scrollTop),
		sw = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
		var x = e.clientX + sw +10, y = e.clientY + sh -35;
	
		$("#_induct_muti").css({"left":x,"top":y});
	});
	//对置沉或置顶进行事件绑定
	 
	$("#_induct_muti_up,#_induct_muti_down").bind("click",function(){
		var _tieattr = $(this).attr("attr");
		var _urlarr = [];
		$("div.threadlist_title input[type='checkbox']").each(function(){
			console.log($(this).attr("checked"));
			if (_tieattr=="up" && $(this).attr("checked")=="checked") {
				var obj = {};
				obj.title = $(this).next().text();
				obj.url = "http://tieba.baidu.com"+$(this).next().attr("href");
				_urlarr.push(obj);
				
			}
			if (_tieattr=="down" && $(this).attr("checked")==undefined) {
				var obj = {};
				obj.title = $(this).next().text();
				obj.url = "http://tieba.baidu.com"+$(this).next().attr("href");
				_urlarr.push(obj);

			}
		});
		console.log(_urlarr);
		chrome.extension.sendMessage({method:"mutiurl",key:"key",value:JSON.stringify(_urlarr)},function(data){
			//alert(data.data);
		}); 
	});
	
}
*/


