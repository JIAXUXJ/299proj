$(document).ready(function(){
	$.get('/review/list',
		function(data){
			if(data){
					$("#leadercont").add("div").css("background-color", "white").text(data);
			}
		}
	);
});
