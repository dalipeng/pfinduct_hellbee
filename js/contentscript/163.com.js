var net163 = {};
//发帖区域
var fatie_sel="#div_reply";
//附加选择素材区域
var material_sel = "articleReplyLogin";
//发帖区域标题
var title_sel = "#title";
//发帖区域内容
var content_sel = "document.getElementsByName('editorIframe')[0].contentDocument.body.innerHTML";
//昵称
var displayname_sel="ntes_usercenter_name";

//列表界面
var list_sel = "div.board-list-one";
//回复列表
var htlist_sel = ".tie-item,.tie-first-item";
//获取版块名称
var forum_sel = "ul.nav_left li a";
//回帖标题
var ht_title_sel = "div.tie-con-hd h2.tie-con-hd-title";

var state = -1;
var currenturl = window.location.href;
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
		/http:\/\/(.*)\.163\.com(.*)/,
		/http:\/\/(.*)\.163\.com\/bbs\/post(.+)/,
		/http:\/\/(.*)\.163\.com\/post\/(.+)\.html/,
		/http:\/\/(.*)\.163\.com\/board\/(.+)\.html/,
		/http:\/\/(.*)\.163\.com\/bbs\/(.*)\d+\.html/,
		/http:\/\/(.*)\.163\.com\/list\/(.*)/,
		/http:\/\/comment\.(.*)\.163\.com\/(.*)/,
		/http:\/\/news\.163\.com\/\d+\/\d+(.*)\.html$/
		
	];
	var url = window.location.href;
	console.log("url : " + url);
	state = publicpfinduct.URLState(regArr,url);

	console.log("neteasy state:"+state);
//	setInterval(function(){window.location.reload()},1000);
	if(state==-1){ 
		return;
	}

	//contentscript.js中一个全局变量

	var userstr=settings.user;
	var user=JSON.parse(userstr);
	
	var pfinducturl = user.pfinducturl;
	var userid = user.userid;
	
	if(state>0){
		pageInfoData = net163.getPageInfo();
		//检查界面登录状态
		publicpfinduct.checkPageInfo(pageInfoData);
		//素材注入(1,2,3都需要注入)
	}
	
	
	
	//素材注入
	if(state==1||state==2||state==3||state==4 || state == 7 || state == 6){
	
		publicpfinduct.insertMaterial(pfinducturl,net163.pageDeal,net163.setFormValues);
		
	}
	
	//回传
	if(state==4||state==5 || state == 6 || state == 7){

		publicpfinduct.sendBack(pfinducturl,userid,pageInfoData,net163.hc_button,net163.listValue);
	}
	
	//账号选择
	if(state>=0){
	net163.fillAccountAndPwd(pfinducturl,currenturl,userid);
	}
	//顶贴
	if (state == 6) {

		$(".top-banner").css({"display":"none"});
	    $("#hotReplies .list").css({"max-height":"500px","overflow-y":"auto"});
		net163.ding(url);
		$("#mainLogon").append("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</pbutton>");
		$(".author").each(function(i){
			$(this).find("div.tie-author-column").append("<pbutton style='margin-top: 5px' class='pf_button pf_orange pf_small' name='btn_up'>回传</span>");
		});
		
	}
	//新闻界面或者评论界面需要插入选择素材
	if (state == 7) {
//		console.log($("#tieArea").find(".tie-info"));
		$("#tieArea").find(".tie-info").append("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</pbutton>");
	}

//		setTimeout(window.location.reload(), 1000);
		
	
	
	
};

/**
 * 选择素材按钮注入
 */
net163.pageDeal=function(){
		 
	if(state==1){
		$(".back_form .form").find("ul li").eq(0).append("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</pbutton>");
	}else if(state==2){
		$(".back_form p").eq(0).append("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</pbutton>");
	} else if (state == 6 || state == 7) {
		$("#tieArea").find(".tie-info").append("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</pbutton>");
	}
	
};



/**取界面元素  **/
net163.getPageInfo=function(){
	var displayname = "";
	if(state==1||state==2||state==3){
		displayname = $("#myLoginButton a").eq(0).text();
	}else if(state==4||state==5){
		displayname = $(".info-username").eq(0).text();
	}else if (state == 7) {
		displayname = $("#js_N_navUsername").text();
	}else if (state == 6) {
		displayname = $(".js-username").text().replace("谁家那个小谁","");
	}
	var accountname = "";
//	var formnameobj = $(forum_sel).eq(0);
//	var forumname = "百度贴吧-"+formnameobj.text();
//	var forumurl = formnameobj.attr("href");
//	forumurl = publicpfinduct.dealWithUrl(forumurl,preforumurl);
	
	var forumname= "网易论坛"+$("title").text();
	var forumurl= window.location.href;
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
net163.hc_button=function(page){
 
	var displayname=page.displayname;
	if(state==5){
		//贴吧界面 回传按钮
		$(list_sel).each(function(i){
			var username=$(this).find(".board-list-write a").text();
			if(username==displayname){
				$(this).find("div.board-list-title-inner").append("<pbutton style='margin-left: 10px' class='pf_button pf_orange pf_small' name='btn_up'>回传</span>");
			}
		});
		
		
	}else if(state==4){
		//回帖界面注入
		$(htlist_sel).each(function(i){
			var author_obj = $(this).find("span.info-name a");
			var username = author_obj.eq(0).text();
			if(username==displayname){
				$(this).find("div.tie-author-column").append("<pbutton style='margin-top: 5px' class='pf_button pf_orange pf_small' name='btn_up'>回传</span>");
			}
		});
		
	}else if (state == 6){
 
		$(".author").each(function(i){
			$(this).append("<pbutton style='margin-top: 5px' class='pf_button pf_orange pf_small' name='btn_up'>回传</span>");
		});
		
		$(".pages li a").live("click",function(){
			
			setInterval(function(){
			 
				$(".author").each(function(i){
					if (!$(this).children("pbutton").length) {
						$(this).append("<pbutton style='margin-top: 5px' class='pf_button pf_orange pf_small' name='btn_up'>回传</span>");
					}

				});
			},2000);
			
		
			
			/*setTimeout(function(){
				$(".author").each(function(i){
					$(this).append("<pbutton style='margin-top: 5px' class='pf_button pf_orange pf_small' name='btn_up'>回传</span>");
					console.log("-------------");
				});
			},2000);*/
			
		
		});
	}
};


/**
 * 列表tr以及处理
 */
net163.listValue=function(obj){
	var trdata = new Object();
	var title = "";
	var url = "";
	var content = "";
	var posttime = "";
	var resulttype = "";
	var heatnum = 0;
	var ranknum = 0;
	var _displayname = "";
	
	if(state==5){
		resulttype = 1;
		
		var trobj = obj.parents(list_sel);
		var listobj = trobj.find(".board-list-title-inner a");
		url = listobj.attr("href");
		url = publicpfinduct.dealWithUrl(url,preforumurl);
		title = listobj.text();
		
	}else if(state==4){
		var trobj = obj.parents(htlist_sel);
		content = trobj.find("div.tie-content").text();
		console.log(content);
		url = currenturl;
		var tail_area = trobj.find("div.tie-con-hd-panel");
		var s = tail_area.find("span.time").text().toString();
		var split = s.split(s.charAt(2)+s.charAt(3));
		posttime = split[0];
		floor = split[1];
		posttime = publicpfinduct.dealWithTime(posttime);
		//楼层
		if(floor!="楼主"){
			resulttype = 2;
		}else{
			resulttype = 1;
		}
		title = $(ht_title_sel).text();
		
	}
	//新闻
	if ( state == 6) {
		var trobj = obj.parents(".reply");
		content = trobj.find(".body").children().last().text();
		if (!!obj.parents(".commentInfo").length) {
		 
			trobj = obj.parents(".commentInfo")
			content = trobj.next().text();
		}
		//找到显示名
		_displayname = trobj.find(".author").children("a").text();
		if (!_displayname) {_displayname = trobj.find(".from").text();}
		posttime = trobj.find(".postTime").text().replace("发表","").trim();
		resulttype = 2;
		url = currenturl;
		title = $("title").text(); 
		//热度  这里使用原生的js操作
		//heat = obj[0].offsetParent.nextElementSibling.nextElementSibling.nextElementSibling.children[0].textContent.replace(/顶|\[|\]/g,"").trim();
		heatnum = obj.parent().next().next().next().children().eq(0).text().replace(/顶|\[|\]/g,"").trim();
		//排名
		//获取当前在第几页
		//var page = $(".hot-pages li .current").text().trim();
		//var index = $("pbutton[name='btn_up']").index(obj);
		//var currObj = $(this).parents(".reply");
        ranknum = $(".reply").index(trobj) + 1;
		//ranknum = $("pbutton[name='ding']").index(obj) + 1;
	 
	 
 		console.log(trobj);
	}
	trdata.title = title;
	trdata.url = url;
	trdata.content = content;
	trdata.posttime = posttime;
	trdata.resulttype = resulttype;
	trdata.displayname = _displayname;
	trdata.heatnum = heatnum;
	trdata.ranknum = ranknum;
	console.log("网易新闻 渠道的数据信息： ");
	console.log(trdata);
	return trdata;
};


/**
 * 选择填充账号
 */
net163.fillAccountAndPwd=function(pfinducturl,currenturl,userid){

	$("input[name=username]").bind("click",function(){
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
	
	$("input.js-username").bind("click",function(){
		var obj = $(this);
		//获取taskid
		publicpfinduct.getCurrentTaskid(pfinducturl,function(taskid){
			account.selectAccount(function(username,password){
//				publicpfinduct.switchCookies(pfinducturl,currenturl,username,password,true);
				var p = obj.parents("form");
				obj.val(username);
				p.find("input.js-password").val(password);
				
			},pfinducturl,currenturl,taskid);
			
		},userid);
	})
	
};

net163.pageDeal=function(){
	//位置翻转
	//document.getElementsByClassName("tie-tab-bottom-nav")[0].id="tie-tab-bottom-nav0";
	//$(fatie_sel).insertBefore("#tie-tab-bottom-nav0");
	if(state==1||state==3||state==2){
		var div = document.createElement("div");
		div.innerHTML = "<span id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</span>";
		document.getElementsByClassName("regularpost postform active")[0].parentNode.insertBefore(div,document.getElementsByClassName("regularpost postform active")[0]);
	}else if(state==4){
		var div = document.createElement("div");
		div.innerHTML = "<span id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</span>";
		document.getElementById("articleReplyLogin").parentNode.insertBefore(div,document.getElementById("articleReplyLogin"));
		var offset = $("#div_reply").scrollTop();
		$("document").scrollTop(offset);
	}
	
};

net163.setFormValues=function(title,content){
	if (state==1||state==3||state==2 || state == 4 ){
		$(title_sel).val(title);
		document.getElementsByName('editorIframe')[0].contentDocument.body.innerHTML = content;
	}else if (state == 6 || state == 7){
		document.getElementsByName("body")[0].value = content;
	}
	
	//$(content_sel).focus();
	//setTimeout(function(){
	//	$(".c_captcha_input_normal").focus();
	//	},1000);
/*	if(state==1||state==3||state==2){
		document.getElementById("btnSubmit").firstChild.click();
		$("input[name=checkcode]").focus();
	}else if(state==4){
		$("#btnSubmit a").click();
		//document.getElementById("btnSubmit").children[0].click();
		//$("a:contains(\'回复本帖\')").click();
	}
*/
};

net163.ding=function(url){
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
				$(".author").each(function(){
					var nickname = $(this).children().eq(1).text();
					var content  = $(this).next().next().text();
					var now =$(this).next().next().next().children().eq(0).children().eq(0).text().replace(/\[|\]|顶/g,"");
		//			console.log($(this).next().next().next().children().eq(0).text());

		//			console.log(nickname);
					if (induct_config["nickname"] == nickname && induct_config["content"] == content) {
						induct_config["now"] = now;
						localStorage[url] = JSON.stringify(induct_config);
						console.log($(this).next().next().next().children().eq(0).children().eq(0)[0]);
						console.log($(this).next().next().next().children().eq(0).children().eq(0)[0].click())
					 
						
						
						setTimeout(window.location.reload(), 1000);
					}
				});
		 
			
		}
		
		}else{
			localStorage[url] = "";
			//如果为空， 就在每一个后面加上按钮
			$(".support").each(function(){
//				console.log($(this).html());
				$(this).append('<pbutton name="ding" class="pf_button pf_orange pf_small ding">顶</pbutton>')
			});
			
			$(".ding").live("click",function(){
				$(this).parent().append("<input type='text' style='width:30px' ><pbutton class='pf_button pf_orange pf_small'><span class='induct_ok'>前台顶</span>|<span class='back_ding'>后台顶</span></pbutton>");
			});
		
			$(".induct_ok").live("click",function(){
				var obj = {};
				var target = $(this).parent().prev().val();
				var nickname = $(this).parent().parent().parent().prev().prev().prev().children().eq(1).text();
				var content = $(this).parent().parent().parent().prev().text();
				var now = $(this).parent().prev().prev().prev().children("em").text().replace(/\[|\]/g,"");
				obj.target = target + now;
				obj.nickname = nickname;
				obj.content = content;
				obj.now = now;
				localStorage[url] = JSON.stringify(obj);
				setTimeout(window.location.reload(), 1000);
	 
			});
		}
		
		//对下一页、上一页 进行处理
		$(".pages li").each(function(){
			$(this).live("click",function(){
				var nextpage_ding = setInterval(function(){
					if (!$(".ding").length) {
						$(".support").each(function(){ 
							$(this).append('<pbutton class="pf_button pf_orange pf_small ding">顶</pbutton>');
						});
					}
					//else{
					//	clearInterval(nextpage_ding);
					//}
			},2000);
			});
		});
		
		/*
		$(".beginEnd").live("click",function(){
			var nextpage_ding = setInterval(function(){
				if (!$(".ding").length) {
					$(".support").each(function(){ 
						$(this).append('<pbutton class="pf_button pf_orange pf_small ding">顶</pbutton>')
					});
				}else{
					clearInterval(nextpage_ding);
				}
			},2000);
			
		});*/
		
	
	
			
		$(".back_ding").live("click",function(){
				var url = window.location.href;
				var originurl = $(".origPost").children().eq(1).attr("href");
				
				var mainpage = $("#mainReplies .current").first().text();
				var dingnum = $(this).parent().prev().val();
				if (!dingnum) {
					alert("请输入需要顶的数量！！");
					return;
				}
				//点击的地区， 是点击的热帖区域还是下面的跟帖区域
				var area = $(this).parents(".replies").attr("id");
						
				var urlarray = url.split("/"); 
				var index = 0; 
				var nickname = $(this).parent().parent().parent().prev().prev().prev().children().eq(1).text();
				var content = $(this).parents(".operations").prev().text().trim();
				 
				//如果点的是热帖区域
				if ("hotReplies" == area) {
					
					//热帖区域的数量
					var hotPage = $("#hotReplies .current").first().text();
					var offset = parseInt(hotPage) - 1;
			 
					//网易在第一次请求的时候返回所有热帖数据
					var replyDataUrlTmp = "http://comment.news.163.com/api/v1/products/a2869674571f77b5a0867c3d71db5856/threads/{forum}/comments/hotTopList?offset=0&limit=40&showLevelThreshold=72&headLimit=1&tailLimit=2";
					
					/*
					http://comment.news.163.com/api/v1/products/a2869674571f77b5a0867c3d71db5856/threads/BGLQGVO600014JB5/comments/hotTopList?offset=0&limit=40&showLevelThreshold=72&headLimit=1&tailLimit=2&callback=getData
					
					*/
					var replyDataUrl = replyDataUrlTmp.replace("{forum}",urlarray[4].substring(0,urlarray[4].indexOf(".")));
					console.log(replyDataUrl);
					var uniquekey;
					var get=new XMLHttpRequest();
						get.onreadystatechange=function(){
						  if (get.readyState==4 && get.status==200){
								var res = JSON.parse(get.responseText);
								// commentIds = res['commentIds'];						
								var comments = res['comments'];
								var tempobj;
								for (var i in comments) { 
								    var comment = comments[i];
									if (comment['content'].trim() == content && (comment['user'].nickname == nickname || nickname.indexOf(comment['user'].location) != -1)) {
										var reqStr = comment['postId'];
										if(reqStr) {
											uniquekey = comment['postId'].replace("_",",");
											break;
										}										  
									}
								}
								if (typeof uniquekey === "undefined") {
									alert("数据获取异常,请联系管理员");
									return ;
								}	
								var retdata= {};
								retdata["uniquekey"] = uniquekey;
							 
								retdata["num"] = dingnum;
								retdata["url"] = originurl;
								retdata["displayname"] = nickname;
								retdata["content"] = content;
								 
								chrome.extension.sendMessage({method:"backpost",key:retdata,value:""},function(){window.location.href = window.location.href;});
								 
								//传到background
						  }
						}
						get.open('GET',replyDataUrl,true);
						get.send();
				}else if ("mainReplies" == area) {
						var mainPage = $("#mainReplies .current").first().text();
						//index 的计算规则是 当前的index 加上分页的数量
						//index = $("#mainReplies .ding").index($(this).parent().prev().prev());
				        var offset = (parseInt(mainPage) - 1) * 30;
						var newsPostListUrlTmp = "http://comment.news.163.com/api/v1/products/a2869674571f77b5a0867c3d71db5856/threads/{forum}/comments/newList?offset={offset}&limit=30&showLevelThreshold=72&headLimit=1&tailLimit=2";
						var newsPostListUrl = newsPostListUrlTmp.replace("{offset}",offset).replace("{forum}",urlarray[4].substring(0,urlarray[4].indexOf(".")));
						var uniquekey;
						var get=new XMLHttpRequest();
							get.onreadystatechange=function(){
							  if (get.readyState==4 && get.status==200){
								var res = JSON.parse(get.responseText);		
								var comments = res['comments'];
								var tempobj;
								for (var i in comments) { 
								    var comment = comments[i];
									if (comment['content'].trim() == content && (comment['user'].nickname == nickname || nickname.indexOf(comment['user'].location) != -1)) {
										var reqStr = comment['postId'];
										if(reqStr) {
											uniquekey = comment['postId'].replace("_",",");
											break;
										}										  
									}
								}
								if (typeof uniquekey === "undefined") {
									alert("数据获取异常,请联系管理员");
									return ;
								}	 
									 
								var retdata= {};
									retdata["uniquekey"] = uniquekey;
									retdata["num"] = dingnum;
									retdata["url"] = originurl;
									retdata["displayname"] = nickname;
									retdata["content"] = content;
									chrome.extension.sendMessage({method:"backpost",key:retdata,value:""},function(){window.location.href = window.location.href;});
								 
							  }
							}
							get.open('GET',newsPostListUrl,true);
							get.send();
				}
		}); 
}

//发帖导航自动登录
function autologin(username,password){
	
	$("#bbsusername").val(username);
	$("input[name='password']").val(password);
	$(".input011").click();
	
	$("#js_loginframe_username").val(username);
	$("input.ntes-loginframe-label-ipt[type='password']").val(password);
	$("button.ntes-loginframe-btn").click();
	
}