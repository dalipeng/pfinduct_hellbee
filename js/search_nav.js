$(function(){
	$('.tabContentUl li').each(function(i){
		if((i+1)%4 == 0){
			$(this).css('margin-right','0px');
		}
	});
	
	//$("a").bind("click",showAccount);
});


var hasTip = false;
function showAccount() {
   	if( !hasTip ){
   		$(this).poshytip({
   			content:'<div style="width:300px;">aaaaaaaa</div><div><div><p style="text-align:right;padding-right:10px;"><a id="_closetip">关闭</a></p>',
   			showOn:'none',
   			alignTo:'target',
   			alignX:'left',
   			alignY:'top',
   			offsetY:-50,
   			offsetX:-50
   		});
   		$(this).poshytip('show');
   		var obj = $(this);
		$("#_closetip").bind("click", function(){obj.poshytip('hide'); hasTip = false;});	
   		
   		hasTip = true;
   	}
   	return false;
}

