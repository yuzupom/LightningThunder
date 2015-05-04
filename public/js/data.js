var Data = {};

(function(){
	Data.getPlayerInfos = function(){
		var player_infos = []
		for(var i=0; i<4; i++){
			var pl = Data.room.seated_users[i];
			if(!pl.game_infomation){
				player_infos[j] = [];
				player_infos[j][0] = pl.display_name;
				player_infos[j][1] = 6;
				player_infos[j][2] = 0;
				player_infos[j][3] = -1;
			}
			else{
				for(var j=0; j<4; j++){
					if(pl.game_infomation.position == TABLE.SEAT_ID[j]){
						player_infos[j] = [];
						player_infos[j][0] = pl.display_name;
						var dragon = pl.game_infomation.dragon;
						player_infos[j][1] = (dragon == "-hidden-") ? 6 : dragon.id;
						player_infos[j][2] = pl.game_infomation.life;
						if(pl.game_infomation.finger == "-hidden-" || 
							pl.game_infomation.finger == "NOT-DECIDED"){
							player_infos[j][3] = (pl.game_infomation.finger_ready) ? 6 : -1;
						}
						else{
							player_infos[j][3] = pl.game_infomation.finger;						
						}
					}				
				}
			}
		}
		return player_infos;
	}
})();

(function(){
	// Dummy Data
	Data.user = {
		"id":25,
		"display_name":"北国",	
		"win_count":0,
		"lose_count":0,
		"ai_id":null,
		"created_at":"2015-04-26T09:36:55.639Z",
		"updated_at":"2015-04-26T09:36:55.649Z",
		"game_infomation":null,
		"seated_room_id":null
	}

	Data.users = [Data.user, Data.user, Data.user];

	Data.room = {
		"name":"test_room",
		"number_of_players":4,
		"room_status_name":"PlayingGame_WaitingForLightning",
		"seated_users":[
			{
				"id":26,
				"display_name":"あああ国",
				"win_count":0,
				"lose_count":0,
				"ai_id":null,
				"created_at":"2015-05-03T13:26:18.362Z",
				"updated_at":"2015-05-03T13:30:34.523Z",
				"game_infomation":{
					"position":"YOU",
					"life":4,
					"parent":false,
					"finger_ready":false,
					"finger":"NOT-DECIDED",
					"dragon":{
						"id":4,
						"name":"響き渡る怒号　ア・コニタム",
						"short_word":"最大",
						"for_2_players":true,
						"for_3_players":true,
						"for_4_players":true,
						"main_text":"未実装",
						"flavor_text":"未実装",
						"atk":200000
					},
					"detail":{
						"finger_1st":null,
						"finger_2nd":null,
						"finger_3rd":null,
						"finger_4th":null,
						"finger_5th":null,
						"called_dragon_card_id":null,
						"posted_ok":false,
						"successed_summon":null,
						"win_game":null,
						"changed_life":0,
						"rank":null
					}
				}
			},
			{"id":27,
			"display_name":"CPU#1",
			"win_count":0,
			"lose_count":1,
			"ai_id":1,
			"created_at":"2015-05-03T13:41:14.376Z",
			"updated_at":"2015-05-03T13:41:14.376Z",
			"game_infomation":{"position":"FIRST_LEFT_PERSON",
			"life":4,
			"parent":false,
			"finger_ready":true,
			"finger":"-hidden-",
			"dragon":{"id":0,
			"name":"雷竜の右腕　ルドベギア",
			"short_word":"推理",
			"for_2_players":true,
			"for_3_players":true,
			"for_4_players":true,
			"main_text":"未実装",
			"flavor_text":"未実装",
			"atk":999999},
			"detail":"-hidden-"}},
			{"id":28,
			"display_name":"CPU#2",
			"win_count":0,
			"lose_count":1,
			"ai_id":1,
			"created_at":"2015-05-03T13:41:14.384Z",
			"updated_at":"2015-05-03T13:41:14.384Z",
			"game_infomation":{"position":"SECOND_LEFT_PERSON",
			"life":4,
			"parent":false,
			"finger_ready":true,
			"finger":"-hidden-",
			"dragon":"-hidden-",
			"detail":"-hidden-"}},
			{"id":29,
			"display_name":"CPU#3",
			"win_count":0,
			"lose_count":1,
			"ai_id":1,
			"created_at":"2015-05-03T13:41:14.393Z",
			"updated_at":"2015-05-03T13:41:14.393Z",
			"game_infomation":{"position":"THIRD_LEFT_PERSON",
			"life":4,
			"parent":false,
			"finger_ready":true,
			"finger":"-hidden-",
			"dragon":"-hidden-",
			"detail":"-hidden-"}}
		],

		"detail":{
			"id":2,
			"creater_id":26,
			"room_status_id":32,
			"created_at":"2015-05-03T13:30:34.516Z",
			"updated_at":"2015-05-03T13:41:14.441Z"
		}
	};

	Data.rooms = [
		{
			"name":"AAAA",
			"number_of_players":4,
			"room_status_name":"Closed",
			"seated_users":[],
			"detail":{
				"id":1,
				"creater_id":21,
				"room_status_id":50,
				"created_at":"2015-04-26T06:52:16.842Z",
				"updated_at":"2015-04-26T06:56:19.977Z"
			}
		},
		{
			"name":"test_room",
			"number_of_players":4,
			"room_status_name":"WaitingForPlayers",
			"seated_users":[{
				"id":26,
				"display_name":"あああ国",
				"win_count":0,
				"lose_count":0,
				"ai_id":null,
				"created_at":"2015-05-03T13:26:18.362Z",
				"updated_at":"2015-05-03T13:30:34.523Z",
				"game_infomation":null
			}],
			"detail":{
				"id":2,
				"creater_id":26,
				"room_status_id":10,
				"created_at":"2015-05-03T13:30:34.516Z",
				"updated_at":"2015-05-03T13:30:34.528Z"
			}
		}
	]

	Data.dragons = [
		{"id":0,"name":"雷竜の右腕　ルドベギア","short_word":"推理","for_2_players":true,"for_3_players":true,"for_4_players":true,"main_text":"未実装","flavor_text":"未実装","atk":999999},
		{"id":1,"name":"常勝帝　VR・リンドウ","short_word":"運命","for_2_players":true,"for_3_players":true,"for_4_players":true,"main_text":"未実装","flavor_text":"未実装","atk":700000},
		{"id":2,"name":"真実詠み　ギャリー・マ・エイビス","short_word":"無双","for_2_players":false,"for_3_players":false,"for_4_players":true,"main_text":"未実装","flavor_text":"未実装","atk":600000},
		{"id":3,"name":"彼岸の侵略者　イフェイオン","short_word":"＋１","for_2_players":true,"for_3_players":true,"for_4_players":true,"main_text":"未実装","flavor_text":"","atk":400000},
		{"id":4,"name":"響き渡る怒号　ア・コニタム","short_word":"最大","for_2_players":true,"for_3_players":true,"for_4_players":true,"main_text":"未実装","flavor_text":"未実装","atk":200000},
		{"id":5,"name":"可能性の生誕","short_word":"奇数","for_2_players":true,"for_3_players":true,"for_4_players":false,"main_text":"未実装","flavor_text":"未実装","atk":500},
		{"id":6,"name":"転卵","short_word":"なし","for_2_players":false,"for_3_players":false,"for_4_players":true,"main_text":"未実装","flavor_text":"未実装","atk":100}
	];
})();
