var pfinducturl = pfinduct.getStorageValue("user","pfinducturl");
var _$userid = pfinduct.getStorageValue("user","userid");
var authkey = encodeURIComponent(pfinduct.getStorageValue("user","authkey"));
//var background = chrome.extension.getBackgroundPage()
//localStorage["mutiurl"] = '[ {"url":"http://tieba.baidu.com/p/1234567","title":"南京城墙涂鸦1"}, {"url":"http://tieba.baidu.com/p/1234567","title":"南京城墙涂鸦2"}, {"url":"http://tieba.baidu.com/p/1234567","title":"南京城墙涂鸦3"}, {"url":"http://tieba.baidu.com/p/1234567","title":"南京城墙涂鸦4"}, {"url":"http://tieba.baidu.com/p/1234567","title":"南京城墙涂鸦5"}, {"url":"http://tieba.baidu.com/p/1234567","title":"南京城墙涂鸦6"}, {"url":"http://tieba.baidu.com/p/1234567","title":"南京城墙涂鸦7"}, {"url":"http://tieba.baidu.com/p/1234567","title":"南京城墙涂鸦8"}, {"url":"http://tieba.baidu.com/p/1234567","title":"南京城墙涂鸦9"}, {"url":"http://tieba.baidu.com/p/1234567","title":"南京城墙涂鸦10"} ]';

$(function(){
    _$mutiurlpost.ipage.getmaterialBypage(0, 1);
    _$mutiurlpost.ipage.listclass();
    _$mutiurlpost.randomfillmat();
    var _$currobj = null;
    //点击选择素材的时候，给当前输入框和标题加上curr作为标识，让素材选完后知道填充哪里
    $(".btn-l").live("click",function(){
	var trobj = $(this).parent().parent();
	if (trobj.hasClass("curr")) {//点两次相同的按钮,将下面的选择界面隐藏
	    $("#m-malistpad").css({"top":(trobj.position().top + 140)+"px"}).hide(200);
	    return ;
	}
	
	_destorytrobj(_$currobj);
	trobj.addClass("curr");
	trobj.next().addClass("curr");
	_$currobj = trobj;
	$("#m-malistpad").css({"top":(trobj.position().top + 140)+"px"}).show(200);
	
	
    });
    //点击选择素材内容
    $(".s-mat").live("click",function(){
	var mid = $(this).attr("mid");
	_$mutiurlpost.ipage.fillmatcontent(mid);
	_destorytrobj(_$currobj);
	$("#m-malistpad").hide(200);
    });
    //点击素材分类
    $(".u-mcname").live("click",function(){
	var cid = $(this).attr("cid");
	_$mutiurlpost.ipage.getmaterialBypage(cid, 1);//跳到对应的分类素材页，每次都是第一页
    });
    //点击页数
    $(".u-pagenation").live("click",function(){
	var pageno = $(this).attr("attr");
	var classid = $(this).attr("classid");
	 _$mutiurlpost.ipage.getmaterialBypage(classid, pageno);
    });
    //点击关闭框
    $("#closepic").live("click",function(){
	_destorytrobj(_$currobj);
	$("#m-malistpad").hide(200);
    });
    //点击账号切换账号
    $(".u-username").live("click",function(){
	_$mutiurlpost.changeAccount.showaccount(this);
    });
    //点击确定提交数据
    $("#postdata").click(function(){
    	_$mutiurlpost.postdata();
    });
    $(".delmater").bind("click",function(){
    	$(this).parentsUntil(".g-module").remove();
    });
});
/**
 * 将素材选择的去掉
 */
function _destorytrobj(_$currobj){
	if (_$currobj) {
	    _$currobj.removeClass("curr");
	    _$currobj.next().removeClass("curr");
	    _$currobj = null;
	}
}


var _$mutiurlpost={};


_$mutiurlpost.accountarr=[];
//最后按确定提交数据

_$mutiurlpost.checkdata=function(){
    var res  = true;
    $(".g-module input[type='text'],.g-module textarea").each(function(){
	var obj = $(this);
	if(!obj.val()) {
	    obj.css({"border":"1px solid red"});
	    obj.bind("keyup",function(){
		if(obj.val()) {
		    obj.css({"border":"1px solid #7F9DB9"});
		}
	    });
	    res = false;
	}
    });
    return res;
}
_$mutiurlpost.postdata=function(){
    if (!_$mutiurlpost.checkdata()){
	return ;
    }
    var datajson = {};
    var postarr=[];
    var _tempurl = "";

    $(".g-module").each(function(){
		var postdata = {};
		var urlobj = $(this).find(".u-url");
		postdata["url"]= urlobj.attr("href");
		postdata["title"]= urlobj.text();
		_tempurl =  urlobj.attr("href");
		
		var accountobj = $(this).find(".u-username");
		postdata["username"] = accountobj.text();
		postdata["password"] = accountobj.attr("attr");
		var mattitle = $(this).find("input[type='text']").val();
		postdata["mtitle"] = mattitle;
		var matcontent = $(this).find("input[type='text']").val();
		postdata["matcontent"] = matcontent;
		
		
		postarr.push(postdata);
    });
    for (i=0,len=muticonfig.length; i<len; i++) {
		if (muticonfig[i]["reg"].test(_tempurl)) {
			index = i;
			break;
		}
	}
    datajson["config"] = muticonfig[i]["config"];
    datajson["data"] = postarr;
	chrome.extension.getBackgroundPage().background.mutiurlTaskExecute(datajson,function(tabid){
		console.log("tabid:"+tabid);
		return true;
	});
    console.log(datajson);
}
//取账号根据domain
_$mutiurlpost.getAccountByDomain=function(url){
    
    var accountarr = {};
    $.ajax({  
	type:'get',
	url:pfinducturl+'/chrome!getAccountByDomain.action',
	data:{"accountbean.domain":url,"accountbean.userid":_$userid},
	async:false,
	dataType:"json",
	success:function(res){
	    accountarr = res;
	}
    });
    return accountarr;
}

//随即给框里塞素材
_$mutiurlpost.randomfillmat=function(){
    //取任务的数据
    var mutiurljson = pfinduct.getStorageValue("mutiurl");
    var url = mutiurljson ? mutiurljson[0]["url"]:"";
    console.log(url);
    //取这个站点下的账号
    var accountarr = _$mutiurlpost.getAccountByDomain(url);
    //赋予全局变量
    _$mutiurlpost.accountarr = accountarr;
    
    //判断站点下是否有账号，如果没有账号则关闭窗口！
    if (!accountarr || accountarr.length <= 0) {
//	alert("该站点下暂无账号，即将关闭该窗口！");
/*	setTimeout(function(){
	    window.opener = null;
	    window.open('','_self');
	    window.close();
	},2000);
	return ;
*/
    }
    //随机去素材库取一页素材填充起来
    var materialarr=[];
    var mutiurllength = mutiurljson ? mutiurljson.length : 1;;
    var pageno = parseInt(_$mutiurlpost.ipage.totalpageno * 3 * Math.random() / mutiurllength);
    
    if (pageno == 0 ) pageno = 1;
    $.ajax({  
	type:'get',
	url:pfinducturl+'/chrome!getMaterialByPage.action',
	data:{"materialbean.classid":0,"page.pageNo":pageno,"page.pageSize":mutiurllength,"materialbean.purpose":4},
	async:false,
	dataType:"json",
	success:function(res){
	    materialarr = $.parseJSON(res)["materiallist"];
	}
    });
    

    //循环json数据，将账号数据塞进去
    var strbuf = [];
    for (var i=0,key;key=mutiurljson[i++];) {
	var accountindex = parseInt(Math.random() * accountarr.length);
	console.log(accountindex);
	console.log(accountarr);
	console.log(accountarr[accountindex]);
	strbuf.push('<div class="g-module"> <div class="m-body"> <table width="100%" border="0" cellspacing="0" cellpadding="0" class="grid"> <colgroup> <col width="15%"> <col width="50%"> <col width="25%"> <col width="10%"> </colgroup> <tbody> <tr align="left"> <td>网文标题:</td>');
	strbuf.push('<td><a href="'+ key["url"] +'" class="u-url" target="_blank">'+ key["title"] +'</a></td>');
	strbuf.push('<td colspan="2"><span style="margin-left:-10px;">发帖账号：</span><span title="'+ accountarr[accountindex]["USERNAME"] +'" attr="'+ accountarr[accountindex]["PASSWORD"] +'" class="u-username">'+ accountarr[accountindex]["USERNAME"] +'</span><em class="delmater"></em></td>');
	strbuf.push('</tr> <tr align="left"> <td>发帖标题:</td>');
	var title="",content="";
	if (materialarr.length == mutiurljson.length && materialarr[i]) {
	    title = materialarr[i]["TITLE"];
	    content = materialarr[i]["content"];
	}else{
	    var index = parseInt(Math.random() * materialarr.length);
	    if(materialarr[index]) {
		title = materialarr[index]["TITLE"];
		content = materialarr[index]["content"];	
	    }
	    
	    
	}
	strbuf.push('<td colspan="2"><input type="text"  value="'+ title +'" style="width:100%;padding-left: 5px;"></td>');
	    strbuf.push('<td rowspan="2" ><input type="button" class="u-btn btn-l" value="选择素材"/></td> </tr> <tr align="left" height="100"> <td>发帖内容:</td> '
		    + ' <td colspan="2"><textarea style="width:100%;height:80%;padding-left: 5px;">'+ content +'</textarea></td> </tr>');
	 strbuf.push('</tbody> </table> </div></div>');   
	
    }
    strbuf.push('<div style="text-align:center"> <span id="postdata" class="u-btn">确定</span> </div>')
    $(".g-head").append(strbuf.join(''));
    
}

_$mutiurlpost.changeAccount={
	currentObj:null,
	hasRuleTip:false,
	showaccount:function(obj){
	    if (_$mutiurlpost.changeAccount.currentObj){
	    	_$mutiurlpost.changeAccount.currentObj.poshytip('hide');
	    }
	    _$mutiurlpost.changeAccount.currentObj = obj;
	    
	    var _data = [];
	    for (var i=_$mutiurlpost.accountarr.length,key; key=_$mutiurlpost.accountarr[--i];) {
		var _style="";
		if (key["USERNAME"] == $(obj).text().trim()) {_style="style='background:#ACD8E6'";}
		_data.push("<a class='c-account' "+ _style +" item='"+ i +"' >"+ key["USERNAME"] +"</a>");
	    }
	    if(!_$mutiurlpost.changeAccount.hasRuleTip ){
		$(obj).poshytip({
		    content:'<p style="text-align:left;margin: 0px;">选择账号：<a id="_closetip" style="cursor:pointer;float:right" title="关闭">X</a></p><div style="width:310px;height:200px;overflow:auto;" id="accountlistpart">'+_data.join('')+'</div>',
		    showOn:'none',
		    alignTo:'target',
		    alignX:'top',
		    alignY:'top',
		    offsetY:10,
		    offsetX:-175
		});
		$(obj).poshytip('show');
		$("#_closetip").bind("click", function(){ $(obj).poshytip('hide'); _$mutiurlpost.changeAccount.hasRuleTip = false;_$mutiurlpost.changeAccount.currentObj = null;});	
		_$mutiurlpost.changeAccount.hasRuleTip = true;
	    }
	    
	    $(".c-account").live("click",function(){
		_$mutiurlpost.changeAccount.hasRuleTip = false;
		$(obj).poshytip('hide');
		_$mutiurlpost.changeAccount.currentObj=null;
		
		var _item = parseInt($(this).attr("item"));
		var _obj = _$mutiurlpost.accountarr[_item];
		$(obj).text(_obj["USERNAME"]);
		$(obj).attr("attr",_obj["PASSWORD"]);
	    });
	}

}
//关于下面素材分页显示相关的
_$mutiurlpost.ipage={
	pagematjson:{},//存放每一页的素材，按id进行标识
	totalpageno:0,
	getmaterialBypage:function(classid,pageno){//分页显示素材
	    $.ajax({  
		type:'get',
		url:pfinducturl+'/chrome!getMaterialByPage.action',
		data:{"materialbean.classid":classid,"page.pageNo":pageno,"page.pageSize":3,"materialbean.purpose":4},
		dataType:"json",
		async:false,
		success:function(res){
		    res = $.parseJSON(res);
		    _$mutiurlpost.ipage.fillmatlist(res["materiallist"]);
		    _$mutiurlpost.ipage.pagnation(res["totalpage"],pageno,classid);
		    
		}
	    });
	},
	fillmatlist:function(materialjson){
	    var strbuf = [];
	    _$mutiurlpost.ipage.pagematjson={};
	    if(materialjson.length){
		 for (var i=0,mobj;mobj=materialjson[i++];) {
		     _$mutiurlpost.ipage.pagematjson[mobj["ID"]]=mobj;
		     strbuf.push('<dt class="m-mitem" > <div class="m-mtitle"><b>标题：'+ mobj["TITLE"] +'</b></div>');
		     strbuf.push('<div class="m-mcontent"><b>摘要</b>：'+ mobj["content"].ellipsis(180).replace(/<[^>]+>/g,"") +'</div> <div class="m-selectbtn"> <span class="u-btn s-mat" mid="'+mobj["ID"]+'">选择内容</span> </div></dt>');
		 }
	    }else{
		strbuf.push('<div style="padding-top:10px;">暂无数据！</div>');
	    }

	    $("#induct_mlist").html(strbuf.join(''));
	},
	fillmatcontent:function(mid){
	    var mobj = _$mutiurlpost.ipage.pagematjson[mid];
	    var title = mobj["TITLE"];
	    var content = mobj["content"];
	    $(".m-body .curr input[type='text']").val(title);
	    $(".m-body .curr textarea").val(content);	    
	},
	listclass:function(){
	    $.ajax({  
		type:'get',
		url:pfinducturl+'/chrome!listMaterialClass.action',
		dataType:"json",
		success:function(res){
		    if(res){
			var cbuf = [];
			for (var i=0,cobj; cobj=res[i++];) {
			    cbuf.push('<a href="javascript:void(0)" title="'+cobj["NAME"]+'" cid="'+cobj["ID"]+'" class="u-mcname">'+ cobj["NAME"] +'</a>');
			}
			$("#mclass").html(cbuf.join(''));
		    }
		}
	    });
	},
	pagnation:function(totalcount,pageno,classid){
	    var pageSize = 3;
	    var showPageno = 3;
	    var pageStr = [];
	    var totalpageno = totalcount%pageSize?(parseInt(totalcount/pageSize)+1):parseInt(totalcount/pageSize);
	    _$mutiurlpost.ipage.totalpageno = totalpageno;//赋值供随即页的时候取调用
	    if (!pageno || 0 > pageno) {
		pageno = 1;
	    }
	    //上一页的显示数量
	    if (pageno == 1) {
		pageStr.push("<span class='unable'>上一页</span>");
	    }else{
		pageStr.push("<span    attr='" + (parseInt(pageno) - 1) + "' class='u-pagenation'>上一页</span>");
	    }
		
		//算结束的页数，当前页数加上需要显示的页数
	    var endpageno = totalpageno > pageno - 0 + showPageno ? pageno- 0 + showPageno :  totalpageno;
	    var startpageno = pageno >= 2 ? (pageno - 1) : pageno;
	    for (var i=	startpageno; i<=endpageno; i++){
		
		if (pageno == i) {
			pageStr.push("<span attr='"+ i +"' class='nor'>"+i+"</span>");
		}else{
			pageStr.push("<span href='javascript:void(0);' attr='"+ i +"' class='u-pagenation' classid='"+ classid +"' >"+i+"</span>"); 
		}
			
	    }
	    if (totalpageno > 5 && (totalpageno > (endpageno+2))) {
			
		pageStr.push("<span class='ellipsis'>...</span>");
		pageStr.push("<span href='javascript:void(0);' class='u-pagenation' attr='"+ i +"' classid='"+ classid +"' >"+ totalpageno +"</span>");
			
	    }
		//上一页的显示数量
	    if (pageno == totalpageno) {
		pageStr.push("<span class='unable'>下一页</span>");
	    }else{
		pageStr.push("<span href='javascript:void(0);' attr='"+ (pageno - 0 + 1) +"' class='u-pagenation' >下一页</span>");
	    }
	    $("#m-pagenation").html(pageStr.join(''));
	}
	
	
	
}


// 截取字符串，一个汉字占2个字节
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
