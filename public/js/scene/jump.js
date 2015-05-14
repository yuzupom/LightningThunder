(function(){
	var tag = 'jump'
	scene_tag[tag] = {}
	scene_tag[tag].onStart = function(){
		function cb(data){
			Data.room = data;
			if(typeof Data.room.room_status_name === "undefined"){
				Scene.change("login");
			}
			var status = Data.room.room_status_name;
			if(status == "WaitingForPlayers"){
				Scene.change("game_waituser_audience");
			}
			if(status == "BeginingGame"){
				Scene.change("game_waituser_audience");
			}
			if(status == "PlayingGame_WaitingForLightning"){
				Scene.change("game_waituser_audience");
			}
			if(status == "PlayingGame_WaitingForDragonName"){
				Scene.change("game_waituser_audience");
			}
			if(status == "PlayingGame_WaitingForOK"){
				Scene.change("game_waituser_audience");
			}
			if(status == "EndingGame"){
				Scene.change("game_waituser_audience");
			}
			if(status == "Closed"){
				Scene.change("game_waituser_audience");
			}
			
		}
		api["GET"]["room"](cb)
	}
})();



/*
		"CreatingRoom",
    	"WaitingForPlayers",
    	"BeginingGame",
    	"PlayingGame",
    	"PlayingGame_WaitingForLightning",
    	"PlayingGame_WaitingForDragonName",
    	"PlayingGame_WaitingForOK",
    	"EndingGame",
	    "Closed",
    	"Error",
 */
