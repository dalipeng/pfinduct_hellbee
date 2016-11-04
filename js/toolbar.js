//所有任务
var taskjson={};
//蜜蜂强势插入
$(function() {
	$("#closepic").bind("click", function() {
		$("body").fadeOut();
	})
});
//密封飞走了

$(function(){
	//时间间隔
	var delaytime=60*1000;
	//导控url
	var pfinducturl=pfinduct.getStorageValue("user","pfinducturl");
	if(!pfinducturl){
		alert("尚未配置插件参数，请配置！");
		return;
	}
	//选项
	//$("#options").click(openOptions);
	
	//初始化select
	initSelect();
	
	//先调用一次
	getTaskNum();
	//循环调用取任务数
	setInterval(function(){
		getTaskNum();
	},delaytime);
	initTask(pfinducturl);
	
	var taskid=pfinduct.getStorageValue("task","taskid");
	if(taskid==null){
		taskid=-1;
	}
	//默认回传结果
	getTaskResultNum(taskid,pfinducturl,false);
	
	$(".select_box").live("click",function() {
		$("ul.son_ul").removeAttr("style");
	});
	$('ul.son_ul li').die().live("click",function(){
		var liobj = $(this).parents('li');
	  liobj.find('span').html($(this).html()); 
	  liobj.find('span').attr("attr-index",$(this).attr("attr-index"));
	  $(this).parents('li').find('ul').slideUp();
	  getParameter();
	 
	});
 
	
});

			
//截图按钮
$(".screen_button").live("click",function(){
	 
	var thisbutton = $(this);
	var resulttype =$(this).attr("resulttype");
	//var param_screen = $("input:radio[name=pfinduct_param_screen]:checked").val();
	var param_screen = "viewport";
	var user=pfinduct.getStorageValue("user","");
	var obj = {};
	obj.userid = user.userid;
	obj.taskid = $("#changetask").val();
	obj.resulttype = resulttype;
	obj.param = param_screen;
	/*
	chrome.extension.sendMessage({method:"screenshot",key:obj},function(response){
		thisbutton.attr("disabled","disabled");
	});
	*/
	//无论如何先弹出框让用户输入

	
	var currurl = "";
	chrome.extension.sendMessage({method:"currurl",key:obj,data :""},function(response){
		currurl = response.data;
		var flag = false;
		for (var i=0,key;key=muticonfig[i++];) {
			var urlregex = key["reg"];
			if (urlregex.test(currurl)){
			flag = true;
			}
		}
		  chrome.extension.sendMessage({method:"sendback",key:obj,data:flag},function(response){
	//		console.log(response);
			if (response.res == -1) {
				 chrome.extension.sendMessage({method:"showinsert",key:obj,data:flag},function(response){ });
			}
			
//						thisbutton.attr("disabled","disabled");
			});
		/*
		if (flag) {
			chrome.extension.sendMessage({method:"cutscreen",key:obj},function(response){
			thisbutton.attr("disabled","disabled");
			});
		}else{
			chrome.extension.sendMessage({method:"showinsert",key:obj},function(response){
	//		console.log(response);
			thisbutton.attr("disabled","disabled");
			});
			
		}	
		*/
	});
	
	/*
	chrome.extension.sendMessage({method:"captureImage",key:obj},function(response){
		thisbutton.attr("disabled","disabled");
	});
	*/
});

function getParameter(){
		var user=pfinduct.getStorageValue("user","");
	if(!user){
		return;
	}
	var userid=user.userid;
	var pfinducturl=user.pfinducturl;
	//var index = $(this).find("option:selected").attr("index");
	var index  = $(".select_box span").attr("attr-index"); 
 
	var task = new pfinduct.task();
	var taskid = "-1";//默认值
	if(index=="-1"){
		task.deleteTask();
	}else{ 
		taskid=taskjson[index].TASKID;
		//存储
		task.setTaskname(taskjson[index].NAME);
		task.setTaskid(taskid);
		task.setKeywords(taskjson[index].MAJORKEYWORDS);
		task.save();
	}
	//获取任务结果
	getTaskResultNum(taskid,pfinducturl,false);
	
}
//设置当前任务
/***
*@delete 此方法已废弃
*
*/
$("#changetask").live("change",function(){
	//$("#changetask").find("option[value=0]").remove();
	var user=pfinduct.getStorageValue("user","");
	if(!user){
		return;
	}
	var userid=user.userid;
	var pfinducturl=user.pfinducturl;
	var index = $(this).find("option:selected").attr("index");
	var task = new pfinduct.task();
	var taskid = "-1";//默认值
	if(index=="-1"){
		task.deleteTask();
	}else{ 
		taskid=taskjson[index].TASKID;
		//存储
		task.setTaskname(taskjson[index].NAME);
		task.setTaskid(taskid);
		task.setKeywords(taskjson[index].MAJORKEYWORDS);
		task.save();
	}
	//获取任务结果
	getTaskResultNum(taskid,pfinducturl,false);
	
});
function initSelect(){
	var user=pfinduct.getStorageValue("user","");
	if(!user){
		return;
	}
	var userid=user.userid;
	var pfinducturl=user.pfinducturl;
	
	var task=pfinduct.getStorageValue("task","");
	var currenttaskid="-1";
	if(task!=null){
		currenttaskid=task.taskid;
	}
	
	//取数据
	var jsondata = new Object();
	jsondata.userid=userid;
	//执行中任务初始化select
	jsondata.state="2";
	jsondata.flag="data";
	var jsondatastr = JSON.stringify(jsondata);
	var data = {condition:jsondatastr};
	$.ajax({
		type: "GET",
		url: pfinducturl+"/chrome!getTask.action",
		data:data,
		async:false,
		dataType:"json",
		success: function(d){
			d = eval(d);
			if(!d || d.length <= 0){
				var task = new pfinduct.task();
				task.deleteTask();
				return;
			}
			//当前任务给全局变量
			taskjson = d;
			$.each(d, function(i,item){
				var selected = "";
				if(item.TASKID==currenttaskid){
					selected = "selected";
					hasSelected = true;
					var selObj = $(".select_box span");
					selObj.html(item.NAME);
					selObj.attr("attr-value",item.TASKID);
					selObj.attr("attr-index",i);
					
				}
				$(".son_ul").append("<li attr-value='"+item.TASKID+"' attr-index="+i+" "+selected+">"+item.NAME+"</li>");
				
			});
 
			
		},
		error:function(msg){
			alert("导控系统连接异常！请检查！");
		}
	});
	
	
}

function initTask(pfinducturl){
	var authkey = encodeURIComponent(pfinduct.getStorageValue("user","authkey"));
	$("#notsign").click(function(){
		window.open(pfinducturl+"/netpf/chromeWeb!getCyListClient.action?task.state=1&authkey="+authkey);
	});
	$("#executing").click(function(){
		window.open(pfinducturl+"/netpf/chromeWeb!getCyListClient.action?task.state=2&authkey="+authkey);
	});
}

function initResult(taskid,pfinducturl){
	var authkey = encodeURIComponent(pfinduct.getStorageValue("user","authkey"));
	var userid = pfinduct.getStorageValue("user","userid");
	$("#taskresult").die("click").live("click",function(){
		window.open(pfinducturl+"/netpf/chromeWeb!getResult.action?task.id="+taskid+"&result=1&authkey="+authkey+"&userid="+userid);
	});
}
/**获取回传结果 **/
function getTaskResultNum(taskid,pfinducturl,flag){
	//是否需要通过json判断taskid的合法性
	if(flag){
		var hasThisTask = false;
		if(taskjson.length>0){
			$.each(taskjson, function(i,item){
				if(item.TASKID==taskid){
					hasThisTask = true;
					return false;//break
				}
			});
		}
		if(!hasThisTask){
			return;
		}
	}
	
	var user=pfinduct.getStorageValue("user","");
	var userid=user.userid;
	var pfinducturl=user.pfinducturl;
	var jsondata = new Object();
	jsondata.userid=userid;
	jsondata.taskid=taskid;
	jsondata.flag="number";
	var jsondatastr = JSON.stringify(jsondata);
	var data = {condition:jsondatastr};
	$.ajax({
		type: "GET",
		url: pfinducturl+"/chrome!getTaskResult.action",
		data:data,
		async:false,
		success: function(d){
			//切换url地址
			initResult(taskid,pfinducturl);
			$("#resultarea").html("已回传成果：<a href='' id=\"taskresult\">"+d+"</a>");
		}
	});
}

/**
 * 获取任务数 
 */
function getTaskNum(){
	chrome.extension.sendMessage({method: "getTaskNumber"},function(response){
		var tasknumber=JSON.parse(response.data);
		$("a[state="+1+"]").text(tasknumber.state1);
		$("a[state="+2+"]").text(tasknumber.state2);
	});
}

function openOptions(){
	var optionsurl = "html/options.html";
	chrome.extension.sendMessage({method:"openUrl",key:optionsurl},function(response){});
	//pfinduct.createATabUrl(optionsurl);(非插件部分，不可以调用chrome.tabs.*)
}