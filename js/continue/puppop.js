//var _path = "http://10.0.23.75:8080/pfinduct";
//var userid = -10;
var _path = pfinduct.getStorageValue("user","pfinducturl");
var userid = pfinduct.getStorageValue("user","userid");
var accountJson = [];//账号的JSON
var unselectAccount = [];
var accountsize = 0;//账号有多少个数
var allMJson = []; //所有素材的json，在保存素材的时候，将这条json传回去
var mindex = 0; //每调用一次，都自增一下。这是给素材自定义添加用的
var mTitleItem = 0; // 每次调用自增。用于给右侧title标号
var maxtitle = 50;
//var accountElipseBuf = [];
$(function(){
	$(".content").height($(window).height() -70);
	$(".tree").height($(".content").height() -60);
	$(".listWrap").height($(".content").height() -245);
	//还原在rule_page里面的数据
	var sibFrm = parent.document.getElementById("rule_page");
	if(sibFrm){
		var materialJsonAll = sibFrm.contentWindow.materialJsonAll;
		if (materialJsonAll.length > 0) {
			setTimeout(function(){
				showChoosedMaterial(materialJsonAll);
			},50);
		}
	}
	/*弹出框左侧项目多选效果*/
	$(".tree dl dd").click(function(){
        if(!$(this).hasClass("select")){
	        $(this).addClass("select");
		}
	});
	
	/*编辑/保存切换效果*/
	$(".edit").click(function(){
		$(this).hide();
		$(".viewContent").hide();
		$(".save").show();
		$(".viewInput").val($(".viewContent").text());
		$(".viewInput").show();
		//将此div里面的内容展现到textarea里面
		
	});
	/*保存效果*/
	$(".save").click(function(){
		var flag = $("#mAdd").css("display");
		var title = $("#mTitle").val();
		var content = $(".viewInput").val();
		if (flag != 'none' && flag != 'undefined') {//如果flag!=null那么是日添加素材
			if (title != "" && content !="") {
				var personalMaterial = {};
				//将预览的选项显示出来
				$("#mPreview").show();
				$("#mAdd").hide();
				$(".viewContent").text(content);
				accountsize = getRandAccountSize();
				//自定义素材的id自增
				mindex++;
				//将这条数据生成一条json，并在 界面中展示
//				var listStr ="<li class='hover' id='m"+ mindex +"'>"+ title +"账号："+ accountJson[accountsize]["USERNAME"] +"<span class='close'></span></li>" 
				var listStr = "<li style='width:370px' class='hover' attr='m"+ mindex +"' aid='"+ accountJson[accountsize]["ID"] +"' >"
						+ "<a style=\"width:25px;display:inline-block\">" +  ++mTitleItem + "、</a><a class='titleelipse'>" + title 
						+ "</a>账号：<a class='accountelipse' > "+ accountJson[accountsize]["USERNAME"] +"</a><span class='close'></span></li>";
				//将数据还原成统一的格式，这里经过自定义或编辑的素材id将会议M开头
				personalMaterial["ID"] = 'm'+mindex;
				personalMaterial["TITLE"] = title;
				personalMaterial["CONTENT1"] = content;
				personalMaterial["CONTENT2"] = "";
				personalMaterial["CONTENT3"] = "";
				personalMaterial["CONTENT4"] = "";
				personalMaterial["CONTENT5"] = "";
				personalMaterial["CONTENT6"] = "";
				personalMaterial["CONTENT7"] = "";
				personalMaterial["CONTENT8"] = "";
				personalMaterial["AID"] = accountJson[accountsize]["ID"];
				personalMaterial["USERNAME"] = accountJson[accountsize]["USERNAME"];
				personalMaterial["PASSWORD"] = accountJson[accountsize]["PASSWORD"];
				personalMaterial["DOMAIN"] = accountJson[accountsize]["DOMAIN"];
				//先将所有的hover去掉
				if (mTitleItem < maxtitle) {
					$(".rightBar .listWrap ul li").each(function(){$(this).removeClass("hover")});
					$(".rightBar .listWrap ul").append(listStr);
					allMJson.push(personalMaterial);
					$("mTitle").val('');
					titleBind();
					$(".rightBar .listWrap ul li").last().click();
				}else{
					showErrorMess("一次任务最多只能添加50篇素材！")
				}

			}else{
				showErrorMess("请输入添加的内容！");
//				alert("请输入添加的内容！");
			}
			
		}
		else {
			var editTxt = $(".viewInput").val();
			$(".viewContent").text(editTxt);
			var item = 0;
			mindex++;
			$(".rightBar .listWrap ul li").each(function(i){
				var classval = $(this).attr("class");
				if (classval == 'hover') {
					item = i;
					$(this).attr("attr","m"+mindex);
				}
			});
			allMJson[item]["ID"] =  "m"+mindex;
			allMJson[item]["CONTENT"] =  editTxt;
			allMJson[item]["CONTENT1"] =  "";
			allMJson[item]["CONTENT2"] =  "";
			allMJson[item]["CONTENT3"] =  "";
			allMJson[item]["CONTENT4"] =  "";
			allMJson[item]["CONTENT5"] =  "";
			allMJson[item]["CONTENT6"] =  "";
			allMJson[item]["CONTENT7"] =  "";
			allMJson[item]["CONTENT8"] =  "";
			
			$(this).hide();
			$(".viewInput").hide();
			$(".edit").show();
			$(".viewContent").show();
			titleBind();
		}

	})
	/*确定按钮*/
	$("#ok").click(function(){
		saveTask();
		window.parent.closeDialog();
	});
	/*取消按钮*/
	$("#cancel").click(function(){
		window.parent.closeDialog();
	});
	
	//点击删除的时候	
	$(".close").live("click",function(){
		var parentObj = $(this).parent();
		var item = parentObj.prevAll().length;
		var id = parentObj.attr("attr");
		allMJson.splice(item,1);
		parentObj.remove();
		//重新标号
		$(".listWrap ul li").each(function(item){
			$(this).children().first().text(++item+"、")
		});
		//将标号的数字减减
		--mTitleItem;
		var mtremain = $("#mt"+id).children().last().text();
		--mtremain;
		if (mtremain > 0) {
			$("#mt"+id).children().last().text(mtremain);
		}else{
			$("#mt"+id).children().last().text('');
		}
		
		//将左侧的选中去掉，并且重新设为可绑定
//		$("#mt"+id).removeClass("select");
//		mtitlebind();
		var rightItem = $(".rightBar .listWrap ul li");
//		//将最后一条数据选中
		
		if (rightItem.length) {
			rightItem.last().click();
		}else{
			$(".viewInput").val('');
			$(".viewContent").text('');
			
		}
	});
	//当鼠标移动到close上面的时候
	$(".close").live("mouseover",function(){
		$(this).addClass('moverclose');
	});
	//当鼠标移出close上面的时候
	$(".close").live("mouseout",function(){
		$(this).removeClass('moverclose');
	});
	
	$("#addMaterial").click(function(){
		$(".edit").click();
		$("#mPreview").hide();
		$("#mAdd").show();
		$(".viewInput").val('');
		$("#mTitle").val('');
	});
	//清空所有的素材
	$("#clearAllMater").click(function(){
		clearAllMaterial();
	});
	/*加载左边目录树*/
	$.ajax({
		type:'get',
		url:_path+'/chrome!getData.action',
		data:{"type":"getMaterialTitle","mdata":""},
		async:false,
		dataType:"json",
		success:function(res){
			var materialList = [];
			var classList = [];
			if (res) {
				if (res["pfimaterialList"]) {
					materialList = res["pfimaterialList"];
				}
				if (res["classList"]) {
					classList = res["classList"];
				}
			}
			/*先将列表展现出来*/
			var classid  = 0;
			var classBuf = [];
			for (i=0 , len=classList.length; i < len; i++ ) {
				classid = classList[i]["ID"];
				classname = classList[i]["NAME"];
				classBuf.push("<dl id='classn" + classid + "'><dt id='classdt"+ classid +"' >" +
						" <label class='labelpointer'><input type='checkbox' attr='"+ classid +"' id='classd"+ classid +"' />"
						+ classname +"</label><span attr='show' class=\"fold\"><span style=\"color:#005E91;float: left;\"></span>" +
								" <em class='trigledown'></em></span></dt></dl>");
			}
			$(".tree").html(classBuf.join(''));
			//缺少判断materialLsit是否为undefined或者为空
			var title = "";
			var materialid = 0;
			
			for (i=0,len=materialList.length; i<len; i++) {
				classid = materialList[i]["CLASSID"];
				materialid = materialList[i]["ID"];
				title = materialList[i]["TITLE"];
				$("#classn"+classid).append("<dd id='mt"+materialid+"' attr="+materialid+"><span  class='mtitleelipse'>"+ title 
						+ "</span><span class='mcount'></span></dd>");
				
			}
			//下面搜索框搜索
			//这里位置不能移动，需要使用materialList
			$(".treeSearch .treeSubmit").click(function(){
			
				classBuf = [];
				var searchword = $("#search_bd").val();
				
				for (i=0 , len=classList.length; i < len; i++ ) {
					classid = classList[i]["ID"];
					classname = new String(classList[i]["NAME"]);
					classBuf.push("<dl id='classn" + classid + "'><dt id='classdt"+ classid +"'>" +
							" <label class='labelpointer'><input type='checkbox' attr='"+ classid 
							+ "' id='classdt"+ classid +"' />"+ classname +"</label><span attr='show' " 
							+ " class=\"fold\"><span style=\"color:#005E91;\"></span><em class='trigledown'>" 
							+ " </em></span></dt></dl>");
				}
				$(".tree").html(classBuf.join(''));
				//缺少判断materialLsit是否为undefined或者为空
				var title = "";
				var materialid = 0;
				
				for (i=0,len=materialList.length; i<len; i++) {
					classid = materialList[i]["CLASSID"];
					materialid = materialList[i]["ID"];
					title = new String(materialList[i]["TITLE"]);
					if (title.indexOf(searchword) != -1) {
						title = title.replace(new RegExp(searchword,"gi"),'<b class="highlight">'+ searchword +'</b>');
						$("#classn"+classid).append("<dd id='mt"+materialid+"' attr="+materialid+"><span  class='mtitleelipse'>"+ title 
						+ "</span><span class='mcount'></span></dd>");
					}
				}
				mtitlebind();//素材标题绑定
				mclassbind();//素材分类绑定
				//搜索完成后，对所有的已选标题存放到数组里面去，将选过的以数字方式展现
				var selectTitle = [];
				$(".rightBar .listWrap ul li").each(function(){
					selectTitle.push($(this).attr("attr"));
				});
				if (selectTitle.length > 0) {
					for (i=0,len=selectTitle.length; i<len; i++) {
						var mcount = $("#mt"+selectTitle[i]).children().last().text();
						if (/^[1-9]\d*$/.test(mcount)) {
							$("#mt"+selectTitle[i]).children().last().text(++mcount);
						}else{
							$("#mt"+selectTitle[i]).children().last().text(1);
						}
//						//将这条素材置为不可选状态
//						$("#mt"+selectTitle[i]).unbind("click");
//						$("#mt"+selectTitle[i]).addClass("select");
					}
				}
				
			});
			/***搜索结束***/
			//绑定素材标题事件
			mtitlebind();
			//绑定素材分类事件
			mclassbind();
		},
		error:function(){
			alert("请求服务发生异常！");
		}
	});
	/*加载目录树结束*/
	
	/*随机选择素材*/
	$("#randbtn").click(function(){
		var randNum = $("#randNum").val();
		if (/^[1-9]\d*$/.test(randNum)) {
			var unSelectMater = [];
			//计算总共有多少个素材
			//找出没选的素材，组成一个数组。然后从数组中挑随机数
			$("dd").each(function(){
//				if (!$(this).attr("class").indexOf('select')) {
					unSelectMater.push($(this).attr("attr"));
//				}
			});
			var remainNum = maxtitle - mTitleItem;
			/*这里换一种算法*/
//			var mall = unSelectMater.length;
			if (remainNum < randNum) {
				
				showErrorMess("还能随机选择"+remainNum+"篇素材！");
				 $("#randNum").val(remainNum);
				randNum = remainNum;
			}
			var mall = $("dd").length;
			//先从所有素材中选一便，以保证在随机时所有素材都能被选中
			var mremain = randNum - mall;//计算选择的数和总共素材的差，如果为正数，那么全从unselecttiotle数组中去取，如果为负数，则从所有素材中随机
			for (i=0; i<randNum; i++) {
				mall = unSelectMater.length;
				if (mall > 0) {
					var rnum = Math.floor(Math.random()*mall);
					showMaterial(unSelectMater[rnum]);
					unSelectMater.splice(rnum,1);
				}else{
					break;
				}
					
			}
			//如果素材库素材不够，则从素材库中去随机
			mall = $("dd").length;
			for(i=0; i<mremain; i++){
				var rnum = Math.floor(Math.random()*mall);
				showMaterial($("dd").eq(rnum).attr("attr"));
//					mall = unSelectMater.length;
//					var rnum = Math.floor(Math.random()*mall);
//					showMaterial(unSelectMater[rnum]);
//					unSelectMater.splice(rnum,1);	
			}
			
			
		}
	});

//	$("dt").live("mouseover",function(){
//		if ($(this).siblings().length > 0) {
//			$(this).children().last().show();
//		}
//	});
//	$("dt").live("mouseout",function(){
//		$(this).children().last().hide();
//	});

	
	/*******点击收起将下面的目录展现出来*******/
	$(".fold").live("click",function(){
		var flag = $(this).attr("attr");
			if (flag == 'show') {
				$(this).attr("attr","hidden");
//				$(this).children().first().text('展开');
				$(this).children().last().removeClass("trigledown");
				$(this).children().last().addClass("trigleup");
			}
			else{
				$(this).attr("attr","show");
//				$(this).children().first().text('收起');
				$(this).children().last().removeClass("trigleup");
				$(this).children().last().addClass("trigledown");
			}
			$(this).parent().siblings().toggle();
	});
	$("#delkeyword").click(function(){
		$("#search_bd").val('');
		$("#delkeyword").hide();
		$(".treeSearch .treeSubmit").click();
	});
	//检测搜索输入框
	$("#search_bd").bind("keyup",function(event){
		if ($("#search_bd").val()) {
			$("#delkeyword").show();
		}else{
			$("#delkeyword").hide();
		}
		if (event.keyCode) {
			if(event.keyCode == "13") {
				$(".treeSearch .treeSubmit").click();
			}
		}
	});
	//检测随机数输入框
	$("#randNum").bind("keyup",function(event){
		if (event.keyCode) {
			if(event.keyCode == "13") {
				$("#randbtn").click();
			}
		}
	});
	//取得所有的账号
	getAccount();
})
function getAccount() {
	var index = -1;
	var url = window.parent.frames["rule_page"].document.getElementById("url").value;
	for (i=0,len=muticonfig.length; i<len; i++) {
		if (muticonfig[i]["reg"].test(url)) {
			index = i;
			break;
		}
	}
	if (muticonfig[index]["config"]["isloginsupport"]) {
		/*根据url去取账号*/
		var jsonURL = {"url":url,"userid":userid};
		$.ajax({
			type:'get',
			url:_path+'/chrome!getData.action',
			data:{"type":"getAccount","mdata":JSON.stringify(jsonURL)},
			async:false,
			dataType:"json",
			success:function(res){
				if (!res.length) {
					if (confirm("该站点下暂时没有帐号，是否继续？")){
						var account = {};
						account["ID"] = "";
						account["USERNAME"] = "";
						account["PASSWORD"] = "";
						account["DOMAIN"] = "";
						accountJson.push(account);
						
					}else{
						window.parent.closeDialog();
					}
				}else{
					accountJson = res;
					extend(unselectAccount,accountJson);
//					unselectAccount = res;
					
//					for (i = 0; i < accountJson.length; i++) {
//						accountElipseBuf.push("<option value='"+ i +"'>" + accountJson[i]["USERNAME"] + "</option>");
//					}
				}
				
//				accountsize = accountJson.length;
			}
		});
	}else{
		var account = {};
		account["ID"] = "";
		account["USERNAME"] = "";
		account["PASSWORD"] = "";
		account["DOMAIN"] = "";
		accountJson.push(account);
		
		showErrorMess("此版块我们暂不支持连续登陆！");
	}
}
function getType(o)
{
    var _t;
    return ((_t = typeof(o)) == "object" ? o==null && "null" || Object.prototype.toString.call(o).slice(8,-1):_t).toLowerCase();
}
function extend(destination,source)
{
    for(var p in source)
    {
        if(getType(source[p])=="array"||getType(source[p])=="object")
        {
            destination[p]=getType(source[p])=="array"?[]:{};
            arguments.callee(destination[p],source[p]);
        }
        else
        {
            destination[p]=source[p];
        }
    }
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
		
/*显示详细信息*/
function showMaterial(materialid){
	var data = {"materialid":materialid,"classid":-1};
	
	$.ajax({
		type:'GET',
		url:_path+'/chrome!getData.action',
		data:{"type":"getMaterialDetail","mdata":JSON.stringify(data)},
		dataType:"json",
		success:function(res){
			if (res) {
				var materialBuf = [];
				var len = res.length;
				var contentArr = [];
				$("#mPreview").show();
				$("#mAdd").hide();
				//将素材预览后面的标题换掉
				$("#pretitle").text(res[len-1]["TITLE"]);
				//将viewcontent显示出来，将viewinput隐藏
				$(".save").hide();
				$(".viewInput").hide();
				$(".edit").show();
				$(".viewContent").show();
				accountsize = getRandAccountSize();
				res[len-1]["AID"] = accountJson[accountsize]["ID"];
				res[len-1]["USERNAME"] = accountJson[accountsize]["USERNAME"];
				res[len-1]["PASSWORD"] = accountJson[accountsize]["PASSWORD"];
				res[len-1]["DOMAIN"] = accountJson[accountsize]["DOMAIN"];
				//最后一条和前面的n条数据多了个选中的效果
				materialBuf.push("<li style='width:370px' class='hover' attr='"+res[len-1]["ID"]+"' aid='"+ accountJson[accountsize]["ID"] +"' >"
						+ "<a style=\"width:25px;display:inline-block\">" +  ++mTitleItem + "、</a><a class='titleelipse'>" + res[len-1]["TITLE"] 
						+ "</a>账号：<a class='accountelipse' item='"+ accountsize +"' > "+ accountJson[accountsize]["USERNAME"] +"</a><span class='close'></span></li>");
//				var sTitleStr = "<div class='mTtilediv'> " 
//						+ "<div style=\"margin-bottom:3px\"><span style=\"width:25px;display:inline-block\">" +  ++mTitleItem + "、</span> <span class='titleelipse' style=\"margin-bottom:5px\">"
//						+ res[len-1]["TITLE"] +"</span><span style=\"margin-bottom:5px\"  >" 
//						+ " <div class='fuiseldiv' style='width:152px'> <select class='fuiselect' style='width:100%'></select>" 
//						+ " <span class='fuiselspan' style='width:132px'>"+ accountJson[accountsize]["USERNAME"] +"</span></div> </span>"
//						+ " <a href=\"#\" class='delTitle'></a></div></div>"
				var mcount = $("#mt"+materialid).children().last().text();
				if (/^[1-9]\d*$/.test(mcount)) {
					$("#mt"+materialid).children().last().text(++mcount);
				}else{
					$("#mt"+materialid).children().last().text(1);
				}
				//将这条素材置为不可选状态(换成可以重复选的样式)
//				$("#mt"+res[len-1]["ID"]).unbind("click");
//				$("#mt"+res[len-1]["ID"]).addClass("select");
				allMJson.push(res[len-1]);//将这个json放到accountAll中
				console.log("console : allMjson : ");
				console.log(allMJson);
				contentArr.push(res[len-1]["CONTENT"]);
				contentArr.push(res[len-1]["CONTENT1"]);
				contentArr.push(res[len-1]["CONTENT2"]);
				contentArr.push(res[len-1]["CONTENT3"]);
				contentArr.push(res[len-1]["CONTENT4"]);
				contentArr.push(res[len-1]["CONTENT5"]);
				contentArr.push(res[len-1]["CONTENT6"]);
				contentArr.push(res[len-1]["CONTENT7"]);
				contentArr.push(res[len-1]["CONTENT8"]);
				//将值展示到页面上去
				//先将所有的hover去掉
				$(".rightBar .listWrap ul li").each(function(){$(this).removeClass("hover")});
//				$(".rightBar .listWrap ").append(sTitleStr);
				$(".rightBar .listWrap ul").append(materialBuf.join(''));
				$(".viewContent").text(contentArr.join(''));
				//对于上面的标题进行一次绑定
				titleBind();
			}
			
		},
		error:function(){
			Dialog.error("请求服务发生异常！");
		}
	});
}

function existInArray(array,elem){
	var res = false;
	for (i=0,len=array.length; i<len; i++) {
		if (elem = array[i]) {
			res = true;
		}
	}
	return res;
}
/**
 * 删除某一分类下的素材
 * @param classid   分类的id
 */
function clearClassMaterial(classid){
	if (classid != "" && classid != 'undefined') {
		$("#classdt"+classid).siblings().each(function(){
			var id = $(this).attr("attr");
			var item = $("li[attr='"+ id +"']").prevAll().length;
			$("li[attr='"+ id +"']").remove();
//			$(this).removeClass("select");
			$(this).children().last().text('');
			allMJson.splice(item,1);	
			--mTitleItem;
		});
		mtitlebind();
	}
}
/**
 * 清空所有的已选
 */
function clearAllMaterial(){
	$("dd").removeClass("select");
	allMJson = [];
	mtitlebind();
	$(".rightBar .listWrap ul li").each(function(){
		$(this).remove();
	});
	$(".viewContent").text('');
	$(".viewInput").text('');
	$("#pretitle").text('');
	$("#mTitle").val('');
	$(".mcount").text('');
	mTitleItem = 0;
}
/**
 * 点击保存任务
 * @param res
 */
function saveTask(res){
	window.parent.frames["rule_page"].showMaterialDetail(allMJson);
}
function showErrorMess(errmess) {
	$("#mess").text(errmess);
	window.setTimeout(function(){
		$("#mess").text('');
	}, 3000)
}
/*将每个素材标题绑定事件*/
function mtitlebind(){
	$("dd").each(function(){
		$(this).unbind("click");
		$(this).bind("click",function(){
			if (mTitleItem < maxtitle) {
				showMaterial($(this).attr("attr"));
			}else{
				$(".rightBar .listWrap ul li ").last().click();
				showErrorMess('一次发帖最多支持选50篇素材！');
			}
			
		});
	});
}

/*将每个分类绑定事件*/
/**
 * 将分类绑定
 * 这里将分类下的每个素材添加一次点击事件
 *  */
function mclassbind(){
	$("input[type=checkbox][id^='classd']").each(function(){
		$(this).unbind("click");
		$(this).bind("click",function(){
			if ($(this).attr("checked") == 'checked'){
//				showMaterial(-1,$(this).attr("attr"));
				$(this).parent().parent().siblings().each(function(){
					if (mTitleItem < maxtitle) {
						//将没有被选过的选中
						if (!$(this).children().last().text()) {
							$(this).click();
						}
						
					}
					
				});
			}
			else{
				clearClassMaterial($(this).attr("attr"));
			}
			
		});
	});
}
/**
 * 请求domain
 * @returns {String}  返回domain
 */
function getDomain(){
	var url = window.parent.frames["rule_page"].document.getElementById("url").value;
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
 * 显示选择的素材，这是从已保存的任务进来的
 * @param materialJson
 */
function showChoosedMaterial(materialJson){
	//判断还原数据里面的站点是否和现在输入框中输入的数据站点一致
	
	if (materialJson.length > 0) {
		if (materialJson[materialJson.length-1]["DOMAIN"] == "" || (getDomain() == materialJson[materialJson.length-1]["DOMAIN"])) {
			var materialBuf  = [];
			var len = 0;
			for (i=0, len=materialJson.length; i<len-1; i++ ) {
				//最后一条和前面的n条数据多了个选中的效果
				materialBuf.push("<li style='width:370px' attr='"+materialJson[i]["ID"]+"' aid='"+ materialJson[i]["AID"] +"' >"
						+ "<a style=\"width:25px;display:inline-block\">" +  ++mTitleItem + "、</a><a class='titleelipse'>" + materialJson[i]["TITLE"] 
						+ "</a>账号：<a class='accountelipse' > "+ materialJson[i]["USERNAME"] +"</a><span class='close'></span></li>");
//				materialBuf.push("<li id='"+ materialJson[i]["ID"] +"' aid="+ materialJson[i]["AID"] +"><a class='titleelipse'>"+ materialJson[i]["TITLE"] +"</a> 账号："+ materialJson[i]["USERNAME"] +"<span class='close'></span></li>");
//				$("#mt"+materialJson[i]["ID"]).unbind("click");
//				$("#mt"+materialJson[i]["ID"]).addClass("select");
				var mcount = $("#mt"+materialJson[i]["ID"]).children().last().text();
				if (/^[1-9]\d*$/.test(mcount)) {
					$("#mt"+materialJson[i]["ID"]).children().last().text(++mcount);
				}else{
					$("#mt"+materialJson[i]["ID"]).children().last().text(1);
				}
				allMJson.push(materialJson[i]);
			}
			
			materialBuf.push("<li class='hover' style='width:370px' attr='"+materialJson[len-1]["ID"]+"' aid='"+ materialJson[len-1]["AID"] +"' >"
					+ " <a style=\"width:25px;display:inline-block\">" +  ++mTitleItem + "、</a><a class='titleelipse'>" + materialJson[len-1]["TITLE"] 
					+ " </a> 账号：<a class='accountelipse' >"+ materialJson[len-1]["USERNAME"] +"</a><span class='close'></span></li>");
			
			//最后一条和前面的n条数据多了个选中的效果
//			materialBuf.push("<li class='hover' id='"+ materialJson[len-1]["ID"] +"' aid="+ materialJson[len-1]["AID"] +"><a class='titleelipse'>"+ materialJson[len-1]["TITLE"] +"</a> 账号："+ materialJson[i]["USERNAME"] +"<span class='close'></span></li>");
			//将素材预览标题换掉
			$("#pretitle").text(materialJson[len-1]["TITLE"]);
			var mcount = $("#mt"+materialJson[len-1]["ID"]).children().last().text();
			if (/^[1-9]\d*$/.test(mcount)) {
				$("#mt"+materialJson[len-1]["ID"]).children().last().text(++mcount);
			}else{
				$("#mt"+materialJson[len-1]["ID"]).children().last().text(1);
			}
			//将这条素材置为不可选状态（已经置为可以重复选的状态）
//			$("#mt"+materialJson[len-1]["ID"]).unbind("click");
//			$("#mt"+materialJson[len-1]["ID"]).addClass("select");
			allMJson.push(materialJson[len-1]);//将这个json放到accountAll中
			var contentArr = [];
			contentArr.push(materialJson[len-1]["CONTENT"]);
			contentArr.push(materialJson[len-1]["CONTENT1"]);
			contentArr.push(materialJson[len-1]["CONTENT2"]);
			contentArr.push(materialJson[len-1]["CONTENT3"]);
			contentArr.push(materialJson[len-1]["CONTENT4"]);
			contentArr.push(materialJson[len-1]["CONTENT5"]);
			contentArr.push(materialJson[len-1]["CONTENT6"]);
			contentArr.push(materialJson[len-1]["CONTENT7"]);
			contentArr.push(materialJson[len-1]["CONTENT8"]);
			//将值展示到页面上去
			//先将所有的hover去掉
			$(".rightBar .listWrap ul li").each(function(){$(this).removeClass("hover")});
			$(".rightBar .listWrap ul").append(materialBuf.join(''));
			$(".viewContent").text(contentArr.join(''));
			titleBind();
		}else{
			showErrorMess("输入的发帖地址已换，请重新选择素材！");
		}
		
	}
	
}
/**
 * 去随机账号
 * @returns   返回账号的一个随机位置
 */

function getRandAccountSize(){
	var rnum = 0;
	if (unselectAccount && 0 < unselectAccount.length) {
		rnum = unselectAccount.length -1;
		unselectAccount.splice(rnum, 1);
	}else{
		rnum = Math.floor(Math.random()*accountJson.length);
	}
	
	return rnum;
}



/**
 * 绑定右侧标题
 */
function titleBind(){
	$(".rightBar .listWrap ul li ").each(function(){
		$(this).unbind("click");
		$(this).bind('click',function(){
			$("#mPreview").show();
			$("#mAdd").hide();
			//将素材预览后面的标题换掉
			$("#pretitle").text($(this).children().eq(1).text());
			//将下面的viewcontent显示出来，防止出现正在编辑的时候点击其他标签无反应
			$(".save").hide();
			$(".viewInput").hide();
			$(".edit").show();
			$(".viewContent").show();
			//给当前点击的标签添加hover属性
			$(this).addClass("hover");
			//移除出这个之外的所有hover属性
			$(this).siblings().removeClass("hover");
			var vid = $(this).attr("attr");//素材id
			var contentArr = [];
			for (i=0, len=allMJson.length; i<len; i++ ) {
				var id = allMJson[i]["ID"];
				if (id == vid){
					contentArr = [];
					contentArr.push(allMJson[i]["CONTENT"]);
					contentArr.push(allMJson[i]["CONTENT1"]);
					contentArr.push(allMJson[i]["CONTENT2"]);
					contentArr.push(allMJson[i]["CONTENT3"]);
					contentArr.push(allMJson[i]["CONTENT4"]);
					contentArr.push(allMJson[i]["CONTENT5"]);
					contentArr.push(allMJson[i]["CONTENT6"]);
					contentArr.push(allMJson[i]["CONTENT7"]);
					contentArr.push(allMJson[i]["CONTENT8"]);
					//如果找到了
					$(".viewContent").text(contentArr.join(''));
					break;
				}
				
			}
		});
	});
}
var editAccount = {
	currentObj:null,
	
	showTip : function(obj){
	    if (editAccount.currentObj){
		editAccount.currentObj.poshytip('hide');
	    }
	    
	    var _data = [];
	    for (var i=accountJson.length,key; key=accountJson[--i];) {
		var _style="";
		if (key["USERNAME"] == $(obj).text().trim()) {_style="style='background:#ACD8E6'";}
		_data.push("<a class='c-account' "+ _style +" item='"+ i +"' >"+ key["USERNAME"] +"</a>");
	    }
	    //当前弹出对象
	    editAccount.currentObj = obj;
	    obj.poshytip({
		content:'<p style="text-align:right;">选择账号：<a id="_closetip" style="cursor:pointer;" title="关闭">X</a></p><div style="width:310px;height:200px;overflow:auto;">'+_data.join('')+'</div>',
		showOn:'none',
		alignTo:'target',
		alignX:'top',
		alignY:'top',
		offsetY:10,
		offsetX:-150
		});
	    $("#_closetip").live("click", function(){
		if(editAccount.currentObj){
		    editAccount.currentObj.poshytip('hide');
		    editAccount.currentObj=null;
		}
	    });	
	    $(".c-account").live("click",function(){
		editAccount.currentObj.poshytip('hide');
		editAccount.currentObj=null;
		var _item = parseInt($(this).attr("item"));
		
		console.log(_item);
		
		//这里去根据当前位置取素材JSON里的item。
		var _parentObj = obj.parent();
		var _mitem = _parentObj.prevAll().length;
		var _obj = accountJson[_item];
		console.log(_obj);
		console.log(allMJson);
		allMJson[_mitem]["USERNAME"] = _obj["USERNAME"];
		allMJson[_mitem]["PASSWORD"] = _obj["PASSWORD"];
		allMJson[_mitem]["AID"] = _obj["ID"];
		
		$(obj).text(_obj["USERNAME"]);
		
		
	    });
	    obj.poshytip('show');
	    
	}
	
};

$(".accountelipse").live("click",function(){
    editAccount.showTip($(this));
});
//截取字符串，一个汉字占2个字节
String.prototype.ellipsis = function(len){
	var str = this.trim();
	var newLen = 0, newStr = "";
	// 汉字
	var CNRegex = /[^\x00-\x80]/g;
	var _char = "";
	var strLen = str.replace(CNRegex, "**").length;
	for( var i = 0; i < strLen; ++i ){
		_char = str.substr(i,1);
		newLen += _char.match(CNRegex) != null ? 2 : 1;
		
		if( newLen > len ){
			break;
		}
		newStr += _char;
	}
	
	if( strLen > len ){
		newStr += "...";
	}
	
	return newStr;
};