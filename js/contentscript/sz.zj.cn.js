var sz_zj = {};
//发帖区域
var fatie_sel="#tb_rich_poster_container";
//附加选择素材区域
var material_sel = ".poster_head";
//发帖区域标题
var title_sel = "#atc_title";
//发帖区域内容
var content_sel = "#tb_rich_poster_container #ueditor_replace";
//昵称
var displayname_sel="document.getElementsByClassName('link_down')[0].text";
//列表界面
var list_sel = "li.j_thread_list";
//回复列表
var htlist_sel = ".read_t";
//回帖标题
var ht_title_sel = "div.left_section h1.thread_title_txt";
//获取版块名称
var forum_sel = "#j_core_title_wrap .core_title h1";


//昵称
var displayname = document.getElementsByClassName('vwmy')[0];
displayname = displayname ? displayname.innerText : "";

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
	 //回帖界面做过urlrewriter ,  一种为 ： http://bbs.sz.zj.cn/read-htm-tid-598097.html  另一种为  http://bbs.sz.zj.cn/read.php?tid-598097.html
	var regArr=[
		/http:\/\/bbs\.sz\.zj.cn(.*)/,
		/http:\/\/bbs\.sz\.zj\.cn\/post\.php\?fid=(.*)/,
		/http:\/\/bbs\.sz\.zj.cn\/read(.*)/,
		/http:\/\/tieba\.sz_zj\.com\/f\?(.*)kw=(.*)/,
		/http:\/\/bbs\.sz\.zj\.cn\/thread-(.*)/
	];
	var url = window.location.href;
	state = publicpfinduct.URLState(regArr,url);
	console.log("sz_zj_cn state:" + state);
	

	if(state==-1){
		return;
	}
	
	
	var userstr=settings.user;
	var user=JSON.parse(userstr);
	
	var pfinducturl = user.pfinducturl;
	var userid = user.userid;
	if(state>0){
		pageInfoData = sz_zj.getPageInfo();
		//检查界面登录状态
		publicpfinduct.checkPageInfo(pageInfoData);
		//素材注入(1,2,3都需要注入)
	}
	
	
	if(state==1||state==2||state==3 || state == 4){
		publicpfinduct.insertMaterial(pfinducturl,sz_zj.pageDeal,sz_zj.setFormValues);
	}
	
	//回传
	if(state==1||state==2 || state == 4){
		publicpfinduct.sendBack(pfinducturl,userid,pageInfoData,sz_zj.hc_button,sz_zj.listValue);
	}
	
	//账号选择
	if(state>=0){
		sz_zj.fillAccountAndPwd(pfinducturl,currenturl,userid);
	}
	
	if (state == 1) {
		//	alert("i'm coming");
			sz_zj.fillcheckbox();
	}
		


	
	//sz_zj.mutitask(pfinducturl,settings);
	
	
};

sz_zj.pageDeal=function(){ 
	if(state==1||state==3 || state==4){ 
		$(".pls").last().prepend("<span id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</span>");
//		$(material_sel).html("<div class='editor_title_txt' style='float: left;'>发表新贴</div><span id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</span>");
	}else if(state==2){
		document.getElementsByName("iscontinue")[0].nextElementSibling.innerHTML = "<div class='editor_title_txt' style='float: left;'>发表回复</div><span id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</span>"		 
	}
	
};

sz_zj.setFormValues=function(title,content){
	$(title_sel).val(title);
	$("#atc_title").val("sd");
//	$(content_sel).text(content);
	if (state == 4) {
		document.getElementById("textarea").value = content
	}else if (state == 1)  { 
		$($(".B_editor_toolbar").next().children("iframe")[0].contentDocument.body).html(content);
	} 
	
	
	
 
};

/**取界面元素  **/
sz_zj.getPageInfo=function(){
	var _displayname = displayname;
	var _accountname = "";

//	var _forumname = document.getElementsByClassName("title")[0].innerText;
//	var _forumname = $(".title").children("strong").children().eq(4).text();
	var _forumname  = document.getElementById("pt").innerText;
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
sz_zj.hc_button=function(page){
 
	var _displayname=page.displayname; 
	if(state==1){
		//发帖界面，暂时未作， 账号无权限
		$(list_sel).each(function(i){
			var username=$(this).find(".tb_icon_author a").text();
			if(username==displayname){
				$(this).find("div.threadlist_li_left").append("<pbutton style='margin-left: 10px' class='pf_button pf_orange pf_small' name='btn_up'>回传</span>");
			}
		});
		
		
	}else if(state==4){
 
		var _trlist = $(".pi>.authi");
	 
//		var _trlist = document.getElementByClassName("read_t");
	console.log(_trlist);
 		for (var i=0,len=_trlist.length; i<len; i++) {
			var _currobj = _trlist[i];
			console.log(_currobj);
			var _trname = _currobj.textContent;
			console.log("_trname : " + _trname + " displayname : " + displayname);
//			if (_trname == _displayname) {
//				var _hcobj = document.createElement("pbutton");
//				_hcobj.className = 'pf_button pf_orange pf_small';
//				_hcobj.setAttribute("name","btn_up");
//				_hcobj.textContent = "回传";
//				_hcobj.setAttribute('margin-top: 5px');
//				_currobj.children[0].children[0].children[0].children[0].children[0].appendChild(_hcobj);
//console.log($(_currobj).children(".floot").children("tbody").children("tr").eq(0).children("td").eq(0));
				$(_currobj).append("<pbutton style='margin-left: 10px' class='pf_button pf_orange pf_small' name='btn_up'>回传</span>");
//			}
		}
	}
};


/**
 * 列表tr以及处理
 */
sz_zj.listValue=function(obj){
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
		
	}else if(state==4){
		console.log("clicked  回传按钮  ");
		console.log(obj);
		var trobj = obj.parents("tr"); 
		content = trobj.find(".plc>.pct>.pcb>.t_fsz>table").text();
		console.log(content);
		url = currenturl;
	    var tail_area =  trobj.find(".plc>.pi>strong>a");
	//	posttime = tail_area.children().eq(2).attr("title");
		posttime = trobj.find(".plc>.pi>.pti.>.authi>em").text();
		console.log(posttime);
		posttime = posttime ? $.trim(posttime.replace("发表于","")) : "0";
		posttime = publicpfinduct.dealWithTime(posttime);
		
		//楼层
		var floor = tail_area.text();
		if(floor!="楼主"){
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
sz_zj.fillAccountAndPwd=function(pfinducturl,currenturl,userid){
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
	document.getElementsByName("submit")[0].click();
	
}

/**
 * 批量发帖
 */
sz_zj.mutitask=function(pfinducturl,settings){
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
			
			var materials = sz_zj.getSingleMaterial(pfinducturl,mid);
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

sz_zj.getSingleMaterial=function(pfinducturl,mid){
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

sz_zj.fillcheckbox=function(){
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
				obj.url = "http://tieba.sz_zj.com"+$(this).next().attr("href");
				_urlarr.push(obj);
				
			}
			if (_tieattr=="down" && $(this).attr("checked")==undefined) {
				var obj = {};
				obj.title = $(this).next().text();
				obj.url = "http://tieba.sz_zj.com"+$(this).next().attr("href");
				_urlarr.push(obj);

			}
		});
		console.log(_urlarr);
		chrome.extension.sendMessage({method:"mutiurl",key:"key",value:JSON.stringify(_urlarr)},function(data){
			//alert(data.data);
		}); 
	});
}



