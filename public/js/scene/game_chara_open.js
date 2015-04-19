require(['js/scene.js','js/compo.js'],function(){
	var tag = 'game_chara_open'
	var base_url = 'https://lightning-thunder.herokuapp.com/api/v1'
	scene_tag[tag] = {}
	scene_tag[tag].onStart = function(){
		this.objs = [];
		var button1 = compo.makeButton(400, 100, 100, 50, '推理');
		this.objs.push(button1);
		var button2 = compo.makeButton(400, 160, 100, 50, '推理される');
		this.objs.push(button2);
		var button3 = compo.makeButton(400, 220, 100, 50, '誰も推理しない');
		this.objs.push(button3);

		//決定ボタン押したら
		button1.elm.onclick = function(){
			/*
			var xhr = new XMLHttpRequest();
			xhr.open('POST' , base_url+'/users?user[display_name]='+textbox.value);
			xhr.onreadystatechange = function(){
				if (xhr.readyState === 4){
					Data.user = xhr.responseText;
					Scene.change('lobby');
				}
			};
			xhr.setRequestHeader("Content-Type" , "application/x-www-form-urlencoded");
			xhr.send();
			*/
			Scene.change('game_whodoneit_performer');
			Scene.start();
		}
		button2.elm.onclick = function(){
			Scene.change('game_whodoneit_audience');
			Scene.start();
		}
		button3.elm.onclick = function(){
			Scene.change('game_battle');
			Scene.start();
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

		ctx.font = '36px/2 sans-serif';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'top';
		ctx.fillStyle = "rgba(255, 255, 255, 1)"
		ctx.fillText(tag , 0, 0);

		for(var i=this.objs.length-1; i>=0; i--){
			this.objs[i].onDraw(ctx);
		}
	}
})

