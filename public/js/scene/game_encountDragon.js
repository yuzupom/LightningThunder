require(['js/scene.js','js/compo.js'],function(){
	var tag = 'game_encountDragon'
	var base_url = 'https://lightning-thunder.herokuapp.com/api/v1'
	scene_tag[tag] = {}
	scene_tag[tag].onStart = function(){
		this.objs = [];
		var button = compo.makeButton(400, 100, 100, 50, '待機完了');
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
			Scene.change('game_chooseNumber_performer');
			
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
	var TRANSFORM_INFO =
	[
		[1, 0, 0, 1, 220, 210],
		[0, 1, -1, 0, 180, 70],
		[-1, 0, 0, -1, 420, 170],
		[0, -1, 1, 0, 460, 270]
	]
	scene_tag[tag].onDraw = function(ctx){
		ctx.fillStyle = "rgba(150, 150, 150, 1)"
		image = img.get('img/背景/lightning.jpg')
		ctx.drawImage(image, 0, 0, 640, 480)

		var player_infos = 
		[
			//user_name,dragon_name,life,hand
			['デフォルト国①','akonitam',4, 0],
			['デフォルト国②','akonitam',3, 4],
			['デフォルト国③','akonitam',4, 5],
			['デフォルト国④','akonitam',4, 3]
		]
		drawFourStatusWindow(ctx, player_infos)

		//推理フェイズのみdragonWindowを呼ぶ
		ctx.drawImage(dragonWindow(),0,370)

		ctx.font = '36px/2 sans-serif';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'top';
		ctx.fillStyle = "rgba(255, 255, 255, 1)"
		ctx.fillText(tag , 0, 0);

		for(var i=this.objs.length-1; i>=0; i--){
			this.objs[i].onDraw(ctx);
		}
	}

	//player_info = [userName, dragonName, life, hand]
	function drawFourStatusWindow(ctx,player_infos){
		for (var i = 0; i < 4; i++){
			ctx.setTransform.apply(ctx,TRANSFORM_INFO[i])
			ctx.drawImage(statusWindow(player_infos[i][0],player_infos[i][1],player_infos[i][2],player_infos[i][3]),0,0)
		}
		ctx.setTransform(1, 0, 0, 1, 0, 0)
	}

	function statusWindow(user_name, dragon_name, life, hand){
		var c = document.createElement('canvas');

		//サイズ設定
		c.width = 200;
		c.height = 150;
		var ctx = c.getContext('2d');
		ctx.fillStyle = "rgba(10, 10, 10, 0.7)"
		ctx.fillRect(0,0,640,480);

		//ドラゴンの画像を表示する
		//index.html内で,画像を既にロードしてます。使いたい画像はindex.htmlで読み込んどいてください。
		ctx.drawImage(img.get('img/ドラゴン画像/d_'+dragon_name+'.png'),0,20,100,100)

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

	function dragonWindow(){
		var c = document.createElement('canvas');
		c.width = 640;
		c.height = 110;
		var ctx = c.getContext('2d');
		ctx.fillStyle = "rgba(10, 10, 10, 0.75)"
		ctx.fillRect(0,0,640,480);

		var x = 30
		var d = 10
		var w = 70
		var h = 100
		for (var i = 0; i < 6;i++){
			image = img.get('img/ドラゴン画像/d_'+DRAGON_NAME_LIST[i]+'.png')
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
	function handWindow(){
		var c = document.createElement('canvas');
		c.width = 640;
		c.height = 110;
		var ctx = c.getContext('2d');
		ctx.fillStyle = "rgba(10, 10, 10, 0.75)"
		ctx.fillRect(0,0,640,480);

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
})

