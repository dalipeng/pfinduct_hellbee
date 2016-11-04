var publicpfinduct={};

String.prototype.endWith=function(str){
	if(str==null||str==""||this.length==0||str.length>this.length)
	  return false;
	if(this.substring(this.length-str.length)==str)
	  return true;
	else
	  return false;
	return true;
};

String.prototype.startWith=function(str){
	if(str==null||str==""||this.length==0||str.length>this.length)
	  return false;
	if(this.substr(0,str.length)==str)
	  return true;
	else
	  return false;
	return true;
};

/**
 * -1:不需要注入
 * 0 :基域名（可以不填）
 * 1 :发帖界面
 * 2 :回帖界面
 * 3 :列表界面
 * 调用的地方需要正确组织arr,1,2,3是定义过的
 */
publicpfinduct.URLState=function(regArr,url){
	if(regArr.length>0){
		//i从1开始
		for(var i=1;i<regArr.length;i++){
			if(regArr[i].test(url)){
				return i;
			};
		}
		if(regArr[0].test(url)){
			return 0;
		}
	}
	console.log("该url暂不在支持列表中，无需注入！");
	return -1;
};

/**
 * 注入样式
 */
publicpfinduct.insertCss=function(pfinducturl){
	var maincss = pfinducturl+"/chrome/css/main.css";
	var uicss = pfinducturl+"/chrome/dialog/ui.css";
	$("<link rel='stylesheet' type='text/css' href='"+maincss+"' />").appendTo("head");
	$("<link rel='stylesheet' type='text/css' href='"+uicss+"' />").appendTo("head");
};


/**
 * 取本地配置
 */
publicpfinduct.getLocalStorage=function(afterDataDeal){
	chrome.extension.sendMessage({method: "getLocalStorage"},function(response){
		if(response){
			var settings=JSON.parse(response.data);
			if(settings){
				if(typeof afterDataDeal=='function'){
					afterDataDeal(settings);
				}
			}else{
				console.log("后台尚未配置！");
			}
		}else{
			console.log("localstorage为空！");
		}
	});
};



/**初始化toolbar**/
publicpfinduct.initToolBar=function(pfinducturl,userid){
	//注入toolbar
	var toolbar = chrome.extension.getURL('html/toolbar.html');
	
	
	
	var toolbarCreate = function(){
	
	var mouseoverflag = 0;	
		
	var browserheight = window.innerHeight/2 - 75;
	//注入toolbar	
	var pluginstr = "<div id=\"pfinduct_plugin_dagai\"  style=\"height:150px;width:40px;background-color:#6292DD;-webkit-border-radius:8px;text-align:center;vertical-align:middle;margin:0;padding:0;background:#6292DD;;\"> <div style=\"width:15px;text-align:center;font-size:18px;color:white;font-family: Arial,Helvetica,sans-serif;margin-left:12px;padding-top:10px;\">导控插件</div></div>";
	$("<div id=\"floatDiv\" style='position:fixed;top:"+browserheight+"px;right:0px;" +
			"height:150px;margin:0;padding:0;line-height:30px;overflow:hidden;width:40px;" +
			"z-index:9999999;-webkit-box-shadow:5px 5px 5px #999;-webkit-border-radius:8px;opacity: 0.9;'></div>").html(pluginstr).prependTo("body");
	
	$("#pfinduct_plugin_dagai").live("mouseover",function(){
		 mouseoverflag = 0;
		$("#floatDiv").css({});
		var toolbarstr = [];
		//toolbar界面字符串
		toolbarstr.push("<div id=\"pfinduct_plugin_iftoolbar\" >");
		toolbarstr.push("<iframe id='pfinducttoolbar' src='"+ toolbar +"' style=\"width:100%\" ><iframe>");
		toolbarstr.push("</div>");
		
		$("#floatDiv").html(toolbarstr.join(''));
		$("#floatDiv").css({"display":"block"});
		var flag = 1;
		var tflag = 1;
/*
		var fwidth = 0;
		var inwidth = window.innerWidth;
		var minleft = window.innerWidth - 380;
        var timerout = setInterval(function () {
        	
            if (!flag) {
                clearInterval(timerout);
            } else {
//            	fwidth = document.getElementById("floatDiv").style.width.replace("px","");
 //           	document.getElementById("floatDiv").style.width = (fwidth-10+20) + "px"; 
            	inwidth = inwidth - 15;
            	document.getElementById("floatDiv").style.left = inwidth+"px";
            	if (minleft > inwidth) {
            		flag = 0;
            		mouseoverflag = 1;
            	}

            	
            }
        }, 10);
        var timewidth = setInterval(function () {
        	
            if (!tflag) {
                clearInterval(timewidth);
            } else {
            	fwidth = document.getElementById("floatDiv").style.width.replace("px","");
            	document.getElementById("floatDiv").style.width = (fwidth-10+25) + "px"; 
            	if (fwidth > 370) {
            		tflag = 0;
            		mouseoverflag = 1;
            	}

            	
            }
        }, 10);
        
  */      

	});
	$("#floatDiv").live("mouseout",function(){
		if  (mouseoverflag) {
			var tflag = 1;
			var fwidth = 0;
	        var timewidth = setInterval(function () {
	        	
	            if (!tflag) {
	                clearInterval(timewidth);
	            } else {
	            	fwidth = document.getElementById("floatDiv").style.width.replace("px","");
	            	document.getElementById("floatDiv").style.width = (fwidth-15) + "px"; 
	            	var fposl = document.getElementById("floatDiv").style.left.replace("px","");
	            	document.getElementById("floatDiv").style.left= (fposl - 10 + 25) + "px";  
	            	if (fwidth <= 40) {
	            		tflag = 0;
	            		 $("#floatDiv").css({"width":"40px","border":"0","-webkit-border-radius":"8px"});
	            		 $("#floatDiv").html(pluginstr);
	            		 if ($("#floatDiv").offset().left > document.body.offsetWidth - 400) {
	        				document.getElementById("floatDiv").style.left=(document.body.offsetWidth-50)+"px";
	            		 }
	            		 document.getElementById("floatDiv").style.right="0px";
	            		 document.getElementById("floatDiv").style.left="";
	            	}
	            }
	        }, 20);
		}
	});
	/*
	//关闭图片的绑定事件
	$("#closepic").live("click",function(){
		$("#floatDiv").css({"width":"40px","border":"0","-webkit-border-radius":"8px"});
		$("#floatDiv").html(pluginstr);
		if ($("#floatDiv").offset().left > document.body.offsetWidth - 400) {
			document.getElementById("floatDiv").style.left=(document.body.offsetWidth-50)+"px";
			
		}
		document.getElementById("floatDiv").style.right="0px";
		document.getElementById("floatDiv").style.left="";

	});
	*/
	//拖拽div结束
	};
	
	toolbarCreate();
	

};
/**
 *  重置
 */
(function(){
	window.addEventListener('resize', function() {
		var browserheight = window.innerHeight/2 - 75;
//		var centerY = document.body.clientHeight/2 - 75;
		var screentY = window.screen.height/2;
		if (browserheight > screentY) {
			return;
		}
		if(document.getElementById("floatDiv")){
			document.getElementById("floatDiv").style.top=browserheight+"px";
		}
	});
})();


/**
 * 插入素材
 * pfinducturl
 * pageDeal:回调函数1
 * setFormValues:回调函数2
 */
publicpfinduct.insertMaterial=function(pfinducturl,pageDeal,setFormValues){
	//调用外部传入函数
	if(typeof pageDeal=='function'){
		pageDeal();
	}
	var url = chrome.extension.getURL('html/material.html');
	//插入素材框架
	$.ajax({
		type:"GET",
		async:false,
		url:url,
		success:function(html){
			$("<div style='display:none'>"+ html +"</div>").appendTo("body");
		},
		error:function(msg){
		}
	});
	
	
	//按钮注入选择素材
	$("#material_btn_select").live("click",function(){
		//取素材
		var url=pfinducturl+"/chrome!getMaterial.action";
		$.ajax({
			type: "POST",
			async:false,
			url: url,
			success: function(datastr){
			var data = JSON.parse(datastr);
			var pfimaterial = data.pfimaterial;
			var pfclass = data.pfclass;
			//console.log("pfimaterial:"+JSON.stringify(pfimaterial));
			//console.log("pfclass:"+JSON.stringify(pfclass));
			
			//清空
			$(".typeContent").empty();
			$(".matterContent").empty();
			$("#material_title").text("");
			$("#material_content").val("");
			
			$.each(pfclass, function(i,item){
				$("<li index='"+i+"' >"+item.NAME+"</li>").appendTo(".typeContent");
	        });
			$.each(pfimaterial, function(i,item){
				$("<li index='"+i+"' classid='"+item.CLASSID+"' ><a style=\"cursor:pointer\">"+item.TITLE+"</a></li>").appendTo(".matterContent");
	        });
			
			//类别
			$('.typeContent li').bind("click",function(){
				$('.typeContent li').removeClass('selected');
				$(this).addClass('selected');
				var index = $(this).attr("index");
				var classid = pfclass[index].ID;
				$('.matterContent li').hide();
				$('.matterContent').find("li[classid='"+classid+"']").show();
				
			});
			//素材列表
			$('.matterContent li').bind("click",function(){
				$('.matterContent li').removeClass('selected');
				$(this).addClass('selected');
				var index = $(this).attr("index");
				$("#material_title").text(pfimaterial[index].TITLE);
				$("#material_content").val(pfimaterial[index].CONTENT);
			});
			
			//showRemind('titleWord','请输入素材标题过滤','ue-default-text');
			
			//搜索素材标题
			$("#titleWord").bind("keyup",function(){
					var regex = new RegExp($(this).val().trim(),"ig");
				$(".selectcon .matterTitle .matterContent li a").each(function(){
					if (regex.exec($(this).text())) {
						$(this).parent().show();
					}
					else{
						$(this).parent().hide();
					}
					
				});

			});
			$("#material_select").dialog("destroy");
			$("#material_select").dialog({
				width:557,
				height:480,
				modal:false,
				autoOpen:true,
				title:'素材选择',
				resizable:false,
				buttons:{
					'确定':function(event,ui){
						var title = $("#material_title").text();
						var content = $("#material_content").val();
						setFormValues(title,content);
						$(this).dialog("close");
						
					},
					'取消':function(event,ui){
						$(this).dialog("close");
					}
				}
			});
			}
		});
	});
	
};

/**
 * 检查界面登录状态
 */
publicpfinduct.checkPageInfo=function(pageinfo){
	//console.log(JSON.stringify(pageinfo));
	var displayname = pageinfo.displayname;
	if(!displayname||displayname==''){
	}else{
		
		//界面已登录
		weblogin = true;
		
	}
};

/** 
* 回传
* pfinducturl:导控url
* userid:用户id
* pageinfo:界面取得对象数据
* hc_button:按钮位置函数
* hc_data:行数据算法函数
*/
publicpfinduct.sendBack=function(pfinducturl,userid,pageinfo,hc_button,hc_data){
	var displayname = pageinfo.displayname;
	if(!displayname||displayname==''){
		console.log("displayname为空！！！");
		return;
	}else{
		//界面已登录
		weblogin = true;
	}
	var forumname = pageinfo.forumname;
	var forumurl = pageinfo.forumurl;
	var accountname = pageinfo.accountname;
	//回传按钮位置注入
	if(typeof hc_button=='function'){
		hc_button(pageinfo);
	}
	
	$("pbutton[name=btn_up]").live("click",function(){
		var thisbutton = $(this);
		var trdata = new Object();
		if(typeof hc_data=='function'){
			trdata = hc_data($(this));
		}
		
//		console.log(JSON.stringify(trdata));
//		return;
		
		var title = trdata.title;
		var url = trdata.url;
		if(!publicpfinduct.regTestURL(url)){
			alert("界面可能已变动！请检查！");
			return;
		}
		var content = trdata.content;
		var posttime = trdata.posttime;
		var resulttype = trdata.resulttype;
		//拿导控任务后回传
		publicpfinduct.getCurrentTaskid(pfinducturl,function(taskid){
			
			var jsondata = new Object();
			jsondata.title=title;
			jsondata.url = url;
			jsondata.forumname = forumname;
			jsondata.forumurl = forumurl;
			jsondata.displayname = displayname;
			jsondata.taskid = taskid;
			jsondata.userid = userid;
			jsondata.content = content;
			jsondata.posttime = posttime;
			jsondata.resulttype =resulttype;
			var param_screen = "viewport";
			jsondata.param = param_screen;
			var jsondatastr = JSON.stringify(jsondata);
			console.log("taskresult:"+jsondatastr);
			//关闭toolbar页面
			$('#floatDiv').hide();
			//按钮屏蔽
			thisbutton.remove();
			//截图
			chrome.extension.sendMessage({method:"cutscreen",key:jsondata},function(response){
			});
			
//			$.ajax({
//				type: "POST",
//				url: pfinducturl+"/chrome!addToTaskResult.action",
//				data:{taskresult:jsondatastr},
//				success: function(msg){
//					if(msg=='1'){
//						document.getElementById("pfinducttoolbar").src=document.getElementById("pfinducttoolbar").src;
//						thisbutton.remove();
//						alert("回传成果成功！！！");
//					}else if(msg=='2'){
//						thisbutton.remove();
//						alert("该结果已回传过！！！");
//					}else {
//						alert("回传成果失败！！！");
//					}
//				},
//				error: function(msg){
//					alert("回传异常！！！");
//				}
//			});
			
		},userid);
		
	});
};

/**
 * 选择素材
 */
publicpfinduct.materialSelect=function(pfinducturl){
	//按钮
	$("<div id=\"showSelectBox\" style=' position: absolute; text-decoration: none; z-index: 899; cursor: pointer; left: 57px; top: 552px; display: none;'>" +
			"<pbutton id='selection' class=\"pf_button pf_orange pf_small\" style='left: 0; top: 0; z-index: 900;' >保存素材</pbutton>" +
			"<input type='hidden' id='pfinductkeyword'/></div>").appendTo("body");
	

	var selectBox = document.getElementById("showSelectBox");
  	var sel = Netpf.textSelection( null, 
  	 	function(e){
  	 		selectBox.style.display = "none";
  	 	}, 
  	 	function(e, txt, pos){
  	 		if(txt != ""){
  	 			$("#pfinductkeyword").val(txt);
	  	 		selectBox.style.left = pos.x +"px";
	  	 		selectBox.style.top = pos.y +"px";
	  	 		selectBox.style.display = "block";
  	 		}
  	 	},selectBox);
  	
  	$("#selection").bind("click",function(){
  		//获取选择的内容
  		var content = $("#pfinductkeyword").val();
  		//获取选择的标题
  		var title = $("title").text();
  		title = title.replace(/\"/g,"'");
  		var classJson="" ;
  		$.ajax({
  			type:"GET",
  			url:pfinducturl+"/chrome!showclass.action",
  			async:false,
  			dataType:"json",
  			success:function(msg){
  				classJson = msg;
  			},
  			error:function(){
  			}
  		});	
  		var classStr = "";
  		classJson = eval(classJson);
		for (var i=0, len=classJson.length; i<len; i++) {
			classStr+= "<option value="+classJson[i].ID+">"+ classJson[i].NAME +"</option>";
		}

  		var divStr = "<div id=\"material_save\"> <div class=\"savecon\"><div class=\"kv-item ue-clear\"> <label>标题：</label>"
  			+ "<div class=\"kv-item-content\"> <input type=\"text\" id=\"save_title\" value="
  			+ title +" /> </div> </div> <div class=\"kv-item ue-clear\"> <label>分类：</label> <div class=\"kv-item-content\"> <select id=\"material_class\">"
  			+ classStr + "</select> </div> </div> <div class=\"kv-item ue-clear\"> <label>内容：</label> <div class=\"kv-item-content\"> <textarea id=\"save_content\">"
  			+ content + "</textarea> </div> </div> </div> </div>" ;
  		
  		var dialog_obj ;
  		if ($("#material").length != 0) {
  			dialog_obj = $("#material").empty().append(divStr);
  		}else{
  			dialog_obj = $("<div id=\"material\">"+divStr+"</div>");
  		}
  		$("#material").dialog("destroy");
  		dialog_obj.dialog({
			width:500,
			height:350,
			modal:false,
			autoOpen:true,
			title:'素材保存',
			resizable:false,
			buttons:{
				'确定':function(event,ui){
					
					var thistitle = $("#save_title").val();
					var classId = $("#material_class").val();
					var thiscontent = $("#save_content").val();
					if($.trim(thistitle)==""||$.trim(thiscontent)==""){
						alert("素材标题或内容不能为空！！！");
						return;
					}
					var jsondata = new Object();
					jsondata.title = thistitle;
					jsondata.classId = classId;
					jsondata.content = thiscontent;
					var jsondatastr = JSON.stringify(jsondata);
					console.log("addToMaterial:"+jsondatastr);
					var data = {material:jsondatastr};
					var obj=this;
					$.ajax({
						type: "POST",
						url: pfinducturl+"/chrome!addToMaterial.action",
						data:data,
						success: function(msg){
							if(msg=='true'){
								alert("保存素材成功！！！");
								$(obj).dialog("close");
							}else{
								alert("保存素材失败！！！");
							}
						},
						error: function(msg){
							alert("保存素材异常！！！");
						}
					});
					
				},
				'取消':function(event,ui){
					$(this).dialog("close");
				}
			}
		});
  		
  	});
  	
};


/**判断url是否能通 **/
publicpfinduct.testURL=function(url){
	if(!url||url==''){
		return false;
	}
	var result=false;
	$.ajax({
		url: url,  
		type: 'GET',
		async:false,
		complete: function(response){
			if(response.status == 200){
			  result = true;
			}else{
			  result = false;
			}
		}
	});
	return result;
};



/**
 * 获取导控任务及其后的相关操作
 */
publicpfinduct.getCurrentTaskid=function(pfinducturl,func,userid){
	chrome.extension.sendMessage({method:"getTask"},function(response){
		var data = response.data;
		var taskid = -1;
		if(data==null||data==""){
			//alert("当前任务为空，请设置当前任务!");
		}else{
			var task=JSON.parse(data);
			var taskidstr=task.taskid;
			taskid = parseInt(taskidstr);
			if(taskid>0){
				
				//服务器验证是否合法
				$.ajax({
					type:"POST",
					async:false,
					url: pfinducturl+"/chrome!validateTask.action",
					data:"taskid="+taskid+"&userid="+userid,
					success: function(msg){
						if(msg=="true"){
						}else{
							taskid = -1;
						}
					}
				});
				
			}else{
				
				//alert("当前任务为空，请设置当前任务!");
				taskid=-1;
			}
		}
		
		
		if(typeof func=="function"){
			func(taskid);
		}
	});
};


/**
 * 验证url的合法性(需要修改)
 */
publicpfinduct.regTestURL=function(url){
	var re=/.+/; 
	return re.test(url);
};

/**
 * 处理界面url前缀问题
 */
publicpfinduct.dealWithUrl=function(url,pre){
	if(!url){
		return "";
	}else if(url.startWith(pre)){
		return url;
	}else{
		if(url.startWith("/")){
			return pre+url;
		}else{
			return pre+"/"+url;
		}
	}
};

/**
 * 处理时间串
 */
publicpfinduct.dealWithTime=function(time){
	time = time.replace(/\r|\n|\t/g,"");
	var result = time.match(/\d{4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2}/g);
	if(result){
		return result[0];
	}else{
		return "";
	}
};

publicpfinduct.setCookie=function(cookiesString,currenturl,deletecookie,callback){
	if(cookiesString.startWith("document.cookie")){
		eval(cookiesString);
		callback();
	}else{
		var cookies = JSON.parse(cookiesString);
		var cookiesArray = [];
		var cookiesNameArray = [];
		for(var i in cookies){
			var cookie = cookies[i];
			var buf = [];
			var ckname = cookie['ckname'];
			buf.push(ckname+"="+cookie['ckvalue']);
			if(cookie['ckdomain']){
				buf.push("domain="+cookie['ckdomain']);
			}
			if(cookie['ckpath']){
				buf.push("path="+cookie['ckpath']);
			}
			if(cookie['ckexpires']){
				buf.push("expires="+cookie['ckexpires']);
			}
			var cookiestr = buf.join(';');
			cookiesArray.push(cookiestr);
			cookiesNameArray.push(ckname);
		}
		//需要删除cookie
		if(deletecookie==1){
			chrome.extension.sendMessage(
					{method: "deleteCookie",
					 url:currenturl,name:cookiesNameArray},
						function(response){
						 	for(var j in cookiesArray){
						 		console.log(cookiesArray[j]);
						 		document.cookie = cookiesArray[j];
						 	}
						 	callback();
						}
			);
		}else{
			for(var j in cookiesArray){
		 		//console.log(cookiesArray[j]);
		 		document.cookie = cookiesArray[j];
		 	}
			
		 	callback();
		}
		
	}
};

function getCookie(name) 
{ 
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]); 
    else 
        return null; 
} 

//删除cookies 
function delCookie(name) 
{ 
    var exp = new Date(); 
    exp.setTime(exp.getTime() - 1); 
    var cval=getCookie(name); 
    if(cval!=null) 
        document.cookie= name + "="+cval+";expires="+exp.toGMTString(); 
}

/**
 * 
 * @param pfinducturl 服务器url
 * @param currenturl 当前url
 * @param username  用户名
 * @param password  密码
 * @param isrefresh   是否能刷新
 */
publicpfinduct.switchCookies = function(pfinducturl,currenturl,username,password,isrefresh,deletecookie){
	var getCookieUrl = pfinducturl+"/chrome!getCookie.action";
	var obj = {};
	obj.username = username;
	obj.password = password;
	obj.url = currenturl;
	var jsondatastr = JSON.stringify(obj);
	var data = {account:jsondatastr};
	var result = false;
	$.ajax({
		type: "POST",
		async:false,
		url: getCookieUrl,
		data:data,
		success: function(str){
			if(str!=""&&str!=null){
				//已登录
				cookielogin = true;
				publicpfinduct.setCookie(str,currenturl,deletecookie,function(){
					if(isrefresh){
						setTimeout(function(){window.location.reload();},1000);
					}
				});
				result = true;
			}else{
				alert("切换账号失败！");
				if(isrefresh){
					setTimeout(function(){window.location.reload();},1000);
				}
				result = false;
			}
		}
	});
	return result;
};

/**---------------------------界面选择事件start----------------------------------------**/
/**
 * 页面文本内容选择触发操作组件
 * @param {DOM Element} 要触发选择文本内容的容器
 * @param {function} 当鼠标按键按下将要选择时要执行的的自定义函数，函数传入的第一个参数是鼠标事件event对象
 * @param {function} 当选择一段文本后鼠标按键弹起时要执行的自定义函数:
 *					 函数的第一个参数是鼠标事件event对象,
 *					 函数的第二个参数是所选择的文本内容
 *                   函数的第三个参数是鼠标按钮弹起时光标所在的页面位置{x:1, y:2}
 */
 
/**
 * 命名空间、事件绑定和事件冒泡
 */
var Netpf = {
	version : "1.0.0"
}; 

// 注册命名空间
Netpf.namespace = function(){
	var o, d, n;
	for( var i = 0; i < arguments.length; i++ ){
		n = arguments[i], 
		d = n.split("."), 
		o = window[d[0]] = window[d[0]] || {};
		
		var d_arr = d.slice(1);
		for( var j = 0; j < d_arr.length; j++ ){
			o = o[d_arr[j]] = o[d_arr[j]] || {};
		}
	}
	/*$.each( arguments, function(i, n){
		d = n.split(".");
		o = window[d[0]] = window[d[0]] || {};
		$.each( d.slice(1), function(j, n2){
			o = o[n2] = o[n2] || {};
		} );
	} );*/
};

Netpf.namespace("Netpf.event");

Netpf.event.bind = function(elem, type, callback, useCapture){
	var _capture = useCapture !== undefined ? useCapture : false;
	elem.addEventListener ? elem.addEventListener(type, callback, _capture) 
						  : elem.attachEvent('on' + type, callback);
};

/**
 * 获取事件类型
 */
Netpf.event.getEvent = function( evt ){
	evt = evt ? evt : ( window.event || arguments.callee.caller.arguments[0] );
	return evt;
};

/** 
 * 阻止一切事件冒泡传递执行，包括浏览器默认的事件 
 * 
 */
Netpf.event.stopEvent = function( evt ){
	evt = this.getEvent(evt);
	if(!evt){
		return;
	}
	
	if( evt.stopPropagation ){
		evt.preventDefault();
		evt.stopPropagation();
	}else{
		evt.cancelBubble = true;
		evt.returnValue = false;
	}
};

/**
 * 仅阻止用户定义事件的冒泡传递 
 */
Netpf.event.cancelEvent = function( evt ){
	evt = this.getEvent(evt);
	if(!evt){
		return;
	}
	
	if(evt.stopPropagation){
		evt.stopPropagation();
	}else{
		evt.cancelBubble=true;
	}
};

Netpf.textSelection = function(eleContainer, fun1, fun2,selectBox){
	
	// 选择区域触发容器
	eleContainer = 	eleContainer || document;
	
	// 阻止菜单体上的相关事件冒泡传递
	if(selectBox){
		selectBox.onclick = selectBox.onmousedown = function(e){
			Netpf.event.cancelEvent(e);
		};
	}
	
	// 获取选择的文本内容
	var _getSelectedText = function(){
		var txt = "";
		if(document.selection){
			txt = document.selection.createRange().text; //IE
		}else{
			txt = document.getSelection();
		}
		return txt.toString();
	};
	
	// 清除选择的内容(删除了选中的内容)
	var _clearSelection = function(){
		// 清除选择的内容
		if(document.selection){
			document.selection.clear(); // IE
		}else{
			var selection = document.getSelection();
			selection.deleteFromDocument();
			
			// The deleteFromDocument not work in Opera. Work around this bug.
			if(!selection.isCollapsed){
				var selRange = selection.getRangeAt(0);
				selRange.deleteContents();
			}
			// The deleteFromDocument works in IE, but a part of the new content becomes selected.
			// prevent the selection
			if(selection.anchorNode){
				selection.collapse(selection.anchorNode, selection.anchorOffset);
			}
		}
	};
	
	// 取消选择(不删除被选择的内容)
	var _cancelSelection = function(){
		if( document.selection ){
			document.selection.empty(); //IE
		}else{
			var selection = document.getSelection();
			selection.removeAllRanges();
		}
	};
	
	Netpf.event.bind(document, "mousedown", function(e){
		if(fun1 && typeof fun1 == 'function'){
			//_cancelSelection();
			fun1.call(eleContainer, e);
		}
	});
	
	Netpf.event.bind(eleContainer, "mouseup", function(e){
		e = e || window.event;
		var txt = _getSelectedText(), 
			sh = Math.max(document.documentElement.scrollTop, document.body.scrollTop),
			sw = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
		
		var x = e.clientX + sw +1, y = e.clientY + sh +1;
		
		// 执行回调函数
		if(fun2 && typeof fun2 == 'function'){
			fun2.call(eleContainer, e, txt, {"x":x, "y":y});
		}
	});
	
	this.getSelectedText = _getSelectedText;
	this.removeSelection  = _clearSelection;
	this.cancelSelection = _cancelSelection;
};

/**---------------------------界面选择事件end----------------------------------------**/


/**界面搜索框内出现的汉字（后面界面调整后需要去除）  **/
//function showRemind(inputId,text,defaultCss){
//	$("#"+inputId).val(text);
//	$("#"+inputId).addClass(defaultCss);
//	$("#"+inputId).focus(function(){if ($("#"+inputId).val() ==text){$(this).val("");$(this).removeClass(defualtCss);}});
//	$("#"+inputId).blur(function(){if ($("#"+inputId).val() ==""){$(this).val(text);$(this).addClass(defualtCss);}});
//}


