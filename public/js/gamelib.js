var debug_cb = function(obj){
	console.log(JSON.stringify(obj))
};

var xhr;
(function(){
	var base_url = 'https://lightning-thunder.herokuapp.com/api/v1/'	
	xhr = function(method, url, cb){
		var xhr = new XMLHttpRequest();
		xhr.open(method , base_url + url);
		xhr.onreadystatechange = function(){
			if (xhr.readyState === 4){
				if(xhr.status >= 400){
					console.error(JSON.stringify(xhr.responseText))
				}
				if(typeof cb == "function"){
					cb(JSON.parse(xhr.responseText));					
				}
			}
		};
		xhr.onerror = function(){
			console.error(xhr.responseText);
		}
		xhr.setRequestHeader("Content-Type" , "application/x-www-form-urlencoded");
		xhr.send();
	}
})();

var api = {};
(function(){
	var offline_debug = !(location.host == "lightning-thunder.herokuapp.com");
	var offline_delay = 1000;
	api['GET'] = {}
	api['POST'] = {}

	// ユーザー一覧の取得
	api['GET']['users'] = function(cb){
		if(offline_debug){ setTimeout(function(){cb(DummyData.users)}, offline_delay); return; }
		xhr('GET', 'users', cb);
	}

	// (ログイン済みの)自分自身の情報の取得
	api['GET']['user'] = function(cb){
		if(offline_debug){ setTimeout(function(){cb(DummyData.user)}, offline_delay); return; }
		xhr('GET', 'user', cb);
	}

	// 新規ユーザーの作成/ユーザーの名前の変更
	api['POST']['users'] = function(display_name, cb){
		if(offline_debug){
			setTimeout(function(){
				DummyData.user.display_name = display_name;
				cb(DummyData.user);
			}, offline_delay);
			return;
		}
		xhr('POST', 'users?user[display_name]=' + display_name, cb);
	}

	// ルーム一覧の取得
	api['GET']['rooms'] = function(cb){
		if(offline_debug){ setTimeout(function(){cb(DummyData.rooms)}, offline_delay); return; }
		xhr('GET', 'rooms', cb);
	}

	// 新規ルームの作成
	api['POST']['rooms'] = function(room_name, cb){
		if(offline_debug){ 
			setTimeout(function(){
				DummyData.room.name = room_name;
				cb(DummyData.room);
			}, offline_delay);
			return;
		}
		var user_num = 4;
		xhr('POST', 'rooms?room[number_of_players]=' + user_num + '&room[name]=' + room_name, cb);
	}

	// ルームへの入室
	api['POST']['rooms/seats/take'] = function(room_id, cb){
		if(offline_debug){ 
			setTimeout(function(){ cb(DummyData.room); }, offline_delay);
			return;
		}
		xhr('POST', 'rooms/seats/take?room[id]=' + room_id, cb);
	}

	// ルームからの退室
	api['POST']['rooms/seats/leave'] = function(cb){
		if(offline_debug){ 
			setTimeout(function(){ cb(DummyData.room); }, offline_delay);
			return;
		}
		xhr('POST', 'rooms/seats/leave', cb);
	}

	// 入室しているルームの情報の取得
	api['GET']['room'] = function(cb){
		if(offline_debug){ setTimeout(function(){cb(DummyData.room)}, offline_delay); return; }
		xhr('GET', 'room', cb);
	}

	// NPCを入れて開始
	api['POST']['game/start'] = function(cb){
		if(offline_debug){ setTimeout(function(){ cb(DummyData.room); }, offline_delay); return; }
		xhr('POST', 'game/start', cb);
	}

	// 指の数を指定
	api['POST']['game/finger'] = function(finger_num, cb){
		if(offline_debug){ setTimeout(function(){ cb(DummyData.room); }, offline_delay); return; }
		xhr('POST', 'game/finger?cast=' + finger_num, cb);
	}

	// 推理時にドラゴンの名前を指定する
	api['POST']['game/name'] = function(dragon_id, cb){
		if(offline_debug){ setTimeout(function(){ cb(DummyData.room); }, offline_delay); return; }
		xhr('POST', 'game/name?cast=' + dragon_id, cb);
	}

	// ラウンド終了を了解する
	api['POST']['game/ok'] = function(cb){
		if(offline_debug){ setTimeout(function(){ cb(DummyData.room); }, offline_delay); return; }
		xhr('POST', 'game/ok', cb);
	}

	// ドラゴン一覧の取得
	api['GET']['dragons'] = function(cb){
		if(offline_debug){ setTimeout(function(){ cb(DummyData.dragons); }, offline_delay); return; }
		xhr('GET', 'dragons', cb);
	}
})();var Data = {};

(function(){
	Data.getPlayerInfos = function(){
		var player_infos = []
		if(typeof Data.room.seated_users == "undefined" 
			|| Data.room.seated_users.length != 4){
			for(var i=0; i<4; i++){
				player_infos[i] = [];
				if(typeof Data.room.seated_users == "undefined"
					|| typeof Data.room.seated_users[i] === "undefined"){
					player_infos[i][0] = "空席";	
				}
				else{
					player_infos[i][0] = Data.room.seated_users[i].display_name;
				}
				player_infos[i][1] = 7;
				player_infos[i][2] = 0;
				player_infos[i][3] = -1;
			}
		}
		else{
			for(var i=0; i<4; i++){
				var pl = Data.room.seated_users[i];
				for(var j=0; j<4; j++){
					if(pl.game_infomation.position == TABLE.SEAT_ID[j]){
						player_infos[j] = [];
						player_infos[j][0] = pl.display_name;
						var dragon = pl.game_infomation.dragon;
						player_infos[j][1] = (dragon == "-hidden-") ? 7 : dragon.id;
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
	// Data
	Data.user = {};
	Data.users = [];
	Data.room = {
		seated_users:[],
		deatil:{},
	};
	Data.rooms = [];
	Data.dragons = {};

	// Seed Data
	DummyData = {};
	DummyData.user = {
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

	DummyData.users = [DummyData.user, DummyData.user, DummyData.user];

	DummyData.room = {
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

	DummyData.rooms = [
		{
			"name":"aaa",
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

	DummyData.dragons = [
		{"id":0,"name":"雷竜の右腕　ルドベギア","short_word":"推理","for_2_players":true,"for_3_players":true,"for_4_players":true,"main_text":"未実装","flavor_text":"未実装","atk":999999},
		{"id":1,"name":"常勝帝　VR・リンドウ","short_word":"運命","for_2_players":true,"for_3_players":true,"for_4_players":true,"main_text":"未実装","flavor_text":"未実装","atk":700000},
		{"id":2,"name":"真実詠み　ギャリー・マ・エイビス","short_word":"無双","for_2_players":false,"for_3_players":false,"for_4_players":true,"main_text":"未実装","flavor_text":"未実装","atk":600000},
		{"id":3,"name":"彼岸の侵略者　イフェイオン","short_word":"＋１","for_2_players":true,"for_3_players":true,"for_4_players":true,"main_text":"未実装","flavor_text":"","atk":400000},
		{"id":4,"name":"響き渡る怒号　ア・コニタム","short_word":"最大","for_2_players":true,"for_3_players":true,"for_4_players":true,"main_text":"未実装","flavor_text":"未実装","atk":200000},
		{"id":5,"name":"可能性の生誕","short_word":"奇数","for_2_players":true,"for_3_players":true,"for_4_players":false,"main_text":"未実装","flavor_text":"未実装","atk":500},
		{"id":6,"name":"転卵","short_word":"なし","for_2_players":false,"for_3_players":false,"for_4_players":true,"main_text":"未実装","flavor_text":"未実装","atk":100}
	];

	Data.dragons = DummyData.dragons;
})();
TABLE = {};
(function(){
	TABLE.SEAT_ID = [
		"YOU",
		"FIRST_LEFT_PERSON",
		"SECOND_LEFT_PERSON",
		"THIRD_LEFT_PERSON"
	];
	TABLE.DRAGON_NAME = [
		'rudobegia',
		'rindou',
		'gyari-_ma_eibis',
		'ifeion',
		'akonitam',
		'tenran',
		'tenran',
		'ura'
	];
	// kanousi
	TABLE.GAME_STATE = [
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
    ]

})();var audio = {};
(function(){
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    var context = new AudioContext();
    var S = {};

	audio.playSE = function(filename){
		var buffer = S[filename]
		var source = context.createBufferSource();
		source.buffer = buffer;
		source.connect(context.destination);
		var now = context.currentTime;
		source.start(now+0);
	};

	(function(){
		var source;
		audio.playBGM = function(filename){
			var buffer = S[filename]
			source = context.createBufferSource();
			source.buffer = buffer;
			source.loop = true;
			source.connect(context.destination);
			var now = context.currentTime;
			source.start(now+0);
		};
		audio.stopBGM = function(){
			source.stop(0);
		};
	})();

	audio.load = function(filename, cb_progress){
		filename = (filename instanceof Array) ? filename : [filename];
		var all = [];
		for(var i=0; i<filename.length; i++){
			all.push(loadSound(filename[i])
				.then(function(value){
					return (cb_progress instanceof Function) ? cb_progress(value) : value
				})
				.catch(function(error){
					return Promise.reject(error);
				})
			);
		}
		return Promise.all(all);
	}
	function loadSound(filename){
		if(S[filename]){return Promise.resolve(filename) }
		return new Promise(function(resolve, reject){
			var request = new XMLHttpRequest();
			request.open('GET', filename, true);
			request.responseType = 'arraybuffer';

			// Decode asynchronously
			request.onload = function() {
				context.decodeAudioData(request.response, function(buffer) {
					S[filename] = buffer;
					resolve(filename);
				}, reject );
			}
			request.onError = function(){
				reject(new Error(request.statusText));
			}
			request.send();
		})
	}
})();/* 
 * img.load(filename, cb_progress).then(cb_complete)
 * hoge.src = img.get[filename]
 */
var img = {};
	var F = {};

(function(){
	img.load = function(filename, cb_progress){
		filename = (filename instanceof Array) ? filename : [filename];
		var all = [];
		for(var i=0; i<filename.length; i++){
			all.push(load(filename[i])
				.then(function(value){
					return (cb_progress instanceof Function) ? cb_progress(value) : value
				})
				.catch(function(error){
					return Promise.reject(error);
				})
			);
		}
		return Promise.all(all);
	}
	img.get = function(filename){
		if(!F[filename]){
			console.error('この画像はまだロードしてないよ:'+filename)
		}
		return F[filename];
	}

	function load(filename){
		if(F[filename]){ return Promise.resolve(filename) }
		return new Promise(function(resolve, reject){
			var img = new Image();
			img.src = filename;
			img.onload = function(){
				F[filename] = img;
				resolve(filename);
			}
			img.onerror = function(e){
				reject(new Error(xhr.statusText))				
			}
		})
	}
})();var template = {};
(function(){
	template["lobby"] = function(ctx, rooms, user){
		var c = document.createElement('canvas');
		var ctx = c.getContext('2d')
		c.width = 640;
		c.height = 480;

		ctx.fillStyle = "rgba(30, 0, 0, 1)"
		ctx.fillRect(0,0,640,480);

		var image = img.get('img/背景/lobby/lt2.jpg')
		ctx.drawImage(image, 0, 0, 640, 480);

		var image = img.get('img/背景/lobby/makeroom.gif')
		ctx.drawImage(image, 160, 40);

		var image = img.get('img/背景/lobby/random.gif')
		ctx.drawImage(image, 368, 40);

		ctx.font = '36px/2 sans-serif';
		ctx.textBaseline = 'middle';
		ctx.fillStyle = "rgba(255, 255, 255, 1)"
		ctx.font = '28px/2 sans-serif';

		var i = 0;
		for(var j=0; j<rooms.length; j++){
			if(!rooms[j]){continue}
			if(rooms[j].room_status_name != "WaitingForPlayers"){continue}
			var image = img.get('img/背景/lobby/room.gif')
			ctx.drawImage(image, 70, 118+(i*85));
			ctx.textAlign = 'left';
			ctx.fillText(rooms[j].name, 90, 156+(i*85));
			ctx.textAlign = 'right';
			ctx.fillText(rooms[j].seated_users.length+'/4', 550, 156+(i*85));
			i++;
		}

		ctx.font = '28px/2 sans-serif';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'top';
		ctx.fillText(user.display_name +'  '+ user.win_count + '勝', 0, 0);
		return c;
	}

	template['makeroom_popup'] = function(){
		var c = document.createElement('canvas');
		var ctx = c.getContext('2d')
		c.width = 400;
		c.height = 150;

		var ctx = c.getContext('2d')
		var image = img.get('img/背景/lobby/frame.png')
		ctx.drawImage(image, 0, 0);
		var image = img.get('img/背景/lobby/ok.gif')
		ctx.drawImage(image, 40, 110);
		var image = img.get('img/背景/lobby/cancel.gif')
		ctx.drawImage(image, 210, 110);

		ctx.fillStyle = "rgba(25, 15, 15, 1)"
		ctx.font = '18px/2 sans-serif';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'top';
		ctx.fillText('部屋名', 30, 30);

		ctx.strokeStyle = "rgba(0, 0, 0, 1)"
		ctx.strokeRect(103, 25, 250, 30);
		ctx.fillStyle = "rgba(255, 255, 255, 1)"
		ctx.fillRect(103, 25, 250, 30);
		return  c;
	}


	template.game_base = function(ctx, dragon_id, tag){
		template.game_bg(ctx);

		var player_infos = Data.getPlayerInfos();

		var c = template.drawFourStatusWindow(player_infos)
		ctx.drawImage(c, 0, 0)

		//カード詳細ポップアップ
		if(dragon_id != null){
			ctx.drawImage(template.dragonDetail(dragon_id),640-269,0);		
		}

		ctx.fillStyle = "rgba(10, 10, 10, 0.75)"
		ctx.fillRect(0, 370, 640, 110);

		var c = template.scene_name(tag);
		ctx.drawImage(c, 0, 0)

	}
	//player_info = [userName, dragonName, life, hand]
	template.drawFourStatusWindow = function(player_infos){
		var c = document.createElement('canvas');
		c.width = 640;
		c.height = 480;
		var ctx = c.getContext('2d');
		var TRANSFORM_INFO =　[
			[1, 0, 0, 1, 220, 210],
			[0, 1, -1, 0, 180, 70],
			[-1, 0, 0, -1, 420, 170],
			[0, -1, 1, 0, 460, 270]
		]
		for (var i = 0; i < 4; i++){
			ctx.setTransform.apply(ctx,TRANSFORM_INFO[i])
			ctx.drawImage(statusWindow(player_infos[i][0],player_infos[i][1],player_infos[i][2],player_infos[i][3]),0,0)
		}
		ctx.setTransform(1, 0, 0, 1, 0, 0)
		return c;
	}

	function statusWindow(user_name, dragon_id, life, hand){
		var c = document.createElement('canvas');
		var ctx = c.getContext('2d');

		//サイズ設定
		c.width = 200;
		c.height = 150;

		ctx.fillStyle = "rgba(10, 10, 10, 0.7)"
		ctx.fillRect(0,0,200,150);

		//ドラゴンの画像を表示する
		//index.html内で,画像を既にロードしてます。使いたい画像はindex.htmlで読み込んどいてください。
		ctx.drawImage(img.get('img/カード画像/'+TABLE.DRAGON_NAME[dragon_id]+'.png'), 1, 20, 95, 130)

		//ライフの数だけ王冠表示する
		for(var i=0;i<life;i++){
			ctx.drawImage(img.get('img/oukan.png'), 100 + (i*25), 125, 20, 20)
		}

		//show hand 
		//if hand == 6, show good mark
		//if hand == -1, dont show anything
		image = img.get('img/手/'+hand+'.png')
		var w = image.width / 10
		var h = image.height / 10
		ctx.drawImage(image, 150 - w/2, 70 - h/2, w, h)

		//国の名前を表示する
		ctx.font = '18px/2 sans-serif';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'top';
		ctx.fillStyle = "rgba(255, 255, 255, 1)"
		ctx.fillText(user_name , 0, 0);
		return c;
	}

	template.game_bg = function(ctx){
		image = img.get('img/背景/lightning.jpg')
		var r =  Math.cos(Date.now() / 10000) + 1;
		var w = 640;
		var h = 480;
		var p = 1/10;
		ctx.drawImage(image, (-w*p/2)*r, (-h*p/2)*r, w + w*p*r, h + h*p*r);
	}

	template.dragonWindow = function(){
		var c = document.createElement('canvas');
		c.width = 640;
		c.height = 110;
		var ctx = c.getContext('2d');

		var x = 30
		var d = 10
		var w = 70
		var h = 100
		for (var i = 0; i < 6;i++){
			image = img.get('img/ドラゴン画像/d_'+TABLE.DRAGON_NAME[i]+'.png')
			ctx.drawImage(image, x, 55 - h/2, w, h)
			x +=  d + w
		}

		image = img.get('img/手/'+ 6 +'.png')
		var w = image.width / 20
		var h = image.height / 20
		ctx.drawImage(image, x+10, 78 - h/2, w, h)
		ctx.font = '36px/2 sans-serif';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'top';
		ctx.fillStyle = "rgba(255, 255, 255, 1)"
		ctx.fillText('OK' , x+10 + w + 10 , 60);
		return c
	}

	template.handWindow = function(){
		var c = document.createElement('canvas');
		c.width = 640;
		c.height = 110;
		var ctx = c.getContext('2d');

		var x = 30
		var d = 20
		for (var i = 0; i < 6;i++){
			image = img.get('img/手/'+ i +'.png')
			var w = image.width / 12
			var h = image.height / 12
			if (i == 5){
				x -= d - 10
			}
			ctx.drawImage(image, x, 55 - h/2, w, h)
			x +=  d + w
		}

		image = img.get('img/手/'+ 6 +'.png')
		var w = image.width / 20
		var h = image.height / 20
		ctx.drawImage(image, x+10, 78 - h/2, w, h)
		ctx.font = '36px/2 sans-serif';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'top';
		ctx.fillStyle = "rgba(255, 255, 255, 1)"
		ctx.fillText('OK' , x+10 + w + 10 , 60);
		return c
	}

	template['scene_name'] = function(scene_name){
		var c = document.createElement('canvas');
		c.width = 640;
		c.height = 110;
		var ctx = c.getContext('2d');

		ctx.font = '16px/2 sans-serif';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'top';
		ctx.fillStyle = "rgba(255, 255, 255, 1)"
		ctx.fillText(scene_name , 8, 8);
		return c;
	}

	template.dragonDetail = function(dragon_id){
		var c = document.createElement('canvas');
		c.width = 269;
		c.height = 370;
		var ctx = c.getContext('2d');

		var dragon_name = TABLE.DRAGON_NAME[dragon_id];
		ctx.drawImage(img.get('img/カード画像/'+dragon_name+'.png'), 0, 0, c.width, c.height)
		return c
	}

	template.waiting = function(message){
		var c = document.createElement('canvas');
		c.width = 640;
		c.height = 110;
		var ctx = c.getContext('2d');

		ctx.font = '18px/2 sans-serif';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'bottom';
		ctx.fillStyle = "rgba(255, 255, 255, 1)"
		var suffix = [
			"",
			".",
			"..",
			"...",			
		]
		ctx.fillText(message+suffix[Date.now()%2000/2000*4|0] , 10, 100);
		return c;		
	}
})();compo = {};
(function(){
	var base_x = document.getElementById('c').style.left;
	var base_y = document.getElementById('c').style.top;
	compo.makeTextbox = function(x, y, w, h){
		var elm = document.createElement('input');
		var pre_text = "";
		var text_canvas = document.createElement('canvas');
		text_canvas.width  = w;
		text_canvas.height = h;

		elm.style.position = 'absolute';
		elm.style.left = x+parseInt(base_x);
		elm.style.top  = y+parseInt(base_y);
		elm.style.width  = w;
		elm.style.height = h;
		document.body.appendChild(elm);
		elm.style.opacity = '0.1'
		// document.onkeyup = function(){
		// }
		var onStep = function(){};
		var onDraw = function(ctx){
			ctx.fillStyle = "rgba(250, 250, 250, 0.01)"
			ctx.fillRect(x, y, w, h)
			if(elm.value != pre_text ){
				var t_ctx = text_canvas.getContext('2d');
				t_ctx.clearRect(0, 0, w, h);
				var f_size = 32*6 / (elm.value.length > 6 ? elm.value.length : 6);
				t_ctx.font = f_size+'px/2 sans-serif';
				t_ctx.textAlign = 'center';
				t_ctx.textBaseline = 'middle';
				t_ctx.fillStyle = "rgba(0, 0, 0, 1)"
				t_ctx.fillText(elm.value , w/2, h/2);
				pre_text = elm.value;
			}
			ctx.drawImage(text_canvas, x, y)
		}
		elm.focus()
		return {
			onStep : onStep,
			onDraw : onDraw,
			elm : elm
		}
	}

	compo.makeButton = function(x, y, w, h, value){
		var elm = document.createElement('button');
		elm.style.position = 'absolute';
		elm.style.opacity = '0.1'
		elm.style.left = x+parseInt(base_x);
		elm.style.top  = y+parseInt(base_y);
		elm.style.width  = w;
		elm.style.height = h;
		elm.innerText = value;
		document.body.appendChild(elm);
		var onStep = function(){};
		var onDraw = function(){};
		return {
			onStep : onStep,
			onDraw : onDraw,
			elm : elm,
		}
	}
})();
var Scene;
(function(){
	scene_list = [];
	scene_tag = {};
	Scene = function(){
	}
	Scene.prototype.onDraw = function(){
	}
	Scene.prototype.onStep = function(){	
	}
	Scene.prototype.onStart = function(){	
	}
	Scene.prototype.onEnd = function(){	
	}
	Scene.change = function(tag_name){
		Scene.end();
		scene_list = [];
		var scene = new Scene();
		for(var prop in scene_tag[tag_name]){
			if(scene_tag[tag_name].hasOwnProperty(prop)){
				scene[prop] = scene_tag[tag_name][prop];
			}
		}
		scene_list.push(scene);
		Scene.start();
		return scene;
	}
	Scene.add = function(name){
		var scene = new Scene();
		for(var prop in scene_tag[name]){
			if(scene_tag[name].hasOwnProperty(prop)){
				scene[prop] = scene_tag[name].prop;
			}
		}
		scene_list.push(scene);
		scene.onStart();		
		return scene;
	}
	Scene.step = function(){
		for(var i=scene_list.length-1; i>=0; i--){
			scene_list[i].onStep();
		}
	}
	Scene.start = function(){
		for(var i=scene_list.length-1; i>=0; i--){
			scene_list[i].onStart();
		}
	}
	Scene.end = function(){
		for(var i=scene_list.length-1; i>=0; i--){
			scene_list[i].onEnd();
		}
	}
	Scene.draw = function(ctx){
		for(var i=scene_list.length-1; i>=0; i--){
			scene_list[i].onDraw(ctx);
		}
	}
})();
function start(){
	var scene_dir = 'js/scene/'
	require(["game.js"], function(){
		var imgs = [
		  'img/oukan.png',
		  'img/connect.png',
		  'img/背景/lightning.jpg',
		  'img/背景/title_bg.png',
		  'img/背景/title_form.png',
		  'img/背景/title_form2.png',
		  'img/背景/lobby/lt2.jpg',
		  'img/背景/lobby/makeroom.gif',
		  'img/背景/lobby/makeroomom.gif',
		  'img/背景/lobby/random.gif',
		  'img/背景/lobby/randomom.gif',
		  'img/背景/lobby/room.gif',
		  'img/背景/lobby/roomom.gif',
		  'img/背景/lobby/frame.png',
		  'img/背景/lobby/ok.gif',
		  'img/背景/lobby/cancel.gif',
		]
		for (var i = -1; i <= 6; i++){
			imgs.push('img/手/' + i + '.png')
		} 

		for (var i = 0; i < TABLE.DRAGON_NAME.length; i++){
			imgs.push('img/ドラゴン画像/d_'+TABLE.DRAGON_NAME[i]+'.png')
		}
		for (var i = 0; i < TABLE.DRAGON_NAME.length; i++){
			imgs.push('img/カード画像/'+TABLE.DRAGON_NAME[i]+'.png')
		}
		audios = [
			"se/決定音候補/se_maoudamashii_system40.mp3",
			"se/キャンセル/se_maoudamashii_system19.mp3",
			"bgm/BGM候補/game_maoudamashii_5_castle04.mp3",
			"se/ゲーム開始音/se_maoudamashii_system49.mp3",
		]
		Promise.all([
			img.load(imgs),
			audio.load(audios)
		])
		.then(function(){
			main();
			Scene.change('login');
		})
		.catch(function(e){
			console.log(e)
		})
	})
}

	function main(){
		var ctx = document.getElementById('c').getContext('2d');
		Scene.draw(ctx);
		Scene.step();
		setTimeout(main, 20);
	}