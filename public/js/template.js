var template = {};
(function(){
	template["lobby"] = function(ctx, rooms, user){
		var c = document.createElement('canvas');
		var ctx = c.getContext('2d')
		c.width = 640;
		c.height = 480;

		ctx.fillStyle = "rgba(30, 0, 0, 1)"
		ctx.fillRect(0,0,640,480);

		var image = img.get('img/背景/lobby/lt2.jpg')
		ctx.drawImage(image, 0, 0, 640, 480);

		var image = img.get('img/背景/lobby/makeroom.gif')
		ctx.drawImage(image, 160, 40);

		var image = img.get('img/背景/lobby/random.gif')
		ctx.drawImage(image, 368, 40);

		ctx.font = '36px/2 sans-serif';
		ctx.textBaseline = 'middle';
		ctx.fillStyle = "rgba(255, 255, 255, 1)"
		ctx.font = '28px/2 sans-serif';

		var i = 0;
		for(var j=0; j<rooms.length; j++){
			if(!rooms[j]){continue}
			if(rooms[j].room_status_name != "WaitingForPlayers"){continue}
			var image = img.get('img/背景/lobby/room.gif')
			ctx.drawImage(image, 70, 118+(i*85));
			ctx.textAlign = 'left';
			ctx.fillText(rooms[j].name, 90, 156+(i*85));
			ctx.textAlign = 'right';
			ctx.fillText(rooms[j].seated_users.length+'/4', 550, 156+(i*85));
			i++;
		}

		ctx.font = '28px/2 sans-serif';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'top';
		ctx.fillText(user.display_name +'  '+ user.win_count + '勝', 0, 0);
		return c;
	}

	template['makeroom_popup'] = function(){
		var c = document.createElement('canvas');
		var ctx = c.getContext('2d')
		c.width = 400;
		c.height = 150;

		var ctx = c.getContext('2d')
		var image = img.get('img/背景/lobby/frame.png')
		ctx.drawImage(image, 0, 0);
		var image = img.get('img/背景/lobby/ok.gif')
		ctx.drawImage(image, 40, 110);
		var image = img.get('img/背景/lobby/cancel.gif')
		ctx.drawImage(image, 210, 110);

		ctx.fillStyle = "rgba(25, 15, 15, 1)"
		ctx.font = '18px/2 sans-serif';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'top';
		ctx.fillText('部屋名', 30, 30);

		ctx.strokeStyle = "rgba(0, 0, 0, 1)"
		ctx.strokeRect(103, 25, 250, 30);
		ctx.fillStyle = "rgba(255, 255, 255, 1)"
		ctx.fillRect(103, 25, 250, 30);
		return  c;
	}


	template.game_base = function(ctx, dragon_id, tag){
		template.game_bg(ctx);

		var player_infos = Data.getPlayerInfos();

		var c = template.drawFourStatusWindow(player_infos)
		ctx.drawImage(c, 0, 0)

		//カード詳細ポップアップ
		if(dragon_id != null){
			ctx.drawImage(template.dragonDetail(dragon_id),640-269,0);		
		}

		ctx.fillStyle = "rgba(10, 10, 10, 0.75)"
		ctx.fillRect(0, 370, 640, 110);

		var c = template.scene_name(tag);
		ctx.drawImage(c, 0, 0)

	}
	//player_info = [userName, dragonName, life, hand]
	template.drawFourStatusWindow = function(player_infos){
		var c = document.createElement('canvas');
		c.width = 640;
		c.height = 480;
		var ctx = c.getContext('2d');
		var TRANSFORM_INFO =　[
			[1, 0, 0, 1, 220, 210],
			[0, 1, -1, 0, 180, 70],
			[-1, 0, 0, -1, 420, 170],
			[0, -1, 1, 0, 460, 270]
		]
		for (var i = 0; i < 4; i++){
			ctx.setTransform.apply(ctx,TRANSFORM_INFO[i])
			ctx.drawImage(statusWindow(player_infos[i][0],player_infos[i][1],player_infos[i][2],player_infos[i][3]),0,0)
		}
		ctx.setTransform(1, 0, 0, 1, 0, 0)
		return c;
	}

	function statusWindow(user_name, dragon_id, life, hand){
		var c = document.createElement('canvas');
		var ctx = c.getContext('2d');

		//サイズ設定
		c.width = 200;
		c.height = 150;

		ctx.fillStyle = "rgba(10, 10, 10, 0.7)"
		ctx.fillRect(0,0,200,150);

		//ドラゴンの画像を表示する
		//index.html内で,画像を既にロードしてます。使いたい画像はindex.htmlで読み込んどいてください。
		ctx.drawImage(img.get('img/カード画像/'+TABLE.DRAGON_NAME[dragon_id]+'.png'), 1, 20, 95, 130)

		//ライフの数だけ王冠表示する
		for(var i=0;i<life;i++){
			ctx.drawImage(img.get('img/oukan.png'), 100 + (i*25), 125, 20, 20)
		}

		//show hand 
		//if hand == 6, show good mark
		//if hand == -1, dont show anything
		image = img.get('img/手/'+hand+'.png')
		var w = image.width / 10
		var h = image.height / 10
		ctx.drawImage(image, 150 - w/2, 70 - h/2, w, h)

		//国の名前を表示する
		ctx.font = '18px/2 sans-serif';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'top';
		ctx.fillStyle = "rgba(255, 255, 255, 1)"
		ctx.fillText(user_name , 0, 0);
		return c;
	}

	template.game_bg = function(ctx){
		image = img.get('img/背景/lightning.jpg')
		var r =  Math.cos(Date.now() / 10000) + 1;
		var w = 640;
		var h = 480;
		var p = 1/10;
		ctx.drawImage(image, (-w*p/2)*r, (-h*p/2)*r, w + w*p*r, h + h*p*r);
	}

	template.dragonWindow = function(){
		var c = document.createElement('canvas');
		c.width = 640;
		c.height = 110;
		var ctx = c.getContext('2d');

		var x = 30
		var d = 10
		var w = 70
		var h = 100
		for (var i = 0; i < 6;i++){
			image = img.get('img/ドラゴン画像/d_'+TABLE.DRAGON_NAME[i]+'.png')
			ctx.drawImage(image, x, 55 - h/2, w, h)
			x +=  d + w
		}

		image = img.get('img/手/'+ 6 +'.png')
		var w = image.width / 20
		var h = image.height / 20
		ctx.drawImage(image, x+10, 78 - h/2, w, h)
		ctx.font = '36px/2 sans-serif';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'top';
		ctx.fillStyle = "rgba(255, 255, 255, 1)"
		ctx.fillText('OK' , x+10 + w + 10 , 60);
		return c
	}

	template.handWindow = function(){
		var c = document.createElement('canvas');
		c.width = 640;
		c.height = 110;
		var ctx = c.getContext('2d');

		var x = 30
		var d = 20
		for (var i = 0; i < 6;i++){
			image = img.get('img/手/'+ i +'.png')
			var w = image.width / 12
			var h = image.height / 12
			if (i == 5){
				x -= d - 10
			}
			ctx.drawImage(image, x, 55 - h/2, w, h)
			x +=  d + w
		}

		image = img.get('img/手/'+ 6 +'.png')
		var w = image.width / 20
		var h = image.height / 20
		ctx.drawImage(image, x+10, 78 - h/2, w, h)
		ctx.font = '36px/2 sans-serif';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'top';
		ctx.fillStyle = "rgba(255, 255, 255, 1)"
		ctx.fillText('OK' , x+10 + w + 10 , 60);
		return c
	}

	template['scene_name'] = function(scene_name){
		var c = document.createElement('canvas');
		c.width = 640;
		c.height = 110;
		var ctx = c.getContext('2d');

		ctx.font = '16px/2 sans-serif';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'top';
		ctx.fillStyle = "rgba(255, 255, 255, 1)"
		ctx.fillText(scene_name , 8, 8);
		return c;
	}

	template.dragonDetail = function(dragon_id){
		var c = document.createElement('canvas');
		c.width = 269;
		c.height = 370;
		var ctx = c.getContext('2d');

		var dragon_name = TABLE.DRAGON_NAME[dragon_id];
		ctx.drawImage(img.get('img/カード画像/'+dragon_name+'.png'), 0, 0, c.width, c.height)
		return c
	}

	template.waiting = function(message){
		var c = document.createElement('canvas');
		c.width = 640;
		c.height = 110;
		var ctx = c.getContext('2d');

		ctx.font = '18px/2 sans-serif';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'bottom';
		ctx.fillStyle = "rgba(255, 255, 255, 1)"
		var suffix = [
			"",
			".",
			"..",
			"...",			
		]
		ctx.fillText(message+suffix[Date.now()%2000/2000*4|0] , 10, 100);
		return c;		
	}
})();