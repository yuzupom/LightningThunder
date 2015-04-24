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
	scene_tag[tag].onDraw = function(ctx){
		ctx.fillStyle = "rgba(30, 0, 0, 1)"
		ctx.fillRect(0,0,640,480);
		ctx.setTransform(1, 0, 0, 1, 200, 250)
		ctx.drawImage(statusWindow('デフォルト国①','akonitam',4),0, 0)
		ctx.setTransform(0, 1, -1, 0, 150, 100)
		ctx.drawImage(statusWindow('デフォルト国②','akonitam',4),0, 0)
		ctx.setTransform(-1, 0, 0, -1, 400, 150)
		ctx.drawImage(statusWindow('デフォルト国③','akonitam',4),0, 0)
		ctx.setTransform(1, 0, 0, 1, 0, 0)

		ctx.font = '36px/2 sans-serif';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'top';
		ctx.fillStyle = "rgba(255, 255, 255, 1)"
		ctx.fillText(tag , 0, 0);

		for(var i=this.objs.length-1; i>=0; i--){
			this.objs[i].onDraw(ctx);
		}
	}
	function statusWindow(user_name, dragon_name, life){
		var c = document.createElement('canvas');

		//サイズ設定
		c.width = 200;
		c.height = 100;
		var ctx = c.getContext('2d');
		ctx.fillStyle = "rgba(250, 0, 0, 1)"
		ctx.fillRect(0,0,640,480);

		//ドラゴンの画像を表示する
		//index.html内で,画像を既にロードしてます。使いたい画像はindex.htmlで読み込んどいてください。
		ctx.drawImage(img.get('img/ドラゴン画像/d_'+dragon_name+'.png'),0,0,100,100)

		//ライフの数だけ王冠表示する
		for(var i=0;i<life;i++){
			ctx.drawImage(img.get('img/oukan.png'), 100+(i*25), 0, 20, 20)
		}

		//国の名前を表示する
		ctx.font = '18px/2 sans-serif';
		ctx.textAlign = 'left';
		ctx.textBaseline = 'top';
		ctx.fillStyle = "rgba(255, 255, 255, 1)"
		ctx.fillText(user_name , 0, 0);
		return c;
	}
})

