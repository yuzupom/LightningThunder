var Scene;
(function(){
	scene_list = [];
	scene_tag = {};
	Scene = function(){
	}
	Scene.prototype.onDraw = function(){
	}
	Scene.prototype.onStep = function(){	
	}
	Scene.prototype.onStart = function(){	
	}
	Scene.prototype.onEnd = function(){	
	}
	Scene.change = function(tag_name){
		Scene.end();
		scene_list = [];
		var scene = new Scene();
		for(var prop in scene_tag[tag_name]){
			if(scene_tag[tag_name].hasOwnProperty(prop)){
				scene[prop] = scene_tag[tag_name][prop];
			}
		}
		scene_list.push(scene);
		return scene;
	}
	Scene.add = function(name){
		var scene = new Scene();
		for(var prop in scene_tag[name]){
			if(scene_tag[name].hasOwnProperty(prop)){
				scene[prop] = scene_tag[name].prop;
			}
		}
		scene_list.push(scene);
		return scene;
	}
	Scene.step = function(){
		for(var i=scene_list.length-1; i>=0; i--){
			scene_list[i].onStep();
		}
	}
	Scene.start = function(){
		for(var i=scene_list.length-1; i>=0; i--){
			scene_list[i].onStart();
		}
	}
	Scene.end = function(){
		for(var i=scene_list.length-1; i>=0; i--){
			scene_list[i].onEnd();
		}
	}
	Scene.draw = function(ctx){
		for(var i=scene_list.length-1; i>=0; i--){
			scene_list[i].onDraw(ctx);
		}
	}
})();
