var pfinducturl = pfinduct.getStorageValue("user","pfinducturl");
var userid = pfinduct.getStorageValue("user","userid");
var background = chrome.extension.getBackgroundPage();
var sitehtmlarr = [];
var newshtmlarr = [];
$(function(){
	//初始化界面
	initSite();
	// 绑定关闭事件
	$("#_closetip").live("click", function(){
		if(currentObj){
			currentObj.poshytip('hide');
			currentObj=null;
		}
	});	
	//关闭弹出界面
	$(document).click(function(){
		if(currentObj){
			currentObj.poshytip('hide');
			currentObj=null;
		}
	});
	
	$("a.site").live("click",function(e){
		 
		//阻止冒泡事件
		e.stopPropagation();
		var cnumber = $(this).attr("cnumber");
		
		if(parseInt(cnumber)===0){
			//var indexurl = $(this).attr("indexurl");
			//window.open(indexurl);
		}else{
			var domain = $(this).attr("domain");
			var data = accountData(domain);
			showTip($(this),data);
			return false;
		}
	});
	$("#newssite").live("click",function(){
		$(this).addClass("selected");
		$(this).siblings().removeClass("selected");
		$("#sitelist").html(newshtmlarr.join(''));
	});
	$("#clubsite").live("click",function(){
		$(this).addClass("selected");
		$(this).siblings().removeClass("selected");
		$("#sitelist").html(sitehtmlarr.join(''));
	});
	
	$("a.account").live("click",function(){
		var username = $(this).text();
		var password = $(this).attr("password");
		var loginurl = currentObj.attr("loginurl");
		var domain = currentObj.attr("domain");
		var servicetype = $(this).attr("servicetype");
		var logintype = $(this).attr("logintype");
		var code = null;
		var cf = loginconfig[domain];
		console.log(cf);
		if(cf){//特殊处理
			var obj = cf[servicetype];
			loginurl = obj["loginurl"];
			code = obj["code"];
			code = code.replace(/\$USERNAME/,username).replace(/\$PASSWORD/,password);
		}else{//普通 servicetype==0且能够直接登陆过程的
		}
		
		var data = {};
		data['USERNAME']=username;
		data['PASSWORD']=password;
		data['LOGINURL']=loginurl;
		data['LOGINTYPE']=logintype;
		data['CODE']=code;
		data['domain']=domain;
		chrome.extension.sendMessage({method: "deleteCookie",url:currentObj.attr('loginurl'),name:""},function(response){
			if (response&&response.data=="ok") {
				background.background.autologin(data);
			}else{
				alert("删除cookis出错");
			}
			
		});
		
	});
	
});

function initSite(sitetype){
	var data = {};
	data.userid = userid;
	var datastr = JSON.stringify(data);
	$.ajax({
		type:'post',
		url:pfinducturl+'/chrome!getData.action',
		data:{"type":"getSiteAccountInfo","mdata":datastr},
		async:false,
		dataType:"json",
		success:function(res){
			$.each(res,function(i,item){
				var sitename = item.SITENAME;
				var indexurl = item.INDEXURL;
				var loginurl = item.LOGINURL;
				var icourl = item.ICOURL;
				var issupport = item.ISSUPPORT;
				var cnumber = item.CNUMBER;
				var domain = item.DOMAIN;
				var sitetype = item.SITETYPE;
				if (sitetype == 'bbs') {
					sitehtmlarr.push("<a class='site' target='_blank' href=\""+indexurl+"\"  domain='"+domain+"' loginurl='"+loginurl+"' indexurl='"+indexurl+"' cnumber="+cnumber+" title=\""+sitename+"("+cnumber+")\" style=\"background-image: url("+icourl+"); background-position: 5% 50%; background-repeat: no-repeat no-repeat; \">"+sitename+"("+cnumber+")</a>");
				}else{
					newshtmlarr.push("<a class='site' target='_blank' href=\""+indexurl+"\"  domain='"+domain+"' loginurl='"+loginurl+"' indexurl='"+indexurl+"' cnumber="+cnumber+" title=\""+sitename+"("+cnumber+")\" style=\"background-image: url("+icourl+"); background-position: 5% 50%; background-repeat: no-repeat no-repeat; \">"+sitename+"("+cnumber+")</a>");
				 }
				
			});
			$("#sitelist").append(sitehtmlarr.join(''));
			$("#sitelist").append("<div class=\"c\"></div>");
		}
	});
}



function accountData(domain){
	var data = {};
	data.userid = userid;
	data.domain = domain;
	var datastr = JSON.stringify(data);
	var result = [];
	$.ajax({
		type:'post',
		url:pfinducturl+'/chrome!getData.action',
		data:{"type":"getSiteAccounts","mdata":datastr},
		async:false,
		dataType:"json",
		success:function(res){
			$.each(res,function(i,item){
				var username = item.USERNAME;
				var password = item.PASSWORD;
				var servicetype = item.SERVICETYPE;
				var logintype = item.LOGINTYPE;
				var s = "<a class='account' title='"+username+"' logintype='"+ logintype +"' servicetype='"+servicetype+"' password='"+password+"' domain='"+domain+"' >"+username+"</a>";
				result.push(s);
			});
		}
	});
	return result.join("");
}

var currentObj=null;
function showTip(obj,data) {
	if(currentObj){
		currentObj.poshytip('hide');
	}
	//当前弹出对象
	currentObj = obj;
	obj.poshytip({
		content:'<p style="text-align:right;"><a id="_closetip" title="关闭">×</a></p><div style="width:400px;">'+data+'</div>',
		showOn:'none',
		alignTo:'target',
		alignX:'left',
		alignY:'top',
		offsetY:0,
		offsetX:-250
	});
	obj.poshytip('show');
}



