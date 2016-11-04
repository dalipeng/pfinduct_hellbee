var pfinduct={};

pfinduct.getStorageValue=function(name,key){
	if(!localStorage[name]){
		return null;
	}
	var jsondata =  JSON.parse(localStorage[name]);
	if(jsondata){
		if(key==""||key==null){
			return jsondata;
		}else{
			return jsondata[key];
		}
	}else{
		return null;
	}
};

/**
 * 打开一个新的标签页，判断是否打开过了，保证只打开一个相同界面(只限内部url)
 */
pfinduct.createATabUrl=function(url,func){
	var fullUrl = chrome.extension.getURL(url);
	chrome.tabs.getAllInWindow(null, function(tabs) {
		for (var i in tabs) { // check if Options page is open already
			var tab = tabs[i];
			if (tab.url == fullUrl||tab.url==url) {
				chrome.tabs.update(tab.id, {selected: true},function(tab){
					chrome.tabs.reload(tab.id, {}, func);
				}); // select the tab
				return;
			}
		}
		chrome.tabs.getSelected(null, function(tab) { // open a new tab next to currently selected tab
			chrome.tabs.create({
				url: url,
				index: tab.index + 1
			},
			func);
		});
	});
};

String.prototype.endWith=function(str){
	if(str==null||str==""||this.length==0||str.length>this.length)
	  return false;
	if(this.substring(this.length-str.length)==str)
	  return true;
	else
	  return false;
	return true;
};

String.prototype.startWith=function(str){
	if(str==null||str==""||this.length==0||str.length>this.length)
	  return false;
	if(this.substr(0,str.length)==str)
	  return true;
	else
	  return false;
	return true;
};

/**
 * 按字符截取
 * @param n(没有参数的时候从0开始)
 * @param s(起始字符串位置，但是不是按字符截取开始的使用的是按照substr)
 * @returns
 */
String.prototype.sub=function(n,s){
	
	if(s==null){
		s=0;
	}
	var r=/[^\x00-\xff]/g;
	if(this.replace(r,"mm").length<=n){
		return this;
	}	
	var m = Math.floor(n/2);
	for(var i=m;i<this.length;i++){
		if(this.substr(s,n).replace(r,"mm").length>=n){
			return this.substr(s,n);
		}
	}
	return this;	
};

Date.prototype.pattern=function(fmt) {     
    var o = {     
    "M+" : this.getMonth()+1, //月份     
    "d+" : this.getDate(), //日     
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时     
    "H+" : this.getHours(), //小时     
    "m+" : this.getMinutes(), //分     
    "s+" : this.getSeconds(), //秒     
    "q+" : Math.floor((this.getMonth()+3)/3), //季度     
    "S" : this.getMilliseconds() //毫秒     
    };     
    var week = {     
    "0" : "\u65e5",     
    "1" : "\u4e00",     
    "2" : "\u4e8c",     
    "3" : "\u4e09",     
    "4" : "\u56db",     
    "5" : "\u4e94",     
    "6" : "\u516d"    
    };     
    if(/(y+)/.test(fmt)){     
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));     
    }     
    if(/(E+)/.test(fmt)){     
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "\u661f\u671f" : "\u5468") : "")+week[this.getDay()+""]);     
    }     
    for(var k in o){     
        if(new RegExp("("+ k +")").test(fmt)){     
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));     
        }     
    }     
    return fmt;     
};




