var account={};
account._z_AllObj = {}; //全局变量
//对外方法
account.selectAccount=function(fillAccountAndPwd,pfinducturl,url,taskid){
	var str = account.showAccount(pfinducturl,url,taskid,userid);
 
	var dialog_oj;
	if (str == null || str == "") {
		return ;
	}
	
	if($("#select_account").length!=0){
		dialog_oj = $("#select_account").empty().append(str.split("/,/")[1]);
	}else{
		dialog_oj = $("<div id='select_account'>"+str.split("/,/")[1]+"</div>");
	}

	dialog_oj.dialog({
		width:450,
		height:500,
		modal:false,
		autoOpen:true,
		title:str.split("/,/")[0]+'账号选择',
		zIndex:1E9,
		resizable:false,
		buttons:{
			'确定':function(event,ui){
				var item = "";
				$("input[type='radio'][name='account']:checked").each(function(){
					item = $(this).attr("attr");
				});
				if (item) {
					account.choseCheckedAccount(fillAccountAndPwd);
					$(this).dialog("close");
				}else{
					alert("请选择账号！");
				}
				
			},
			'取消':function(event,ui){
				$(this).dialog("close");
			}
		}
	});

};

//拿到选择的账号和这个账号在json数组中的item，便于取密码
account.choseCheckedAccount = function (fillAccountAndPwd){
	$("input[type='radio'][name='account']:checked").each(function(){
		var item = $(this).attr("attr");
		var password = account._z_AllObj[item]["PASSWORD"];
		var username = account._z_AllObj[item]["USERNAME"];
		console.log("username : " + username + " password : " + password);
		if (typeof(fillAccountAndPwd) == 'function') {
			fillAccountAndPwd(username,password);
		}
	});

};


//去数据库取得账号，以json形式返回
account.showAccount = function (pfinducturl,url,taskid,userid){
	var result='';
	var data = {};
	data.taskid=taskid;
	data.url=url;
	data.userid=userid;
	$.ajax({
		type:"POST",
		url:pfinducturl+"/chrome!showAccountList.action",
		data:data,
		async:false,
		success:function(msg){
			if (msg) {
				msg = account.fillAccount(msg,pfinducturl,url,taskid);
				result = msg;
			}
		},
		error:function(){
//			alert("转换出错，请联系运维人员!");
		}
	});
	return result;
};



//将账号填充进去
account.fillAccount = function (msg,pfinducturl,url,taskid){
	var accountAndSiteJson = $.parseJSON(msg);
	var accountObj = accountAndSiteJson["account"];
	var accountBuf = [];
	var siteName = accountAndSiteJson["siteName"];
	if (accountObj != null && accountObj != "" && accountObj.length > 0) {

		var tip = " <div style=\"padding:13px\"><span style=\"color:gray; font-size:13px; float:left;margin-top: 3px;\">" +
				" <span style=\"color:red\">*</span> 红色表示任务指派账号</span><div style=\"float:right;position:relative;\">" +
				" <input type=\"text\"  id=\"searchAccount\" style=\"width:100px;height:19px; border:1px solid gray;\">" +
				" <span id=\"closeInput\" style=\"position:absolute;left: 85px;top: 4px;display:none\"> " +
				" <img src=\""+ pfinducturl +"/images/taskAdd/selectClose.png\"id=\"closeImgId\" width=\"9\" height=\"9\" alt=\"pic\" />" +
				" </span>" +
				" <img src=\""+ pfinducturl +"/images/ico/qwjs2.gif\" id=\"searchImgId\" style=\"width:19px;vertical-align: top;\"  alt=\"查询图片\"/>" +
				" </div></div><div id=\"accountDiv\" style=\"display: inline-block;margin-top: 10px; height:380px;overflow:auto\">";
		var checkBoxStr = "<span class=\"pf_choose\"><label><input type=\"radio\" attr=\"{item}\" id=\"rd_{accountId}\" name=\"account\" /><span class=\"pf_text\" title=\"{accountName}\" style=\"{color}\">{accountName}</span></label></span>";
		var accountObjJson = accountAndSiteJson["account"];
		account._z_AllObj = accountObjJson;
		accountBuf.push("<div >");
		accountBuf.push(tip);
		if (accountObjJson.length > 0 ) {
		for(var i=0; i<accountObjJson.length; i++){
				var color = accountObjJson[i]["ACCOUNTID"] != ""?"color:red":"";
				accountBuf.push(checkBoxStr.replace(/\{accountId\}/g,accountObjJson[i]["ID"]).replace("{item}",i).replace(/\{accountName\}/g,accountObjJson[i]["USERNAME"]).replace("{color}",color));
		}
			accountBuf.push("</div></div>");
		}
	}
	$("#closeImgId").live("click",function(){
		$("#searchAccount").val('');
		$("#searchImgId").click();
	});
	$("#searchAccount").live("keyup",function(){
		if (event.keyCode) {
			if(event.keyCode == "13") {
				$("#searchImgId").click();
				
			}
		}
		if ($("#searchAccount").val()) {
			$("#closeInput").show();
		}else{
			$("#closeInput").hide();
		}
	});
	
	$("#searchImgId").live("click",function(){
		var searchAccountStr = "<span class=\"pf_choose\"><label><input type=\"radio\" attr=\"{item}\" id=\"rd_{accountId}\" name=\"account\" /><span class=\"pf_text\" title=\"{accountName}\" style=\"{color}\">{targetWord}</span></label></span>";
		var searchAccount = $("#searchAccount").val();
		var searchBuf = [];
		if (accountObjJson.length > 0) {
			for(var i=0; i<accountObjJson.length; i++){
				var regex = new RegExp(searchAccount,"ig"),
					str = accountObjJson[i]["USERNAME"],
					arr = regex.exec(str);
				if(arr){
					searchBuf.push(searchAccountStr.replace(/\{accountId\}/g,accountObjJson[i]["ID"])
						.replace("{item}",i)
						.replace(/\{accountName\}/g, str)
						.replace(/\{color\}/, accountObjJson[i]["ACCOUNTID"] != ""?"color:red":"")
						.replace(/\{targetWord\}/, str.replace(regex,"<em style='background-color:yellow;font-style:normal;'>"+arr[0]+"</em>"))
					);
				}
			}
			
			$("#accountDiv").html(searchBuf.join(''));

		}
	});
	if(accountBuf.length==0){
		return "";
	}
	return siteName + "/,/" +accountBuf.join('');
};
