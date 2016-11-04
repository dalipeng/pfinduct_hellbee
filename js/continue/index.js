//var _path = "http://10.0.23.75:8080/pfinduct";
//var userid = -10;
var s_dlg;
var _path = pfinduct.getStorageValue("user","pfinducturl");
var userid = pfinduct.getStorageValue("user","userid");
$(document).ready(function(){
	//计算提示框弹出的位置
	$("#scoutTip").attr("style","left:"+$(window).width()/2 +";top:"+$(window).height()/2);
	/*侧边栏TAB切换选中效果*/
	$("#sidebar ul li").click(function(){
        if(!$(this).hasClass("select")){
            $("#sidebar ul").find(".select").removeClass("select");
	        $(this).addClass("select");
		}
	})
	/*计算主框架的高度*/
	$("#main").height($(window).height() - 57);
	$(window).resize(function() {
        $("#main").height($(window).height() - 57);
    });
	/*计算侧边栏的高度*/
	$("#sidebar ul").height($(window).height() - 117);
	$(window).resize(function() {
        $("#sidebar ul").height($(window).height() - 117);
    });
	/*计算主内容区的高度*/
	$("#content").height($(window).height() - 95);
	$(window).resize(function() {
        $("#content").height($(window).height() - 95);
    });
	//隐藏发帖
	hidePostTask();
	$('.postButton').click(function(e) {
		$("#taskList li").removeClass('select');
		hidePostTask();
		window.frames["rule_page"].clearAllValue();
		$("#newTaskTitle").val('');
		if ($("#newTaskTitle").length == 0) {
			$("#taskList").prepend("<li name='addNewTask' class='select'><div id='newTaskTitle'></div></li>");
		}
//        var temp = $(this).next('ul').find('li:eq(0)').clone(true);
//		temp.find('span').text('未命名');
//		$(this).next('ul').append(temp);
//		$(this).next('ul').find('.select').removeClass('select').end().find('li:last-child').addClass('select');
		
    });
	
	
	/*关闭弹出层*/
	$(".pupopWrap .title .close").click(function(){
		closeDialog();
	})
	
	/*删除任务*/
	$("#taskList li .ico").live("click",function(){
		var taskid = $(this).parent().attr("id");
		$(this).parent().remove();
		deletask(taskid);
		if($("#taskList li span").first().html()){
			$("#taskList li span").first().click();
		}else{
			window.frames["rule_page"].clearAllValue();
		}
		cancelEvent(event);
	});
	//点击查看任务详情
	$("#taskList li span").live("click",function(){
		if ($("#newTaskTitle").length == 1) {
			if (confirm("当前正处于编辑状态，可能有数据未保存，是否确定离开编辑页面？")) {
				removeTaskTitle();
				//如果选中是一个状态，将没有选中的那些背景去掉
				if(!$(this).parent().hasClass("select")){
						$("#sidebar ul").find(".select").removeClass("select");
						$(this).parent().addClass("select");
				}
				 //将发帖按钮隐藏
				showPostTask();
				var taskid = $(this).parent().attr("id");
				getTaskDetail(taskid);
				window.frames["rule_page"].setTaskid(taskid);
				window.frames["rule_page"].checkForm();
			}
			
		}else{
			removeTaskTitle();
			//如果选中是一个状态，将没有选中的那些背景去掉
			if(!$(this).parent().hasClass("select")){
					$("#sidebar ul").find(".select").removeClass("select");
					$(this).parent().addClass("select");
			}
			 //将发帖按钮隐藏
			showPostTask();
			var taskid = $(this).parent().attr("id");
			getTaskDetail(taskid);
			window.frames["rule_page"].checkForm();
			window.frames["rule_page"].setTaskid(taskid);
		}		
		
		
	});
	/*点击保存按钮*/
	$("#savetask").click(function(){
		//这里调用子窗口方法，生成json对象
		var task = window.frames["rule_page"].saveTask();
		if ( task["DOMAIN"] == "" || (getDomain() == task["DOMAIN"]) ) {
			//调用子窗口的发帖方法，将title,content，accountname,password等数据全部取出来
			var index = checkURL();
			if (index > -1) {
				if (window.frames["rule_page"].checkForm()) {
					task["USERID"] = userid;
//					Dialog.alert("really?");
					//保存任务
					var res = saveTask(task);
				}
			}else{
				alert("您输入的版块我们正在开发、、、");
			}
		}
		else{
			alert("站点已换，请重新选择素材！");
		}
		
	});	
	
	/*点击保存并发帖按钮*/
	/**
	 * {"NAME":"舆情导控发帖规则","URL":"http://tieba.baidu.com/f?kw=34","NUM":"3","STAT":1,"DOMAIN":"baidu.com","MATERIAL":[{"MID":2770,"TITLE":"aasdasd","CONTENT":"dsfasdf","AID":69,"USERNAME":"账号123","PASSWORD":"123456"}],"config":{}
	 */
	$("#savepost").click(function(){
		//这里调用子窗口方法，生成json对象,保存任务
		var task = window.frames["rule_page"].saveTask();
		if ( task["DOMAIN"] == "" || (getDomain() == task["DOMAIN"]) ) {
			//调用子窗口的发帖方法，将title,content，accountname,password等数据全部取出来
			var index = checkURL();
			if (index > -1) {
				if (window.frames["rule_page"].checkForm()) {
					task["USERID"] = userid;
					
					//保存任务
					var res = saveTask(task);
					var task = window.frames["rule_page"].postTask();
					task["config"] = muticonfig[i]["config"];
					task["ID"] = res["taskid"];
					chrome.extension.getBackgroundPage().background.mutiTaskExcute(task,function(tabid){
					console.log("tabid:"+tabid);
					return true;
					});
				}
			}else{
				alert("您输入的版块我们正在开发、、、");
			}
		}else{
			alert("站点已换，请重新选择素材！");
		}
	});
	/*点击保存并发帖按钮*/
	/**
	 * {"NAME":"舆情导控发帖规则","URL":"http://tieba.baidu.com/f?kw=34","NUM":"3","STAT":1,"DOMAIN":"baidu.com","MATERIAL":[{"MID":2770,"TITLE":"aasdasd","CONTENT":"dsfasdf","AID":69,"USERNAME":"账号123","PASSWORD":"123456"}],"config":{}
	 */
	$("#updatepost").click(function(){
		//这里调用子窗口方法，生成json对象,保存任务
		var task = window.frames["rule_page"].updateTask();
		
		if ( task["DOMAIN"] == "" || (getDomain() == task["DOMAIN"]) ) {
			//调用子窗口的发帖方法，将title,content，accountname,password等数据全部取出来
			var index = checkURL();
			if (index > -1) {
				if (window.frames["rule_page"].checkForm()) {
					
					if (window.frames["rule_page"].checkForm()) {
						task["USERID"] = userid;
						$.ajax({
						type:'post',
						url:_path+'/chrome!postData.action',
						data:{"type":"updateTaskDetail","mdata":JSON.stringify(task)},
						async:false,
						dataType:"json",
						success:function(res){
							//如果返回200表示保存成功，将对应的名字加到左边列表
							if (res["status"] == 200) {
								showTips(res["status"]);
								var oldTaskid = task["ID"];
								$("#"+oldTaskid).remove();
								taskSig = {"taskid":oldTaskid,"taskname":task["NAME"]};
								add2TaskList(taskSig);
								
								//发帖
								var posttask = window.frames["rule_page"].postTask();
								posttask["config"] = muticonfig[i]["config"];
								chrome.extension.getBackgroundPage().background.mutiTaskExcute(posttask,function(tabid){
									console.log("tabid:"+tabid);
									return true;
								});
								
							}else{
								showTips(300);
							}
						}
						});
					}
				}
			}else{
				alert("您输入的版块我们正在开发、、、");
			}
		}
		
		
	});
	/*点击更新按钮*/
	/**
	 * {"NAME":"舆情导控发帖规则","URL":"http://tieba.baidu.com/f?kw=34","NUM":"3","STAT":1,"DOMAIN":"baidu.com","MATERIAL":[{"MID":2770,"TITLE":"aasdasd","CONTENT":"dsfasdf","AID":69,"USERNAME":"账号123","PASSWORD":"123456"}],"config":{}
	 */
	$("#updatetask").click(function(){
		//这里调用子窗口方法，生成json对象
		var task = window.frames["rule_page"].updateTask();
		if ( task["DOMAIN"] == "" || (getDomain() == task["DOMAIN"]) ) {
			//调用子窗口的发帖方法，将title,content，accountname,password等数据全部取出来
			var index = checkURL();
			if (index > -1) {
				if (window.frames["rule_page"].checkForm()) {
					task["USERID"] = userid;
					$.ajax({
					type:'post',
					url:_path+'/chrome!postData.action',
					data:{"type":"updateTaskDetail","mdata":JSON.stringify(task)},
					async:false,
					dataType:"json",
					success:function(res){
						//如果返回200表示保存成功，将对应的名字加到左边列表
						if (res["status"] == 200) {
							showTips(res["status"]);
							var oldTaskid = task["ID"];
							$("#"+oldTaskid).remove();
							taskSig = {"taskid":oldTaskid,"taskname":task["NAME"]};
							add2TaskList(taskSig);
						}else{
							showTips(300);
						}
					}
					});
				}
			}else{
				alert("您输入的版块我们正在开发、、、");
			}
		}
		else{
			alert("站点已换，请重新选择素材！");
		}
	});
	//取得任务的名字
	getTaskNames();
	setTimeout(function(){
		$("#taskList li span").first().click();
	},500);
	
});

//给左边点击我要发帖时新增的text框赋值
function setTaskTitle(titVal){
	$("#newTaskTitle").text(titVal);
}
/**
 * 将左侧下面新增的text框删掉
 */
function removeTaskTitle(){
	$("#newTaskTitle").parent().remove();
}
/**
 * 保存任务  注意是以post方式提交数据  防止出现乱码现象
 * @param task  格式如下：
 * {"NAME":"舆情导控发帖规则","URL":"http://tieba.baidu.com/f?kw=34","POSTNUM":"3","DOMAIN":"baidu.com","DATA":[{"MID":2770,"AID":69},{"MID":2897,"AID":31},{"MID":2020,"AID":29}]} 
 */
function saveTask(task){
	showPostTask();
	task["USERID"] = userid;
	var taskSig = {};
	$.ajax({
		type:'post',
		url:_path+'/chrome!postData.action',
		data:{"type":"saveTaskDetail","mdata":JSON.stringify(task)},
		async:false,
		dataType:"json",
		success:function(res){
			//如果返回200表示保存成功，将对应的名字加到左边列表
			if (res["status"] == 200) {
				showTips(res["status"]);
				taskSig = {"taskid":res["tid"],"taskname":task["NAME"]};
				add2TaskList(taskSig);
			}else{
				showTips(300);
			}
			
		}
	});
	return  taskSig;
}
//将任务添加到左边列表
function add2TaskList(taskSig){
	//将左侧标题移除
	removeTaskTitle();
	$("#taskList li").removeClass("select");
	var listStr = "<li id='"+ taskSig["taskid"] +"' class='select'><span  class='tasktitleelipse'>"+ taskSig["taskname"] +"</span><a href='javascript:;' class='ico'></a></li>";
	$("#taskList").prepend(listStr);
	window.frames["rule_page"].setTaskid(taskSig["taskid"]);
}
/**
 * 请求domain
 * @returns {String}  返回domain
 */
function getDomain(){
	var url = window.frames["rule_page"].document.getElementById("url").value;
	var domain = "";
	$.ajax({
		type:'post',
		url:_path+'/chrome!getData.action',
		data:{"type":"getDomain","mdata":url},
		async:false,
		success:function(res){
			domain = res;
		}
	});
	return domain;
}
/**
 *检查url是否是连续发帖支持的站点 
 * @returns {Number}	index   是这个url是在第几个，便于后面取config
 */
function checkURL(){
	var index = -1;
	//待做验证url
	var url = window.frames["rule_page"].document.getElementById("url").value;
	//执行时候去检查muti-config看看url是否支持
	for (i=0,len=muticonfig.length; i<len; i++) {
		if (muticonfig[i]["reg"].test(url)) {
			index = i;
			break;
		}
	}
	return index;
}
/**
 * 加载左边的任务列表
 */
function getTaskNames(){
	
	$.ajax({
		type:'get',
		url:_path+'/chrome!getData.action',
		data:{"type":"getTaskNames","mdata":userid},
		async:false,
		dataType:"json",
		success:function(res){
			showTaskNames(res);
		}
	});
}
function showTaskNames(taskNames){
	var id = 0;
	var name = "";
	var taskStr = "";
	var taskBuf = [];
	for (i=0,len=taskNames.length; i<len; i++) {
		id = taskNames[i]["ID"];
		name = taskNames[i]["NAME"];
		taskStr = "<li id="+ id +"><span  class='tasktitleelipse'>"+ taskNames[i]["NAME"] +"</span><a href=\"javascript:;\" class=\"ico\"></a></li>";
		taskBuf.push(taskStr);
	}
	$("#taskList").html(taskBuf.join(''));
}
/**
 * 删除某一个任务
 */
function deletask(taskid){
	$.ajax({
		type:'get',
		url:_path+'/chrome!postData.action',
		data:{"type":"deleteTask","mdata":taskid},
		async:false,
		dataType:"json",
		success:function(res){
			console.log(res);
			
		}
	});
}
/**
 * 拿到任务的详细信息
 * @param taskid
 */
function getTaskDetail(taskid){
	$.ajax({
		type:'get',
		url:_path+'/chrome!getData.action',
		data:{"type":"getTaskDetail","mdata":taskid},
		async:false,
		dataType:"json",
		success:function(res){
			window.frames["rule_page"].showTaskDetail(res);
		}
	});
}

function openDialog(materialJson){
//	if (!$(".pupopWrap iframe").attr("src")) {
//		$(".pupopWrap iframe").attr("src","rule_page_pupop.html");
//	}
//	$("<div><iframe src='rule_page_pupop.html' width=\"100%\" height=\"100%\" frameborder=\"0\" scrolling=\"auto\"></iframe><div>").dialog({
//			width:800,
//			height:500,
//			modal:false,
//			autoOpen:true,
//			title:'账号选择',
//			zIndex:1E9,
//			resizable:false,
//			buttons:{
//				'确定':function(event,ui){
//					$(this).dialog("close");
//				},
//				'取消':function(event,ui){
//					$(this).dialog("close");
//				}
//			}
//});
//	$(".pupopWrap iframe").attr("src","rule_page_pupop.html");
//	$(".pupopWrap").show();
		s_dlg = Dialog.open({ id:"chrome_simple", title:"素材选择", url:"rule_page_pupop.html", resizable:false, theme:"chrome_simple", width:700, height:1600,
			OnLoad:function(){
				setTimeout(function(){
//					this.innerDoc.showChoosedMaterial(materialJson);
				},50);
				
			}
})
	
}
//弹出框事件预设
function closeDialog(){
	s_dlg.close();
}
//隐藏和取消posttask
function showPostTask(){
	$("#savepost").hide();
	$("#savetask").hide();
	$("#updatetask").show();
	$("#updatepost").show();
}
function hidePostTask(){
	$("#savepost").show();
	$("#savetask").show();
	$("#updatetask").hide();
	$("#updatepost").hide();
}
/**
 * 仅阻止用户定义事件的冒泡传递 
 */
 function cancelEvent( evt ){
	evt = evt || window.event;
	if(!evt){
		return;
	}
	
	if(evt.stopPropagation){
		evt.stopPropagation();
	}else{
		evt.cancelBubble=true;
	}
}