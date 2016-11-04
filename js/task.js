pfinduct.task=function(){};
pfinduct.task.prototype={
	taskname:"",
	taskid:"",
	keywords:"",
	setTaskname:function(_taskname){taskname=_taskname;},
	setTaskid:function(_taskid){taskid=_taskid;},
	setKeywords:function(_keywords){keywords=_keywords;},
	getTaskname:function(){return taskname;},
	getTaskid:function(){return taskid;},
	getKeywords:function(){return keywords;},
	save:function(){
		var data = new Object();
		data.taskname=taskname;
		data.taskid=taskid;
		data.keywords=keywords;
		localStorage.setItem("task",JSON.stringify(data));
	},
	deleteTask:function(){
		delete localStorage['task'];
	},
	setTask:function(str){//localstorage里面的对象初始化当前对象
		var data = JSON.parse(str);
		this.taskname = data.taskname;
		this.taskid = data.taskid;
		this.keywords = data.keywords;
	}
};