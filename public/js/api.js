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