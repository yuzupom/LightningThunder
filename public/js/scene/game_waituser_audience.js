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