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

