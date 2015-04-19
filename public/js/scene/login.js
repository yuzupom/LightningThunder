require(['js/scene.js','js/compo.js'],function(){
	var tag = 'login'
	var base_url = 'https://lightning-thunder.herokuapp.com/api/v1'
	scene_tag[tag] = {}
	scene_tag[tag].onStart = function(){
		this.objs = [];
		var textbox = compo.makeTextbox(100, 100, 200, 50);
		this.objs.push(textbox);
		var button = compo.makeButton(500, 100, 100, 50, '国名決定');
		this.objs.push(button);

		//決定ボタン押したら
		button.elm.onclick = function(){
			
			var xhr = new XMLHttpRequest();
			xhr.open('POST' , base_url+'/users?user[display_name]='+textbox.value);
			xhr.onreadystatechange = function(){
				if (xhr.readyState === 4){
					Data.user = JSON.parse(xhr.responseText);
					Scene.change('lobby_choose');
					Scene.start();
				}
			};
			xhr.setRequestHeader("Content-Type" , "application/x-www-form-urlencoded");
			xhr.send();
			
			// Scene.change('lobby_choose');
			// Scene.start();
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

