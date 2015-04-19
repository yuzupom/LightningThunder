require(['js/scene.js','js/compo.js'],function(){
	var tag = 'lobby_choose'
	var base_url = 'https://lightning-thunder.herokuapp.com/api/v1'
	scene_tag[tag] = {}
	scene_tag[tag].onStart = function(){
		this.objs = [];
		var makeroom = compo.makeButton(400, 100, 100, 50, '部屋作');
		this.objs.push(makeroom);
		this.room = [];
		this.room[0] = compo.makeButton(300, 160, 100, 50, '部屋①');
		this.objs.push(this.room[0]);
		this.room[1] = compo.makeButton(300, 220, 100, 50, '部屋②');
		this.objs.push(this.room[1]);
		this.room[2] = compo.makeButton(300, 280, 100, 50, '部屋③');
		this.objs.push(this.room[2]);
		this.room[3] = compo.makeButton(300, 340, 100, 50, '部屋④');
		this.objs.push(this.room[3]);

		makeroom.elm.onclick = function(){
			Scene.change('lobby_make');
			
		}
		for(var i=0; i<this.room.length; i++){
			this.room[i].elm.onclick = function(){
				Scene.change('game_waituser_audience');
				
			}
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

	scene_tag[tag].onStep = function(){
	}

})

