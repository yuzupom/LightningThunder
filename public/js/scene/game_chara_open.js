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