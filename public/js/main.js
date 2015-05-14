function start(){
	var scene_dir = 'js/scene/'
	require(["game.js"], function(){
		var imgs = [
		  'img/oukan.png',
		  'img/connect.png',
		  'img/背景/lightning.jpg',
		  'img/背景/title_bg.png',
		  'img/背景/title_form.png',
		  'img/背景/title_form2.png',
		  'img/背景/lobby/lt2.jpg',
		  'img/背景/lobby/makeroom.gif',
		  'img/背景/lobby/makeroomom.gif',
		  'img/背景/lobby/random.gif',
		  'img/背景/lobby/randomom.gif',
		  'img/背景/lobby/room.gif',
		  'img/背景/lobby/roomom.gif',
		  'img/背景/lobby/frame.png',
		  'img/背景/lobby/ok.gif',
		  'img/背景/lobby/cancel.gif',
		]
		for (var i = -1; i <= 6; i++){
			imgs.push('img/手/' + i + '.png')
		} 

		for (var i = 0; i < TABLE.DRAGON_NAME.length; i++){
			imgs.push('img/ドラゴン画像/d_'+TABLE.DRAGON_NAME[i]+'.png')
		}
		for (var i = 0; i < TABLE.DRAGON_NAME.length; i++){
			imgs.push('img/カード画像/'+TABLE.DRAGON_NAME[i]+'.png')
		}
		audios = [
			"se/決定音候補/se_maoudamashii_system40.mp3",
			"se/キャンセル/se_maoudamashii_system19.mp3",
			"bgm/BGM候補/game_maoudamashii_5_castle04.mp3",
			"se/ゲーム開始音/se_maoudamashii_system49.mp3",
		]
		Promise.all([
			img.load(imgs),
			audio.load(audios)
		])
		.then(function(){
			main();
			Scene.change('login');
		})
		.catch(function(e){
			console.log(e)
		})
	})
}

	function main(){
		var ctx = document.getElementById('c').getContext('2d');
		Scene.draw(ctx);
		Scene.step();
		setTimeout(main, 20);
	}