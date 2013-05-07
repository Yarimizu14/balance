(function(w) {
	
	var $s = {
		all: [],
		getStorage: function() {
			var storage = JSON.parse(window.localStorage.getItem("balance"));
			if (storage !== null) {
				if(!(storage instanceof Array)) {
					$s.all[0] = storage;
				} else {
					$s.all = storage;
				};
			};
		},
		addStorage: function(obj) {
			this.all[this.all.length] = obj;
			window.localStorage.setItem("balance", JSON.stringify(this.all));
		},
		reset: function() {
			this.all = [];
			window.localStorage.setItem("balance", "");			
		}
	};

	var $b = {
		cvs: null,
		ctx: null,
		playing: false,
		active: false,
		timer: null,
		result: {
			time: null,
			score: 0
		},
		//gravity detection
		move: {
			xg: 0,
			yg: 0	
		},
		current: {
			x: 0,
			y: 0
		},
		target: {
			x: window.innerHeight/2,
			y: window.innerWidth/2
		},
		imgs: [],

		initialize: function() {
			this.playing = true;
			this.active = true;
			
			var new_cvs = document.createElement("canvas");
			new_cvs.setAttribute("id", "canvas");				/* position: absolute; z-index: 10; を指定 */

			this.cvs = new_cvs;
			this.ctx = this.cvs.getContext("2d");

			this.cvs.height = 320;
			this.cvs.width = 480;
			
			this.result.score =0;
			
			var sprite = new Image();
			sprite.src = "./images/tiny_draw.png";
			this.imgs[0] = sprite;
			console.log(sprite);
			console.log(sprite.complete);
						
			sprite.addEventListener("load", function() {
				alert("sprite loaded");
				$b.timer = new Timer(0, 10, $b.update);
				window.addEventListener("devicemotion", gravity_detection, true);
				$b.draw();
			}, false);


			//this.timer = new Timer(0, 10, this.update);			
/*デバッグ用*/	//this.draw();

			//w.addEventListener("devicemotion", gravity_detection, true);

			return new_cvs;
		},
		draw: function() {
			var cvs = $b.cvs,
				ctx = $b.ctx,
				move = $b.move,
				current = $b.current,
				target = $b.target,
				imgs = $b.imgs;

			ctx.fillStyle = "black";
			ctx.fillRect(0, 0, cvs.width, cvs.height);

			current.x = Math.floor(window.innerHeight/2 + move.xg * 35);
			current.y = Math.floor(window.innerWidth/2 + move.yg * 60) + 15;
			
			ctx.drawImage(imgs[0], 0, 0, 400, 400, target.y-25, target.x-25, 50, 50);
			//ctx.drawImage(imgs[1], current.y-25, current.x-25, 50, 50);
			
			ctx.drawImage(imgs[0], 400, 0, 400, 400, current.y-25, current.x-25, 50, 50);

			var dif = {};
			dif.x = Math.abs(current.x - target.x);
			dif.y = Math.abs(current.y - target.y);
			
			if(dif.x <= 10 && dif.y <= 10) { 
				$b.target.x = Math.floor(Math.random() * (window.innerHeight - 20));
				$b.target.y = Math.floor(Math.random() * (window.innerWidth - 20));

				$b.result.score++;
			};
			
			/*タイムカウントの表示*/
			var angle = 90 * Math.PI / 180;
			ctx.rotate(angle);
			ctx.font = "18px 'ＭＳ Ｐゴシック'";
			ctx.fillStyle = "red";
			ctx.fillText($b.timer.show(), 10, -10);
			ctx.rotate(-angle);

			return current;
		},
		update: function() {
			$b.draw();
			if ($b.timer.check()) {
				alert("診断終了");
				var d = new Date();
				$b.result.time = util.translate(d);
				
				var customEvent = document.createEvent("HTMLEvents");
				customEvent.initEvent("custom_event", true, false);
				window.dispatchEvent(customEvent);
			}
		},
		stop: function() {
			this.timer.stop();
			this.active = false;
			w.removeEventListener("devicemotion", gravity_detection, true);
			this.cvs.style.display = "none";
		},
		restart: function() {
			this.timer.start();
			this.active = true;
			w.addEventListener("devicemotion", gravity_detection, true);
			this.cvs.style.display = "block";
		},
		destroy: function() {
			this.playing = false;
			this.active = false;
			this.cvs.parentNode.removeChild(this.cvs);
			this.cvs = null;
			this.ctx = null;
			w.removeEventListener("devicemotion", gravity_detection, true);
		}
	};
	
	function gravity_detection(e) {
		var xg = e.accelerationIncludingGravity.x;  // X方向の傾き
		var yg = e.accelerationIncludingGravity.y;  // Y方向の傾き
		
		console.log("removing");
		
		$b.move.xg = xg;
		$b.move.yg = yg;
		
		$b.update();		
	}

	w.$b = $b;
	$s.getStorage();
	w.$s = $s;

})(window);