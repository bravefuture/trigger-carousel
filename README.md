# trigger-carousel
## 轮播图
html结构：
```html
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
```