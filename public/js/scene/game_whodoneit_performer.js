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
