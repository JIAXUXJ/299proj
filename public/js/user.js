/**
 * Tyler Harnadek on 2016-07-24.
 */

// globals
var userName   = null;
var passWord   = null;
var passWordRe = null;
var userID     = null;


function checkLogin() {

	//check if logged in, set account data if so
	$.get('/user/settings', function(data) {

		//logged in
		$("#loginbutton-container").css("visibility", "hidden");
		$("#logoutbutton-container").css("visibility", "visible");
		$("#user-id").empty().html(data.UserName);

	}).fail(function(data) {

		//logged out
		$("#loginbutton-container").css("visibility", "visible");
		$("#logoutbutton-container").css("visibility", "hidden");

	});

}


$('#login').submit(function() {

    // get all the inputs into an array.
    var $inputs = $('#login :input');
    var values = {};
    $inputs.each(function() {
        values[this.name] = $(this).val();
    });
	console.log(values);
	
	userName =  values.userName;
	passWord =  values.pw;
	// Literally log the password in the console for maximum insecurity
	console.log(userName);
	console.log(passWord);
	if(!passWord || !userName){
		// Do a bad thing here if the user is too lazy to enter credentials
		alert("Password or username field left blank");
		return;
	}

	// THIS NEEDS TO BE ADAPTED TO A LOGIN REQUEST
	$.post(
		"/user/login",
		{
			"userName": userName,
			"PwHash": hash(passWord),
		}, function(data, textStatus) {
			alert("Successfully logged in!");
			checkLogin();
		}
	).fail(function(data) {
	    alert("Incorrect user name or password.");
		checkLogin();
    });
	

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
	// Literally log the password in the console for maximum insecurity
	console.log(userName);
	console.log(passWord);
	if(!passWord || !userName){
		// Do a bad thing here if the user is too lazy
		alert("Password or username field left blank");
		return;
	}
	if(passWord != passWordRe ){
		// Do a bad thing here if the password fields don't match
		alert("Passwords do not match, try again");
		return;
	}
	$.post(
		"/user/new",
		{
			"userName": userName,
			"PwHash": hash(passWord),
		}, function(data, textStatus) {
			alert("Registered successfully! Try logging in!");
		}
	).fail(function() {
	    alert("Sorry! Could not create your account at this time.");
    });
	

});

function hash(string){
	//TODO: use better algo!!!! this is sdbm
	var hash = 0;
	var c;
	for(c = 0; c < string.length ; c++){
		hash = string.charCodeAt(c) + (hash<<6)+(hash<<16)-hash;
	}
	return hash;
}


function init() {

    console.log("Initalizing Page...");

	checkLogin();

}

init();