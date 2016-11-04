$(function(){
	$("#ckcx").click(del);
	$("#thread").click(thread);
	var db = chrome.extension.getBackgroundPage().getDB();
	$("#execute").bind("click",function(){
		var sql = $("#sql").val();
		if($.trim(sql)==''){
			alert("sql语句为空！！！");
			return;
		}
		if(db){
			db.transaction(function(tx) {
				tx.executeSql(sql,[],
						function(tx, result){//成功
					$("#resulttable").empty();
					if(result){
						 for(var i = 0; i < result.rows.length; i++){
							 var obj = result.rows.item(i);
							 var str = "<tr>";
							 for(j in obj){
								 str+="<td>"+obj[j]+"</td>";
							 }
							 //if(obj['EXECUTETIME']==0||obj['EXECUTETIME']==null){
								 str+="<td><input type='button' class='action3' value='执行该任务' rowid="+obj['ID']+" ></td></tr>";
							 //}else{
							 //	 str+="<td></td></tr>";
							 //}
							 $("#resulttable").append(str);
						 } 
					}else{
						console.log("查询结果为空！");
					}
				},function(){//失败
					//alert("sql 执行失败");
					return false;
				});
			});
			
		}
	});
	
	$("#clear").bind("click",function(){
		$("#resulttable").empty();
	});
	
	var task = {
			name:"回帖任务1",
			url:"http://tieba.baidu.com/p/1970209572",
			num:3,
			totalnum:3,
			material:[
			          {id:100,title:"湖人v5？",content:"奥胖所强调的\'三\"角进攻，乃是一代宗师杰克逊所创，公牛队屡试不爽，湖人队也因之五夺总冠军。而奥胖的建议似乎还有另一层含义：布朗不是禅师，如此大牌集中的湖人，布朗无论是协调能力还是战术水平，都搞不定。",username:'nacklfpq@163.com',password:'a111111'},
			          {id:102,title:"元芳又来了",content:"元芳，你怎\'么\"看？",username:'elevenojk9@163.com',password:'a111111'},
			          {id:101,title:"也许是吧",content:"楼主言\'之\"有理",username:'liguvtyt@yeah.net',password:'a111111'}
			          ],
			config:{},
			state:1
	};
	$("#action1").bind("click",function(){
		var name = $("#name").val();
		var url = $("#url").val();
		var num = $("#num").val();
		task.name = name;
		task.url = url;
		task.num = num;
		task.totalnum = num;
		
		insertTask(db,task);
		
		$("#execute").click();
		
	});
	
	$("#action2").bind("click",function(){
		var name = $("#name").val();
		var url = $("#url").val();
		var num = $("#num").val();
		task.name = name;
		task.url = url;
		task.num = num;
		task.totalnum = num;
		
		executeTask(task);
		
		$("#execute").click();
	});
	
	$(".action3").live("click",function(){
		var id = $(this).attr("rowid");
		executeTask(null,id);
		$("#execute").click();
	});
	
	//查询下结果
	$("#execute").click();
	
	
});

/**
 * 执行任务（无id则新建一个任务，有id则update数据库任务）
 * @param task
 * @param id
 * @returns {Boolean}
 */
function executeTask(task,id){
	var db = chrome.extension.getBackgroundPage().getDB();
	if(!db){
		alert("本地数据库无法连接！");
		return false;
	}
	
	var sql = "";
	var param = [];
	var currenttime = new Date().getTime();
	if(id){//数据库中任务update
		sql = "update PFINDUCTMUTITASK set EXECUTETIME=? where id=?";
		param = [currenttime,id];
		//拿到任务
		if(task){
			executeSqlAndTask(db,sql,param,task,id);
		}else{
			getTask(db,id,function(data){
				executeSqlAndTask(db,sql,param,data,id);
			});
		}
	}else{//新任务new
		var idsql = "select seq from sqlite_sequence where name='PFINDUCTMUTITASK'";
		chrome.extension.getBackgroundPage().executeSql(db,idsql,[],function(array){
			var taskid = array[0].seq+1;
			
			sql = "INSERT INTO PFINDUCTMUTITASK(TASKJSON,CREATETIME,EXECUTETIME) VALUES(?,?,?)";
			var taskstr = JSON.stringify(task);
			param = [taskstr,currenttime,currenttime];
			executeSqlAndTask(db,sql,param,task,taskid);
			
			
		});
		
	}
	
}

//执行sql并执行任务
function executeSqlAndTask(db,sql,param,task,id){
	db.transaction(function (tx) {
		   tx.executeSql(sql,param,
			function(){//成功
			   if(!task){
				   alert("任务为空！！");
				   return false;
			   }
			   //将数据库id放入内存，便于执行完成后更新结果
			   task.id = id;
			   var cf = getConfig(task.url);
				task.config = cf;
				chrome.extension.getBackgroundPage().background.mutiTaskExcute(task,function(tabid){
					console.log("tabid:"+tabid);
					return true;
				});
				
		   },function(){//失败
			   return false;
		   });
	});
}

function getTask(db,id,callback){
	var sql = "select TASKJSON from PFINDUCTMUTITASK where ID=?";
	var param = [id];
	db.transaction(function (tx) {
		   tx.executeSql(sql,param,
			function(tx,result){//成功
			  var s = result.rows.item(0)['TASKJSON'];
			  var task = {};
			  if(s){
				  task = JSON.parse(s);
			  }
			  if(typeof callback=='function'){
				  callback(task);
			  }
		   },function(){//失败
			   return false;
		   });
	});
}

/**
 * 
 * @param db
 * @param task
 * @returns {Boolean}
 */
function insertTask(db,task){
	if(!task){
		return false;
	}
	if(db){
		var taskstr = JSON.stringify(task);
		db.transaction(function (tx) {
		   tx.executeSql('INSERT INTO PFINDUCTMUTITASK(NAME,TASKJSON,CREATETIME) VALUES(?,?,?)',[task.name,taskstr,new Date().getTime()],
			function(){//成功
			   return true;
		   },function(){//失败
			   return false;
		   });
		});
	}
}

function del(){
	var url = $("#ckurl").val();
	var name = $("#ck").val();
//	chrome.cookies.remove({url:url,name:name,storeId:"0"},function(){
//		alert(1111);
//	});
	chrome.extension.sendMessage(
			{method: "deleteCookie",
			 url:url,name:name},
				function(response){
					console.log("2:");
				}
	);
}

function thread(){
	var pfinducturl = "http://127.0.0.1:8080/pfinduct";
	$.ajax({
		type: "POST",
		url: pfinducturl+"/chrome!RunThread.action",
		success: function(msg){
			
		},
		error: function(msg){
		}
	});
}


