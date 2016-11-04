var xici = {};
//列表界面
var list_sel = "tr[class^=board_bg_]";
//回复列表
var htlist_sel = "div.doc_sp[id^=floor]";

var state = -1;
//url前缀
var preforumurl = currenturl.match(/http:\/\/(\w+\.)+(\w+)/g)[0];

/**
 * 账号选择添加公用div
 */
function addAccountDiv() {
    try {
    	// 页面中放入隐藏元素
		var pfinduct_hideDiv = document.createElement("div");
		pfinduct_hideDiv.id = "hideLoginDiv";
		pfinduct_hideDiv.style = "display:none";
		document.body.appendChild(pfinduct_hideDiv);
		$("ul.user_login>li:eq(1)>a:first").bind('click',function(){
			setTimeout(function(){
				$('#UserName', $($('#newShopIframe')[0].contentDocument)).die('click').live('click',function(){
					pfinduct_hideDiv.click();
				});
			},500);
		});
	}
    catch (e) { }
}

var pageinit = function(settings){
	
	//如果存在，那么需要通过界面注入隐藏元素和js来处理
	addAccountDiv();
	/**
	 * 0 :基域名
	 * 1 :发帖界面
	 * 2 :回帖界面
	 * 3 :列表界面
	 */
	var regArr=[
		/http:\/\/www\.xici\.net(.*)/,
		/http:\/\/www\.xici\.net\/b(.+)/,
		/http:\/\/www\.xici\.net\/d(.+)/,
		/http:\/\/www\.xici\.net\/b(.+)/
	];
	state = publicpfinduct.URLState(regArr,currenturl);
	console.log("xici state:"+state);
	
	if(state==-1){ 
		return;
	}
	
	var userstr=settings.user;
	var user=JSON.parse(userstr);
	
	var pfinducturl = user.pfinducturl;
	var userid = user.userid;
	if(state>0){
		pageInfoData = xici.getPageInfo();
		//检查界面登录状态
		publicpfinduct.checkPageInfo(pageInfoData);
	}
	//素材注入
	if(state==1||state==2){
		publicpfinduct.insertMaterial(pfinducturl,xici.pageDeal,xici.setFormValues);
	}
	
	//回传
	if(state==1||state==2){
		publicpfinduct.sendBack(pfinducturl,userid,pageInfoData,xici.hc_button,xici.listValue);
	}
	
	//账号选择
	if(state>=0){
		xici.fillAccountAndPwd(pfinducturl,currenturl,userid);
	}
		
	
};

/**
 * 选择素材按钮注入
 */
xici.pageDeal=function(){
	
	if(state==1){
		$("select[name=doc_topic]").css({width:"120px"});
		$("#msg .ftit").append("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</pbutton>");
	}else if(state==2){
		$("#msg .ftit").append("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</pbutton>");
	}
	
};

/**
 * 发帖区域赋值
 */
xici.setFormValues=function(title,content){
	if(state==1){
		$("input[name='doc_title']").val(title);
		$("#mce_editor_0").contents().find("body").empty().append(content);
		$("input[name='doc_title']").focus();
		setTimeout(function(){
			$("#verifyimg").focus();
			},1000);

	}else if(state==2){
		$("#mce_editor_0").contents().find("body").empty().append(content);
		//$('#bSendDoc').click();
	}
};

/**取界面元素  **/
xici.getPageInfo=function(){
	var displayname = $("ul.user_info>li:last>a:first").text();
	 
	var accountname = displayname;
	var formnameobj = $("#bd_nav a:eq(2)");
	var forumname = "西祠胡同-"+formnameobj.text();
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
xici.hc_button=function(page){
	var displayname=page.displayname;
	if(state==1){
		//列表界面 回传按钮
		$(list_sel).each(function(i){
			var username=$(this).find("td:eq(2) a").text();
			username=$.trim(username);
			//console.log(username+"~~~"+displayname+"~~~");
			if(username==displayname){
				$(this).find("td:eq(1)").append("<pbutton style='margin-left: 10px' class='pf_button pf_orange pf_small' name='btn_up'>回传</pbutton>");
			}
		});
		
		
	}else if(state==2){
		//回帖界面注入(去掉楼主)
		$(htlist_sel).filter("[id!=floor1]").each(function(i){
			var username = $(this).find("div.td_r div.l>a:first").text();
			//console.log(username+"~~~"+displayname+"~~~");
			if(username==displayname){
				$(this).find("div.td_l").append("<pbutton style='margin: 5px' class='pf_button pf_orange pf_small' name='btn_up'>回传</pbutton>");
			}
		});
		
	}
};


/**
 * 列表tr以及处理
 */
xici.listValue=function(obj){
	var trdata = new Object();
	var title = "";
	var url = "";
	var content = "";
	var posttime = "";
	var resulttype = "";
	
	if(state==1){
		resulttype = 1;
		
		var trobj = obj.parents(list_sel);
		var listobj = trobj.find("td:eq(1) a:first");
		url = listobj.attr("href");
		url = publicpfinduct.dealWithUrl(url,preforumurl);
		title = listobj.text();
	}else if(state==2){
		var trobj = obj.parents(htlist_sel);
		content = trobj.find(".td_r div.doc_txt")[0].childNodes[0].nodeValue;
		url = currenturl;
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
xici.fillAccountAndPwd=function(pfinducturl,currenturl,userid){
	$("#hideLoginDiv,#UserName").unbind("click").die("click").live("click",function(){
		//存在iframe的登陆窗
		var login_ifr = $('#newShopIframe')[0];
		//获取taskid
		publicpfinduct.getCurrentTaskid(pfinducturl,function(taskid){
			account.selectAccount(function(username,password){
//				publicpfinduct.switchCookies(pfinducturl,currenturl,username,password,true);
				if(login_ifr){
					$('#UserName', $(login_ifr.contentDocument)).val(username);
					$('.inp_tip', $(login_ifr.contentDocument)).text('').die('click');
				}else{
					$("#UserName").val(username);
					$('.inp_tip').text('').die('click');
				}
				if(login_ifr){
					$('#Password', $(login_ifr.contentDocument)).val(password);
				}else{
					$("#Password").val(password);
				}
				
			},pfinducturl,currenturl,taskid);
			
		},userid);
	});
	
};

function autologin(username,password){
	$("input[name='username']").val(username);
	$("input[name='password']").val(password);
 	$("button[type='submit']").click(); 
 
	
}