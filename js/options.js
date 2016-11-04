$(function(){
	restore_options();
	$("#save").bind("click",save_options);
	var obj = chrome.extension.getBackgroundPage().TASK;
	ukeyaccount();
	console.log(JSON.stringify(obj));
	
	$("#username").live("click",function(){
	    
	    ukeyaccount();
	});
	//getDB();
});

/**
 * 取ukey的账号密码
 */
function ukeyaccount(){
  
   var pfinducturl = $("#pfinducturl").val();

   if (!pfinducturl) {
       return ;
   }
    $.ajax({
	type: "get",
	async:false,
	url: pfinducturl+"/chrome!ukeyaccount.action",
	success: function(username){
	    if (username) {
		$("#username").val(username);
	//	$("#username").attr("readonly","true");
	    }
	}
    });
}

function save_options() {
	  var pfinducturl = $("#pfinducturl").val();
	  var username = $("#username").val();
	  var password = $("#password").val();
	  var userid = "";
	  var authkey = "";
	  var jsondata = new Object();
	  jsondata.username=username;
	  jsondata.password=password;
	  var jsondatastr = JSON.stringify(jsondata);
	  var data = {user:jsondatastr};
	  $.ajax({
			type: "POST",
			async:false,
			url: pfinducturl+"/chrome!loginSystem.action",
			data:data,
			success: function(dataStr){
				if(dataStr!="" && dataStr!=null){
					var obj = JSON.parse(dataStr);
					userid = obj.userid;
					authkey = obj.authkey;
					var user = new pfinduct.user();
					user.setPfinducturl(pfinducturl);
					user.setUserid(userid);
					user.setAuthkey(authkey);
					user.save();
					//删除任务
					new pfinduct.task().deleteTask();
					
					//界面提示
					$("#status").css({"color":"green"});
					$("#status").text("保存成功");
					setTimeout(function() {
						$("#status").text("");
						//打开任务导航界面
						authkey = encodeURIComponent(authkey);
						var taskurl = pfinducturl+"/netpf/chromeWeb!getCyListClient.action?authkey="+authkey;
						pfinduct.createATabUrl(taskurl);
						//更新显示的数字
						chrome.extension.getBackgroundPage().background.getTask();
						
					}, 750);
					
				}else{
					$("#status").css({"color":"red"});
					$("#status").text("验证失败");
				}
				
			},
			error: function(msg){
				$("#status").css({"color":"red"});
				$("#status").text("保存失败");
				
			}
		});
	}

function restore_options() {
  var user = pfinduct.getStorageValue("user","");
  if(user){
  	  var pfinducturl = user.pfinducturl;
  	  var jsondatastr = JSON.stringify(user);
 	  var data = {user:jsondatastr};
  	  $.ajax({
		type: "POST",
		async:false,
		url: pfinducturl+"/chrome!loginSystem.action",
		data:data,
		success: function(dataStr){
			$("#pfinducturl").val(user.pfinducturl);
			if(dataStr==null||dataStr==""){
				user.authkey="";
				user.userid="";
				localStorage.setItem("user",JSON.stringify(user));
				return;
			}
			var obj = JSON.parse(dataStr);
			if(obj){
			  	$("#username").val(obj.username);
			  	$("#password").val(obj.password);	
			}
		},
		error: function(msg){
		}
	});
  }
}


function getQueryParams() {
	var query = document.location.search || "";
	if (query.indexOf("?") == 0)
		query = query.substring(1);
	
	query = query.split("&");
	
	var params = [];
	for (i in query) {
		var pair = query[i].split("=");
		params[pair[0]] = pair[1];
	}
	
	return params;
}


function getDB(){	
   var DB=null;
   try {
       if (!window.openDatabase) {
           alert('not supported');
       } else {
           var shortName = 'pfinductDatabase';
           var version = '1.0';
           var displayName = 'pfinductDatabase desc';
           var maxSize = 4*1024*1024;
           DB = openDatabase(shortName, version, displayName, maxSize);
       }
   } catch(e) {
       alert("Error creating the database");
   }
   return DB;
}


