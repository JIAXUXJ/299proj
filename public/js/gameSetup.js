//created by Jia at 7-20, get the user settings input
// var serverInterface = new ServerInterface("localhost", 3000);
 
var socket = io.connect('http://localhost:30052'); 
console.log('IO: socket.id: '+socket.io);
 
 /*
  * Add event handlers for buttons.
  */
 function init() {
     //judge which setting page user in currently, we have 3 setting pages in total: local, AI, Networking
     var title = $(document).attr("title");	
	
     $('#play-button').on('click', function () {
		//console.log("play button");
         //token: the color of user selected for their token.
		
		//gamemodes: 0 = Ai, 1 = Online, 2 = Hotseat
		
		var gameMode = 0;
		if($("#optionsOpponent2").is(":checked")){
			gameMode = 1;
		}
		if($("#optionsOpponent3").is(":checked")){
			gameMode = 2;
		}		
		
		var size = 9;
		if($("#optionsSize13").is(":checked")){
			size = 13;
		}
		else if($("#optionsSize19").is(":checked")){
			size = 19;
		}

		//console.log(size, gameMode);
        var bg = "size=" + size+ "&" + "mode=" + gameMode;


        $.post(
         "match/startHotSeat",
         {
             "boardSize": size
         },
         function(data, textStatus) {
             if (data) {
                 console.log('gameSetup/init: '+data);
                 window.location.href = '/gamePlay.html?gameID=' + data + "&" + bg;
                 //getData();
             }
             else if (textStatus !== 'success') {
                 alert("Failed to access server.");
             }
         }
        );
 
     });
 
 }
init();
