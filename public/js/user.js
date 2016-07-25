/**
 * Tyler Harnadek on 2016-07-24.
 */

// globals
var userName   = null;
var passWord   = null;
var passWordRe = null;
var userID     = null;


$(".login-button").click(function() {
	console.log("register");
	 $.post(
		"/user/new",
		{
			"userName": userName,
			"PwHash": hash(passWord),
		}, function(data, textStatus) {
			if (textStatus !== 'success') {
				alert('Failed to login.');
				console.log("Login failed. Status: " + textStatus);
			}
		}
	); 

});


$('#register').submit(function() {

    // get all the inputs into an array.
    var $inputs = $('#register :input');
    var values = {};
    $inputs.each(function() {
        values[this.name] = $(this).val();
    });
	console.log(values);
	
	userName =  values.userName;
	passWord =  values.pw;
	passWordRe= values.re_pw;
	
	console.log(userName);
	console.log(passWord);
	if(!passWord || !userName){
		// Do a bad thing here
		alert("Password or username field left blank");
		return;

	}
	if(passWord != passWordRe ){
		// Do a bad thing here
		alert("Passwords do not match, try again");
		return;

	}
	console.log("now we post");
	$.post(
		"/user/new",
		{
			"userName": userName,
			"PwHash": hash(passWord),
		}, function(data, textStatus) {
			if (textStatus !== 'success') {
				alert('Failed to login.');
				console.log("Login failed. Status: " + textStatus);
			}
		}
	); 
	

});

function hash(string){
	//TODO: use better algo!!!! this is djb2
	var hash = 5381;
	for(var i = 0; i < string.length; i++){
		var char = string.charCodeAt(i);
		hash = ((hash<<5) + hash) + char;
	}
	return hash;
}


function init() {

    console.log("Initalizing Page...");

}

init();