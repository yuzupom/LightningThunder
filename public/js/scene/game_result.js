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
})();