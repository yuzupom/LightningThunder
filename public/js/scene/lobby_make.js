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

