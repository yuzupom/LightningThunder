compo = {};
(function(){
	var base_x = document.getElementById('c').style.left;
	var base_y = document.getElementById('c').style.top;
	compo.makeTextbox = function(x, y, w, h){
		var elm = document.createElement('input');
		elm.style.position = 'absolute';
		elm.style.left = x+parseInt(base_x);
		elm.style.top  = y+parseInt(base_y);
		elm.style.width  = w;
		elm.style.height = h;
		document.body.appendChild(elm);
		elm.style.opacity = '0'
		// document.onkeyup = function(){
		// }
		var onStep = function(){};
		var onDraw = function(ctx){
			ctx.fillStyle = "rgba(250, 250, 250, 1)"
			ctx.fillRect(x, y, w, h)

			ctx.font = '36px/2 sans-serif';
			ctx.textAlign = 'left';
			ctx.textBaseline = 'top';
			ctx.fillStyle = "rgba(0, 0, 0, 1)"
			ctx.fillText(elm.value , x, y);
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
		elm.style.opacity = '0.5'
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
