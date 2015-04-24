/* 
 * img.load(filename, cb_progress).then(cb_complete)
 * hoge.src = img.get[filename]
 */
var img = {};
	var F = {};

(function(){
	img.load = function(filename, cb_progress){
		filename = (filename instanceof Array) ? filename : [filename];
		var file_num = filename.length
		var all = [];
		for(var i=0; i<file_num; i++){
			all.push(load(filename[i])
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
	img.get = function(filename){
		if(!F[filename]){
			console.error('この画像はまだロードしてないよ！')
		}
		return F[filename];
	}

	function load(filename){
		if(F[filename]){ return Promise.resolve(filename) }
		return new Promise(function(resolve, reject){
			var img = new Image();
			img.src = filename;
			img.onload = function(){
				F[filename] = img;
				resolve(filename);
			}
			img.onerror = function(e){
				reject(new Error(xhr.statusText))				
			}
		})
	}
})();