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