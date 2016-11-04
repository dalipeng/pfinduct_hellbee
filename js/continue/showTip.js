 	 		
			function showTips(res){
				if(res==200 || res =='200'){
					/*操作成功*/					
					$(".scout-setup-tip").find("span").text("操作成功");
					$(".scout-setup-tip").fadeIn("slow",function(){
						$(this).addClass("succeed");
							$(this).css("display","block");
						});				
					window.setTimeout(function(){
						hidden_tip();
					},1000);
				}else{
					//操作失败				
					$(".scout-setup-tip").find("span").text("操作失败");
					$(".scout-setup-tip").fadeIn("slow",function(){
						$(this).addClass("failure");
						$(this).css("display","block");
					});				
					window.setTimeout(function(){
						hidden_tip();
					},1000);
				}
			}
			// 隐藏提示信息
			function hidden_tip(){
				$(".scout-setup-tip").fadeOut("slow",function(){
				   $(this).css("display","none");
				});
			}
			