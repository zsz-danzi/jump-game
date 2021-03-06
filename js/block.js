	
	function Block(x,y,width){
		this.x = x;
		this.y = y;
		this.width = width || Math.ceil(Math.random() * 100) + 90;
		this.height = 110;

		this.preH = this.height;
		this.preY = this.y;

		this.xSpeed = 1; //水平速度

		this.life = true; //生命 

		this.shake = true;

		this.first_flag = false;

	}
	
	Block.prototype.draw = function(paint){

		paint.save();
		//开始路径
		paint.beginPath();
		paint.strokeStyle = '#54606c';
		paint.fillStyle = '#54606c';
		paint.rect(this.x,this.y,this.width,this.height);
		paint.stroke();
		paint.fill();
		paint.closePath();
		//关闭路径
		paint.restore();

	}

	Block.prototype.create = function(){
		var _this = this;
		var H = this.y;
		_this.y = 1000;

		var tween1 = new TWEEN.Tween( { y : _this.y } )
            .to({y: H}, 550)
            .easing( TWEEN.Easing.Bounce.Out )  //Quadratic, Cubic, Quartic, Quintic, Sinusoidal, Exponential, Circular, Elastic, Back 和 Bounce 删掉就是linear
            .onUpdate(function() {
            	_this.y = this.y;
            })
            .onComplete(function(){
            	tween1 = null;
            })
            .start();
	}

	Block.prototype.jump = function(){
		if( this.first_flag ) return;
		this.first_flag = true;
		var _this = this;


		var H = this.preH;
		var Y = this.preY;
		var tween1 = new TWEEN.Tween( { h : _this.height , y : _this.y } )
            .to({h: H , y : Y }, 550)
            .easing( TWEEN.Easing.Elastic.Out )  //Quadratic, Cubic, Quartic, Quintic, Sinusoidal, Exponential, Circular, Elastic, Back 和 Bounce 删掉就是linear
            .onUpdate(function() {
            	_this.y = this.y;
            })
            .onComplete(function(){
            	tween1 = null;
            })
            .start();
	}


	Block.prototype.move = function(){
		this.x+=this.xSpeed; //的速度 
	}




