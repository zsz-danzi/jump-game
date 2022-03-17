
	function Man(x,y,src){

		this.width = 24;
		this.height = this.width * 2.75;

		this.x = x ;
		this.y = y ;
		this.prey = y;


		this.baseSpeedx = 1; //基数速度X，按下时间越长，基数越大
		this.baseSpeedy = 1; //基数速度Y，按下时间越长，基数越大

		//数据初始化
		this.init();

		this.first_flag1 = false;
		this.land = false; //是否着落

		//预加载图片
		this.img = new Image();
		this.img.onload = function(){
			this.load = true;
		}.bind(this);
		this.img.src = src;
	}

	Man.prototype.init = function(){

		this.life = true; //生命  

		this.first_flag = false;

		this.y = this.prey;

		this.ready_flag = false; //预备动作

		this.target_x = 0;
		this.t = 0 ; // 回落到水平位置所需时间 
		this.time = 0;

		this.rotate_flag = false;
		this.deg = 0; //旋转角度


		this.speedX = .8;
		this.speedY = -16;

		this.g = 1.5;
		this.b_h = 0; //底座下压的距离
	}
 
	Man.prototype.draw = function(paint){
		if(this.load){
			paint.save();

			if(this.rotate_flag){
				paint.translate( this.x, this.y - this.height/2);
				paint.rotate( this.deg *Math.PI/180);
				paint.drawImage( this.img,  - this.width/2 ,  -this.height/2 ,this.width, this.height );
			}else{
				paint.drawImage( this.img, this.x - this.width/2 , this.y - this.height ,this.width, this.height );
			}


			paint.restore();
		}else{
			setTimeout(function(){
				this.draw(paint);
			}.bind(this),30);
		}
	}
   
	Man.prototype.jump = function(){
		//速度控制 X Y 
		this.speedX *= this.baseSpeedx;

		this.speedY *= this.baseSpeedy;


		//进来第一次算出回到水平位置 X的距离
		if(!this.first_flag){
			this.first_flag = true;

			// this.t = Math.floor(-2 * this.speedY / this.g);  //一开始底座没有下压的时间

			this.t = Math.floor((-this.speedY + Math.sqrt( this.speedY * this.speedY + 2 * this.g * this.b_h )) / this.g);

			this.target_x = this.t * this.speedX + this.x;
		}
		this.time++;

		if( this.time > this.t && this.land ){

			//着落 数据重置初始化
			setTimeout(function(){
				this.first_flag1 = false;
				this.land = false;
			}.bind(this),60)

			this.init();

			return;
		}

		if( this.y >= Page.B1 ){
			this.y = Page.B1; 
			return;
		}

		this.x += this.speedX ;

		this.speedY+= this.g;

		this.y += this.speedY; 

		this.baseSpeedx = 1;
		this.baseSpeedy = 1;

		//物体旋转360
		this.rotate_flag = true;
		this.deg += 18;

		if(this.deg >=360){
			this.deg = 360;
		}

		//物体恢复
		if(this.width<=24){
			this.width = 24; 
			this.height = this.width * 2.75;
			return;
		}
		this.width-=0.6;
		this.height+=0.8;

	}

	Man.prototype.ready = function( block ){

		this.baseSpeedx += .3;
		this.baseSpeedy += 0.01;

		if( this.width > 46 ) return;
		this.ready_flag = true;
		this.width+=.3;
		this.height -=0.4;

		this.y+=.8;
		this.b_h-=.8;
		block.y+=.8;

		// this.height = this.width * 3.1;
	}

	Man.prototype.move_back = function(){

	}

   



