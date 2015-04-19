(function(){
	var base_url = 'https://lightning-thunder.herokuapp.com/api/v1'	
	xhr = function(method, url, cb){
		var xhr = new XMLHttpRequest();
		xhr.open(method , base_url + url);
		xhr.onreadystatechange = function(){
			if (xhr.readyState === 4){
				cb(JSON.parse(xhr.responseText));
			}
		};
		xhr.setRequestHeader("Content-Type" , "application/x-www-form-urlencoded");
		xhr.send();
	}

	dummy_xhr = function(data, cb){
		setTimeout(cb(data),0);
	}
})();
