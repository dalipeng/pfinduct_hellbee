function _fn(){
	var url = location.href ; 
	//海安论坛
	if (  url.indexOf("haianw.com") >0) {
		$("div[id^='BAIDU']").remove();
		$("div[id^='baidu']").remove();
		$("iframe[id^='BAIDU']").remove();
		$("iframe[id^='baidu']").remove();
		$("ins[id^='baidu']").remove();
	}else if ( url.indexOf("haljl.com") > 0){
		//海安零距离
		//baidu投放广告
		$("div[id^='BAIDU']").remove();
		$("div[id^='baidu']").remove();
		$("iframe[id^='BAIDU']").remove();
		$("iframe[id^='baidu']").remove();
		$("ins[id^='baidu']").remove();
		//菜单栏上
		$("#qmenu_menu").next().remove();
		//菜单栏下
		$("#scbar").prev().remove();
		//中部
		$("#comiis_x3dfmh101").remove();
	}else if ( url.indexOf("0513.org") > 0) { 
		$("div[id^='portal_block_1051']").remove();
		$("div[id^='portal_block_1050']").remove();
		//baidu投放广告
		$("div[id^='BAIDU']").remove();
		$("div[id^='baidu']").remove();
		$("iframe[id^='BAIDU']").remove();
		$("iframe[id^='baidu']").remove();
		$("ins[id^='baidu']").remove();
		
		
		
	}
	
}
 
document.addEventListener("DOMContentLoaded", _fn, true);
	
