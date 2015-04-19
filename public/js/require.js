/*
 * usage : require(filelist, fn);
 *   filelistで指定されたjsファイルのうち、
 *   読み込まれていないファイルを順に読み込む
 *   全部読み込んだらfnを実行する
 *   (既に読み込まれているjsファイルはスキップする)
 *
 *   require中にrequireされる場合、最新のrequireから順に処理する
 *     例：
 *       require(['one.js','two.js','three.js'],fn1)でone.js読み込み中、
 *       one.js内でrequire(['three.js','a.js'],fn2)される場合
 *       'one.js'→'three.js'→'a.js'→fn2→'two.js'→fn1と読み込まれる。
 */
var require;

(function(){
	var scripts = {};
	var queue = [];

	require = function(filelist, fn){
		if(typeof filelist == "string"){
			filelist = [filelist];
		}
		var interrupt = [];
		for(var i=0; i<filelist.length; i++){
			interrupt.push(loadScript(filelist[i]))
		}
		if(typeof fn == "function"){
			(function(fn){
				interrupt.push(function(value){
					return Promise.resolve().then(fn);
				});
			})(fn);
		}
		if(queue.length == 0){
			queue = interrupt;
			dequeue();
		}
		else{
			queue = interrupt.concat(queue);
		}
	}

	function dequeue(value){
		var fn = queue.shift();
		if(!fn){ return }
		fn(value).then(function(){
			return dequeue(value)
		});
	}

	function loadScript(filename){
		return function(value){
			scripts[filename] = scripts[filename] || new Promise(function(resolve, reject){
				var script = document.createElement('script');
				script.src = filename;
				script.onload = function(){
					resolve(filename);
				}
				var head = document.getElementsByTagName('head')[0] || document.documentElement;
				head.insertBefore(script, head.firstChild);
			});
			return scripts[filename];
		}
	}
})();