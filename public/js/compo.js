compo = {};
(function(){
	var base_x = document.getElementById('c').style.left;
	var base_y = document.getElementById('c').style.top;
	compo.makeTextbox = function(x, y, w, h){
		var elm = document.createElement('input');
		var pre_text = "";
		var text_canvas = document.createElement('canvas');
		text_canvas.width  = w;
		text_canvas.height = h;

		elm.style.position = 'absolute';
		elm.style.left = x+parseInt(base_x);
		elm.style.top  = y+parseInt(base_y);
		elm.style.width  = w;
		elm.style.height = h;
		document.body.appendChild(elm);
		elm.style.opacity = '0.1'
		// document.onkeyup = function(){
		// }
		var onStep = function(){};
		var onDraw = function(ctx){
			ctx.fillStyle = "rgba(250, 250, 250, 0.01)"
			ctx.fillRect(x, y, w, h)
			if(elm.value != pre_text ){
				var t_ctx = text_canvas.getContext('2d');
				t_ctx.clearRect(0, 0, w, h);
				var f_size = 32*6 / (elm.value.length > 6 ? elm.value.length : 6);
				t_ctx.font = f_size+'px/2 sans-serif';
				t_ctx.textAlign = 'center';
				t_ctx.textBaseline = 'middle';
				t_ctx.fillStyle = "rgba(0, 0, 0, 1)"
				t_ctx.fillText(elm.value , w/2, h/2);
				pre_text = elm.value;
			}
			ctx.drawImage(text_canvas, x, y)
		}
		elm.focus()
		return {
			onStep : onStep,
			onDraw : onDraw,
			elm : elm
		}
	}

	compo.makeButton = function(x, y, w, h, value){
		var elm = document.createElement('button');
		elm.style.position = 'absolute';
		elm.style.opacity = '0.1'
		elm.style.left = x+parseInt(base_x);
		elm.style.top  = y+parseInt(base_y);
		elm.style.width  = w;
		elm.style.height = h;
		elm.innerText = value;
		document.body.appendChild(elm);
		var onStep = function(){};
		var onDraw = function(){};
		return {
			onStep : onStep,
			onDraw : onDraw,
			elm : elm,
		}
	}
})();
