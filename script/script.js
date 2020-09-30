$(document).ready(function(){
	(function($) {
		var	$window = $(window),
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
			var	delay = 325,
				locked = false;
			$main._show = function(id, initial) {
				var $article = $main_articles.filter('#' + id);
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
					var $currentArticle = $main_articles.filter('.active');
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
				var $article = $main_articles.filter('.active');
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
			$main_articles.each(function() {
				var $this = $(this);
					$('<div class="close">Close</div>').appendTo($this).on('click', function() {
						location.hash = '';
					});
					$this.on('click', function(event) {
						event.stopPropagation();
					});
				});
				$body.on('click', function(event) {
					if ($body.hasClass('is-article-visible')){
						$main._hide(true);
					}
				});
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
				if ('scrollRestoration' in history){
					history.scrollRestoration = 'manual';
				}else {
					var	oldScrollPos = 0,
						scrollPos = 0,
						$htmlbody = $('html,body');
					$window.on('scroll', function() {
						oldScrollPos = scrollPos;
						scrollPos = $htmlbody.scrollTop();
					}).on('hashchange', function() {
						$window.scrollTop(oldScrollPos);
					});
				}
				$main.hide();
				$main_articles.hide();
				if (location.hash != '' && location.hash != '#'){
					$window.on('load', function() {
						$main._show(location.hash.substr(1), true);
					});
				}
	})(jQuery);
})