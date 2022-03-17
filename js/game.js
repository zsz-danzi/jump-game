/*
 * @author:danzizhong;
 * @date:2018/03/17;
 * @content:game-tiaoyitiao-2D;
*/

var Game = function(){

	var cvs = gid('cvs');
	var btn = gid('btn-again');
	var p_num = gid('num');
	var index_num = 0;

	var W = 750;
	var H = 1334;

	cvs.width = 750;
	cvs.height = 1334;

	//游戏属性
	var man = null,
		_this = null,
		ctx = cvs.getContext('2d'),
		back_speed = 8, //物体向后移动速度
		block_arr = [], //块数组
		touch_flag = false, // 是否按下
		running_flag = false, //是否正在移动
		f_block_dis = 50, //第1块block位置距离屏幕50
		s_block_dis = 300, //第2块block位置距离屏幕360,
		back_i = 0, // 后退时间
		distance = 0,
		first_flag = false,
		block_width = 100,
		game_over = false,
		block_id = 0 ; // 状态1 - 第1个block碰撞  2 - 第2个block  3 - 没有碰撞 做自由落体运动 


	function gid(v){
		return document.getElementById(v);
	}

    var stats = initStats();

    function initStats() {

        var stats = new Stats();
        stats.setMode(0); // 0: fps, 1: ms


        // Align top-left
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';

        document.getElementById("Stats-output").appendChild(stats.domElement);

        return stats;
    }

	return {

		init : function(){

			_this = this;

			//创建人物
			man = new Man(110 , 1334 -100  , './img/tiao.png');
			man.draw(ctx);

			//创建地板
			var block = new Block(f_block_dis, 1334 - 100 , 120 );
			block.draw(ctx);
			block_arr.push(block);

			block = new Block(s_block_dis, 1334 - 100 );
			block.create();
			block_arr.push(block);


			this.animate();
	
	        btn.addEventListener('touchstart',function(ev){
	        	var ev = ev || event;
	        	ev.cancelBubble = true;
	        	return false;
	        });

	        btn.addEventListener('touchend',function(ev){
	        	var ev = ev || event;
	        	ev.cancelBubble = true;

	        	_this.reset();

	        })


			document.addEventListener( 'touchstart', _this.onDocumentTouchStart.bind(_this), false );
	        document.addEventListener( 'touchmove', _this.onDocumentTouchMove.bind(_this), false );
	        document.addEventListener( 'touchend', _this.onDocumentTouchEnd.bind(_this), false );

		},

		reset : function(){

			//分数
			index_num = _this.toTwo(0) ;
			p_num.innerHTML = index_num;

			btn.style.display = 'none';

			_this.animate_stop =false;
			block_width = 100;

			block_arr = [];
			//创建人物
			man = new Man(110 , 1334 -100  , './img/tiao.png');
			man.draw(ctx);

			//创建地板
			var block = new Block(f_block_dis, 1334 - 100 , 120 );
			block.draw(ctx);
			block_arr.push(block);

			block = new Block(s_block_dis, 1334 - 100 );
			block.create();
			block_arr.push(block);

			this.animate();
		},

		//每一证的状态
		animate : function( time){

			stats.update();  //帧率

			TWEEN.update( time ); //twee动画

			if(this.animate_stop) return;

			ctx.clearRect(0,0,W,H)

			if(man.life){
				if( man.y >= Page.B1 ){
					game_over = true;
					btn.style.display = 'block';
					_this.stop();
				}
				if( touch_flag ){
					man.ready( block_arr[0] );
					block_arr[0].first_flag = false;

				}else{
					if( man.ready_flag){

						man.jump();  //跳跃瞬间得出水平X的目标位置
						block_arr[0].jump();

						//算物体的目标与底座是否碰撞
						if( !man.first_flag1 ){
							man.first_flag1 = true;
							for(var i=0; i<block_arr.length; i++){
								var bl = block_arr[i];

								if( _this.collision(man,bl)){
									block_id = i+1 ; //与第几个碰撞了
									if( block_id == 2 ){
										man.back_flag = true;
										distance = Math.floor( block_arr[1].x - f_block_dis);

										if( distance > 260 ){
											back_speed += Math.floor((distance - 260)/20);
										}


									}

									man.land = true; //顺利降落
								}
							}
						}

						//算物体自身与底座是否碰撞
						if( !man.land ){
							for(var i=0; i<block_arr.length; i++){
								var bl = block_arr[i];
								var result = _this.collision2(man,bl);

								if(result){
									if(result == 'right'){
										man.speedX = .8;
									}else{
										man.speedX = -1;
									}
									man.speedY = 1;
									break;
								}
							}
						}
					}else if( man.back_flag ){

						if(!first_flag){ //生成下一块

							first_flag = true;

							var b_width = Math.ceil(Math.random() * block_width) + 90;

							s_block_dis = Math.ceil(Math.random() * 200 ) + 100 + block_arr[1].width;

							var block = new Block( s_block_dis + distance , 1334 - 100 , b_width );
							block.create();
							block_arr.push(block);

							block_width -= 2;

							//计分
							index_num++;
							p_num.innerHTML =_this.toTwo(index_num);

						}

						_this.moveMap( distance , function(){

							first_flag = false;
							back_speed = 8;

						} )

					}
				}

				man.draw(ctx);
			}

			for(var i=0; i<block_arr.length; i++){
				var b = block_arr[i];
				if(b.life){
					b.draw(ctx);
				}else{
					b = null;
					block_arr.splice(i,1);
					i--;
				}
			}


			window.requestAnimationFrame( this.animate.bind(this) );

		},

		//暂停
		stop : function(){
			this.animate_stop = true;	
		},

		toTwo : function(num){
			return num < 10 ? '0' + num : num;
		},

		moveMap : function(distance,endFn){  //移动场景 - 第二块block移动到屏幕左边距离50的地方


			back_i++;

			if(back_i * back_speed >= distance) {

				man.back_flag = false;

				back_speed = distance - ((back_i -1) * back_speed);

				back_i = 0;

			}

			man.x -= back_speed;

			//block
			for(var i = 0; i < block_arr.length; i++ ){
				var b = block_arr[i];

				b.x -= back_speed;

				if(b.x + b.width <= 0){
					b.life = false;
				}

			}

			if(back_i == 0){
				endFn && endFn();
			}


		},

		collision : function(s1,s2){  // 判断两个物体是否碰撞
			if (s1.target_x < s2.x) {
				return false;
			}
			if (s2.x + s2.width < s1.target_x ) {
				return false;
			}
			return true;			
		},

		collision2 : function(s1,s2){  // 判断两个物体是否碰撞
			if (s1.x + s1.width/2 > s2.x && s1.x -s1.width/2 < s2.x + s2.width && s1.y > s2.y  ) {
				if( s1.x < s2.x + s2.width/2 ){
					return "left";
				}else{
					return "right";
				}
			}
			return false;

		},

		onDocumentTouchStart : function(){
			if( man.back_flag || man.ready_flag ) return;
			touch_flag = true;
		}, 

		onDocumentTouchMove : function(){

		},

		onDocumentTouchEnd : function(){
			if( !touch_flag ) return;
			touch_flag = false;
		}

	}

}

var game = Game();
game.init();

