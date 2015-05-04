var debug_cb = function(obj){
	console.log(JSON.stringify(obj))
};

var xhr;
(function(){
	var base_url = 'https://lightning-thunder.herokuapp.com/api/v1/'	
	xhr = function(method, url, cb){
		var xhr = new XMLHttpRequest();
		xhr.open(method , url);
		xhr.onreadystatechange = function(){
			if (xhr.readyState === 4){
				cb(JSON.parse(xhr.responseText));
			}
		};
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
		if(offline_debug){ setTimeout(function(){cb(Data.users)}, offline_delay); return; }
		xhr('GET', 'users', cb);
	}

	// (ログイン済みの)自分自身の情報の取得
	api['GET']['user'] = function(cb){
		if(offline_debug){ setTimeout(function(){cb(Data.user)}, offline_delay); return; }
		xhr('GET', 'user', cb);
	}

	// 新規ユーザーの作成/ユーザーの名前の変更
	api['POST']['users'] = function(display_name, cb){
		if(offline_debug){
			setTimeout(function(){
				Data.user.display_name = display_name;
				cb(Data.user);
			}, offline_delay);
			return;
		}
		xhr('POST', 'users?user[display_name]=' + display_name, cb);
	}

	// ルーム一覧の取得
	api['GET']['rooms'] = function(cb){
		if(offline_debug){ setTimeout(function(){cb(Data.rooms)}, offline_delay); return; }
		xhr('GET', 'rooms', cb);
	}

	// 新規ルームの作成
	api['POST']['rooms'] = function(room_name, cb){
		if(offline_debug){ 
			setTimeout(function(){
				Data.room.name = room_name;
				cb(Data.room);
			}, offline_delay);
			return;
		}
		var user_num = 4;
		xhr('POST', 'rooms?room[number_of_players]=' + user_num + '&room[name]=' + room_name, cb);
	}

	// ルームへの入室
	api['POST']['rooms/seats/take'] = function(room_id, cb){
		if(offline_debug){ 
			setTimeout(function(){ cb(Data.room); }, offline_delay);
			return;
		}
		xhr('POST', 'rooms/seats/take?room[id]=' + room_id, cb);
	}

	// ルームからの退室
	api['POST']['rooms/seats/leave'] = function(cb){
		if(offline_debug){ 
			setTimeout(function(){ cb(Data.room); }, offline_delay);
			return;
		}
		xhr('POST', 'rooms/seats/leave', cb);
	}

	// 入室しているルームの情報の取得
	api['GET']['room'] = function(cb){
		if(offline_debug){ setTimeout(function(){cb(Data.room)}, offline_delay); return; }
		xhr('GET', 'room', cb);
	}

	// NPCを入れて開始
	api['POST']['game/start'] = function(cb){
		if(offline_debug){ setTimeout(function(){ cb(Data.room); }, offline_delay); return; }
		xhr('POST', 'game/start', cb);
	}

	// 指の数を指定
	api['POST']['game/finger'] = function(finger_num, cb){
		if(offline_debug){ setTimeout(function(){ cb(Data.room); }, offline_delay); return; }
		xhr('POST', 'game/finger?cast=' + finger_num, cb);
	}

	// 推理時にドラゴンの名前を指定する
	api['POST']['game/name'] = function(dragon_id, cb){
		if(offline_debug){ setTimeout(function(){ cb(Data.room); }, offline_delay); return; }
		xhr('POST', 'game/name?cast=' + dragon_id, cb);
	}

	// ラウンド終了を了解する
	api['POST']['game/ok'] = function(cb){
		if(offline_debug){ setTimeout(function(){ cb(Data.room); }, offline_delay); return; }
		xhr('POST', 'game/ok', cb);
	}

	// ドラゴン一覧の取得
	api['GET']['dragons'] = function(cb){
		if(offline_debug){ setTimeout(function(){ cb(Data.dragons); }, offline_delay); return; }
		xhr('GET', 'dragons', cb);
	}
})();

var audio = {};
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
			console.log(buffer);
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
})();

compo = {};
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


var Data = {};

(function(){
	Data.getPlayerInfos = function(){
		var player_infos = []
		for(var i=0; i<4; i++){
			var pl = Data.room.seated_users[i];
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

/* 
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
		'ura'
	];
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

})();

var template = {};
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

		for(var i=0;i<4;i++){
			if(!Data.rooms[i]){continue}
			var image = img.get('img/背景/lobby/room.gif')
			ctx.drawImage(image, 70, 118+(i*85));
			ctx.textAlign = 'left';
			ctx.fillText(rooms[i].name, 90, 156+(i*85));
			ctx.textAlign = 'right';
			ctx.fillText(rooms[i].seated_users.length+'/4', 550, 156+(i*85));
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
		ctx.drawImage(img.get('img/カード画像/'+TABLE.DRAGON_NAME[dragon_id]+'.png'), 1, 20, 95, 130)

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
			image = img.get('img/ドラゴン画像/d_'+TABLE.DRAGON_NAME[i]+'.png')
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
		ctx.drawImage(img.get('img/カード画像/'+dragon_name+'.png'), 0, 0, c.width, c.height)
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
})();

(function(){
	var tag = 'game_battle'
	var dragon_id = null;
	var base_url = 'https://lightning-thunder.herokuapp.com/api/v1'
	scene_tag[tag] = {}
	
	scene_tag[tag].onStart = function(){
		this.objs = [];
		var button = compo.makeButton(400, 100, 100, 50, '待機完了');
		this.objs.push(button);

		//決定ボタン押したら
		button.elm.onclick = function(){
			Scene.change('game_damage');			
		}
		var player_infos = Data.getPlayerInfos();
		var hand = [];
		hand[0] = compo.makeButton(220, 230, 98, 130, player_infos[0][1]);
		this.objs.push(hand[0]);
		hand[1] = compo.makeButton(30, 70, 130, 98, player_infos[1][1]);
		this.objs.push(hand[1]);
		for(var i=0; i<hand.length; i++){
			(function(i){
				hand[i].elm.onmouseover = function(){
					dragon_id = player_infos[i][1];
				}
				hand[i].elm.onmouseout = function(){
					dragon_id = null;
				}			
			})(i);
		}
	}

	scene_tag[tag].onEnd = function(){
		for(var i=this.objs.length-1; i>=0; i--){
			if(this.objs[i].elm){
				var elm = this.objs[i].elm;
				elm.parentNode.removeChild(elm);
			}
		}
		this.objs = null;
		document.onkeyup = null;
	}
	scene_tag[tag].onDraw = function(ctx){
		template.game_base(ctx, dragon_id, "勝敗判定フェイズ");

		var c = template.waiting("３位と４位がダメージを受けます");
		ctx.drawImage(c, 0, 370)
		
		for(var i=this.objs.length-1; i>=0; i--){
			this.objs[i].onDraw(ctx);
		}
	}
})();

(function(){
	var tag = 'game_chara_open'
	var update_timer;
	var dragon_id = null;
	scene_tag[tag] = {}

	scene_tag[tag].onStart = function(){
		this.objs = [];
		var button1 = compo.makeButton(400, 100, 100, 50, '推理');
		this.objs.push(button1);
		var button2 = compo.makeButton(400, 160, 100, 50, '推理される');
		this.objs.push(button2);
		var button3 = compo.makeButton(400, 220, 100, 50, '誰も推理しない');
		this.objs.push(button3);

		update_timer = setInterval(function(){
			var cb = function(data){
				Data.room = data;
				if(Data.room == "PlayingGame_WaitingForDragonName"){
					if(update_timer){
						clearInterval(update_timer);
						update_timer = null;
						audio.playSE("se/決定音候補/se_maoudamashii_system40.mp3");
						player_infos = Data.getPlayerInfos();
						if(player_infos[0][1] == 'rudobegia'){
							Scene.change('game_whodoneit_performer');
						}
						else{
							Scene.change('game_whodoneit_audience');			
						}
					}
				}
				if(Data.room == "PlayingGame_WaitingForOK"){
					if(update_timer){
						clearInterval(update_timer);
						update_timer = null;
						audio.playSE("se/決定音候補/se_maoudamashii_system40.mp3");
						Scene.change('game_battle');
					}
				}
			}
			api['GET']['room'](cb);
		}, 1000)

		//決定ボタン押したら
		button1.elm.onclick = function(){
			/*
			 *  TODO
			 */
			Scene.change('game_whodoneit_performer');
		}
		button2.elm.onclick = function(){
			/*
			 *  TODO
			 */
			Scene.change('game_whodoneit_audience');			
		}
		button3.elm.onclick = function(){
			/*
			 *  TODO
			 */
			Scene.change('game_battle');
			
		}

		var player_infos = Data.getPlayerInfos();
		var hand = [];
		hand[0] = compo.makeButton(220, 230, 98, 130, player_infos[0][1]);
		this.objs.push(hand[0]);
		hand[1] = compo.makeButton(30, 70, 130, 98, player_infos[1][1]);
		this.objs.push(hand[1]);
		for(var i=0; i<hand.length; i++){
			(function(i){
				hand[i].elm.onmouseover = function(){
					dragon_id = player_infos[i][1];
				}
				hand[i].elm.onmouseout = function(){
					dragon_id = null;
				}			
			})(i);
		}
	}

	scene_tag[tag].onEnd = function(){
		for(var i=this.objs.length-1; i>=0; i--){
			if(this.objs[i].elm){
				var elm = this.objs[i].elm;
				elm.parentNode.removeChild(elm);
			}
		}
		this.objs = null;
		document.onkeyup = null;
	}
	scene_tag[tag].onDraw = function(ctx){
		template.game_base(ctx, dragon_id, "降臨フェイズ");

		var c = template.waiting("降臨フェイズ");
		ctx.drawImage(c, 0, 370)

		for(var i=this.objs.length-1; i>=0; i--){
			this.objs[i].onDraw(ctx);
		}
	}
})();

(function(){
	var tag = 'game_chooseNumber_audience'
	var dragon_id = null;
	scene_tag[tag] = {}
	scene_tag[tag].onStart = function(){
		this.objs = [];

		update_timer = setInterval(function(){
			var cb = function(data){
				Data.room = data;
				if(Data.room != "PlayingGame_WaitingForLightning"){
					if(update_timer){
						clearInterval(update_timer);
						update_timer = null;
						audio.playSE("se/決定音候補/se_maoudamashii_system40.mp3");
						Scene.change('game_chara_open');
					}
				}
			}
			api['GET']['room'](cb);
		}, 1000)
		var player_infos = Data.getPlayerInfos();
		var hand = [];
		hand[0] = compo.makeButton(220, 230, 98, 130, player_infos[0][1]);
		this.objs.push(hand[0]);
		hand[1] = compo.makeButton(30, 70, 130, 98, player_infos[1][1]);
		this.objs.push(hand[1]);
		for(var i=0; i<hand.length; i++){
			(function(i){
				hand[i].elm.onmouseover = function(){
					dragon_id = player_infos[i][1];
				}
				hand[i].elm.onmouseout = function(){
					dragon_id = null;
				}			
			})(i);
		}
	}

	scene_tag[tag].onEnd = function(){
		for(var i=this.objs.length-1; i>=0; i--){
			if(this.objs[i].elm){
				var elm = this.objs[i].elm;
				elm.parentNode.removeChild(elm);
			}
		}
		this.objs = null;
		document.onkeyup = null;
	}
	scene_tag[tag].onDraw = function(ctx){
		template.game_base(ctx, dragon_id, "契約フェイズ");

		var c = template.waiting("対戦相手が考えています");
		ctx.drawImage(c, 0, 370)

		for(var i=this.objs.length-1; i>=0; i--){
			this.objs[i].onDraw(ctx);
		}
	}
})();

(function(){
	var tag = 'game_chooseNumber_performer'
	var base_url = 'https://lightning-thunder.herokuapp.com/api/v1'
	var choosed_finger = null;
	var dragon_id = null;

	scene_tag[tag] = {}
	scene_tag[tag].onStart = function(){
		choosed_finger = null;
		this.objs = [];
		var number = [];
		var x = 30;
		for(var i=0;i<6;i++){
			var hand_w = [646, 646, 677, 677, 783, 1012]
			number[i] = compo.makeButton(x, 375, hand_w[i]/12, 100, i);
			this.objs.push(number[i]);
			x += hand_w[i]/12 + ((i == 4)? 10 : 20);
		}
		var button = compo.makeButton(x+8, 420, 115, 52, '数字選択完了');
		this.objs.push(button);

		//決定ボタン押したら
		for(var i=0; i<6; i++){
			(function(i){
				number[i].elm.onclick = function(){
					audio.playSE("se/決定音候補/se_maoudamashii_system40.mp3");
					choosed_finger = i;
				}
			})(i)
		}
		//決定ボタン押したら
		button.elm.onclick = function(){
			if(choosed_finger == null){
				audio.playSE("se/キャンセル/se_maoudamashii_system19.mp3");
				return 
			}
			audio.playSE("se/決定音候補/se_maoudamashii_system40.mp3");
			var cb = function(data){
				Scene.change('game_chooseNumber_audience');
			}
			api['POST']['game/finger'](choosed_finger, cb);
		}

		var player_infos = Data.getPlayerInfos();
		var hand = [];
		hand[0] = compo.makeButton(220, 230, 98, 130, player_infos[0][1]);
		this.objs.push(hand[0]);
		hand[1] = compo.makeButton(30, 70, 130, 98, player_infos[1][1]);
		this.objs.push(hand[1]);
		for(var i=0; i<hand.length; i++){
			(function(i){
				hand[i].elm.onmouseover = function(){
					dragon_id = player_infos[i][1];
				}
				hand[i].elm.onmouseout = function(){
					dragon_id = null;
				}			
			})(i);
		}
	}
	scene_tag[tag].onEnd = function(){
		for(var i=this.objs.length-1; i>=0; i--){
			if(this.objs[i].elm){
				var elm = this.objs[i].elm;
				elm.parentNode.removeChild(elm);
			}
		}
		this.objs = null;
		document.onkeyup = null;
	}
	scene_tag[tag].onDraw = function(ctx){
		template.game_base(ctx, dragon_id, "契約フェイズ");

		//数字指定フェイズのみhandWindowを呼ぶ
		ctx.drawImage(template.handWindow(),0,370)

		if(choosed_finger != null){
			var x = 30;
			for(var i=0; i<6; i++){
				var hand_w = [646, 646, 677, 677, 783, 1012]
				if(choosed_finger == i){
					ctx.strokeStyle = "rgba(255, 255, 255, 1)"
					ctx.lineWidth = 3;
					ctx.strokeRect(x, 375, hand_w[i]/12, 100);
				}
				x += hand_w[i]/12 + ((i == 4)? 10 : 20);
			}
		}

		for(var i=this.objs.length-1; i>=0; i--){
			this.objs[i].onDraw(ctx);
		}
	}
})();

(function(){
	var tag = 'game_damage'
	var dragon_id = null;
	scene_tag[tag] = {}
	scene_tag[tag].onStart = function(){
		this.objs = [];
		var button = compo.makeButton(400, 100, 100, 50, 'ドラゴンへ');
		this.objs.push(button);
		var result = compo.makeButton(400, 160, 100, 50, 'リザルトへ');
		this.objs.push(result);

		//決定ボタン押したら
		button.elm.onclick = function(){
			Scene.change('game_encountDragon');		
		}
		result.elm.onclick = function(){
			Scene.change('game_result');			
		}

		var player_infos = Data.getPlayerInfos();
		var hand = [];
		hand[0] = compo.makeButton(220, 230, 98, 130, player_infos[0][1]);
		this.objs.push(hand[0]);
		hand[1] = compo.makeButton(30, 70, 130, 98, player_infos[1][1]);
		this.objs.push(hand[1]);
		for(var i=0; i<hand.length; i++){
			(function(i){
				hand[i].elm.onmouseover = function(){
					dragon_id = player_infos[i][1];
				}
				hand[i].elm.onmouseout = function(){
					dragon_id = null;
				}			
			})(i);
		}
	}

	scene_tag[tag].onEnd = function(){
		for(var i=this.objs.length-1; i>=0; i--){
			if(this.objs[i].elm){
				var elm = this.objs[i].elm;
				elm.parentNode.removeChild(elm);
			}
		}
		this.objs = null;
		document.onkeyup = null;
	}
	scene_tag[tag].onDraw = function(ctx){
		template.game_base(ctx, dragon_id, tag);

		for(var i=this.objs.length-1; i>=0; i--){
			this.objs[i].onDraw(ctx);
		}
	}
})();

(function(){
	var tag = 'game_encountDragon'
	var dragon_id = null;
	scene_tag[tag] = {};

	scene_tag[tag].onStart = function(){
		this.objs = [];

		//決定ボタン押したら
		setTimeout(function(){
			Scene.change('game_chooseNumber_performer');			
		},1000)

		var player_infos = Data.getPlayerInfos();
		var hand = [];
		hand[0] = compo.makeButton(220, 230, 98, 130, player_infos[0][1]);
		this.objs.push(hand[0]);
		hand[1] = compo.makeButton(30, 70, 130, 98, player_infos[1][1]);
		this.objs.push(hand[1]);
		for(var i=0; i<hand.length; i++){
			(function(i){
				hand[i].elm.onmouseover = function(){
					dragon_id = player_infos[i][1];
				}
				hand[i].elm.onmouseout = function(){
					dragon_id = null;
				}			
			})(i);
		}
	}

	scene_tag[tag].onEnd = function(){
		for(var i=this.objs.length-1; i>=0; i--){
			if(this.objs[i].elm){
				var elm = this.objs[i].elm;
				elm.parentNode.removeChild(elm);
			}
		}
		this.objs = null;
		document.onkeyup = null;
	}
	scene_tag[tag].onDraw = function(ctx){
		template.game_base(ctx, dragon_id, "契約フェイズ");

		var c = template.waiting("ドラゴンとの接触");
		ctx.drawImage(c, 0, 370)

		for(var i=this.objs.length-1; i>=0; i--){
			this.objs[i].onDraw(ctx);
		}
	}

})();

(function(){
	var tag = 'game_result'
	var dragon_id = null;
	scene_tag[tag] = {}
	
	scene_tag[tag].onStart = function(){
		this.objs = [];
		var button = compo.makeButton(400, 100, 100, 50, '待機完了');
		this.objs.push(button);

		//決定ボタン押したら
		button.elm.onclick = function(){
			var cb = function(data){
				audio.stopBGM();
				Scene.change('lobby_choose');
			}
			api['POST']['game/ok'](cb);
		}

		var player_infos = Data.getPlayerInfos();
		var hand = [];
		hand[0] = compo.makeButton(220, 230, 98, 130, player_infos[0][1]);
		this.objs.push(hand[0]);
		hand[1] = compo.makeButton(30, 70, 130, 98, player_infos[1][1]);
		this.objs.push(hand[1]);
		for(var i=0; i<hand.length; i++){
			(function(i){
				hand[i].elm.onmouseover = function(){
					dragon_id = player_infos[i][1];
				}
				hand[i].elm.onmouseout = function(){
					dragon_id = null;
				}			
			})(i);
		}
	}

	scene_tag[tag].onEnd = function(){
		for(var i=this.objs.length-1; i>=0; i--){
			if(this.objs[i].elm){
				var elm = this.objs[i].elm;
				elm.parentNode.removeChild(elm);
			}
		}
		this.objs = null;
		document.onkeyup = null;
	}
	scene_tag[tag].onDraw = function(ctx){
		template.game_base(ctx, dragon_id, "ゲームの終了");

		for(var i=this.objs.length-1; i>=0; i--){
			this.objs[i].onDraw(ctx);
		}
	}
})();

(function(){
	var tag = 'game_waituser_audience'
	var dragon_id = null;
	var update_timer;
	scene_tag[tag] = {}

	scene_tag[tag].onStart = function(){
		this.objs = [];
		var exit = compo.makeButton(400, 160, 100, 50, '退室');
		this.objs.push(exit);

		//通信待機
		update_timer = setInterval(function(){
			var cb = function(data){
				Data.room = data;
				if(Data.room != "WaitingForPlayers"){
					if(update_timer){
						clearInterval(update_timer);
						update_timer = null;
						audio.playSE("se/ゲーム開始音/se_maoudamashii_system49.mp3")
						audio.playBGM("bgm/BGM候補/game_maoudamashii_5_castle04.mp3")
						Scene.change('game_encountDragon');						
					}
				}
			}
			api['GET']['room'](cb);
		}, 1000)
		exit.elm.onclick = function(){
			var cb = function(data){
				if(update_timer){
					clearInterval(update_timer);
					update_timer = null;
					audio.playSE("se/キャンセル/se_maoudamashii_system19.mp3");
					Scene.change('lobby_choose');
				}
			}
			api['POST']['rooms/seats/leave'](cb);
		}

		var player_infos = Data.getPlayerInfos();
		var hand = [];
		hand[0] = compo.makeButton(220, 230, 98, 130, player_infos[0][1]);
		this.objs.push(hand[0]);
		hand[1] = compo.makeButton(30, 70, 130, 98, player_infos[1][1]);
		this.objs.push(hand[1]);
		for(var i=0; i<hand.length; i++){
			(function(i){
				hand[i].elm.onmouseover = function(){
					dragon_id = player_infos[i][1];
				}
				hand[i].elm.onmouseout = function(){
					dragon_id = null;
				}			
			})(i);
		}
	}

	scene_tag[tag].onEnd = function(){
		for(var i=this.objs.length-1; i>=0; i--){
			if(this.objs[i].elm){
				var elm = this.objs[i].elm;
				elm.parentNode.removeChild(elm);
			}
		}
		this.objs = null;
		document.onkeyup = null;
		clearInterval(update_timer);
	}
	scene_tag[tag].onDraw = function(ctx){
		template.game_base(ctx, dragon_id, "ゲームの準備");

		var c = template.waiting("対戦相手が現れるのを待っています");
		ctx.drawImage(c, 0, 370)

		for(var i=this.objs.length-1; i>=0; i--){
			this.objs[i].onDraw(ctx);
		}
	}
})();

(function(){
	var tag = 'game_waituser_performer'
	var dragon_id = null;
	scene_tag[tag] = {}

	scene_tag[tag].onStart = function(){
		this.objs = [];
		var button = compo.makeButton(350, 400, 100, 50, '待機完了');
		this.objs.push(button);
		var exit = compo.makeButton(500, 400, 100, 50, '退室');
		this.objs.push(exit);

		//決定ボタン押したら
		button.elm.onclick = function(){
			var cb = function(data){
				Data.room = data;
				audio.playSE("se/ゲーム開始音/se_maoudamashii_system49.mp3")
				audio.playBGM("bgm/BGM候補/game_maoudamashii_5_castle04.mp3")
				Scene.change('game_encountDragon');
			}
			api['GET']['room'](cb);
		}
		exit.elm.onclick = function(){
			var cb = function(data){
				Data.room = data;
				audio.playSE("se/キャンセル/se_maoudamashii_system19.mp3");
				Scene.change('lobby_choose');
			}
			api['POST']['rooms/seats/leave'](cb);
		}

		var player_infos = Data.getPlayerInfos();
		var hand = [];
		hand[0] = compo.makeButton(220, 230, 98, 130, player_infos[0][1]);
		this.objs.push(hand[0]);
		hand[1] = compo.makeButton(30, 70, 130, 98, player_infos[1][1]);
		this.objs.push(hand[1]);
		for(var i=0; i<hand.length; i++){
			(function(i){
				hand[i].elm.onmouseover = function(){
					dragon_id = player_infos[i][1];
				}
				hand[i].elm.onmouseout = function(){
					dragon_id = null;
				}			
			})(i);
		}
	}

	scene_tag[tag].onEnd = function(){
		for(var i=this.objs.length-1; i>=0; i--){
			if(this.objs[i].elm){
				var elm = this.objs[i].elm;
				elm.parentNode.removeChild(elm);
			}
		}
		this.objs = null;
		document.onkeyup = null;
	}
	scene_tag[tag].onDraw = function(ctx){
		template.game_base(ctx, dragon_id, "ゲームの準備");

		for(var i=this.objs.length-1; i>=0; i--){
			this.objs[i].onDraw(ctx);
		}
	}
})();

(function(){
	var tag = 'game_whodoneit_audience'
	var update_timer;
	var dragon_id = null;
	scene_tag[tag] = {}

	scene_tag[tag].onStart = function(){
		this.objs = [];
		update_timer = setInterval(function(){
			var cb = function(data){
				Data.room = data;
				if(Data.room != "PlayingGame_WaitingForDragonName"){
					if(update_timer){
						clearInterval(update_timer);
						update_timer = null;
						Scene.change('game_battle')
					}
				}
			}
			api['GET']['room'](cb);
		}, 1000)

		var player_infos = Data.getPlayerInfos();
		var hand = [];
		hand[0] = compo.makeButton(220, 230, 98, 130, player_infos[0][1]);
		this.objs.push(hand[0]);
		hand[1] = compo.makeButton(30, 70, 130, 98, player_infos[1][1]);
		this.objs.push(hand[1]);
		for(var i=0; i<hand.length; i++){
			(function(i){
				hand[i].elm.onmouseover = function(){
					dragon_id = player_infos[i][1];
				}
				hand[i].elm.onmouseout = function(){
					dragon_id = null;
				}			
			})(i);
		}
	}

	scene_tag[tag].onEnd = function(){
		for(var i=this.objs.length-1; i>=0; i--){
			if(this.objs[i].elm){
				var elm = this.objs[i].elm;
				elm.parentNode.removeChild(elm);
			}
		}
		this.objs = null;
		document.onkeyup = null;
		clearTimeout(update_timer);
	}
	scene_tag[tag].onDraw = function(ctx){
		template.game_base(ctx, dragon_id, "推理フェイズ");

		var c = template.waiting("対戦相手が考えています");
		ctx.drawImage(c, 0, 370)
	}
})();

(function(){
	var tag = 'game_whodoneit_performer'
	var choosed_dragon = null;
	var dragon_id = null;
	scene_tag[tag] = {}
	scene_tag[tag].onStart = function(){
		choosed_dragon = null;
		this.objs = [];
		var dragon = [];

		var x = 30;
		var w = 70;
		for(var i=0;i<6;i++){
			dragon[i] = compo.makeButton(x, 375, w, 100, Data.dragons[i].name);
			this.objs.push(dragon[i]);
			x += w + 10;
		}
		var button = compo.makeButton(x+8, 420, 115, 52, 'OK');
		this.objs.push(button);

		var player_infos = Data.getPlayerInfos();
		var hand = [];
		hand[0] = compo.makeButton(220, 230, 98, 130, player_infos[0][1]);
		this.objs.push(hand[0]);
		hand[1] = compo.makeButton(30, 70, 130, 98, player_infos[1][1]);
		this.objs.push(hand[1]);
		for(var i=0; i<hand.length; i++){
			(function(i){
				hand[i].elm.onmouseover = function(){
					dragon_id = player_infos[i][1];
				}
				hand[i].elm.onmouseout = function(){
					dragon_id = null;
				}			
			})(i);
		}

		for(var i=0; i<6; i++){
			(function(i){
				dragon[i].elm.onclick = function(){
					audio.playSE("se/決定音候補/se_maoudamashii_system40.mp3");
					choosed_dragon = Data.dragons[i].id;
				}
				dragon[i].elm.onmouseover = function(){
					dragon_id = i;
				}
				dragon[i].elm.onmouseout = function(){
					dragon_id = null;
				}
			})(i)
		}
		//決定ボタン押したら
		button.elm.onclick = function(){
			if(choosed_dragon == null){
				audio.playSE("se/キャンセル/se_maoudamashii_system19.mp3");
				return 
			}
			audio.playSE("se/決定音候補/se_maoudamashii_system40.mp3");
			var cb = function(data){
				Scene.change('game_battle');
			}
			api['POST']['game/name'](choosed_dragon, cb);
		}
	}
	scene_tag[tag].onEnd = function(){
		for(var i=this.objs.length-1; i>=0; i--){
			if(this.objs[i].elm){
				var elm = this.objs[i].elm;
				elm.parentNode.removeChild(elm);
			}
		}
		this.objs = null;
		document.onkeyup = null;
	}
	scene_tag[tag].onDraw = function(ctx){
		template.game_base(ctx, dragon_id, "推理フェイズ")

		//推理フェイズのみdragonWindowを呼ぶ
		ctx.drawImage(template.dragonWindow(),0,370)

		var x = 30;
		var w = 70;
		for(var i=0; i<6; i++){
			if(choosed_dragon == i){
				ctx.strokeStyle = "rgba(255, 255, 255, 1)"
				ctx.lineWidth = 3;
				ctx.strokeRect(x, 375, w, 100);
			}
			x += w + 10;
		}

	}
})();

(function(){
	var tag = 'lobby_choose'
	scene_tag[tag] = {}
	scene_tag[tag].onStart = function(){
		this.objs = [];
		var makeroom = compo.makeButton(160, 40, 200, 70, '部屋作');
		this.objs.push(makeroom);
		this.room = [];
		for(var i=0; i<4; i++){
			this.room[i] = compo.makeButton(70, 118+i*85, 500, 80, '部屋'+i);
			this.objs.push(this.room[i]);
		}

		makeroom.elm.onclick = function(){
			audio.playSE("se/決定音候補/se_maoudamashii_system40.mp3");
			Scene.change('lobby_make');
		}
		for(var i=0; i<this.room.length; i++){
			(function(i, room){
				if(!Data.rooms[i]){return}
				room[i].elm.onclick = function(){
					audio.playSE("se/決定音候補/se_maoudamashii_system40.mp3");
					var cb = function(data){
						Data.room = data;
						Scene.change('game_waituser_audience');
					}
					var room_id = Data.rooms[i].id;
					api['POST']['rooms/seats/take'](room_id, cb);
				}
			})(i, this.room);
		}
	}
	scene_tag[tag].onEnd = function(){
		for(var i=this.objs.length-1; i>=0; i--){
			if(this.objs[i].elm){
				var elm = this.objs[i].elm;
				elm.parentNode.removeChild(elm);
			}
		}
		this.objs = null;
		document.onkeyup = null;
	}
	scene_tag[tag].onDraw = function(ctx){
		ctx.fillStyle = "rgba(30, 0, 0, 1)"
		ctx.fillRect(0,0,640,480);

		var c = template['lobby'](ctx, Data.rooms, Data.user);
		ctx.drawImage(c, 0, 0);

		for(var i=this.objs.length-1; i>=0; i--){
			this.objs[i].onDraw(ctx);
		}
	}

	scene_tag[tag].onStep = function(){
	}

})();

(function(){
	var tag = 'lobby_make'
	scene_tag[tag] = {}
	scene_tag[tag].onStart = function(){
		console.log('hoge')
		this.objs = [];
		var textbox = compo.makeTextbox(223, 205, 250, 30);
		this.objs.push(textbox);
		var ok = compo.makeButton(160, 290, 150, 25, 'この設定で部屋作る');
		this.objs.push(ok);
		var cancel = compo.makeButton(330, 290, 150, 25, 'この設定で部屋作る');
		this.objs.push(cancel);

		ok.elm.onclick = function(){
			audio.playSE("se/決定音候補/se_maoudamashii_system40.mp3");
			api['POST']['rooms'](textbox.elm.value+"国", function(data){
				Data.room = data;
				Scene.change('game_waituser_performer');
			})
		}
		cancel.elm.onclick = function(){
			audio.playSE("se/キャンセル/se_maoudamashii_system19.mp3");
			Scene.change('lobby_choose');
		}
	}
	scene_tag[tag].onEnd = function(){
		for(var i=this.objs.length-1; i>=0; i--){
			if(this.objs[i].elm){
				var elm = this.objs[i].elm;
				elm.parentNode.removeChild(elm);
			}
		}
		this.objs = null;
		document.onkeyup = null;
	}
	scene_tag[tag].onDraw = function(ctx){
		ctx.fillStyle = "rgba(30, 0, 0, 1)"
		ctx.fillRect(0,0,640,480);

		var c = template['lobby'](ctx, Data.rooms, Data.user);
		ctx.drawImage(c, 0, 0);

		c = template['makeroom_popup']();
		ctx.drawImage(c, 120, 180);

		for(var i=this.objs.length-1; i>=0; i--){
			this.objs[i].onDraw(ctx);
		}
	}
})();

(function(){
	var tag = 'login'
	scene_tag[tag] = {}
	scene_tag[tag].onStart = function(){
		this.objs = [];
		var textbox = compo.makeTextbox(135, 327, 240, 50);
		this.objs.push(textbox);
		var button = compo.makeButton(420, 305, 120, 100, '国名決定');
		this.objs.push(button);

		//決定ボタン押したら
		button.elm.onclick = function(){
			audio.playSE("se/決定音候補/se_maoudamashii_system40.mp3");
			var cb = function(data){
				Data.user = data;
				Scene.change('lobby_choose');
			}
			api['POST']['users'](textbox.elm.value + '国', cb);
		}
	}
	scene_tag[tag].onEnd = function(){
		for(var i=this.objs.length-1; i>=0; i--){
			if(this.objs[i].elm){
				var elm = this.objs[i].elm;
				elm.parentNode.removeChild(elm);
			}
		}
		this.objs = null;
		document.onkeyup = null;
	}
	var text = {}
	scene_tag[tag].onDraw = function(ctx){
		var image = img.get('img/背景/title_bg.png')
		ctx.drawImage(image, 0, 0)
		// ctx.drawImage(image, Math.random()*10|0-5, Math.random()*10|0-5);

		var image = img.get('img/背景/title_form2.png')
		ctx.drawImage(image, 133, 308);

		for(var i=this.objs.length-1; i>=0; i--){
			this.objs[i].onDraw(ctx);
		}
	}
})();