(function(){
	var tag = 'game_battle'
	var dragon_id = null;
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
})();(function(){
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
				if(Data.room.room_status_name != "WaitingForPlayers"){
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
})();(function(){
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
				console.log(Data.room.room_status_name);
				if(Data.room.room_status_name == "PlayingGame_WaitingForDragonName"){
					if(update_timer){
						clearInterval(update_timer);
						update_timer = null;
						audio.playSE("se/決定音候補/se_maoudamashii_system40.mp3");
						player_infos = Data.getPlayerInfos();
						if(player_infos[0][1] == 0){
							Scene.change('game_whodoneit_performer');
						}
						else{
							Scene.change('game_whodoneit_audience');			
						}
					}
				}
				if(Data.room.room_status_name == "PlayingGame_WaitingForOK" ||
					Data.room.room_status_name == "EndingGame"){
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
})();(function(){
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
			api['POST']['game/start'](cb);
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
})();(function(){
	var tag = 'game_chooseNumber_audience'
	var dragon_id = null;
	scene_tag[tag] = {}
	scene_tag[tag].onStart = function(){
		this.objs = [];

		update_timer = setInterval(function(){
			var cb = function(data){
				Data.room = data;
				if(Data.room.room_status_name != "PlayingGame_WaitingForLightning"){
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
})();(function(){
	var tag = 'game_whodoneit_audience'
	var update_timer;
	var dragon_id = null;
	scene_tag[tag] = {}

	scene_tag[tag].onStart = function(){
		this.objs = [];
		update_timer = setInterval(function(){
			var cb = function(data){
				Data.room = data;
				if(Data.room.room_status_name != "PlayingGame_WaitingForDragonName"){
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
})();(function(){
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
})();(function(){
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
	var tag = 'game_damage'
	var dragon_id = null;
	scene_tag[tag] = {}
	scene_tag[tag].onStart = function(){
		this.objs = [];
		if(Data.room.room_status_name == "PlayingGame_WaitingForOK"){
			var button = compo.makeButton(400, 100, 100, 50, 'ドラゴンへ');
			this.objs.push(button);
			//決定ボタン押したら
			button.elm.onclick = function(){
				var cb = function(data){
					var cb = function(data){
						Data.room = data;
						Scene.change('game_encountDragon');
					}
					api['GET']['room'](cb);
				}
				api['POST']['game/ok'](cb);
			}
		}
		if(Data.room.room_status_name == "EndingGame"){
			var result = compo.makeButton(400, 160, 100, 50, 'リザルトへ');
			this.objs.push(result);
			result.elm.onclick = function(){
				Scene.change('game_result');			
			}
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
})();(function(){
	var tag = 'lobby_choose'
	scene_tag[tag] = {}
	scene_tag[tag].onStart = function(){
		this.objs = [];
		var makeroom = compo.makeButton(160, 40, 200, 70, '部屋作');
		this.objs.push(makeroom);
		this.rooms = [];
		for(var i=0; i<4; i++){
			this.rooms[i] = compo.makeButton(70, 118+i*85, 500, 80, '部屋'+i);
			this.objs.push(this.rooms[i]);
		}

		makeroom.elm.onclick = function(){
			audio.playSE("se/決定音候補/se_maoudamashii_system40.mp3");
			Scene.change('lobby_make');
		}

		//通信待機
		update_timer = setInterval(function(){
			var cb = function(data){
				if(update_timer){
					Data.rooms = data;
				}
			}
			api['GET']['rooms'](cb);
		}, 1000)		

		var i = 0;
		for(var j=0; j<Data.rooms.length; j++){
			if(!Data.rooms[j]){continue}
			if(Data.rooms[j].room_status_name != "WaitingForPlayers"){continue}
			(function(i, j, rooms_elm){
				rooms_elm[i].elm.onclick = function(){
					audio.playSE("se/決定音候補/se_maoudamashii_system40.mp3");
					var cb = function(data){
						Data.room = data;
						clearInterval(update_timer);
						update_timer = null;
						Scene.change('game_waituser_audience');
					}
					var room_id = Data.rooms[j].detail.id;
					api['POST']['rooms/seats/take'](room_id, cb);
				}
			})(i, j, this.rooms);
			i++;
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

})();(function(){
	var tag = 'lobby_make'
	scene_tag[tag] = {}
	scene_tag[tag].onStart = function(){
		this.objs = [];
		var textbox = compo.makeTextbox(223, 205, 250, 30);
		this.objs.push(textbox);
		var ok = compo.makeButton(160, 290, 150, 25, 'この設定で部屋作る');
		this.objs.push(ok);
		var cancel = compo.makeButton(330, 290, 150, 25, 'この設定で部屋作る');
		this.objs.push(cancel);

		ok.elm.onclick = function(){
			audio.playSE("se/決定音候補/se_maoudamashii_system40.mp3");
			api['POST']['rooms'](textbox.elm.value, function(data){
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
		template.game_base(ctx, dragon_id, "ゲームの終了");

		for(var i=this.objs.length-1; i>=0; i--){
			this.objs[i].onDraw(ctx);
		}
	}
})();(function(){
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
			api['POST']['rooms/seats/leave']();			
			audio.playSE("se/決定音候補/se_maoudamashii_system40.mp3");
			var cb = function(data){
				Data.user = data;
				var cb = function(data){
					Data.rooms = data;
					Scene.change('lobby_choose');
				}
				api['GET']['rooms'](cb);
			}
			if(textbox.elm.value != ''){
				api['POST']['users'](textbox.elm.value + '国', cb);
			}
			else{
				api['POST']['users']('', cb);			
			}
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

