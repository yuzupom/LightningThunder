require(['js/scene.js','js/compo.js'],function(){
	var tag = 'game_whodoneit_performer'
	var base_url = 'https://lightning-thunder.herokuapp.com/api/v1'
	scene_tag[tag] = {}
	scene_tag[tag].onStart = function(){
		this.objs = [];
		var dragon = [];
		dragon[0] = compo.makeButton(300, 160, 100, 50, 'ドラゴン①');
		this.objs.push(dragon[0]);
		dragon[1] = compo.makeButton(300, 220, 100, 50, 'ドラゴン②');
		this.objs.push(dragon[1]);
		dragon[2] = compo.makeButton(300, 280, 100, 50, 'ドラゴン③');
		this.objs.push(dragon[2]);
		dragon[3] = compo.makeButton(450, 160, 100, 50, 'ドラゴン④');
		this.objs.push(dragon[3]);
		dragon[4] = compo.makeButton(450, 220, 100, 50, 'ドラゴン⑤');
		this.objs.push(dragon[4]);
		dragon[5] = compo.makeButton(450, 280, 100, 50, 'ドラゴン⑥');
		this.objs.push(dragon[5]);
		var button = compo.makeButton(400, 100, 100, 50, 'ドラゴン選んだ');
		this.objs.push(button);

		//決定ボタン押したら
		button.elm.onclick = function(){
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

