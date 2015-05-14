(function(){
	var tag = 'lobby_choose'
	scene_tag[tag] = {}
	scene_tag[tag].onStart = function(){
		this.objs = [];
		var makeroom = compo.makeButton(160, 40, 200, 70, '部屋作');
		this.objs.push(makeroom);
		this.rooms = [];
		for(var i=0; i<4; i++){
			this.rooms[i] = compo.makeButton(70, 118+i*85, 500, 80, '部屋'+i);
			this.objs.push(this.rooms[i]);
		}

		makeroom.elm.onclick = function(){
			audio.playSE("se/決定音候補/se_maoudamashii_system40.mp3");
			Scene.change('lobby_make');
		}

		//通信待機
		update_timer = setInterval(function(){
			var cb = function(data){
				if(update_timer){
					Data.rooms = data;
				}
			}
			api['GET']['rooms'](cb);
		}, 1000)		

		var i = 0;
		for(var j=0; j<Data.rooms.length; j++){
			if(!Data.rooms[j]){continue}
			if(Data.rooms[j].room_status_name != "WaitingForPlayers"){continue}
			(function(i, j, rooms_elm){
				rooms_elm[i].elm.onclick = function(){
					audio.playSE("se/決定音候補/se_maoudamashii_system40.mp3");
					var cb = function(data){
						Data.room = data;
						clearInterval(update_timer);
						update_timer = null;
						Scene.change('game_waituser_audience');
					}
					var room_id = Data.rooms[j].detail.id;
					api['POST']['rooms/seats/take'](room_id, cb);
				}
			})(i, j, this.rooms);
			i++;
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
