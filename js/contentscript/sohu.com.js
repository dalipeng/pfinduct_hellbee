var sohu = {};

var state = -1;

var currenturl = window.location.href;
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
		/http:\/\/(.*)\.sohu\.com(.*)/,
		/http:\/\/club\.(.*)\.sohu\.com\/\?.*action=post.*/,
		/http:\/\/club\.(.*)\.sohu\.com\/\?.*action=read.*/,
		/http:\/\/club\.(.*)\.sohu\.com\/\?.*action=list.*/,
		/http:\/\/quan\.sohu\.com\/pinglun\/\w+\/\d+/,
		/http:\/\/news\.sohu\.com\/\d+\/\w\d+\.shtml.*/,
		/http:\/\/m\.sohu\.com\/cm\/\d+/,
		
	];
	state = publicpfinduct.URLState(regArr,currenturl);
	console.log("sohu state:"+state);
	//setInterval(function(){window.location.reload()},1000);
	
	
	if(state==-1){ 
		return;
	}
	
	var userstr=settings.user;
	var user=JSON.parse(userstr);
	
	pfinducturl = user.pfinducturl;
	var userid = user.userid;
	if(state>0){
		pageInfoData = sohu.getPageInfo();
		//检查界面登录状态
		publicpfinduct.checkPageInfo(pageInfoData);
	}
	//素材注入
	if(state==1||state==2 || state == 4 || state == 5){
		publicpfinduct.insertMaterial(pfinducturl,sohu.pageDeal,sohu.setFormValues);
	}
	
	//回传
	if(state==3||state==2 || state ==4){
		publicpfinduct.sendBack(pfinducturl,userid,pageInfoData,sohu.hc_button,sohu.listValue);
	}
	
	//账号选择
	if(state>=0){
		sohu.fillAccountAndPwd(pfinducturl,currenturl,userid);
	}
	
	if (state == 4 || state ==6) {
		
		//$(".topic-changyan").css({"height":"500px","overflow":"scroll","overflow-x":"hidden"});
		$(".article-description").css({"display":"none"});
		$(".list-block-gw.list-hot-w").css({"height":"500px","overflow":"auto","overflow-x":"hidden"});
		$(".section-list-w").css({"position":"relative"});
		$(".list-hot-w .block-title-gw").css({"position":"absolute","top":"-29px","width":"100%"});
		
		
		$("#page_sohu").bind("click",function(){

			setTimeout(function(){
				$(".wrap-user-gw").each(function(i){
					$(this).append("<pbutton  class='pf_button pf_orange pf_small' name='btn_up'>回传</pbutton>");
				});
				
		 
			 
				$(".action-click-gw").each(function(){
					$(this).append('<pbutton class="pf_button pf_orange pf_small ding">顶</pbutton>')
				 
				});
		 
			},1000);
			 
		});
	
		
		sohu.ding(currenturl);

	}
	

	$("input[type='submit']").bind("click",function(){
		var interFlag = true;
		var inter = setInterval(function(){
		console.log(pageInfoData);		//回帖界面注入
		var displayname=pageInfoData.displayname;
		$("table.viewpost").each(function(i){
			var author_obj = $(this).find("span#userinfo>a");
			var username = author_obj.text();
			console.log(username+"~~~"+displayname);
			if(username==displayname){
				interFlag = false;
				console.log($(this).find("tr th pbutton").html());
				if (!$(this).find("tr th pbutton").html()) {
					$(this).find("tr th").append("<pbutton  class='pf_button pf_orange pf_small' name='btn_up'>回传</pbutton>");
				}
				
			}
		});
		if (!interFlag) {
			clearInterval(inter);
		}
		},5000);
	});
};

/**
 * 选择素材按钮注入
 */
sohu.pageDeal=function(){
	
	if(state==1){
		$("#reply .title").append("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</pbutton>");
	}else if(state==2){
		$("#editor_form dl dt").append("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</pbutton>");
		//$("#editor_form").insertBefore(".pageLite");	
	}else if (state == 4 || state == 5) {
		
	//	$("#article_info_sohu").find(".title-join-w").last().prepend("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</pbutton>");
	$("#article_info_sohu").append("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</pbutton>");
		$("#comment_sohu").insertAfter("#powerby_sohu")
		$("#article_info_sohu").insertAfter("#powerby_sohu");

		//$("#article_info_sohu").append("<pbutton id='material_btn_select' class=\"pf_button pf_orange pf_small\" >选择素材</pbutton>");
	}
	
};

/**
 * 发帖区域赋值
 */
sohu.setFormValues=function(title,content){
	if(state==1){
		$("#ipt_title").val(title);
		$("#editor_ifr").contents().find("#tinymce").empty().append(content);
		$("#tinymce",$("#editor_ifr").contents()).click();
		setTimeout(function(){
			if($("#vcode").length>0){
				$("#vcode").focus();
			}
		},500);
		
	}else if(state==2){
		$("#editor").val(content);
		$("#editor").click();
		setTimeout(function(){
			if($("#vcode").length>0){
				$("#vcode").focus();
			}
		},500);
		
	}else if ( state ==  4 || state == 5 ){
		$("textarea.textarea-fw").focus();
		$("textarea.textarea-fw").val(content);
	
	}
};

/**取界面元素  **/
sohu.getPageInfo=function(){
	var userObj = $("#userCardyes em.userCard a");
	var displayname = userObj.text();
	var userurl = userObj.attr("href");
	var accountname="";
	if(userurl){
		accountname = userurl.split("=")[1];
	}
	var formnameobj = $("div.navigation>a:last");
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
		//列表界面 回传按钮
		$("table.postlist>tbody>tr").each(function(i){
			var username=$(this).find("td:eq(1) span a").text();
			//console.log(username+"~~~"+displayname);
			if(username==displayname){
				$(this).find("td:eq(0)").append("<pbutton class='pf_button pf_orange pf_small' name='btn_up'>回传</pbutton>");
			}
		});
		
		
	}else if(state==2){
		//回帖界面注入
		$("table.viewpost[id!=post_0]").each(function(i){
			var author_obj = $(this).find("span#userinfo>a");
			var username = author_obj.text();
			//console.log(username+"~~~"+displayname);
			if(username==displayname){
				$(this).find("tr th").append("<pbutton  class='pf_button pf_orange pf_small' name='btn_up'>回传</pbutton>");
			}
		});
		
	}else if (state == 4){
		$(".wrap-user-gw").each(function(i){
			$(this).append("<pbutton  class='pf_button pf_orange pf_small' name='btn_up'>回传</pbutton>");
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
	var dispalyname = "";
	var ranknum = "";
	var heatnum = "";
	
	if(state==3){
		resulttype = 1;
		
		var trobj = obj.parents("tr");
		var listobj = trobj.find("td:eq(0) a");
		url = listobj.attr("href");
		url = publicpfinduct.dealWithUrl(url,preforumurl);
		title = listobj.text();
	}else if(state==2){
		var trobj = obj.parents("table");
		content = trobj.find("tbody>tr>td div.wrap").text();
		url = currenturl;
		resulttype = 2;
	}else if (state == 4){//新闻回传页面
		var trobj = obj.parents(".msg-wrap-gw");
		content = trobj.find(".wrap-issue-gw").text();
		title= $("title").text().replace("圈子","搜狐");
		displayname = trobj.find(".user-name-gw").text();
		heatnum = obj.parent().next().next().children().eq(0).find(".icon-name-bg").text().trim();
	
		//ranknum = $("pbutton[name='btn_up']").index(obj) + 1;  
        var currobj = obj.parents(".block-cont-gw");
        
        ranknum = $(".block-cont-gw").index(currobj) + 1;
		url = currenturl;
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
sohu.fillAccountAndPwd=function(pfinducturl,currenturl,userid){
	$("#email,#pemail,#passport-id").unbind("click").die("click").live("click",function(){
		var obj = $(this);
		//获取taskid
		publicpfinduct.getCurrentTaskid(pfinducturl,function(taskid){
			account.selectAccount(function(username,password){
//				publicpfinduct.switchCookies(pfinducturl,currenturl,username,password,true);
				
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
			
		},userid);
	});
};

sohu.ding=function(url){
			//先去localstroagr 里面去找当前url是否有任务， 如果没有就在这个界面的后缀展示“顶”
		var mres = /http:\/\/quan\.sohu\.com\/pinglun\/\w+\/(\d+)/.test(url);
		var murl = window.location.href;
		var topicid = RegExp.$1;
/*		if (mres){
			murl = "http://m.sohu.com/cm/"+ topicid +"/";
		}else{
			murl = url;
		}
*/
	 
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
					if (!!$(".action-click-gw").length) {
						clearInterval(inter);
						
						$(".action-click-gw").each(function(){
							var nickname = $(this).parent().prev().prev().find(".user-name-gw").text();
							var address =  $(this).parent().prev().prev().find(".user-address-gw").text();
							var content = $(this).parent().prev().text().replace(/\n|\r|"/g,"");
							var now = $(this).find(".icon-name-bg").text();
							var topic = induct_config["topicid"];
							var commentid = induct_config["commentid"];
							var topicid = $("#list_sohu").attr("topicid");
							console.log(induct_config["nickname"] + " &&  " + nickname + " &&  " + induct_config["content"] + " && " + content);
							if (induct_config["nickname"] == nickname && induct_config["content"] == content) {
		 
								induct_config["now"] = now;
								localStorage[murl] = JSON.stringify(induct_config);
//								$.get("http://pinglun.sohu.com/post/simple_up?topicId="+ topic +"&commentId="+ commentid +"&rt=json&_input_encode=UTF-8&_output_encode=UTF-8",function(res){
								alert("正在顶贴， 请过几分钟后查看");
								setInterval(function(){
									$.get("http://changyan.sohu.com/api/2/comment/action?callback=fn&action_type=1&comment_id="+ commentid +"&client_id=cyqemw6s1&topic_id="+ topicid +"&_=1415693539543",function(res){
									res = res.replace("fn(",""),replace(")");
									console.log(res);
									//var rtval = JSON.parse(res);
									induct_config["now"] = res["count"];
									localStorage[murl] = JSON.stringify(induct_config);
									if (res["count"] >=  induct_config["target"]) {
										localStorage[url] = "";
										return false;
									}
									setTimeout(window.location.reload(), 1000);	
									return false;
								});
								},5000);
								return false;
							
							}
						});
					}
					
				} ,1000);

			}
		}else{
			localStorage[url] = "";
			var inter = setInterval(function(){
				if (!!$(".action-click-gw").length) {
					$(".action-click-gw").each(function(){
						$(this).append('<pbutton class="pf_button pf_orange pf_small ding">顶</pbutton>')
						clearInterval(inter);
					});
				}
			
			},1000);
 
			
			$(".ding").live("click",function(){
				if (!$(this).next()[0]) {
					$(this).parent().append("<input type='text' style='width:30px' ><pbutton class='pf_button pf_orange pf_small'><span class='induct_ok'>前台顶</span>|<span class='back_ding'>后台顶</span></pbutton>");
				}else{
					$(this).next()[0].focus();
				}
			});
		
			$(".induct_ok").live("click",function(){
				var obj = {};
				var target = $(this).parent().prev().val();
				var nickname = $(this).parent().parent().parent().prev().prev().find(".user-name-gw").text();
				var address =  $(this).parent().parent().parent().prev().prev().find(".user-address-gw").text();
				var content = $(this).parent().parent().parent().prev().text().replace(/\n|\r|"/g,"");
				var now = $(this).parent().find(".icon-name-bg").text();
				var commentid = $(this).parents(".block-cont-bg").attr("cmtid");
				now = !now ?  0 : now;
				obj.target = target + now;
				obj.nickname = nickname;
				obj.content = content;
				obj.topicid = topicid;
				obj.commentid = commentid;
				obj.now = now; 
				localStorage[url] = JSON.stringify(obj);
//				setTimeout(window.open(murl+), 1000);
				setTimeout(window.location.reload(), 1000);
				
			});
			
		//后台顶
		$(".back_ding").live("click",function(){
			var url = $(".click-more").attr("href");
			var nickname = $(this).parent().parent().parent().prev().prev().find(".user-name-gw").text();
			var mainpage = $("#mainReplies .current").first().text();
			var dingnum = $(this).parent().prev().val();
			if (!dingnum) {
				alert("请输入需要顶的数量！！");
				return;
			}
			
			 //找到需要顶贴的标示
			var topid = $("#list_sohu").attr("topicid");
			var uniquekey = $(this).parents(".block-cont-gw").attr("cmtid");
			var clientid = $(this).parents(".block-cont-gw").children(".cont-head-gw").children(".head-img-gw").children("a").attr("href");
			var content = $(this).parents(".wrap-action-gw").prev().text().trim();
			 
			clientid = clientid.substring(clientid.indexOf("=")+1,clientid.length);
			var retdata= {};
			retdata["uniquekey"] =  uniquekey + "," +clientid + "," + topid ;
  
			retdata["num"] = dingnum;
			retdata["url"] = url;
			retdata["displayname"] = nickname;
			retdata["content"] = content; 
			chrome.extension.sendMessage({method:"backpost",key:retdata,value:""},function(){window.location.href = window.location.href;});

		});

			
		}
};
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function autologin(username,password){
	$("#pemail").val(username);
	$("#ppwd").val(password);
	
		
	$("input[name='email']").val(username);
	$("input[name='password']").val(password);
 
	$("input[type=Submit]").click();
}
