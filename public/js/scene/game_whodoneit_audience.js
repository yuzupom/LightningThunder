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