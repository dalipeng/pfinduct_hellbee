/**
 * FUI 弹出窗口组件
 * Dialog.open(), Dialog.alert(), Dialog.confirm(), Dialog.warning(), Dialog.success(), Dialog.error(), Dialog.prompt()
 *
 * @name     fui.iDialog.js
 * @author   yswang
 * @version  3.0
 * @date     2010/11/17  update at 2011/03/02
 * @depend   fui.core.js
 * @example  see examples/idialog.html
*/
var Dialog_Language = {
	Window:{
		title : "&nbsp;",
		closeTitle: "点击关闭"
	},
	Alert:{
		title : "",
		buttons : ["确定"]
	},
	Confirm:{
		title : "",
		buttons : ["是", "否", "取消"]
	},
	Success:{
		title : "",
		buttons : ["确定"]
	},
	Error:{
		title : "",
		buttons : ["确定"]
	},
	Warning:{
		title : "",
		buttons : ["确定"]
	},
	Prompt:{
		title : "提示",
		buttons:["确定", "取消"]
	}
};
var _$DlgWin = FUI.dom.getTopWindow(), 
	_ielt7 = (FUI.browser.isIE && parseInt(FUI.browser.version) < 7),
	$WinSize = function(win){ return FUI.dom.getDimensions(win); };
	
function _$id (id){
	return typeof id == "string" ? document.getElementById(id) : id;
}

// iDialog
function Dialog( opts ){
	opts = opts ? opts : {};
	
	// 对外开放的属性
	this.id        = null;		// 窗口唯一标识，建议定义，这样可以避免重复弹出窗口
	this.title	   = "&nbsp;";	// 窗口标题，可以自定义
	this.url       = false;		// 窗口打开URL页面
	this.drag      = true;		// 窗口是否允许拖动，默认允许，值： true, false
	this.shadow    = true;      // 窗口是否显示阴影效果
	//this.maskOpacity = null;    // 自定义背景遮罩透明度，数值[0-1]
	this.width     = null;		// 窗口宽度， 默认为展示视窗宽度的一半
	this.height    = null;		// 窗口高度， 默认为宽度一半
	this.left      = "50%";		// 窗口水平显示位置，默认居中
	this.top       = "50%";		// 窗口垂直显示位置，默认居中
	this.resizable = true;		// 窗口是否允许 resize 大小，默认不允许，值： true, false
	this.theme     = null;		// 窗口特殊主题样式（需要重写样式css），默认 默认主题样式
	this.toolbarTheme = null;   // 工具栏主题样式
	this.statusbarTheme = null; // 状态栏主题样式
	this.content   = null;		// 窗口显示content字符串内容
	this.toolbar   = null;      // 在窗口头上部工具栏
	this.statusbar = null;      // 状态栏
	this.modal     = true;		// 窗口是否为模态窗口，默认：模态窗口，值： true, false
	this.delay = 0;         // 窗口自动关闭时间，单位： 毫秒
	//this.escClose  = true;      // 窗口是否允许 ESC 关闭，默认允许，值： true, false
	this.onLoad    = false;		// 窗口打开后，执行的事件
	this.closeEvent = false;    // 重置窗口关闭事件，函数this对象为dialog
	this.closeable = true;      // 是否显示窗口右上角的关闭按钮
	this.onShow = null;         // 当窗口显示后要执行的回调函数，注意和onLoad的区分，注：函数上下文this对象指向Dialog
	this.onClosed = null;       // 当窗口关闭后要执行的回调函数，注：函数上下文this对象指向Dialog
	this.context   = _$DlgWin;  // 窗口显示的上下文环境，默认顶层窗口
	this.autoHeight = true;     // 自动根据内容高度适应
	this.autoHeightBy = null;   // 根据子页面中的某个元素的高度获取自适应高度（推荐），默认根据contentWindow的高度
	
	this.onShowAnimate = false; // 用户自定义Dialog显示的方式
	this.onCloseAnimate = false; // 用户自定义Dialog关闭的方式
		
	// 
	this.openerWindow = null;
	this.openerDialog = null;
	this.innerWin = null;
	this.innerDoc = null;
	
	// 视窗属性
	this.ui = {
	    ShowButtonRow : false,
	    unauthorized : false,
	    AlertModel   : false,
	    zindex       : 9999
	};
	
	// 初始相关信息
	Dialog.setOptions( this, opts );
	
	this.contextDoc = this.context.document;
	
	if(!this.id){
		this.id = (this.context.Dialog._dialogArray.length +1)+"";
	}
	
	this.autoHeight = ( this.height === null || this.autoHeightBy !== null );
	
	// 为每个从当前window上弹出的Dialog指定window名字
	this._iWinName = window._iDiagWinName;
}

Dialog._divPrefix  = "";
Dialog._dialogArray = [];
Dialog._childDialogArray = [];
Dialog.maskDiv = null;
Dialog.initzIndex = 9999;

// 创建新窗口
Dialog.prototype.create = function(){
	
	var dlgTmpl = '\
		<div class="idlg-wbtns">\
			<a id="idlg-close-'+this.id+'" class="idlg-w-close" href="javascript:void(0);" title="'+(Dialog_Language.Window.closeTitle)+'" style="'+(this.closeable?"":"display:none;")+'"></a>\
		</div>\
		'+(function(_dlg){
			return _dlg.shadow ? "<div class=\"idlg-shadow\"></div>" : "";
		  })(this)
		+'\
		<table width="100%" border="0" cellspacing="0" cellpadding="0" unselectable="on">\
		<tr>\
			<td id="idlg-wt-'+this.id+'" valign="top">\
				<table border="0" width="100%" cellspacing="0" cellpadding="0" style="border:0 none;table-layout:fixed;">\
					<tr class="idlg-title-panel">\
						<td class="idlg-wt-l"></td>\
						<td class="idlg-wt-c" width="100%" align="left">\
							<div id="idlg-title-'+this.id+'" class="idlg-title">'+ this.title +'</div>\
						</td>\
						<td class="idlg-wt-r"></td>\
					</tr>\
				</table>\
				'+(function(_dlg){
					if( _dlg.toolbar ){
						return '\
							 <table id="idlg-tbpanel-'+_dlg.id+'" width="100%" class="idlg-toolbar-panel '+(_dlg.toolbarTheme?_dlg.toolbarTheme:"")+'" onmousedown="FUI.event.cancelEvent(event);" border="0" width="100%" cellspacing="0" cellpadding="0" style="border:0 none;table-layout:fixed;">\
								<tr>\
									<td class="idlg-tb-l"></td>\
									<td class="idlg-tb-c" width="100%" align="left">\
										<div id="idlg-toolbar-'+_dlg.id+'" class="idlg-toolbar"></div>\
									</td>\
									<td class="idlg-tb-r"></td>\
								</tr>\
							</table>\
						  ';
					}else{ return ""; }
				})(this)+'\
			</td>\
		</tr>\
		<tr>\
			<td valign="top" align="center">\
				<table width="100%" border="0" cellspacing="0" cellpadding="0" style="border:0 none;">\
					<tr>\
						<td id="idlg-wm-l-'+this.id+'" class="idlg-wm-l'+(this.resizable?" resize-W":"")+'" align="left"><i></i></td>\
						<td id="idlg-wm-bdy-'+this.id+'" class="idlg-wm-c" align="center" valign="top">\
							<div id="idlg-wm-bdyin-'+this.id+'" class="idlg-bdy-inner">\
							' + (function (_dlg) {
							        if(_dlg.url){ 
							           return '<div id="idlg-frm-mask-' + _dlg.id + '" class="idlg-frm-mask" style="display:none;"></div><iframe id="idlg-frm-' + _dlg.id + '" src="'+_dlg.displacePath()+'" width="100%" height="100%" frameborder="0" scrolling="auto" style="border:0 none;overflow:auto;"></iframe>';
							        }else{
							        	return "&nbsp;";
							        }
						    	})(this) + '\
							</div>\
						</td>\
						<td id="idlg-wm-r-'+this.id+'" class="idlg-wm-r'+(this.resizable?" resize-E":"")+'" align="right"><i></i></td>\
					</tr>\
				</table>\
			</td>\
		</tr>\
		<tr>\
			<td id="idlg-wb-'+this.id+'" valign="top">\
				'+(function(_dlg){
						if( _dlg.statusbar ){
							return '\
								<table id="idlg-stbpanel-'+_dlg.id+'" width="100%" class="idlg-statusbar-panel '+(_dlg.statusbarTheme?_dlg.statusbarTheme:"")+'" border="0" width="100%" cellspacing="0" cellpadding="0" style="border:0 none;table-layout:fixed;">\
									<tr>\
										<td class="idlg-stb-l"></td>\
										<td class="idlg-stb-c" width="100%" align="left">\
											<div id="idlg-statusbar-'+_dlg.id+'" class="idlg-statusbar"></div>\
										</td>\
										<td class="idlg-stb-r"></td>\
									</tr>\
								</table>\
							';
						}else{ return ""; }
					})(this)
				+'\
				<table border="0" width="100%" cellspacing="0" cellpadding="0" style="border:0 none;table-layout:fixed;">\
					<tr>\
						<td class="idlg-wb-l"></td>\
						<td class="idlg-wb-c" width="100%"></td>\
						<td class="idlg-wb-r"></td>\
					</tr>\
				</table>\
			</td>\
		</tr>\
		</table><a id="_forTab_'+this.id+'" class="idlg-focus" tabindex="-1" href="#">&nbsp;</a>\
	';
	
	var resizeHanlders = '\
		<div class="resize-N"></div>\
		<div class="resize-NE"></div>\
		<div class="resize-SE"></div>\
		<div class="resize-S"></div>\
		<div class="resize-SW"></div>\
		<div class="resize-NW"></div>\
	';
	
	//dlgTmpl = dlgTmpl.replace(/\{ID\}/gm, this.id);
	
	// 创建Dialog主体
	var newDlg = this.contextDoc.createElement("div");
	
	if( this.id ){
		newDlg.id = Dialog._divPrefix + this.id;
	}
	
	newDlg.className = "fui-idialog";
	newDlg.style.cssText = "position:absolute;left:-9999px;top:-9999px;";
	
	this.contextDoc.getElementsByTagName("BODY")[0].appendChild( newDlg );
	
	newDlg.innerHTML = '<div class="'+(this.theme ? this.theme : "")+'" style="float:left;">'
							+( this.resizable ? resizeHanlders : "" ) 
							+ dlgTmpl 
							+ (this.url?'<div id="iurl-loading-'+this.id+'" class="idlg-url-loading">正在等待 '+this.url+' 的响应</div>':"")
							+'</div>';
	
	// 保存对象信息
	this.ui.dlgDiv = newDlg;
	//this.ui.dlgDiv.dialogID = this.id;
	this.ui.dlgDiv.dialogInstance = this;
	this.ui.dlgBody = this.context._$id("idlg-wm-bdy-"+ this.id);
	this.ui.dlgBdyIn = this.context._$id("idlg-wm-bdyin-"+ this.id);
	this.ui.dlgCloseBtn = this.context._$id("idlg-close-"+ this.id);
	this.ui.dlgToolBar = this.context._$id("idlg-toolbar-"+ this.id);
	this.ui.dlgStatusBar = this.context._$id("idlg-statusbar-"+ this.id);
	
	// 如果加载URL
	if( this.url ){
	    this.innerFrameOnLoad = (function (_dlg) {
	    	return function(){
	    	   // 页面加载完毕后
	           try {
	           		var ifrm = _dlg.context._$id("idlg-frm-"+_dlg.id);
	          		_dlg.innerWin = ifrm.contentWindow;
					_dlg.innerWin.ownerDialog = _dlg;
	               	_dlg.innerDoc = _dlg.innerWin.document;
	               
	               
	               // 如果没有设置高度，则高度自适应
	               if( _dlg.autoHeight && _dlg.innerWin ){
	               	 ifrm.style.width = "100%";
	               	 ifrm.style.height = "100%";
	               	 
	               	 var innerH = $WinSize(_dlg.innerWin).scrollHeight + 5;
	               	 if( _dlg.autoHeightBy != null && _dlg.innerDoc.getElementById(_dlg.autoHeightBy) ){
	               	 	innerH = $("#"+_dlg.autoHeightBy, _dlg.innerDoc).outerHeight(true)+1;//_dlg.innerDoc.getElementById(_dlg.autoHeightBy).offsetHeight + 5;
	               	 }
	               	
	               	 var topH = $WinSize(_dlg.context).clientHeight;
	               	 if( innerH >= topH  ){
	               	 	innerH = topH;
	               	 	_dlg.ui.dlgDiv.style.top = "0px";
	               	 }
	               	 
	          		 _dlg.setSize(_dlg.width, innerH, true );
	               }
	               
	               ifrm = null;
	           } catch(e){
	              _dlg.ui&&(_dlg.ui.unauthorized = true);
	           }finally{
	           		_dlg.context._$id("iurl-loading-"+_dlg.id).style.display = "none";
	           }
	           
	           if( _dlg.onLoad && typeof(_dlg.onLoad) == "function" ){
	           		_dlg.onLoad.call( _dlg );
	           }
           }
       })(this);
       
       if (FUI.browser.isIE) {
     		this.context._$id("idlg-frm-"+this.id).attachEvent("onload", this.innerFrameOnLoad);
       }else{
           this.context._$id("idlg-frm-"+this.id).onload = this.innerFrameOnLoad;  
       }
	}
	
	this.openerWindow = window;
	
	if( window.ownerDialog ){
		this.openerDialog = window.ownerDialog;
	}
	
	// 为关闭按钮绑定关闭事件
	this.ui.dlgCloseBtn.onclick = (function(_dlg){
		return function(evt){
			if( this.disabled ){
				return false;
			}
			
			// 如果重置了窗口关闭事件
			if( _dlg.closeEvent && typeof _dlg.closeEvent == 'function' ){
				_dlg.closeEvent.call(_dlg);
				return;
			}
			
			if( _dlg.onCloseAnimate && typeof _dlg.onCloseAnimate == 'function' ){
				_dlg.onCloseAnimate.call(_dlg, _dlg.ui.dlgDiv);
			}else{
		 		_dlg.close.call(_dlg);
		 	}
		}
	})(this);
	
	 // 设置拖动
    if( this.drag ){
    	this.setDragable();
    }
    
    // 设置了resize
    if( this.resizable ){
       this.ui.dlgDiv.onmousedown = (function(_dlg){
       	  return function(evt){
       	  	 evt = evt ? evt : _dlg.context.event;
	       	 var t = evt.srcElement || evt.target;
	       	 if( t.className.indexOf("resize-") > -1 ){	
	      	 		var cn = t.className;
	      	 		cn = cn.substr(cn.lastIndexOf("-")+1, cn.length-1);
	      	 		_dlg.context.Dialog.resizeStart( _dlg.id, cn, evt );
	      	 		cn = null;
	       	 }
	       	 t = null;
       	  };
       })(this);
    }
	
	try{
		return newDlg;
	}finally{
		dlgTmpl = null; newDlg = null;
	}
};

Dialog.prototype.initContent = function(){
	if( !this.url && !this.ui.AlertModel ){
		this.ui.dlgBdyIn.style.overflow = "auto";
	}
	
	if( this.content ){
		this.setContent();
	}
	
	// 如果存在工具栏
	if( this.toolbar ){
		if( typeof this.toolbar == 'function' ){
			var tbar = this.toolbar.call(this.ui.dlgToolBar);
			if( tbar && typeof tbar == 'string' ){
				this.ui.dlgToolBar.innerHTML = tbar;
			}
		}else{
			this.ui.dlgToolBar.innerHTML = this.toolbar;
		}
	}
	
	// 如果存在状态栏
	if( this.statusbar ){
		if( typeof this.statusbar == 'function' ){
			var stbar = this.statusbar.call(this.ui.dlgStatusBar);
			if( stbar && typeof stbar == 'string' ){
				this.ui.dlgStatusBar.innerHTML = stbar;
			}
		}else{
			this.ui.dlgStatusBar.innerHTML = this.statusbar;
		}
	}
	
	// 设置Dialog的大小
	this.initSize();
	this.setSize( this.width, this.height, this.autoHeight );
};

// 显示窗口
Dialog.prototype.show = function(){
	var thisDlg = this.context._$id( Dialog._divPrefix + this.id );
	
	if( thisDlg ){
		thisDlg.dialogInstance.showSelf();
		return false;
	}else{
		// 先创建遮罩层
		var maskDiv = Dialog.createMask( this.context );
		if (this.modal){
			if( this.context.Dialog._dialogArray.length > 0 ){
	        	maskDiv.style.zIndex = this.context.Dialog._dialogArray[this.context.Dialog._dialogArray.length - 1].ui.zindex + 1;
	        }else{
	        	// 首次显示把页面滚动条隐藏
	        	Dialog.hideScrollBar( this.context, true );
	        }
	        
	        maskDiv.style.display = "block";
	        Dialog.resizeMask(this.context);
	    }
		
		// 创建Dialog
		thisDlg = this.create();
		//thisDlg.style.visibility = "visible";
		thisDlg.style.zIndex = this.ui.zindex = parseInt(this.context.Dialog.maskDiv.style.zIndex) + 1;
		
		this.initContent();
		
		if (this.context.Dialog._dialogArray.length > 0) 
		{
	    	var prevDlg = this.context.Dialog._dialogArray[this.context.Dialog._dialogArray.length - 1];
	        thisDlg.style.zIndex = this.ui.zindex = parseInt(prevDlg.ui.zindex) + 2;
	        
	        // 对于非提示窗口叠加错位显示
	       /* if( !this.ui.AlertModel ){
		        var toL = parseInt(prevDlg.left) + 30, toT = parseInt(prevDlg.top) + 30;
		    	thisDlg.dialogInstance.left = toL;
		    	thisDlg.dialogInstance.top = toT;
		        thisDlg.style.left = toL+"px";
		        thisDlg.style.top = toT+"px";
	        }*/
        
	        prevDlg = null;
	    }
	    
	    this.context.Dialog._dialogArray.push(this);
		Dialog._childDialogArray.push(this);
		
		if(Dialog._childDialogArray.length == 1){
			if(window.ownerDialog){
				ownerDialog.disableCloseBtn( true );
			}
		}
			
	    // 设置显示位置
	    this.setPosition();
	    
	    // 如果定义了窗口打开后要执行的事件
	    if( this.onShow && typeof this.onShow == "function" ){
	    	this.onShow.call(this);
	    }
	    
		maskDiv = null;
	}
};

// 关闭窗口
Dialog.prototype.close = function(){
	
	 // 如果定义了窗口关闭后要执行的事件
    if( this.onClosed && typeof this.onClosed == "function" ){
    	this.onClosed.call(this);
    }
	
	if(this.ui.unauthorized === false){
	  	if(this.innerWin && this.innerWin.Dialog && this.innerWin.Dialog._childDialogArray.length>0){
	  		return;
	  	}
	}
    
	var thisDlg = this.ui.dlgDiv;
	//thisDlg.style.visibility = "hidden";
	thisDlg.style.display = "none";
	
	if ( this === this.context.Dialog._dialogArray[this.context.Dialog._dialogArray.length - 1] ) {
	     var isTopDialog = this.context.Dialog._dialogArray.pop();
	}else{
	     this.context.Dialog._dialogArray.remove(this);
	}
    
	Dialog._childDialogArray.remove(this);
	
	if( Dialog._childDialogArray.length == 0 ){
		if(window.ownerDialog){
			if( ownerDialog.closeable ){
				ownerDialog.disableCloseBtn(false);
			}
		}
	}
	var hideMask = true;
    if (this.context.Dialog._dialogArray.length > 0){
        if ( this.modal && isTopDialog ){
        	var index = this.context.Dialog._dialogArray.length;
        	//var hideMask = true;
        	while(index){
        		index = index - 1;
        		if( this.context.Dialog._dialogArray[index].modal ){
		        	this.context.Dialog.maskDiv.style.zIndex = this.context.Dialog._dialogArray[index].ui.zindex - 1;
		        	hideMask=  false;
		        	break;
		        }
        	}
        	
        }
    }
    
    if( hideMask && this.modal ){
        this.context.Dialog.maskDiv.style.display = "none";
        this.context.Dialog.maskDiv.style.top = "0px";
        Dialog.hideScrollBar( this.context, false );
    }
    
    this.openerWindow.focus();
    
	/*****释放引用，以便浏览器回收内存**/
   	thisDlg.onmousedown = null;
    thisDlg.dialogInstance = null;
    thisDlg.onDragStart = null;
	thisDlg.onDragEnd = null;
    
	this.context._$id("idlg-wt-" + this.id).onmousedown = null;
	this.context._$id("idlg-wt-" + this.id).root = null;
	
	var ifr = this.context._$id("idlg-frm-"+this.id);
	if( ifr ){
		if( FUI.browser.isIE ){
			ifr.detachEvent("onload", this.innerFrameOnLoad);
		}
		ifr.onload = null;
		
		ifr.src = "about:blank";
		FUI.dom.removeNode( ifr, this.contextDoc );
		FUI.browser.isIE&&CollectGarbage();
	}
	ifr = null;
	
	this.innerFrameOnLoad = null;
	
	thisDlg.innerHTML = "";
    FUI.dom.removeNode( thisDlg, this.contextDoc );
   	thisDlg = null;
   	
	this.closeEvent = null;
	
	this.ui.dlgDiv = null;
	this.ui.dlgBody = null;
	this.ui.dlgBdyIn = null;
	this.ui.dlgToolBar = null;
	this.ui.dlgStatusBar = null;
	this.innerWin = null;
	this.innerDoc = null;
	
	if(document.all){
   		CollectGarbage();
   	}
};

Dialog.prototype.setContent = function(content){
	var asncy = content !== undefined;
	if( !asncy ){
		content = this.content;
	}
	
	if( typeof content == 'function' ){
		var _self = this;
		content = content.call(_self, function(newContent){ _self.setContent(newContent); });
	}
	
	if( typeof content == 'string' ){
		this.ui.dlgBdyIn.innerHTML = content;
	}
	
};

Dialog.prototype.displacePath = function () {
    if (this.url.substr(0, 7) == "http://" || this.url.substr(0, 1) == "/" || this.url.substr(0, 11) == "javascript:") {
        return this.url;
    } else {
        var thisPath = this.url;
        var locationPath = window.location.href;
        locationPath = locationPath.substring(0, locationPath.lastIndexOf('/'));
        while (thisPath.indexOf('../') >= 0) {
            thisPath = thisPath.substring(3);
            locationPath = locationPath.substring(0, locationPath.lastIndexOf('/'));
        }
        return locationPath + '/' + thisPath;
    }
};

// 设置窗口位置
Dialog.prototype.setPosition = function(){
    var bd = $WinSize( this.context );
    var thisTop = this.top, thisLeft = this.left, thisDlg = this.ui.dlgDiv;

    if (typeof this.top == "string" && this.top.indexOf("%") != -1) {
        var percentT = parseFloat(this.top) * 0.01;
        
        // 如果dialog高度 < 窗口/2，则使用黄金分割比例 0.382， 否则使用绝对居中
        var fp = (percentT == 0.5 && thisDlg.offsetHeight <= bd.clientHeight/2) ? 0.382 : percentT;
        
		thisTop = bd.clientHeight * fp - thisDlg.offsetHeight * percentT + bd.scrollTop;
    }
    
    if (typeof this.left == "string" && this.left.indexOf("%") != -1) {
        var percentL = parseFloat(this.left) * 0.01;
        thisLeft = _ielt7 ? bd.clientWidth * percentL - thisDlg.scrollWidth * percentL + bd.scrollLeft
        				 : bd.clientWidth * percentL - thisDlg.scrollWidth * percentL;
    }
    
    this.top = thisTop;
    this.left = thisLeft;
    
    thisDlg.style.left = Math.round(thisLeft) + "px";
    
    if( this.onShowAnimate && typeof this.onShowAnimate == 'function' ){
    	this.onShowAnimate.call(this, thisDlg, thisTop, thisLeft);
    }else{
    	thisDlg.style.top = Math.round(thisTop) + "px";
    	 // 当Dialog创建后，让Dialog获取光标
	    this.context._$id("_forTab_"+this.id).focus();
    }
    
    thisDlg = null; bd = null;
};

// 初始化窗口大小
Dialog.prototype.initSize = function(){
	var bd = $WinSize(this.context);
    
    if (this.width == null){ 
    	this.width = 400 
    }
    if (this.height == null){
    	this.height = this.width / 2;
     	// 设置自动高度，为了在后面的innerFrameOnload中自适应高度
     	this.autoHeight = true;
    }
    if( this.width >= bd.clientWidth ){ 
    	this.width = Math.round(bd.clientWidth) - 2; 
    }
    
    if( this.height >= bd.clientHeight || this.ui.dlgDiv.offsetHeight >= bd.clientHeight ){ 
    	this.autoHeight = false; 
    	this.height = Math.round(bd.clientHeight) - 10; 
    }
};

// 重置窗口大小
Dialog.prototype.setSize = function( w, h, isAutoH ){
	w = parseInt(w, 10), h = parseInt(h, 10);
	
	if( w <= 0 || h <= 0 ){
		return false;
	}
	
	// 左右边线框的宽度总和
	var lrw = this.context._$id("idlg-wm-l-"+this.id).offsetWidth + this.context._$id("idlg-wm-r-"+this.id).offsetWidth,
	// 头部+底部的高度总和
	lrh = this.context._$id("idlg-wt-"+this.id).offsetHeight + this.context._$id("idlg-wb-"+this.id).offsetHeight;
	
	// 整体框体宽度
	this.ui.dlgDiv.style.width = w +"px";
	
	// 对于iframe加载url，设置iframe的大小
	if( this.url ){
		this.ui.dlgBdyIn.style.height = ( isAutoH ? h : h - lrh) +"px";
	}
	
	// 中间主数据体的大小
	this.ui.dlgBdyIn.style.width = ( w - lrw ) + "px";
	this.ui.dlgBody.style.width = ( w - lrw ) + "px";
	
	if( !this.autoHeight || !isAutoH ){
		this.ui.dlgBdyIn.style.height = ( h - lrh ) +"px";
		//this.ui.dlgBody.style.height = ( h - (isAutoH ? 0 : lrh) ) + "px";
	}
	
};

// 设置标题
Dialog.prototype.setTitle = function( title ){
	this.context._$id("idlg-title-"+this.id).innerHTML = title;
};

// 重新加载URL
Dialog.prototype.reload = function(url){
	this.context._$id("idlg-frm-"+this.id).src = url;
};

Dialog.prototype.disableCloseBtn = function( isHide ){
	//this.ui.dlgCloseBtn.style.visibility = isHide ? "hidden" : "visible";
	if(isHide){
		this.ui.dlgCloseBtn.disabled = true;
		this.ui.dlgCloseBtn.className = "idlg-w-close idlg-w-close-dis";
	}else{
		this.ui.dlgCloseBtn.disabled = false;
		this.ui.dlgCloseBtn.className = "idlg-w-close";
	}
};

Dialog.prototype.showSelf = function(){
	if( this.url && !this.ui.unauthorized ){
		var _innerURL = this.innerWin.location.href;
		if( _innerURL.lastIndexOf( this.url ) == -1 ){
			this.context._$id("idlg-frm-"+this.id).src = this.url;
		}
	}else{
		if(FUI.effect){
			FUI.effect.iWobble(this.ui.dlgDiv);
		}
	}
};
Dialog.prototype.getDOMObject = function(){
	return this.ui.dlgDiv;
};

// 设置可拖动
Dialog.prototype.setDragable = function(){
	var self = this, bd = null, owh = this.shadow ? 10 : 5;
	//注册拖拽方法
    if (this.drag && this.context.Drag)
    {
		var dragHandle = this.context._$id("idlg-wt-" + this.id), dragBody = this.ui.dlgDiv;
		this.context.Drag.init(dragHandle, dragBody);
		
		dragBody.onDragStart = function (left,top,mouseX,mouseY) {
			if(self.url && !FUI.browser.isIE){
			 	self.context._$id("idlg-frm-mask-"+self.id).style.display = "block";
			}
			
			bd = $WinSize( self.context );
		};
		dragBody.onDrag = function( currLeft, currTop, mouseX, mouseY ){
			if(currLeft < 5){
				this.style.left = '5px';
			} else if( currLeft + this.clientWidth + owh > bd.clientWidth){
				this.style.left = (bd.clientWidth - this.clientWidth - owh)+'px';
			}
			
			if( currTop < (bd.scrollTop+5) ){
				this.style.top = (bd.scrollTop+5)+'px';
			}
			else if( currTop + this.clientHeight + owh > bd.scrollTop + bd.clientHeight ){
				this.style.top = (bd.scrollTop + bd.clientHeight - this.clientHeight - owh)+'px';
			}
		};
		dragBody.onDragEnd = function(left,top,mouseX,mouseY){
			if(self.url && !FUI.browser.isIE){
				self.context._$id("idlg-frm-mask-"+self.id).style.display = "none";
			}
			
			this.dialogInstance.left = parseInt( this.style.left );
			this.dialogInstance.top = parseInt( this.style.top );
		}
	}
};
// 设置属性
Dialog.setOptions = function (obj, opts) {
    if(opts){
	    for (var optName in opts) {
	        obj[optName] = opts[optName];
	    }
    }
};
// 创建遮罩层
Dialog.createMask = function (ctx) {
    if (ctx.Dialog && ctx.Dialog.maskDiv){
    	 return ctx.Dialog.maskDiv;
    }
    
    var maskDiv = ctx._$id("idlg-mask-layer");
    if (!maskDiv) {
        maskDiv = ctx.document.createElement("div");
        maskDiv.id = "idlg-mask-layer";
        maskDiv.className = "idlg-mask-layer";
        maskDiv.style.cssText = "left:0px;top:0px;z-index:"+Dialog.initzIndex;
       // maskDiv.style.zIndex = Dialog.initzIndex;
        
        ctx.document.getElementsByTagName("BODY")[0].appendChild( maskDiv );
        
        maskDiv.oncontextmenu = function(){return false;};
        maskDiv.onselectstart = function(){ return false; };
        
        maskDiv.innerHTML = "<div>"+ (_ielt7 ? '<iframe src="about:blank" frameborder="0" style="filter:alpha(opacity=0);border:0 none;width:100%;height:100%;" width="100%" height="100%"></iframe>' : "") +"</div>";	
    	bd = null;
    }
    
    ctx.Dialog.maskDiv = maskDiv;
    
	maskDiv = null;
		
    return ctx.Dialog.maskDiv;
};

Dialog.resizeMask = function(ctx){
	var maskDiv = ctx.Dialog.maskDiv;
	if( maskDiv && maskDiv.style.display != "none" ){
		maskDiv.style.top = $WinSize(ctx).scrollTop+"px";
	}
	maskDiv = null;
};

Dialog.resizeObj = null;
Dialog.resizeStart = function( id, dir, evt ){
	dlgWin = window;
	var dlgDiv = dlgWin._$id( Dialog._divPrefix + id);
	
	if( !dlgDiv.dialogInstance.resizable || dlgDiv.dialogInstance.isMaxView ){
		 dlgDiv = null;
		 return false;	
	}
	
	var resizeDiv = dlgWin._$id("_iDlgResizeDiv_");
	var w = dlgDiv.offsetWidth - 2, h = dlgDiv.offsetHeight - 2;
	if( !resizeDiv ){
		resizeDiv = dlgWin.document.createElement("div");
		resizeDiv.id = "_iDlgResizeDiv_";
		resizeDiv.className = "idlg-resize";

		dlgWin.document.getElementsByTagName("BODY")[0].appendChild(resizeDiv);
	}
	
	resizeDiv.style.cssText = "width:"+w+"px;height:"+h+"px;left:"+dlgDiv.style.left+";top:"+dlgDiv.style.top+";cursor:"+dir.toLowerCase()+"-resize;display:block;z-index:"+(parseInt(dlgDiv.style.zIndex) + 1)+";";
	
	if( document.all ){
		resizeDiv.setCapture();	
	}else{
		evt.preventDefault();	
	}
	
	if( dlgWin._$id("idlg-frm-"+id) ){
		dlgWin._$id("idlg-frm-"+id).style.visibility = "hidden";
	}
	
	evt = FUI.event.fixEvent(evt);
	resizeDiv.data = {"DlgWin": dlgWin, "id":id, "w":w, "h":h, "startX":evt.pageX, "startY":evt.pageY, "dir":dir };
	
	Dialog.resizeObj = resizeDiv;
	
	dlgWin.document.onmousemove = dlgWin.Dialog.doResize;
	dlgWin.document.onmouseup = dlgWin.Dialog.resizeEnd;
	
	dlgDiv = null; resizeDiv = null;
	
};
Dialog.doResize = function(evt){
	evt = evt || window.event;
	var resizeDiv = Dialog.resizeObj, data = resizeDiv.data, prop = {};
	evt = FUI.event.fixEvent(evt);
	
	if( data.dir.indexOf("E") != -1 ){
		prop.width = Math.max(150, data.w + (evt.pageX-data.startX));
	}
	if( data.dir.indexOf("S") != -1 ){
		prop.height = Math.max(120, data.h + (evt.pageY-data.startY));
	}
	
	if( data.dir.indexOf("W") != -1 ){
		prop.width = Math.max(150, data.w + (data.startX-evt.pageX));
		prop.left = data.startX +(data.w - parseInt(prop.width));
	}
	
	if( data.dir.indexOf("N") != -1 ){
		prop.height = Math.max(120, data.h + (data.startY-evt.pageY));
		prop.top = data.startY +(data.h - parseInt(prop.height));
	}
	
	if( prop.left ){
		resizeDiv.style.left = prop.left+"px";
	}
	if( prop.top ){
		resizeDiv.style.top = prop.top+"px";
	}
	if( prop.width ){
		resizeDiv.style.width = prop.width+"px";
	}
	if( prop.height ){
		resizeDiv.style.height = prop.height+"px";
	}
	
	prop = null; resizeDiv = null;
	FUI.event.stopEvent(evt);
	
	return false;
};
Dialog.resizeEnd = function(evt){
	var resizeDiv = Dialog.resizeObj;
	var data = resizeDiv.data, dlgWin = data["DlgWin"];
	
	dlgWin.document.onmouseup = null;
	dlgWin.document.onmousemove = null;
	
	
	if( document.all ){
		resizeDiv.releaseCapture();	
	}
	
	if( dlgWin._$id("idlg-frm-" + data.id) ){
		dlgWin._$id("idlg-frm-" + data.id).style.visibility = "visible";
	}
	
	var dlg = dlgWin._$id( Dialog._divPrefix + data.id );
	dlg.style.left = resizeDiv.style.left;
	dlg.style.top = resizeDiv.style.top;
	
	dlg.dialogInstance.left = parseInt(resizeDiv.style.left);
	dlg.dialogInstance.top = parseInt(resizeDiv.style.top);
	dlg.dialogInstance.setSize( resizeDiv.offsetWidth, resizeDiv.offsetHeight, false );
	
	
	dlgWin.document.getElementsByTagName("BODY")[0].removeChild( resizeDiv );

	dlgWin = null; dlg = null; resizeDiv.data = null; resizeDiv = null; Dialog.resizeObj = null;
};

// 隐藏显示页面滚动条
Dialog.hideScrollBar = function( win, isHide ){
	if( isHide ){
		win.$("html").addClass("idlg-lock-scroll");
	}else{
		win.$("html").removeClass("idlg-lock-scroll");
	}
};

//----------------------------------------------------------- 扩展 ------------------------------------------------------------------

Dialog.open = function( opts ){
	var dlg = new Dialog( opts );
	dlg.show();
	
	return dlg;
};

Dialog.ownerDialog = function(){
	if( window.ownerDialog ){
		return window.ownerDialog;
	}else{
		return null;
	}
};

Dialog.openerWindow = function(){
	if( window.ownerDialog ){
		return window.ownerDialog.openerWindow;
	}else{
		return null;
	}
};

Dialog.openerDialog = function(){
	var op_win = Dialog.openerWindow();
	if( op_win && op_win.ownerDialog ){
		return op_win.ownerDialog;
	}else{
		return null;
	}
};

Dialog.close = function(dlg_id, win){
	win = win ? win : _$DlgWin;
	var c_dlg = win.document.getElementById("idlg-close-"+dlg_id);
	if( c_dlg ){
		c_dlg.onclick();
	}else{
		FUI.debug("Can't find the Dialog by id [ "+dlg_id+" ]!");
	}
	c_dlg = null;
	/*else if( window.ownerDialog ){
		window.ownerDialog.close();
	}*/
};

Dialog.createAlert = function ( type, msg, opts, btns ){
	opts = opts ? opts : {};
	
	if( !opts.width ){ opts.width = 380; }
	//if( !opts.height ){ opts.height = 146; }
	opts.height = null; // 所有提示框高度自适应
	
	opts.resizable = false;
	opts.escClose = false;
	opts.closeable = false;
	opts.toolbar = false;
	opts.statusbar = false;
	opts.autoHeight = true;
	
    var diag = new Dialog( opts );
    diag.ui.ShowButtonRow = true;
    diag.ui.AlertModel = true;
    diag.title = (opts.title != undefined) ? opts.title : Dialog_Language[type].title;
    diag.theme = "idlg-alert"+((opts.title === undefined||$.trim(opts.title) == "") ? " idlg-alert-notitle":"")+(opts.theme?" "+opts.theme:"");
    
    var alertIcon = "idlg-ico-"+ type.toLowerCase()+( opts.iconClass ? " "+opts.iconClass : "" );
    
    var _hide = "";
    if( "Prompt" == type){
    	msg = msg.replace(/\{ID\}/gm, diag.id); //msg.replace(/\{PW\}/gm, parseInt(opts.width, 10)-55);
    	_hide = ' style="display:none;"';
    }
    
    diag.content = '<iframe src="" frameborder="0" style="width:0;height:0;display:none;"></iframe><table width="100%" border="0" align="left" cellpadding="0" cellspacing="0" style="border:0 none;table-layout:fixed;">\
						<tr><td nowrap align="center" valign="top" class="idlg-alert-icon"'+_hide+'><div class="'+ alertIcon +'"></div></td>\
							<td align="left" valign="middle" id="idlg-alert-msg-' + diag.id + '" class="idlg-alert-msg">'+msg+'</td></tr>\
					</table>';
	
	if( btns && btns.length > 0 ){
		diag.statusbar = function(){
			var _btn = null, _btnArr = new Array(btns.length);
			for( var i = 0; i < btns.length; ++i ){
				_btn = btns[i];
				_btnArr[i]='<a href="javascript:void(0);" class="idlg-btn'+(_btn.focus?" idlg-btn-focus":"")+'"><span class="idlg-btn-txt">'+_btn.label+'</span></a>';
			}
			
			this.innerHTML = "<div class=\"idlg-btn-panel\">"+_btnArr.join("")+"</div>";
			
			_btn = null; _btnArr = []; _btnArr = null;
		};
	}
		  
  try{		    
     return diag;
  }catch(e){
  }finally{
  	diag = null;
  }
  
};

Dialog.alert = function( msg, yesFun, opts ){
	opts = opts ? opts : {};
	// 内置类型
	if( !opts._innerType ){
		opts._innerType = "Alert";
	}
	
	var diag = Dialog.createAlert( opts._innerType, msg, opts, [ { label:opts.yesLabel ? opts.yesLabel : Dialog_Language[opts._innerType].buttons[0], focus:true } ] );
	
	diag.show();
	
	var btns = $("a.idlg-btn", diag.ui.dlgStatusBar);
	btns[0].onclick = function(){
		diag.ui.dlgCloseBtn.onclick();
	    yesFun&&yesFun.call(diag);
	};
	btns[0].focus();
	
    return diag;
};

Dialog.confirm = function( msg, yesFun, noFun, opts ){
	opts = opts ? opts : {};
	var diag = Dialog.createAlert( "Confirm", msg, opts, [
		{ label:opts.yesLabel ? opts.yesLabel : Dialog_Language.Confirm.buttons[0], focus:true },
		{ label:opts.noLabel ? opts.noLabel : Dialog_Language.Confirm.buttons[1] },
		{ label:opts.cancelLabel ? opts.cancelLabel : Dialog_Language.Confirm.buttons[2] }
	] );
	
	diag.show();
	
	var btns = $("a.idlg-btn", diag.ui.dlgStatusBar);
	btns[0].onclick = function(){
		yesFun&&yesFun.call(diag);
	};
	btns[0].focus();
	
	btns[1].onclick = function(){
		diag.ui.dlgCloseBtn.onclick();
	    noFun&&noFun.call( diag );
	};
	
	btns[2].onclick = function(){
		diag.ui.dlgCloseBtn.onclick();
	};
	
	btns = null;
    
    return diag;
};

Dialog.warning = function( msg, yesFun, opts ){
	opts = opts ? opts : {};
	opts._innerType = "Warning";
	
	return Dialog.alert( msg, yesFun, opts  );
};

Dialog.success = function( msg, yesFun, opts ){
	opts = opts ? opts : {};
	opts._innerType = "Success";
	
	return Dialog.alert( msg, yesFun, opts  );
};

Dialog.error = function( msg, yesFun, opts ){
	opts = opts ? opts : {};
	opts._innerType = "Error";
	
	return Dialog.alert( msg, yesFun, opts  );
};

Dialog.prompt = function( msg, yesFun, noFun, opts ){
	opts = opts ? opts : {};
	
	var _msg = '<div class="idlg-prompt-panel"><div class="idlg-prompt-title">'+msg+'</div>';
	if( opts.multiline ){
		_msg += '<textarea id="idlg-prompt-{ID}" class="idlg-prompt-textarea"></textarea>';
	}else{
		_msg += '<input type="text" id="idlg-prompt-{ID}" class="idlg-prompt-input"/>';
	}
	_msg += "</div>";
	
	var diag = Dialog.createAlert( "Prompt", _msg, opts, [
		{ label:opts.yesLabel ? opts.yesLabel : Dialog_Language.Prompt.buttons[0], focus:true },
		{ label:opts.noLabel ? opts.noLabel : Dialog_Language.Prompt.buttons[1]}
	] );
	
	diag.show();
	
	var btns = $("a.idlg-btn", diag.ui.dlgStatusBar);
	btns[0].onclick = function(){
	    yesFun&&yesFun.call( diag, diag.context._$id("idlg-prompt-"+diag.id).value );
	};
	
	btns[1].onclick = function(){
	    diag.ui.dlgCloseBtn.onclick();
	    noFun&&noFun.call( diag, diag.context._$id("idlg-prompt-"+diag.id).value );
	};
	
	if( !opts.multiline ){
		diag.context._$id("idlg-prompt-"+diag.id).onkeydown = (function(btns){
			return function(evt){
				evt = evt ? evt : window.event;
				if( evt.keyCode == 13 ){
					btns[0].onclick();
				}
			};
		})(btns);
	}
	
	//diag.context._$id("idlg-prompt-"+diag.id).focus();
	
	btns = null;
	
    return diag;
};

Dialog.tip = function( msg, opts ){
	opts = opts ? opts : {};
	// 内置类型
	if( !opts._innerType ){
		opts._innerType = "Alert";
	}
	
	var tipDiag = Dialog.createAlert( opts._innerType, msg, opts, null );
	tipDiag.show();
	
	// 是否定义自动关闭
	if( opts.delay && parseInt(opts.delay, 10) > 0 ){
		window.setTimeout(function(){
			tipDiag.close();
		}, parseInt(opts.delay, 10));
	}
	
    return tipDiag;
};

// 当父页面发生重定向时，关闭所有从这个页面弹出的Dialog
var _winUnloadCloseiDlg = function(){
	var iWinName = window._iDiagWinName, _idiag = null;
	
	if( Dialog._childDialogArray && Dialog._childDialogArray.length > 0 ){
		for( var i = 0, len = Dialog._childDialogArray.length; i < len; ++i ){
			_idiag = Dialog._childDialogArray[i];
			if( _idiag._iWinName == iWinName ){
				_idiag.close();
			}
		}
	}
	_idiag = null;
	if( Dialog._dialogArray && Dialog._dialogArray.length > 0 ){
		for( var i = 0, len = Dialog._dialogArray.length; i < len; i++ ){
			_idiag = Dialog._dialogArray[i];
			if( _idiag._iWinName == iWinName ){
				_idiag.close();
			}
		}
	}
};

window.onload = function(){
	// 为当前Dialog所在的window生成代号，用于当页面发生重定向时关闭所有从这个window上弹出的Dialog
	window._iDiagWinName = new Date().getTime();
};
window.onunload = function(){
  _winUnloadCloseiDlg();
};
