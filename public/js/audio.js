var audio = {};
(function(){
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    var context = new AudioContext();
    var S = {};

	audio.playSE = function(filename){
		var buffer = S[filename]
		var source = context.createBufferSource();
		source.buffer = buffer;
		source.connect(context.destination);
		var now = context.currentTime;
		source.start(now+0);
	};

	(function(){
		var source;
		audio.playBGM = function(filename){
			var buffer = S[filename]
			console.log(buffer);
			source = context.createBufferSource();
			source.buffer = buffer;
			source.loop = true;
			source.connect(context.destination);
			var now = context.currentTime;
			source.start(now+0);
		};
		audio.stopBGM = function(){
			source.stop(0);
		};
	})();

	audio.load = function(filename, cb_progress){
		filename = (filename instanceof Array) ? filename : [filename];
		var all = [];
		for(var i=0; i<filename.length; i++){
			all.push(loadSound(filename[i])
				.then(function(value){
					return (cb_progress instanceof Function) ? cb_progress(value) : value
				})
				.catch(function(error){
					return Promise.reject(error);
				})
			);
		}
		return Promise.all(all);
	}
	function loadSound(filename){
		if(S[filename]){return Promise.resolve(filename) }
		return new Promise(function(resolve, reject){
			var request = new XMLHttpRequest();
			request.open('GET', filename, true);
			request.responseType = 'arraybuffer';

			// Decode asynchronously
			request.onload = function() {
				context.decodeAudioData(request.response, function(buffer) {
					S[filename] = buffer;
					resolve(filename);
				}, reject );
			}
			request.onError = function(){
				reject(new Error(request.statusText));
			}
			request.send();
		})
	}
})();