pfinduct.user=function(){};
pfinduct.user.prototype={
	authkey:'',
	userid:'',
	pfinducturl:'',
	setAuthkey:function(_authkey){authkey=_authkey;},
	setUserid:function(_userid){userid=_userid;},
	setPfinducturl:function(_pfinducturl){pfinducturl=_pfinducturl;},
	getAuthkey:function(){return authkey;},
	getUserid:function(){return userid;},
	getPfinducturl:function(){return pfinducturl;},
	save:function(){
		var data = new Object();
		data.authkey=authkey;
		data.userid=userid;
		data.pfinducturl=pfinducturl;
		localStorage.setItem("user",JSON.stringify(data));
	},	
	setUser:function(str){//localstorage里面的对象初始化当前对象
		var data = JSON.parse(str);
		this.username = data.username;
		this.password = data.password;
		this.authkey =data.data
		this.userid = data.userid;
		this.pfinducturl = data.pfinducturl;
	}
};