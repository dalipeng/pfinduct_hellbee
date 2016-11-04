var shijiulou = {};
//发帖区域
var fatie_sel="#tb_rich_poster_container";
//附加选择素材区域
var reply_material_sel = "#quickreply .quick-hd .title";
var post_material_sel = "ul.post-bd li.post-title";


//发帖区域标题
var title_sel = "#subject";

//发帖区域内容
var content_sel = "$('#editorIfr')[0].contentDocument.body";

var reply_content_sel = "#qp_content";
//昵称
var displayname_sel="#J_headerLogined span.user-name a";
//列表界面
var list_sel = ".subject";
//回复列表
var htlist_sel = "#view-bd div.side";
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
		/http:\/\/(.*)\.19lou\.com\/(.*)/,
		/http:\/\/(.*)\.19lou\.com\/thread\/category\/normal\/publish\?fid=\d+/,
		/http:\/\/(.*)\.19lou\.com\/forum-\d+-thread-\d+\-\d-\d.html/,
		/http:\/\/(.*)\.19lou\.com\/forum-\d+-filter-type-typeid-\d+-\d+\.html/
	];
	var url = window.location.href;
	state = publicpfinduct.URLState(regArr,url);
	console.log("19lou state:"+state);
	
	
	if(state==-1){
		return;
	}

	
	var userstr=settings.user;
	var user=JSON.parse(userstr);
	
	var pfinducturl = user.pfinducturl;
	var userid = user.userid;
	if(state>0){
		pageInfoData = shijiulou.getPageInfo();
		//检查界面登录状态
		publicpfinduct.checkPageInfo(pageInfoData);
		//素材注入(1,2,3都需要注入)
	}
	
	
	if(state==1||state==2||state==3){
		publicpfinduct.insertMaterial(pfinducturl,shijiulou.pageDeal,shijiulou.setFormValues);
	}
	
	//回传
	if(state==1||state==2){
		publicpfinduct.sendBack(pfinducturl,userid,pageInfoData,shijiulou.hc_button,shijiulou.listValue);
	}
	
	//账号选择
	if(state>=0){
		shijiulou.fillAccountAndPwd(pfinducturl,currenturl,userid);
	}
	//暂时不实现  多url置顶
	if (state == 1) {
		//	alert("i'm coming");
//			baidu.fillcheckbox();
	}
		


	
	//baidu.mutitask(pfinducturl,settings);
	
	
};

shijiulou.pageDeal=function(){
	//位置翻转
	
	
	if(state==1||state==3){
		$(post_material_sel).append("<span id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</span>");
	}else if(state==2){
		$("#quickreply>.reply-bd>.side>.view-reply-face").prepend("<span id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</span>");
		$("#quickreply>.quick-bd>.quick-side").append("<span id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</span>");
	}
	
};

shijiulou.setFormValues=function(title,content){
console.log("title : " + title + " content :  " + content);
	console.log($("#quickreply").html());
	if ($("#quickreply").html()){
	//	$(reply_content_sel).val(content);
	 	$('#J_content').val(content);
		$("#qp_content").val(content);
	}else{
		$(title_sel).val(title);
		$($('#editorIfr')[0].contentDocument.body)	.html(content);
	}
//	$(content_sel).focus();
	setTimeout(function(){
		$("#publishButton").focus();
		},1000);
};

/**取界面元素  **/
shijiulou.getPageInfo=function(){
	var displayname = $(displayname_sel).text().replace("的家","")
	var accountname = "";

	var forumname = $("#second_position").text();
	var forumurl = $("#second_position").attr("href");
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
shijiulou.hc_button=function(page){
	var displayname=page.displayname;
	
	console.log("displayname : " + displayname);
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
		$(".post-hd>.u-add>.link1").each(function(i){
			//var author_obj = $(this).find("div.author");
			var author_obj = $(this);
		
			var username = author_obj.find("div.uname a span").text().trim();
			console.log("username : "+ username);
		
     	//	if(username==displayname){
				author_obj.append("<pbutton style='margin-top: 5px' class='pf_button pf_orange pf_small' name='btn_up'>回传</span>");
		//	}
		});
		$(".cont>.cont-hd>.link1").each(function(i){
			//var author_obj = $(this).find("div.author");
			var author_obj = $(this);
		
			var username = author_obj.find("div.uname a span").text().trim();
			console.log("username : "+ username);
		
     	//	if(username==displayname){
				author_obj.append("<pbutton style='margin-top: 5px' class='pf_button pf_orange pf_small' name='btn_up'>回传</span>");
		//	}
		});
		
	}
};


/**
 * 列表tr以及处理
 */
shijiulou.listValue=function(obj){
	
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
		var trobj = obj.parents(".post-hd");
		var tmpobj  = obj.parents(".cont-hd");
		console.log(trobj);
		//content = trobj.parent().find(".thread-cont").text().trim().replace(/\n|\r|\t/g,"");
		
		content = trobj.next().text();
		if (!content) {content = tmpobj.next().children(".J_referSelectItem").text();}
		url = currenturl;
		var tail_area = trobj.parent().find("div.cont div.cont-hd");
	//	console.log(tail_area);
		posttime = tail_area.find("p.fl span").text();
		posttime = publicpfinduct.dealWithTime(posttime);
	//	console.log(posttime);
		//楼层
		var floor = tail_area.children().last("a").text().trim().replace(/\n|\r|\t|#/g,"");
	//	console.log(floor);
		
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
shijiulou.fillAccountAndPwd=function(pfinducturl,currenturl,userid){
	$("#userName").unbind("click").die("click").live("click",function(){

		var obj = $(this);
		//获取taskid
		publicpfinduct.getCurrentTaskid(pfinducturl,function(taskid){
			account.selectAccount(function(username,password){
//				publicpfinduct.switchCookies(pfinducturl,currenturl,username,password,true);
				var p = obj.parents("form");
				obj.val(username);
				p.find("#userPass").val(password);
				
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
	 $("#userName").val(username);
	 $("#userPass").val(password);
	 document.getElementById("loginButton").click();
}

/**
 * 批量发帖
 */
shijiulou.mutitask=function(pfinducturl,settings){
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
			
			var materials = shijiulou.getSingleMaterial(pfinducturl,mid);
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

shijiulou.getSingleMaterial=function(pfinducturl,mid){
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

shijiulou.fillcheckbox=function(){
 //暂不实现
}



