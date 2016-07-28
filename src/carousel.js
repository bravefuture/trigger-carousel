/**
 * [tab切换]
 * @update: 2016.07.28
 * @author: yongcheng0660@163.com
 * @github: https://github.com/bravefuture
 * html结构：
<div class="carousel" data-trigger="carousel" data-options="{'move':'#move','num':'#num','next':'#next','prev':'#prev','time':2000,'auto':false}">
	<div class="move" id="move">
		<ul class="clearfix">
			<li>1</li>
			<li>2</li>			
			<li>3</li>
		</ul>
	</div>
	<div class="num" id="num">
		<ul class="clearfix">
			<li class="on">1</li>
			<li>2</li>
			<li>3</li>
		</ul>
	</div>
	<a href="" id="prev">prev</a>
	<a href="" id="next">next</a>
</div>
 */

(function($, undefined){
	/**
	 * [dataTrigger data属性API]
	 * @type {String}
	 */
	var dataTrigger = '[data-trigger="carousel"]';
	

	/**
	 * [Carousel 标签构造函数]
	 */
	var Carousel = function(element, options){
		/**
		 * [获取该元素对象]
		 */
		this.element = element;
		/**
		 * [获取参数值]
		 */
		this.move = $(options.move);
		this.moveChild = this.move.find(options.moveChild);
		this.moveChildItem = this.move.find(options.moveChildItem);
		this.num = $(options.num);
		this.numOn = options.numOn;
		this.numChildItem = options.numChildItem;
		this.next = $(options.next);
		this.prev = $(options.prev);
		this.events = options.events;
		this.speed = options.speed;
		this.time = options.time;
		this.moveLen = this.moveChildItem.length;

		this.index = 0;

		this.resetSlideDom();
		this.bindNum();
		this.bindNext();
		this.bindPrev();
		if (options.auto === true) {
			this.autoPlay();
			this.carouselHover();			
		}
	};


	/**
	 * [version 定义版本号]
	 * @type {String}
	 */
	Carousel.prototype.version = '2.0.0';
	/**
	 * [resetSlideDom 重新设置滑动特效dom结构，多复制一个dom结构作为基点]
	 * @return {[type]} [description]
	 */
	Carousel.prototype.resetSlideDom = function(){
		var first = this.moveChildItem.first().clone();
		this.moveChild.append(first);
		this.moveLen = this.moveChildItem.length + 1;
		this.moveW = this.moveChildItem.outerWidth(true);
		this.moveChild.width(this.moveLen * this.moveW);
	};
	/**
	 * [autoPlay 自动播放]
	 * @return {[type]} [description]
	 */
	Carousel.prototype.autoPlay = function(){
		var that = this;
		this.playTimer = null;
		this.playTimer = setTimeout(function(){
			that.next.trigger('click');
			that.playTimer = setTimeout(arguments.callee, that.time)
		}, that.time);
	};
	/**
	 * [carouselHover 移上停止播放]
	 * @return {[type]} [description]
	 */
	Carousel.prototype.carouselHover = function(){
		var that = this;
		var hoverDom = this.move.add(this.num).add(this.next).add(this.prev);
		hoverDom.hover(
			function(){
				clearTimeout(that.playTimer);
			},
			function(){
				that.autoPlay();
			}
		);
	};
	/**
	 * [bindNum “数字”绑定事件]
	 * @return {[type]} [description]
	 */
	Carousel.prototype.bindNum = function(){
		var that = this;
		this.num.on(this.events + '.enjoy.carousel', this.numChildItem, function(e){
			that.index = $(this).index();
			that.slide(that.index);
			e.preventDefault();
		});
	};
	/**
	 * [slide 滑动特效]
	 * @param  {[type]}  index  [description]
	 * @param  {Boolean} isPrev [description]
	 * @return {[type]}         [description]
	 */
	Carousel.prototype.slide = function(index, isPrev){
		var that = this;
		if(isPrev === true && index === this.moveLen - 1){
			this.moveChild.css({
				marginLeft: -(this.moveLen - 1) * this.moveW
			});
			this.moveChild.stop().animate({marginLeft: -(this.moveLen - 2) * this.moveW}, this.speed);
			this.index--;
		}
		else{
			if (index === 1 && isPrev === undefined) {
				this.moveChild.css({
					marginLeft: 0
				}).stop(true, true).animate({marginLeft: -index * this.moveW}, this.speed);
			} else {
				this.moveChild.stop(true, true).animate({marginLeft: -index * this.moveW}, this.speed, function(){
					if(index === that.moveLen - 1){
						that.moveChild.css({
							marginLeft: 0
						});
					}
				});				
			}
		}

		if (this.moveLen - 1 === index) {
			index = 0;
			if (isPrev === true) {
				index = this.moveLen - 2;
			}
		}
		this.num.find(this.numChildItem).removeClass(this.numOn).eq(index).addClass(this.numOn);		
	};
	/**
	 * [bindNext 下一个]
	 * @return {[type]} [description]
	 */
	Carousel.prototype.bindNext = function(){
		var that = this;
		this.next.on('click.enjoy.carousel', function(e){
			that.index++;
			if(that.index === that.moveLen){
				that.index = 1;
			}
			that.slide(that.index);
			e.preventDefault();
		});
	};
	/**
	 * [bindPrev 上一个]
	 * @return {[type]} [description]
	 */
	Carousel.prototype.bindPrev = function(){
		var that = this;
		this.prev.on('click.enjoy.carousel', function(e){
			that.index--;
			if(that.index === -1){
				that.index = that.moveLen - 1;
			}		
			that.slide(that.index, true);
			e.preventDefault();
		});
	};
	/**
	 * [init 实例化]
	 * @this  {[type]} options [description]
	 * @return {[type]}         [description]
	 */
	var init = function(options){
		return this.each(function(){
			var _this = $(this);
			var data = _this.data('enjoy.carousel');
			if(!data){
				_this.data('enjoy.carousel', (data = new Carousel(_this, options)))
			}
		});
	};
	/**
	 * [参数设置]
	 * @return {[type]} [description]
	 */
	$(dataTrigger).each(function(){
		var _this = $(this);
		var dataOptions = _this.attr('data-options') || '';
		var pJData = dataOptions === '' ? {} : $.parseJSON(dataOptions.replace(/\'/g, '\"'));
		var options = $.extend({
			move: null,
			moveChild: 'ul',
			moveChildItem: 'li',
			num: null,
			numOn: 'on',
			numChildItem: 'li',
			next: null,
			prev: null,
			events: 'click',
			effect: 'slide',
			speed: 200,
			time: 5000,
			auto: false
		}, pJData || {});
		init.call(_this, options);
	});
})(jQuery, undefined);