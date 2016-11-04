var pfinducturl = pfinduct.getStorageValue("user","pfinducturl");
var userid = pfinduct.getStorageValue("user","userid");
var authkey = encodeURIComponent(pfinduct.getStorageValue("user","authkey"));
//var background = chrome.extension.getBackgroundPage()
$(function(){
	getUserModule();
	/*
	var userid = pfinduct.getStorageValue("user","userid");
	var authkey = encodeURIComponent(pfinduct.getStorageValue("user","authkey"));
	var taskurl = pfinducturl+"/netpf/chromeWeb!getCyListClient.action?authkey="+authkey;
	var navurl = "html/navigation.html";
	var autopublishurl = "html/autopublish.html";
	var helpurl = pfinducturl + "/chrome!help.action";
	var manageurl = pfinducturl + "/netpf/chromeWeb!accountIndex.action?authkey="+authkey;
	var tongjiurl = pfinducturl + "/netpf/reportChrome!getDeptPeo.action?authkey="+authkey;
	var gongzuourl = pfinducturl + "/netpf/workdataChrome!workData.action?authkey="+authkey+"&userid="+userid;
	$("#task").click(function(){
		pfinduct.createATabUrl(taskurl);
	});
	
	$("#nav").click(function(){
		pfinduct.createATabUrl(navurl);
	});
	$("#autopublish").click(function(){
		pfinduct.createATabUrl(autopublishurl);
	});
	$("#help").click(function(){
		pfinduct.createATabUrl(helpurl);
	});
	
	$("#manage").click(function(){
		pfinduct.createATabUrl(manageurl);
	});
	$("#tongji").click(function(){
		pfinduct.createATabUrl(tongjiurl);
	});
	$("#gongzuo").click(function(){
		pfinduct.createATabUrl(gongzuourl);
	});
	
	$("#options").click(openOptions);
	
	$("ul.nav").append("<li class=\"item\"  id=\"help\"> <a class=\"ue-state-default\"> <span class=\"icon help\"></span><span>使用手册</span> </a> </li>");
	*/
	var helpurl = pfinducturl + "/chrome!help.action";
	$("#options").click(openOptions);
	$("#help").click(function(){
		pfinduct.createATabUrl(helpurl);
	});
	var testurl = "html/mutiurlpost.html"
	$("#test").click(function(){
		//界面完成
		chrome.extension.sendMessage({method: "openUrl",key:testurl},function(response){
			
		});
	});
});


function openOptions(){
	var optionsurl = "html/options.html";
	pfinduct.createATabUrl(optionsurl);
	//window.open("html/options.html");
}

function showPluginModule(moduleData){
	if (!moduleData) {
		return ;
	}
	var functionNameid = /id=\"([^"]*)\"/.exec(moduleData["PATH"])[1]; 
	$("ul.nav div").append(moduleData["PATH"]);
	$("#"+functionNameid).click(function(){
		if (/^html\/.*/.test(moduleData["D_PATH"])) {
			pfinduct.createATabUrl(moduleData["D_PATH"]);
		}else{
			pfinduct.createATabUrl(pfinducturl+moduleData["D_PATH"].replace("{authkey}",authkey).replace("{userid}",userid));
		}
		
	});
	
}

function getUserModule(){
	$.ajax({  
		type:'get',
		url:pfinducturl+'/chrome!getPluginModules.action?userid='+userid,
		success:function(res){
			if(res){
				var resJson = $.parseJSON(res);
				console.log(resJson);
				for(i=0,len=resJson.length; i<len; i++){
					showPluginModule(resJson[i]);
				}
				
			}
		},
		error:function(){
			//alert("请求服务发生异常！");
		}
 });
	
}
function test(){
	chrome.tabs.executeScript(null, {code:"chrome.extension.sendMessage({method: \"getLocalStorage\"},function(response){alert(response.data)})"});
	
	//界面完成
	chrome.extension.sendMessage({method: "complete"},function(response){
	});
}