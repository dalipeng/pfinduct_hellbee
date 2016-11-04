function executeScript(a){
	var b = document.createElement("script");
	b.innerHTML = a;
	a = document.head || document.body || document.documentElement || document;
	
	a.insertBefore(b,a.firstChild);
	a.removeChild(b);
}


var induct_baseversion = 1.3;

executeScript("checkcrx("+induct_baseversion+")");