require(['js/scene.js','js/compo.js','js/xhr.js','js/data.js'],function(){
	var tag = 'login'
	scene_tag[tag] = {}
	scene_tag[tag].onStart = function(){
		this.objs = [];
		var textbox = compo.makeTextbox(100, 100, 200, 50);
		this.objs.push(textbox);
		var button = compo.makeButton(500, 100, 100, 50, '国名決定');
		this.objs.push(button);

		//決定ボタン押したら
		button.elm.onclick = function(){
			var data = {
				"id": 1,
				"display_name": "小柳の国",
				"seated_room_id": null,
				"win_count": 0,
				"lose_count": 0,
				"created_at": "2015-04-12T08:43:50.658Z",
				"updated_at": "2015-04-12T08:43:50.667Z",
				"ai_id": null,
			}
			var cb = function(json){
				Data.user = json;
				Scene.change('lobby_choose');
			}
			dummy_xhr(data, cb)
			/*
			xhr('POST', '/users?user[display_name]='+textbox.elm.value+'国', cb)
			*/
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

