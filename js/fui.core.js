/**
 * FUI核心JavaScript类库
 *
 * @name     fui-core.js
 * @author   yswang
 * @version  2.0
 * @date     2010/5/4
 * @depend   jquery.js
 * @example  see examples/core.html
*/
var FUI = {
	author : "yswang",
	version : "2.0.0"
};
 
(function(){

	/**
	 *	浏览器特性检测
	 */
 	var ua = navigator.userAgent.toLowerCase(),
        check = function(r){
            return r.test(ua);
        },
        browerVer = 0,
        isStrict = document.compatMode == "CSS1Compat",
        isOpera = check(/opera/),
        isChrome = check(/chrome/),
        isWebKit = check(/webkit/),
        isSafari = !isChrome && check(/safari/),
        isSafari2 = isSafari && check(/applewebkit\/4/), // unique to Safari 2
        isSafari3 = isSafari && check(/version\/3/),
        isSafari4 = isSafari && check(/version\/4/),
        isIE = !isOpera && check(/msie/),
        isIE6 = isIE && check(/msie 6/),
        isIE7 = isIE && check(/msie 7/),
        isIE8 = isIE && check(/msie 8/),
        isIE9 = isIE && check(/msie 9/),
        isGecko = !isWebKit && check(/gecko/),
        isGecko2 = isGecko && check(/rv:1\.8/),
        isGecko3 = isGecko && check(/rv:1\.9/),
        isFirefox = check(/firefox/),
        isFirefox3 = check(/firefox\/3/),
        browerVer = (isIE ? ua.match(/msie ([\d.]+)/)[1] :
                  isFirefox ? ua.match(/firefox\/([\d.]+)/)[1] :
                  isChrome ? ua.match(/chrome\/([\d.]+)/)[1] : 
                  isOpera ? ua.match(/opera.([\d.]+)/)[1] : 
                  isSafari ? ua.match(/version\/([\d.]+).*safari/)[1] : 0),
        isBorderBox = isIE && !isStrict,
        isWindows = check(/windows|win32/),
        isMac = check(/macintosh|mac os x/),
        isAir = check(/adobeair/),
        isLinux = check(/linux/),
        isSecure = /^https/i.test(window.location.protocol),
        isiPhone = check(/iphone/),
        isiPad = check(/ipad/);
		
	    /**
	     * 清除IE6下背景图片闪烁
	     */
	    if(isIE6){
	        try{
	            document.execCommand("BackgroundImageCache", false, true);
	        }catch(e){}
	    }
	    
	    /** 
	     * FUI 的命名空间 
	     */
	    FUI.namespace = function(){
	    	var o, d;
	    	$.each( arguments, function(i, n){
	    		d = n.split(".");
	    		o = window[d[0]] = window[d[0]] || {};
	    		$.each( d.slice(1), function(j, n2){
	    			o = o[n2] = o[n2] || {};
	    		} );
	    	} );
	    };
	    
	    /** 
	     * FUI的一些全局常量 
	     */
	    FUI.CONSTANTS = {
	    	RANDOM_STRING : "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
	    	RANDOM_NUM : "0123456789"
	    };
	    
	    /**
	     * 浏览器检测 
	     * eg. alert( FUI.browser.isIE );
	     */
	    FUI.browser = {
	    	isOpera : isOpera,
	        isChrome : isChrome,
	        isWebKit : isWebKit,
	        isSafari : isSafari,
	        isSafari2 : isSafari2,
	        isSafari3 : isSafari3,
	        isSafari4 : isSafari4,
	        isIE : isIE,
	        isIE6 : isIE6,
	        isIE7 : isIE7,
	        isIE8 : isIE8,
	        isIE9 : isIE9,
	        isGecko : isGecko,
	        isGecko2 : isGecko2,
	        isGecko3 : isGecko3,
	        isFirefox : isFirefox,
	        isFirefox3 : isFirefox3,
	        version: browerVer,
	        isBorderBox : isBorderBox,
	        isWindows : isWindows,
	        isMac : isMac,
	        isAir : isAir,
	        isLinux : isLinux,
	        isiPhone : isiPhone,
	        isiPad : isiPad
	    };
	    
	    /**
	     * Javascript Debug
	     */
	    FUI.debug = function( msg, e ){
	    	if( typeof console != 'undefined' && typeof console.log != 'undefined' ){
	    		console.log( msg, e ? e : "" );
	    	}
	    };
	    
	    /**
	     * 扩展String对象原型方法
	     */
	    
	    /**
		 * String.trim() 去除前后空格 
		 * @return 去除前后空格之后的字符串
		 *
		 * eg. " abc ".trim() --> "abc"
		 */
		String.prototype.trim = function(){
			return this.replace(/^\s+|\s+$/g, "");
		};
	     
	    /** 
		 * replaceAll 字符串替换所有函数
		 * @param s1 要替换的字符串
		 * @param s2 替换的新字符串
		 * @param ignoreCase 是否区分大小写替换，默认不区分大小写 
		 * @return 替换后的字符串
		 *
		 * eg. " Abc defg aBc, abc ".replaceAll( "abc", "1" ) --> " 1 defg 1, 1 "
		 *     " Abc defg aBc, abc ".replaceAll( "abc", "1", false ) --> " Abc defg aBc, 1 "
		 */
		String.prototype.replaceAll = function( s1, s2, ignoreCase ){
			var p = ignoreCase === false ? "gm" : "gmi";
			return this.replace( new RegExp( s1, p ), s2 );
		};
		
		/**
		 * String.startWidth() 判断字符串是否以某个字符串开头
		 * @param value 开始字符
		 * @param ignoreCase 是否区分大小写判断，默认不区分
		 * @return 布尔型结果 true | false
		 *
		 * eg. alert( "/images/ico".startWith("/") ) --> true
		 *     alert( "An loce".startWith("a", false) ) --> false
		 */
		String.prototype.startWith = function(value, ignoreCase){
			var reg = (ignoreCase === false) ? new RegExp("^"+String(value))
											 : new RegExp("^"+String(value), "i");
			return reg.test(this);
		};
		
		/**
		 * String.endWidth() 判断字符串是否以某个字符串结尾
		 * @param value 结束字符
		 * @param ignoreCase 是否区分大小写判断，默认不区分
		 * @return 布尔型结果 true | false
		 *
		 * eg. alert( "images/1.gif".endWith(".Gif") ) --> true
		 *     alert( "images/1.GIF".endWith(".gif", false) ) --> false
		 *     alert( "images/1.JPG".endWith(".jpe?g") ) --> true
		 */
		String.prototype.endWith = function(value, ignoreCase){
			var reg = (ignoreCase === false) ? new RegExp(String(value)+"$") 
										     : new RegExp(String(value)+"$", "i");
			return reg.test(this);
		};
		
		/**
		 * 计算字符串的字节长度
		 */
		 String.prototype.byteLength = function(){
		 	var str = this;
		 	if( typeof str == "undefined" ){
		 		return 0;
		 	}
		 	// 匹配汉字
		 	var aMatch = str.match(/[^\x00-\x80]/g);
		 	//var aMatch = str.match(/[^\x00-\xff]/g);
		 	
		 	// 如果按1个汉字 = 2个字节
		 	//return ( str.length +(!aMatch?0:aMatch.length) );
		 	// 如果按1个汉字 = 3个字节
		 	return ( str.length +(!aMatch?0:aMatch.length*2) );
		 };
		 // 获取字符串的字数长度
		 String.prototype.getLength = function(){
		 	// 如果按1个汉字 = 2个字节
		 	//return Math.ceil( this.byteLength()/2 );
		 	// 如果按1个汉字 = 3个字节
		 	return Math.ceil( this.byteLength()/3 );
		 };
		 
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
		
		/**
	     * 扩展Date日期对象原型方法
	     */
		
		/** 
		 * 格式化日期显示样式
		 * eg. new Date().format("yyyy-MM-dd"); 
		 */
		Date.prototype.format = function( format ){
			format = format || "yyyy-MM-dd HH:mm:ss";
			
			var fm = {
				"M+" : this.getMonth()+1,
				"d+" : this.getDate(),
				"H+" : this.getHours(),
				"m+" : this.getMinutes(),
				"s+" : this.getSeconds(),
				"q+" : Math.floor( (this.getMonth()+3)/3 ),
				"S"  : this.getMilliseconds()
			};
				
			if( /(y+)/.test( format ) ){
				format = format.replace( RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length) );
			}
			
			for( var f in fm ){
				if( new RegExp("("+ f +")").test( format ) ){
					format = format.replace( RegExp.$1, RegExp.$1.length == 1 ? fm[f] : ("00"+fm[f]).substr( (""+fm[f]).length ) );
				}
			}
			
			return format;
		}; 	
		
		/**
	     * 扩展Array数组对象原型方法
	     */
	    
	    /**
	     * 判断数组是否存在某个元素
	     * @param obj 元素
	     * @ignoreCase 是否区分大小写，默认区分
	     * @return {true|false} 存在返回 true； 否则，返回false
	     */
	    Array.prototype.contains = function( obj, ignoreCase ){
	    	if( obj === null || obj === undefined ){
	    		return false;
	    	}
	    	var ic = (ignoreCase === null || ignoreCase === undefined) ? false : ignoreCase;
	    	
	    	obj = ic ? String(obj).toLowerCase() : obj;
	    	
	    	var a = null;
	    	for( var i = 0; i < this.length; i++ ){
    			a = ic ? String(this[i]).toLowerCase() : this[i];
    			if( a == obj ){
    				return true;
    			}
	    	}
	    	
	    	return false;
	    };
	    
	    /**
	     * 去除数据中的重复元素
	     * @ignoreCase 是否不区分大小写，默认 区分大小写
	     * @return {Array} 由不重复元素构成的数组
	     */
	    Array.prototype.unique = function( ignoreCase ){
	    	var ra = new Array();
	    	var ic = (ignoreCase === null || ignoreCase === undefined) ? false : ignoreCase;
	    	
	    	for( var i = 0; i < this.length; i++ ){
	    		if( !ra.contains(this[i], ic) ){
	    			ra.push( this[i] );
	    		}
	    	}
	    	
	    	return ra;
	    };
	    
	    /**
	     * 在数组中的index位置插入一个元素
	     */
	    Array.prototype.insert = function( index, data ){
	    	if( index > this.length ){
	    		this.push( data );
	    	}
	    	else if( index >= 0 && index <= this.length ){
	    		/*var temp = this.slice( index );
	    		this[index] = data;
	    		for( var i = 0; i < temp.length; i++ ){
	    			this[index+1+i] = temp[i];
	    		}*/
	    		this.splice(index, 0, data);
	    	}
	    	
	    	return this;
	    };
	    
	    Array.prototype.remove = function( data ){
	    	for( var i = 0; i < this.length; i++ ){
	    		if( data == this[i] ){
	    			this.splice(i, 1);
	    		}
	    	}
	    	
	    	return this;
	    };
	    
	   // 计算数组中元素的最大值
	   Array.prototype.max = function(){
	   	 return Math.max.apply({}, this);
	   };
	   
	   // 计算数组中元素的最小值
	   Array.prototype.min = function(){
	   	 return Math.min.apply({}, this);
	   };

})();



/**
 * FUI DOM对象扩展方法
 *
 * @author   yswang
 * @version  2.0
 * @date     2010/5/4
 * @depend   
 * @example  see examples/dom.html
*/ 

/**
 * 注册命名空间
 */
FUI.namespace("FUI.dom");

/**
 * 获取DOM对象
 */
FUI.dom.getDOM = function( ele ){
	if( typeof ele == 'string' ){
	  	ele = document.getElementById(ele);
	 }else if( typeof ele == 'object' && ele instanceof jQuery ){
	  	ele = ele.get(0);
	 }
	 
	 return ele;
};

/**
 * 获取DOM对象在当前页面上的绝对偏移量
 */
FUI.dom.getPosition = function( ele ){
	return {"x":$(ele).offset().left, "y":$(ele).offset().top };
  /*ele = this.getDOM(ele);
  
  if ( ele.parentNode === null || ele.style.display == 'none' ){
    return null;
  }
  
  var doc = ele.ownerDocument;
  var parent = null;
  var pos = [];
  var box;
  
  //IE,FF3,己很精确，但还没有非常确定无误的定位
  if(ele.getBoundingClientRect){
    box = ele.getBoundingClientRect();
    
    var scrollTop = Math.max(doc.documentElement.scrollTop, doc.body.scrollTop);
    var scrollLeft = Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft);
    var X = box.left + scrollLeft - doc.documentElement.clientLeft;
    var Y = box.top + scrollTop - doc.documentElement.clientTop;
   
    if(document.all){
    	X = X-1;
    	Y = Y-1;
    }
    
    return {x:X, y:Y};
    
  }else if(doc.getBoxObjectFor){ // FF2
    box = doc.getBoxObjectFor(ele);
    var borderLeft = (ele.style.borderLeftWidth)?parseInt(ele.style.borderLeftWidth):0;
    var borderTop = (ele.style.borderTopWidth)?parseInt(ele.style.borderTopWidth):0;
    pos = [box.x - borderLeft, box.y - borderTop];
  }
  
  if (ele.parentNode) {
    parent = ele.parentNode;
  }else {
    parent = null;
  }
  
  while (parent && parent.tagName != 'BODY' && parent.tagName != 'HTML'){
    pos[0] -= parent.scrollLeft;
    pos[1] -= parent.scrollTop;
    
    if (parent.parentNode){
      parent = parent.parentNode;
    }else{
      parent = null;
    }
  }
  
  return {x:pos[0], y:pos[1]};*/
};

/**
 * 获取DOM对象相对于最外层页面的绝对偏移量
 */
FUI.dom.getPositionEx = function( ele ){
	ele = this.getDOM(ele);
	
	var pos = this.getPosition(ele);
	var win = window, sw, sh, pos2;
	
	while( win != win.parent){
		if( win.frameElement ){
			pos2 = this.getPosition(win.frameElement);
			pos.x += pos2.x;
			pos.y += pos2.y;
			pos2 = null;
		 }
		 
		sw = Math.max(win.document.body.scrollLeft, win.document.documentElement.scrollLeft);
		sh = Math.max(win.document.body.scrollTop,  win.document.documentElement.scrollTop);
		
		pos.x -= sw;
		pos.y -= sh;
		
		win = win.parent;
	 }
	 
	return pos;	
};

/**
 * 删除节点（垃圾回收）
 */
 FUI.dom.removeNode = FUI.browser.isIE ? function(){     
      var d;     
      return function(n, doc){     
          if(n && n.tagName != 'BODY'){
              d = d || (doc||document).createElement('div');     
              d.appendChild(n);     
              d.innerHTML = '';     
          }
          d = null;
          CollectGarbage();     
      }     
  }() : function(n, doc){     
      if(n && n.parentNode && n.tagName != 'BODY'){     
          n.parentNode.removeChild(n);     
      }     
 };	

/**
 * 获取最外层window对象
 */
 FUI.dom.getTopWindow = function(){
 	var twin = window;
	while( twin.parent && twin.parent != twin ){
	    try{ 
	    	// 跨域
	    	if( twin.parent.document.domain != document.domain ){
	    	 	break;
	    	} 
	    }catch(e){
	    	break;
	    }
	    
		twin = twin.parent;
	}
	
	return twin;
 };

/**
 * 
 */
FUI.dom.getDimensions = function(win){
	win = win ? win : window;
    var doc = win.document;
    var cw = doc.compatMode == "BackCompat" ? doc.body.clientWidth : doc.documentElement.clientWidth;
    var ch = doc.compatMode == "BackCompat" ? doc.body.clientHeight : doc.documentElement.clientHeight;
    var sl = Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft);
    var st = Math.max(doc.documentElement.scrollTop, doc.body.scrollTop);
    var sw = Math.max(doc.documentElement.scrollWidth, doc.body.scrollWidth);
    var sh = Math.max(doc.documentElement.scrollHeight, doc.body.scrollHeight);
	if(sh<ch) sh=ch; //IE下在页面内容很少时存在scrollHeight<clientHeight的情况
    
    return {
        "clientWidth": cw,
        "clientHeight": ch,
        "scrollLeft": sl,
        "scrollTop": st,
        "scrollWidth": sw,
        "scrollHeight": sh
    }
};


/**
 * FUI Event事件对象扩展方法
 *
 * @author   yswang
 * @version  2.0
 * @date     2010/5/4
 * @depend   gdk.core.js, gdk.dom.js
 * @example  see examples/event.html
*/

// 注册命名空间
FUI.namespace("FUI.event");

/**
 * 获取事件类型
 */
FUI.event.getEvent = function( evt ){
	evt = evt ? evt : ( window.event || arguments.callee.caller.arguments[0] );
	return evt;
};

/** 
 * 阻止一切事件冒泡传递执行，包括浏览器默认的事件 
 * 
 */
FUI.event.stopEvent = function( evt ){
	evt = this.getEvent(evt);
	if(!evt){
		return;
	}
	
	if( evt.stopPropagation ){
		evt.preventDefault();
		evt.stopPropagation();
	}else{
		evt.cancelBubble = true;
		evt.returnValue = false;
	}
};

/**
 * 仅阻止用户定义事件的冒泡传递 
 */
FUI.event.cancelEvent = function( evt ){
	evt = this.getEvent(evt);
	if(!evt){
		return;
	}
	
	if(evt.stopPropagation){
		evt.stopPropagation();
	}else{
		evt.cancelBubble=true;
	}
};

/**
 * 格式化事件参数对象
 */
FUI.event.fixEvent = function(e){
	e = this.getEvent( e );
	var sl = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
	var st = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
	
	if(typeof e.layerX=="undefined")e.layerX=e.offsetX;
	if(typeof e.layerY=="undefined")e.layerY=e.offsetY;
	if(typeof e.pageX == "undefined")e.pageX = e.clientX + sl - document.body.clientLeft;
	if(typeof e.pageY == "undefined")e.pageY = e.clientY + st - document.body.clientTop;
	
	return e;
};

/** 
 * 获取鼠标事件在当前页面上的绝对坐标 
 * 
 */
FUI.event.getPosition = function( evt ){
	evt = this.getEvent(evt);
	
	var pos = { "x":evt.clientX, "y":evt.clientY };
	pos.x = evt.pageX || pos.x + Math.max( document.body.scrollLeft, document.documentElement.scrollLeft );
	pos.y = evt.pageY || pos.y + Math.max( document.body.scrollTop, document.documentElement.scrollTop );
	
	return pos;
};

/**
 * 获取鼠标事件坐标相对于最外层页面上的坐标值
 * 通常用于跨无限层iframe框架
 */
FUI.event.getPositionEx = function( evt ){
	evt = this.getEvent(evt);
	var pos = { "x":evt.clientX, "y":evt.clientY };
	var win, srcEle = (evt.srcElement ? evt.srcElement : evt.target);
	
	if( FUI.browser.isGecko ){
		win = srcEle.ownerDocument.defaultView;
	}else{
		win = srcEle.ownerDocument.parentWindow;
	}
	
	var pos2;// sw = 0, sh = 0;
	while(win != win.parent){
		if(win.frameElement){
			pos2 = FUI.dom.getPosition(win.frameElement);
			pos.x += pos2.x;
			pos.y += pos2.y;	
		 }
		 
		//sw = Math.max(win.document.body.scrollLeft, win.document.documentElement.scrollLeft);
		//sh = Math.max(win.document.body.scrollTop, win.document.documentElement.scrollTop);
		//pos.x -= sw;
		//pos.y -= sh;
		
		win = win.parent;	
	 }
	 
	return pos;	
};

// Drag
var Drag={
    "obj":null,
	"init":function(handle, dragBody, e){
		if (e == null) {
			handle.onmousedown=Drag.start;
		}
		handle.root = dragBody;

		if(isNaN(parseInt(handle.root.style.left)))handle.root.style.left="0px";
		if(isNaN(parseInt(handle.root.style.top)))handle.root.style.top="0px";
		handle.root.onDragStart=new function(){};
		handle.root.onDragEnd=new function(){};
		handle.root.onDrag=new function(){};
		if (e !=null) {
			var handle=Drag.obj=handle;
			e=Drag.fixe(e);
			var top=parseInt(handle.root.style.top);
			var left=parseInt(handle.root.style.left);
			handle.root.onDragStart(left,top,e.pageX,e.pageY);
			handle.lastMouseX=e.pageX;
			handle.lastMouseY=e.pageY;
			document.onmousemove=Drag.drag;
			document.onmouseup=Drag.end;
		}
	},
	"start":function(e){
		FUI.event.stopEvent(e);
		var handle=Drag.obj=this;
		e=FUI.event.fixEvent(e);
		var top=parseInt(handle.root.style.top);
		var left=parseInt(handle.root.style.left);
		
		handle.root.onDragStart(left,top,e.pageX,e.pageY);
		handle.lastMouseX=e.pageX;
		handle.lastMouseY=e.pageY;
		document.onmousemove=Drag.drag;
		document.onmouseup=Drag.end;
		return false;
	},
	"drag":function(e){
		e=FUI.event.fixEvent(e);
							
		var handle=Drag.obj;
		var mouseY=e.pageY;
		var mouseX=e.pageX;
		var top=parseInt(handle.root.style.top);
		var left=parseInt(handle.root.style.left);
		
		if(document.all){Drag.obj.setCapture();}else{e.preventDefault();};//作用是将所有鼠标事件捕获到handle对象，对于firefox，以用preventDefault来取消事件的默认动作：

		var currentLeft,currentTop;
		currentLeft=left+mouseX-handle.lastMouseX;
		currentTop=top+(mouseY-handle.lastMouseY);
		handle.root.style.left=currentLeft +"px";
		handle.root.style.top=currentTop+"px";
		handle.lastMouseX=mouseX;
		handle.lastMouseY=mouseY;
		handle.root.onDrag(currentLeft,currentTop,e.pageX,e.pageY);
		return false;
	},
	"end":function(){
		if(document.all){Drag.obj.releaseCapture();};//取消所有鼠标事件捕获到handle对象
		document.onmousemove=null;
		document.onmouseup=null;
		Drag.obj.root.onDragEnd(parseInt(Drag.obj.root.style.left),parseInt(Drag.obj.root.style.top));
		Drag.obj=null;
	}
};

