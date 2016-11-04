var e0575 = {};
//发帖区域
var fatie_sel="#tb_rich_poster_container";
//附加选择素材区域
var material_sel = ".poster_head";
//发帖区域标题
var title_sel = "#atc_title";
//发帖区域内容
var content_sel = "#textarea";

var post_content_sel = "$('#note_iframe')[0].contentDocument.body";
//昵称
var displayname_sel="#ew_topbar2";
//列表界面
var list_sel = "li.j_thread_list";
//回复列表
var htlist_sel = ".read_t";
//回帖标题
var ht_title_sel = "div.read_h1";
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
		/http:\/\/www\.e0575\.cn(.*)/,
		/http:\/\/www\.e0575\.cn\/(post)(.*)/,
		/http:\/\/www\.e0575\.cn\/(read)(.*)/,
		/http:\/\/tieba\.e0575\.cn\/f\?(.*)kw=(.*)/
	];
	var url = window.location.href;
	state = publicpfinduct.URLState(regArr,url);
	console.log("e0575 state:"+state);
	
	
	if(state==-1){
		return;
	}

	
	var userstr=settings.user;
	var user=JSON.parse(userstr);
	
	var pfinducturl = user.pfinducturl;
	var userid = user.userid;
	
	if(state>0){
		pageInfoData = e0575.getPageInfo();
		//检查界面登录状态
		publicpfinduct.checkPageInfo(pageInfoData);
		//素材注入(1,2,3都需要注入)
	}
	
	
	if(state==1||state==2||state==3){
		publicpfinduct.insertMaterial(pfinducturl,e0575.pageDeal,e0575.setFormValues);
	}
	
	//回传
	if(state==1||state==2){
		publicpfinduct.sendBack(pfinducturl,userid,pageInfoData,e0575.hc_button,e0575.listValue);
	}
	
	//账号选择
	if(state>=0){
		e0575.fillAccountAndPwd(pfinducturl,currenturl,userid);
	}
	
	if (state == 1) {
		//	alert("i'm coming");
			e0575.fillcheckbox();
	}
		


	
	//e0575.mutitask(pfinducturl,settings);
	
	
};

e0575.pageDeal=function(){
	//位置翻转
	 
	if(state==1||state==3){
		$("#tabTypeBodys").children("div").eq(0).append("<span id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</span>");
	}else if(state==2){
		$("#formHiddens").next().next().html("<div class='editor_title_txt' style='float: left;'>发表回复</div><span id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</span>");

		
	}
	
};

e0575.setFormValues=function(title,content){
	$(title_sel).val(title);
	if (state == 2) {
		$(content_sel).text(content);
	}else if (state == 1) {
		$($('#note_iframe')[0].contentDocument.body).html(content)
	}
	
	
};

/**取界面元素  **/
e0575.getPageInfo=function(){
	var _displayname = $(displayname_sel).find("a").eq(0).text();
	var _accountname = "";
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
	var _forumname = $("#breadCrumb").children().eq(4).text();
	var _forumurl = window.location.href;
	var obj = new Object();
	obj.displayname = _displayname;
	obj.accountname = _accountname;
	obj.forumname = _forumname;
	obj.forumurl = _forumurl;
	
	return obj;
};

/**
 * 
 */
e0575.hc_button=function(page){
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
			var author_obj = $(this).find("div.readName");
			var username = author_obj.find("a").text();
		//	if(username==displayname){
				author_obj.append("<pbutton style='margin-top: 5px' class='pf_button pf_orange pf_small' name='btn_up'>回传</span>");
		//	}
		});
		
	}
};


/**
 * 列表tr以及处理
 */
e0575.listValue=function(obj){
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
		console.log("clicked  回传按钮  ");
		console.log(obj);
		var trobj = obj.parents(htlist_sel);
		console.log(trobj);
		content = trobj.find("div.f14").text();
		url = currenturl;
		var tail_area = trobj.find(".tipTop");
		posttime = tail_area.children().eq(2).attr("title");
		posttime = publicpfinduct.dealWithTime(posttime);
		var displayname = obj.prev().text();
		
		//楼层
		var floor = tail_area.children().eq(1).text();
		 
		if(floor!="楼主"){
			resulttype = 2;
		}else{
			resulttype = 1;
		}
		title = trobj.find(ht_title_sel).text();
		
		
	}
	trdata.title = title;
	trdata.url = url;
	trdata.content = content;
	trdata.posttime = posttime;
	trdata.resulttype = resulttype;
	trdata.displayname = displayname;
	console.log(trdata);
	return trdata;
};

/**
 * 选择填充账号
 */
e0575.fillAccountAndPwd=function(pfinducturl,currenturl,userid){
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
	document.getElementsByName("pwuser")[0].value= username;
	document.getElementsByName("pwpwd")[0].value= password;
	setTimeout(function(){
		document.getElementsByName("submit")[0].click();
	},2000);
	
	
}

e0575.getSingleMaterial=function(pfinducturl,mid){
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

e0575.fillcheckbox=function(){
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
				obj.url = "http://tieba.e0575.com"+$(this).next().attr("href");
				_urlarr.push(obj);
				
			}
			if (_tieattr=="down" && $(this).attr("checked")==undefined) {
				var obj = {};
				obj.title = $(this).next().text();
				obj.url = "http://tieba.e0575.com"+$(this).next().attr("href");
				_urlarr.push(obj);

			}
		});
		console.log(_urlarr);
		chrome.extension.sendMessage({method:"mutiurl",key:"key",value:JSON.stringify(_urlarr)},function(data){
			//alert(data.data);
		}); 
	});
}



