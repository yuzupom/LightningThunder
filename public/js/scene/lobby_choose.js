(function(){
	var tag = 'lobby_choose'
	scene_tag[tag] = {}
	scene_tag[tag].onStart = function(){
		this.objs = [];
		var makeroom = compo.makeButton(160, 40, 200, 70, '部屋作');
		this.objs.push(makeroom);
		this.room = [];
		for(var i=0; i<4; i++){
			this.room[i] = compo.makeButton(70, 118+i*85, 500, 80, '部屋'+i);
			this.objs.push(this.room[i]);
		}

		makeroom.elm.onclick = function(){
			audio.playSE("se/決定音候補/se_maoudamashii_system40.mp3");
			Scene.change('lobby_make');
		}
		for(var i=0; i<this.room.length; i++){
			(function(i, room){
				if(!Data.rooms[i]){return}
				room[i].elm.onclick = function(){
					audio.playSE("se/決定音候補/se_maoudamashii_system40.mp3");
					var cb = function(data){
						Data.room = data;
						Scene.change('game_waituser_audience');
					}
					var room_id = Data.rooms[i].id;
					api['POST']['rooms/seats/take'](room_id, cb);
				}
			})(i, this.room);
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

		for(var i=this.objs.length-1; i>=0; i--){
			this.objs[i].onDraw(ctx);
		}
	}

	scene_tag[tag].onStep = function(){
	}

})();
