(function(){
	if(typeof Promise != "undefined"){
		return;
	}
	
	Promise = function(fn){
		var fullfilled_task = [];
		var rejected_task   = [];
		var value;
		var status = "Pending";

		this.then = function(onFullfilled, onRejected){
			var promise = function(cb, resolve, reject){
				setTimeout(function(){
					try{
						var val = cb(value);
						if(val instanceof Promise){
							val.then(resolve, reject);
						}
						else{
							resolve(val);
						}
					}catch(e){
						reject(e);
					}
				}, 0);
			}

			if(status == "Fulfilled"){
				if(typeof onFullfilled == "function"){
					return new Promise(function(resolve, reject){
						promise(onFullfilled, resolve, reject);
					})
				}
				else{
					return Promise.resolve(value)
				}
			}
			else if(status == "Rejected"){
				if(typeof onRejected == "function"){
					return new Promise(function(resolve, reject){
						promise(onRejected, resolve, reject);
					})
				}
				else{
					return Promise.reject(value)
				}
			}
			else if(status == "Pending"){
				return new Promise(function(resolve, reject){
					fullfilled_task.push(function(){
						promise(onFullfilled, resolve, reject)
					});
					rejected_task.push(function(){
						promise(onRejected, resolve, reject)
					});
				});
			}
		}
		this.catch = function(onRejected){
			return this.then(null, onRejected);
		}
		var resolve = function(val){
			if(status != "Pending"){ return; }
			status = "Fulfilled"
			value = val;
			for(var i=0; i<fullfilled_task.length; i++){
				(function(i){
					setTimeout(function(i){
						fullfilled_task[i](value);
					}, 0, i);
				})(i);
			}
		}
		var reject = function(val){
			if(status != "Pending"){ return; }
			status = "Rejected"
			value = val;
			for(var i=0; i<rejected_task.length; i++){
				(function(i){
					setTimeout(function(){
						rejected_task[i](value);
					}, 0);
				})(i);
			}
		}
		if(typeof fn == "function"){
			fn(resolve, reject);
		}
	}

	Promise.resolve = function(value){
		return new Promise(function(resolve, reject){
			resolve(value);
		});
	}
	Promise.reject = function(value){
		return new Promise(function(resolve, reject){
			reject(value);
		});
	}

	Promise.all  = function(PromiseList){
		return new Promise(function(resolve, reject){
			var counter = (function(){
				var count = 0;
				var values = [];
				return function(i){
					return function(value){
						values[i] = value;
						if(++count == PromiseList.length){
							resolve(values)
						}				
					}
				}
			})();
			for(var i=0;i<PromiseList.length;i++){
				PromiseList[i].then(counter(i), reject);
			}
		});
	}
	Promise.race = function(PromiseList){
		return new Promise(function(resolve, reject){
			for(var i=0;i<PromiseList.length;i++){
				PromiseList[i].then(resolve, reject);
			}
		});
	}
})
