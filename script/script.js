$(document).ready(function(){
	(function($) {
		let ws = $("#wise_saying > span");
		let min = 0;
		let max = ws.length-1;
		let RandVal = Math.floor(Math.random() * (max - min + 1)) + min;
		$(ws[RandVal]).css({"top":0})
		setInterval(function(){
			$(ws[RandVal]).animate({"top":"-100%"}).siblings().css({"top":"100%"});
			RandVal++;
			if(RandVal>max)RandVal=0;
			$(ws[RandVal]).animate({"top":0})
		}, 3000)

		let	$window = $(window),
			$body = $('body'),
			$header = $('#header'),
			$footer = $('#footer'),
			$main = $('#main'),
			$main_articles = $main.children('article');
		// NOTE: 페이지 로드 0.1초 후 body에 is-preload 클래스 삭제
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});
		let	delay = 325,
			locked = false;
		$main._show = function(id, initial) {
			// NOTE: 주소창의 #뒤의 단어 추출 후 $article로 초기화
			let $article = $main_articles.filter('#' + id);
			$body.animate({scrollTop : 0}, delay);
			if ($article.length == 0){
				return;
			}
			if (locked || (typeof initial != 'undefined' && initial === true)) {
				$body.addClass('is-switching');
				$body.addClass('is-article-visible');
				$main_articles.removeClass('active');
				$header.hide();
				$footer.hide();
				$main.show();
				$article.show();
				$article.addClass('active');
				locked = false;
				setTimeout(function() {
					$body.removeClass('is-switching');
				}, (initial ? 1000 : 0));
				return;
			}
			locked = true;
			if ($body.hasClass('is-article-visible')) {
				let $currentArticle = $main_articles.filter('.active');
				$currentArticle.removeClass('active');
				setTimeout(function() {
					$currentArticle.hide();
					$article.show();
					setTimeout(function() {
						$article.addClass('active');
						$window.scrollTop(0).triggerHandler('resize.flexbox-fix');
						setTimeout(function() {
							locked = false;
						}, delay);
					}, 25);
				}, delay);
			}else {
				$body.addClass('is-article-visible');
					setTimeout(function() {
						$header.hide();
						$footer.hide();
						$main.show();
						$article.show();
						setTimeout(function() {
							$article.addClass('active');
								$window.scrollTop(0).triggerHandler('resize.flexbox-fix');
							setTimeout(function() {
								locked = false;
							}, delay);
						}, 25);
				}, delay);
			}
		};
		$main._hide = function(addState) {
			let $article = $main_articles.filter('.active');
			if (!$body.hasClass('is-article-visible')){
				return;
			}
			if (typeof addState != 'undefined' && addState === true){
				history.pushState(null, null, '#');
			}
			if (locked) {
				$body.addClass('is-switching');
				$article.removeClass('active');
				$article.hide();
				$main.hide();
				$footer.show();
				$header.show();
				$body.removeClass('is-article-visible');
				locked = false;
				$body.removeClass('is-switching');
				$window.scrollTop(0).triggerHandler('resize.flexbox-fix');
				return;
			}
			// NOTE: 팝업 사라지는 효과
			locked = true;
			$article.removeClass('active');
			setTimeout(function() {
				$article.hide();
				$main.hide();
				$footer.show();
				$header.show();
				setTimeout(function() {
					$body.removeClass('is-article-visible');
					$window.scrollTop(0).triggerHandler('resize.flexbox-fix');
					setTimeout(function() {
						locked = false;
					}, delay);
				}, 25);
			}, delay);
		};
		// NOTE: 모달팝업 지우는 태그 생성, 클릭시 해쉬지우면서 index로 넘어감
		$main_articles.each(function() {
			let $this = $(this);
			$('<div class="close">Close</div>').appendTo($this).on('click', function() {
				location.hash = '';
			});
			$this.on('click', function(event) {
				event.stopPropagation();
			});
		});
		// NOTE: 모달팝업 띄운 상태에서 body 클릭 시 팝업 사라짐
		// $body.on('click', function(event) {
		// 	if ($body.hasClass('is-article-visible')){
		// 		$main._hide(true);
		// 	}
		// });
		// NOTE: 모달팝업 띄운 상태에서 ESC(key code == 27)을 누르면 팝업 사라짐
		$window.on('keyup', function(event) {
			switch (event.keyCode) {
				case 27:
					if ($body.hasClass('is-article-visible')){
							$main._hide(true);
						}
					break;
				default:
					break;
			}
		});
		// NOTE: 주소의 #뒤에 있는 단어를 가져와, 해당 id선택자가 있는 모달팝업 띄움
		$window.on('hashchange', function(event) {
			if (location.hash == '' || location.hash == '#') {
				event.preventDefault();
				event.stopPropagation();
				$main._hide();
			}else if ($main_articles.filter(location.hash).length > 0) {
				event.preventDefault();
				event.stopPropagation();
				$main._show(location.hash.substr(1));
			}
		});
		// NOTE: 스크롤 방지
		$main.hide();
		$main_articles.hide();
		if (location.hash != '' && location.hash != '#'){
			$window.on('load', function() {
				$main._show(location.hash.substr(1), true);
			});
		}
	})(jQuery);
})