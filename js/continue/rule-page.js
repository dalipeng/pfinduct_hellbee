var materialJsonAll = [];

var taskFormValidator;
$(function(){
	taskFormValidator = $("#postForm").validate({
		rules:{
			"name":{
				required : true,
				CNRangeLength : [0,255]
			},
			"url":{
				required : true,
				url	: true
			}
		},
		messages:{
			"name":{
				required : "请输入任务名！",
				CNRangeLength : "任务名称输入过长！"
			},
			"url":{
				required : "请输入url！",
				url		: "请输入正确格式的url"
			}
		}
	});

});

$(document).ready(function(){
    //iframe链接获取
	$(".fodderButton").click(function(){
		var index = -1;
		var loginSupport = false
		//待做验证url
		var url = $("#url").val();
		for (i=0,len=muticonfig.length; i<len; i++) {
			if (muticonfig[i]["reg"].test(url)) {
				index = i;
				break;
			}
		}
		if (index > -1) {
			window.parent.openDialog(materialJsonAll);
//			setTimeout(function(){
//				window.parent.frames["materialFrame"].showChoosedMaterial(materialJsonAll);
//			},50);
		}else{
			alert("该站点不支持连续发帖！");
		}
		
	});
	//点击删出某一篇素材
	$(".delete").live("click",function(){
		var parentObj = $(this).parent().parent();
		var offset = parentObj.prevAll().length;
		parentObj.remove();
		materialJsonAll.splice(offset,1);
		//将发帖次数减1
		var postnum = $("#postnum").text();
		if (/^[1-9]\d*$/.test(postnum)) {
			if (postnum > 1) {
				$("#postnum").text(--postnum);
			}else{
				$("#postnum").text('');
			}
		}
	});
	
	$("#name").keyup(function(){
		window.parent.setTaskTitle($("#name").val());
	});
	
})

function checkForm(){
	var res = $("#postForm").validate().form();
//	var res = taskFormValidator.form();
	return res;
}
/***
 * 保存task
 */
function saveTask(){
	var task = {};
	task["NAME"] = $("#name").val();
	task["URL"] = $("#url").val();
	task["POSTNUM"] = $("#postnum").text();
	if (materialJsonAll.length) {
		task["DOMAIN"] = materialJsonAll[materialJsonAll.length-1]["DOMAIN"];
	}
	
	var materialJson = [];
	var matAndAcc = [];
	for (i = 0,len = materialJsonAll.length; i < len; i++) {
		var contentArr = [];
		var mid = materialJsonAll[i]["ID"];
		var title = materialJsonAll[i]["TITLE"];
		contentArr.push(materialJsonAll[i]["CONTENT"]);
		contentArr.push(materialJsonAll[i]["CONTENT1"]);
		contentArr.push(materialJsonAll[i]["CONTENT2"]);
		contentArr.push(materialJsonAll[i]["CONTENT3"]);
		contentArr.push(materialJsonAll[i]["CONTENT4"]);
		contentArr.push(materialJsonAll[i]["CONTENT5"]);
		contentArr.push(materialJsonAll[i]["CONTENT6"]);
		contentArr.push(materialJsonAll[i]["CONTENT7"]);
		contentArr.push(materialJsonAll[i]["CONTENT8"]);
		var aid = materialJsonAll[i]["AID"];
		if ((/^[1-9]\d*$/.test(mid)) ) {
			matAndAcc = {"MID":mid,"AID":aid};
		}else{
			matAndAcc = {"TITLE":title,"CONTENT":contentArr.join(''),"AID":aid};
		}
		materialJson.push(matAndAcc);
//		task["data"] = matAndAcc;
		
	}
	task["DATA"] = materialJson;
	return task;
}
/**
 * 设置taskid,防止每次更新id还是原来的id
 * @param taskid
 */
function setTaskid(taskid){
	$("#taskid").val(taskid);
}
/**
 * 发帖Json和保存任务不同的是
 * @returns {___anonymous1444_1445}
 */
function postTask(){
	var task = {};
	task["NAME"] = $("#name").val();
	task["URL"] = $("#url").val();
	task["NUM"] = $("#postnum").text();
	task["TOTALNUM"] = $("#postnum").text();
	
	task["ID"] = $("#taskid").val();
	task["STATE"] = 1;
	task["DOMAIN"] = materialJsonAll[0]["DOMAIN"];
	var contentArr = [];
	var materialJson = [];
	var matAndAcc = [];
	for (i = 0,len = materialJsonAll.length; i < len; i++) {
		contentArr = [];
		contentArr.push(materialJsonAll[i]["CONTENT"]);
		contentArr.push(materialJsonAll[i]["CONTENT1"]);
		contentArr.push(materialJsonAll[i]["CONTENT2"]);
		contentArr.push(materialJsonAll[i]["CONTENT3"]);
		contentArr.push(materialJsonAll[i]["CONTENT4"]);
		contentArr.push(materialJsonAll[i]["CONTENT5"]);
		contentArr.push(materialJsonAll[i]["CONTENT6"]);
		contentArr.push(materialJsonAll[i]["CONTENT7"]);
		contentArr.push(materialJsonAll[i]["CONTENT8"]);
		matAndAcc = {"MID":materialJsonAll[i]["ID"],"TITLE":materialJsonAll[i]["TITLE"],"CONTENT":contentArr.join(''),"AID":materialJsonAll[i]["AID"],"USERNAME":materialJsonAll[i]["USERNAME"],"PASSWORD":materialJsonAll[i]["PASSWORD"]};
		materialJson.push(matAndAcc);
	}
	task["MATERIAL"] = materialJson;
	return task;
}
/***
 * 更新task
 */
function updateTask(){
	var task = saveTask();
	task["ID"] = $("#taskid").val();
	return task;
}
//将任务素材的详细信息显示在列表中
function showMaterialDetail(materialJson){
	$("#postnum").text(materialJson.length);
	$("#postnumlable").show();
	materialJsonAll = materialJson;
	if (materialJson != null) {
		var alltaskstr = [];
		for (i=0; i<materialJson.length; i++) {
			var contentArr = [];
			contentArr.push(materialJson[i]["CONTENT"]);
			contentArr.push(materialJson[i]["CONTENT1"]);
			contentArr.push(materialJson[i]["CONTENT2"]);
			contentArr.push(materialJson[i]["CONTENT3"]);
			contentArr.push(materialJson[i]["CONTENT4"]);
			contentArr.push(materialJson[i]["CONTENT5"]);
			contentArr.push(materialJson[i]["CONTENT6"]);
			contentArr.push(materialJson[i]["CONTENT7"]);
			contentArr.push(materialJson[i]["CONTENT8"]);
			alltaskstr.push("<dl><dt mid='"+ materialJson[i]["ID"] +"' aid='"+  materialJson[i]["AID"] +"'><a href='javascript:;' class='delete'>删除</a>"+ materialJson[i]["TITLE"] +"  <span style='float:right;padding-right: 20px;'> 账号："+ materialJson[i]["USERNAME"] +"</span></dt><dd>"+ contentArr.join('') +"</dd></dl>");
		}
		$(".list").html(alltaskstr.join(''));
	}
}
/**
 * 显示taskdetail
 * @param taskJson
 */
function showTaskDetail(taskJson){
	var name = taskJson["NAME"];
	var url = taskJson["URL"];
	var num =  taskJson["NUM"];
	var material = taskJson["MATERIAL"];
	$("#name").val(name);
	$("#url").val(url);
	$("#postnum").text(num);
	$("#postnumlable").show();
	$("#taskid").val(taskJson["ID"]);
	materialJsonAll = material;
	showMaterialDetail(material);
}
function clearAllValue(){
	$("#postnumlable").hide();
	$("#name").val('');
	$("#postnum").text('');
	$("#url").val('');
	$(".list").html('');
	materialJsonAll = [];
}

$("#help").live("click",function(){showTip(this)});
//显示支持站点
var hasValidTip = false;
function showTip(obj) {
	if( !hasValidTip ){
		$(obj).poshytip({
			content:'<p >支持站点<a id="_closetip" title="关闭" style="text-align:right;position:absolute;right:5px;cursor:pointer;">×</a></p>'
				+'<div style="width:150px;"><div><a href="http://tieba.baidu.com" target="_blank">百度贴吧</a>，'
				+'<a href="http://club.sohu.com/" target="_blank">搜狐社区</a></div><div><a href="http://www.tianya.cn/login" target="_blank">天涯社区</a>，'
				+'<a href="http://bbs.we54.com" target="_blank">大连新青年</a></div>'
				+'<div><a href="http://user.kdnet.net/login_new.asp" target="_blank">凯迪社区</a>，<a href="http://forum.home.news.cn/list/50-0-0-1.html" target="_blank">新华网</a></div>'
				+'<div><a href="http://bbs.tiexue.net" target="_blank">铁血社区</a>，<a href="http://bbs.ifeng.com/" target="_blank">凤凰论坛</a></div>'
				+'<div><a href="http://www.xici.net/" target="_blank">西祠论坛</a>，<a href="http://bbs.voc.com.cn/" target="_blank">华声论坛</a></div>'
				+'</div>',
			showOn:'none',
			alignTo:'target',
			alignX:'top',
			alignY:'top',
			offsetY:10,
			offsetX:-60
		});
		$(obj).poshytip('show');
		$("#_closetip").bind("click", function(){ $(obj).poshytip('hide'); hasValidTip = false;});	
		hasValidTip = true;
	}
	
}	

function closeTip(obj){
	$(obj).poshytip('hide');
	hasValidTip = false;
}
