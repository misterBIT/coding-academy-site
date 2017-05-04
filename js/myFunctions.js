SEMICOLON.mySlider = {

		init: function() {

			SEMICOLON.mySlider.sliderParallaxDimensions();
			SEMICOLON.mySlider.sliderRun();
			// SEMICOLON.mySlider.sliderParallax();
			// SEMICOLON.mySlider.sliderElementsFade();
			SEMICOLON.mySlider.captionPosition();

		},

		sliderParallaxDimensions: function(){
			if( $mySliderParallaxEl.find('.slider-parallax-inner').length < 1 ) { return true; }

			if( $body.hasClass('device-lg') || $body.hasClass('device-md') || $body.hasClass('device-sm') ) {
				var parallaxElHeight = $mySliderParallaxEl.outerHeight(),
					parallaxElWidth = $mySliderParallaxEl.outerWidth();

				if( $mySliderParallaxEl.hasClass('revslider-wrap') || $mySliderParallaxEl.find('.carousel-widget').length > 0 ) {
					parallaxElHeight = $mySliderParallaxEl.find('.slider-parallax-inner').children().first().outerHeight();
					$mySliderParallaxEl.height( parallaxElHeight );
				}

				$mySliderParallaxEl.find('.slider-parallax-inner').height( parallaxElHeight );

				if( $body.hasClass('side-header') ) {
					$mySliderParallaxEl.find('.slider-parallax-inner').width( parallaxElWidth );
				}

				if( !$body.hasClass('stretched') ) {
					parallaxElWidth = $wrapper.outerWidth();
					$mySliderParallaxEl.find('.slider-parallax-inner').width( parallaxElWidth );
				}
			} else {
				$mySliderParallaxEl.find('.slider-parallax-inner').css({ 'width': '', height: '' });
			}

			if( swiperSlider ) { swiperSlider.update( true ); }
		},

		sliderRun: function(){

			if( typeof Swiper === 'undefined' ) {
				console.log('sliderRun: Swiper not Defined.');
				return true;
			}

			if( $mySlider.hasClass('customjs') ) { return true; }

			if( $mySlider.hasClass('swiper_wrapper') ) {

				var element = $mySlider.filter('.swiper_wrapper'),
					elementDirection = element.attr('data-direction'),
					elementSpeed = element.attr('data-speed'),
					elementAutoPlay = element.attr('data-autoplay'),
					elementLoop = element.attr('data-loop'),
					elementEffect = element.attr('data-effect'),
					elementGrabCursor = element.attr('data-grab'),
					slideNumberTotal = element.find('#slide-number-total'),
					slideNumberCurrent = element.find('#slide-number-current'),
					sliderVideoAutoPlay = element.attr('data-video-autoplay');

				if( !elementSpeed ) { elementSpeed = 300; }
				if( !elementDirection ) { elementDirection = 'horizontal'; }
				if( elementAutoPlay ) { elementAutoPlay = Number( elementAutoPlay ); }
				if( elementLoop == 'true' ) { elementLoop = true; } else { elementLoop = false; }
				if( !elementEffect ) { elementEffect = 'slide'; }
				if( elementGrabCursor == 'false' ) { elementGrabCursor = false; } else { elementGrabCursor = true; }
				if( sliderVideoAutoPlay == 'false' ) { sliderVideoAutoPlay = false; } else { sliderVideoAutoPlay = true; }

				if( element.find('.swiper-pagination').length > 0 ) {
					var elementPagination = '.swiper-pagination',
						elementPaginationClickable = true;
				} else {
					var elementPagination = '',
						elementPaginationClickable = false;
				}

				var elementNavNext = '#slider-arrow-right',
					elementNavPrev = '#slider-arrow-left';

				swiperSlider = new Swiper( element.find('.swiper-parent') ,{
					direction: elementDirection,
					speed: Number( elementSpeed ),
					autoplay: elementAutoPlay,
					loop: elementLoop,
					effect: elementEffect,
					slidesPerView: 1,
					grabCursor: elementGrabCursor,
					pagination: elementPagination,
					paginationClickable: elementPaginationClickable,
					prevButton: elementNavPrev,
					nextButton: elementNavNext,
					onInit: function(swiper){
						SEMICOLON.slider.sliderParallaxDimensions();
						element.find('.yt-bg-player').removeClass('customjs');
						SEMICOLON.widget.youtubeBgVideo();
						$('.swiper-slide-active [data-caption-animate]').each(function(){
							var $toAnimateElement = $(this),
								toAnimateDelay = $toAnimateElement.attr('data-caption-delay'),
								toAnimateDelayTime = 0;
							if( toAnimateDelay ) { toAnimateDelayTime = Number( toAnimateDelay ) + 750; } else { toAnimateDelayTime = 750; }
							if( !$toAnimateElement.hasClass('animated') ) {
								$toAnimateElement.addClass('not-animated');
								var elementAnimation = $toAnimateElement.attr('data-caption-animate');
								setTimeout(function() {
									$toAnimateElement.removeClass('not-animated').addClass( elementAnimation + ' animated');
								}, toAnimateDelayTime);
							}
						});
						$('[data-caption-animate]').each(function(){
							var $toAnimateElement = $(this),
								elementAnimation = $toAnimateElement.attr('data-caption-animate');
							if( $toAnimateElement.parents('.swiper-slide').hasClass('swiper-slide-active') ) { return true; }
							$toAnimateElement.removeClass('animated').removeClass(elementAnimation).addClass('not-animated');
						});
						SEMICOLON.slider.swiperSliderMenu();
					},
					onSlideChangeStart: function(swiper){
						if( slideNumberCurrent.length > 0 ){
							if( elementLoop == true ) {
								slideNumberCurrent.html( Number( element.find('.swiper-slide.swiper-slide-active').attr('data-swiper-slide-index') ) + 1 );
							} else {
								slideNumberCurrent.html( swiperSlider.activeIndex + 1 );
							}
						}
						$('[data-caption-animate]').each(function(){
							var $toAnimateElement = $(this),
								elementAnimation = $toAnimateElement.attr('data-caption-animate');
							if( $toAnimateElement.parents('.swiper-slide').hasClass('swiper-slide-active') ) { return true; }
							$toAnimateElement.removeClass('animated').removeClass(elementAnimation).addClass('not-animated');
						});
						SEMICOLON.slider.swiperSliderMenu();
					},
					onSlideChangeEnd: function(swiper){
						element.find('.swiper-slide').each(function(){
							var slideEl = $(this);
							if( slideEl.find('video').length > 0 && sliderVideoAutoPlay == true ) { slideEl.find('video').get(0).pause(); }
							if( slideEl.find('.yt-bg-player.mb_YTPlayer:not(.customjs)').length > 0 ) { slideEl.find('.yt-bg-player.mb_YTPlayer:not(.customjs)').YTPPause(); }
						});
						element.find('.swiper-slide:not(".swiper-slide-active")').each(function(){
							var slideEl = $(this);
							if( slideEl.find('video').length > 0 ) {
								if( slideEl.find('video').get(0).currentTime != 0 ) { slideEl.find('video').get(0).currentTime = 0; }
							}
							if( slideEl.find('.yt-bg-player.mb_YTPlayer:not(.customjs)').length > 0 ) {
								slideEl.find('.yt-bg-player.mb_YTPlayer:not(.customjs)').YTPGetPlayer().seekTo( slideEl.find('.yt-bg-player.mb_YTPlayer:not(.customjs)').attr('data-start') );
							}
						});
						if( element.find('.swiper-slide.swiper-slide-active').find('video').length > 0 && sliderVideoAutoPlay == true ) { element.find('.swiper-slide.swiper-slide-active').find('video').get(0).play(); }
						if( element.find('.swiper-slide.swiper-slide-active').find('.yt-bg-player.mb_YTPlayer:not(.customjs)').length > 0 && sliderVideoAutoPlay == true ) { element.find('.swiper-slide.swiper-slide-active').find('.yt-bg-player.mb_YTPlayer:not(.customjs)').YTPPlay(); }

						element.find('.swiper-slide.swiper-slide-active [data-caption-animate]').each(function(){
							var $toAnimateElement = $(this),
								toAnimateDelay = $toAnimateElement.attr('data-caption-delay'),
								toAnimateDelayTime = 0;
							if( toAnimateDelay ) { toAnimateDelayTime = Number( toAnimateDelay ) + 300; } else { toAnimateDelayTime = 300; }
							if( !$toAnimateElement.hasClass('animated') ) {
								$toAnimateElement.addClass('not-animated');
								var elementAnimation = $toAnimateElement.attr('data-caption-animate');
								setTimeout(function() {
									$toAnimateElement.removeClass('not-animated').addClass( elementAnimation + ' animated');
								}, toAnimateDelayTime);
							}
						});
					}
				});

				if( slideNumberCurrent.length > 0 ) {
					if( elementLoop == true ) {
						slideNumberCurrent.html( Number( element.find('.swiper-slide.swiper-slide-active').attr('data-swiper-slide-index') ) + 1 );
					} else {
						slideNumberCurrent.html( swiperSlider.activeIndex + 1 );
					}
				}
				if( slideNumberTotal.length > 0 ) {
					slideNumberTotal.html( element.find('.swiper-slide:not(.swiper-slide-duplicate)').length );
				}

			}
		},

		// sliderParallaxOffset: function(){
		// 	var sliderParallaxOffsetTop = 0;
		// 	var headerHeight = $header.outerHeight();
		// 	if( $body.hasClass('side-header') || $header.hasClass('transparent-header') ) { headerHeight = 0; }
		// 	if( $pageTitle.length > 0 ) {
		// 		var pageTitleHeight = $pageTitle.outerHeight();
		// 		sliderParallaxOffsetTop = pageTitleHeight + headerHeight;
		// 	} else {
		// 		sliderParallaxOffsetTop = headerHeight;
		// 	}

		// 	if( $mySlider.next('#header').length > 0 ) { sliderParallaxOffsetTop = 0; }

		// 	return sliderParallaxOffsetTop;
		// },

		// sliderParallax: function(){

		// 	if( $mySliderParallaxEl.length < 1 ) { return true; }

		// 	var parallaxOffsetTop = SEMICOLON.slider.sliderParallaxOffset(),
		// 		parallaxElHeight = $mySliderParallaxEl.outerHeight();

		// 	if( ( $body.hasClass('device-lg') || $body.hasClass('device-md') ) && !SEMICOLON.isMobile.any() ) {
		// 		if( ( parallaxElHeight + parallaxOffsetTop + 50 ) > $window.scrollTop() ){
		// 			$mySliderParallaxEl.addClass('slider-parallax-visible').removeClass('slider-parallax-invisible');
		// 			if ($window.scrollTop() > parallaxOffsetTop) {
		// 				if( $mySliderParallaxEl.find('.slider-parallax-inner').length > 0 ) {
		// 					var tranformAmount = (($window.scrollTop()-parallaxOffsetTop) *-.4 ).toFixed(0),
		// 						tranformAmount2 = (($window.scrollTop()-parallaxOffsetTop) *-.15 ).toFixed(0);
		// 					$mySliderParallaxEl.find('.slider-parallax-inner').css({'transform':'translateY('+ tranformAmount +'px)'});
		// 					$('.slider-parallax .slider-caption,.ei-title').css({'transform':'translateY('+ tranformAmount2 +'px)'});
		// 				} else {
		// 					var tranformAmount = (($window.scrollTop()-parallaxOffsetTop) / 1.5 ).toFixed(0),
		// 						tranformAmount2 = (($window.scrollTop()-parallaxOffsetTop) / 7 ).toFixed(0);
		// 					$mySliderParallaxEl.css({'transform':'translateY('+ tranformAmount +'px)'});
		// 					$('.slider-parallax .slider-caption,.ei-title').css({'transform':'translateY('+ -tranformAmount2 +'px)'});
		// 				}
		// 			} else {
		// 				if( $mySliderParallaxEl.find('.slider-parallax-inner').length > 0 ) {
		// 					$('.slider-parallax-inner,.slider-parallax .slider-caption,.ei-title').css({'transform':'translateY(0px)'});
		// 				} else {
		// 					$('.slider-parallax,.slider-parallax .slider-caption,.ei-title').css({'transform':'translateY(0px)'});
		// 				}
		// 			}
		// 		} else {
		// 			$mySliderParallaxEl.addClass('slider-parallax-invisible').removeClass('slider-parallax-visible');
		// 		}
		// 		if (requesting) {
		// 			requestAnimationFrame(function(){
		// 				SEMICOLON.slider.sliderParallax();
		// 				SEMICOLON.slider.sliderElementsFade();
		// 			});
		// 		}
		// 	} else {
		// 		if( $mySliderParallaxEl.find('.slider-parallax-inner').length > 0 ) {
		// 			$('.slider-parallax-inner,.slider-parallax .slider-caption,.ei-title').css({'transform':'translateY(0px)'});
		// 		} else {
		// 			$('.slider-parallax,.slider-parallax .slider-caption,.ei-title').css({'transform':'translateY(0px)'});
		// 		}
		// 	}
		// },

		// sliderElementsFade: function(){

		// 	if( $mySliderParallaxEl.length > 0 ) {
		// 		if( ( $body.hasClass('device-lg') || $body.hasClass('device-md') ) && !SEMICOLON.isMobile.any() ) {
		// 			var parallaxOffsetTop = SEMICOLON.slider.sliderParallaxOffset(),
		// 				parallaxElHeight = $mySliderParallaxEl.outerHeight();
		// 			if( $mySlider.length > 0 ) {
		// 				if( $header.hasClass('transparent-header') || $('body').hasClass('side-header') ) { var tHeaderOffset = 100; } else { var tHeaderOffset = 0; }
		// 				$mySliderParallaxEl.find('#slider-arrow-left,#slider-arrow-right,.vertical-middle:not(.no-fade),.slider-caption,.ei-title,.camera_prev,.camera_next').css({'opacity': 1 - ( ( ( $window.scrollTop() - tHeaderOffset ) *1.85 ) / parallaxElHeight ) });
		// 			}
		// 		} else {
		// 			$mySliderParallaxEl.find('#slider-arrow-left,#slider-arrow-right,.vertical-middle:not(.no-fade),.slider-caption,.ei-title,.camera_prev,.camera_next').css({'opacity': 1});
		// 		}
		// 	}
		// },

		captionPosition: function(){
			$mySlider.find('.slider-caption:not(.custom-caption-pos)').each(function(){
				var scapHeight = $(this).outerHeight();
				var scapSliderHeight = $mySlider.outerHeight();
				if( $(this).parents('#mySlider').prev('#header').hasClass('transparent-header') && ( $body.hasClass('device-lg') || $body.hasClass('device-md') ) ) {
					if( $(this).parents('#mySlider').prev('#header').hasClass('floating-header') ) {
						$(this).css({ top: ( scapSliderHeight + 160 - scapHeight ) / 2 + 'px' });
					} else {
						$(this).css({ top: ( scapSliderHeight + 100 - scapHeight ) / 2 + 'px' });
					}
				} else {
					$(this).css({ top: ( scapSliderHeight - scapHeight ) / 2 + 'px' });
				}
			});
		},

		swiperSliderMenu: function( onWinLoad ){
			onWinLoad = typeof onWinLoad !== 'undefined' ? onWinLoad : false;
			if( $body.hasClass('device-lg') || $body.hasClass('device-md') ) {
				var activeSlide = $mySlider.find('.swiper-slide.swiper-slide-active');
				SEMICOLON.slider.headerSchemeChanger(activeSlide, onWinLoad);
			}
		},

		revolutionSliderMenu: function( onWinLoad ){
			onWinLoad = typeof onWinLoad !== 'undefined' ? onWinLoad : false;
			if( $body.hasClass('device-lg') || $body.hasClass('device-md') ) {
				var activeSlide = $mySlider.find('.active-revslide');
				SEMICOLON.slider.headerSchemeChanger(activeSlide, onWinLoad);
			}
		},

		headerSchemeChanger: function( activeSlide, onWinLoad ){
			if( activeSlide.length > 0 ) {
				var darkExists = false;
				if( activeSlide.hasClass('dark') ){
					if( oldHeaderClasses ) { var oldClassesArray = oldHeaderClasses.split(/ +/); } else { var oldClassesArray = ''; }
					var noOfOldClasses = oldClassesArray.length;

					if( noOfOldClasses > 0 ) {
						var i = 0;
						for( i=0; i<noOfOldClasses; i++ ) {
							if( oldClassesArray[i] == 'dark' && onWinLoad == true ) {
								darkExists = true;
								break;
							}
						}
					}
					$('#header.transparent-header:not(.sticky-header,.semi-transparent,.floating-header)').addClass('dark');
					if( !darkExists ) {
						$('#header.transparent-header.sticky-header,#header.transparent-header.semi-transparent.sticky-header,#header.transparent-header.floating-header.sticky-header').removeClass('dark');
					}
					$headerWrap.removeClass('not-dark');
				} else {
					if( $body.hasClass('dark') ) {
						activeSlide.addClass('not-dark');
						$('#header.transparent-header:not(.semi-transparent,.floating-header)').removeClass('dark');
						$('#header.transparent-header:not(.sticky-header,.semi-transparent,.floating-header)').find('#header-wrap').addClass('not-dark');
					} else {
						$('#header.transparent-header:not(.semi-transparent,.floating-header)').removeClass('dark');
						$headerWrap.removeClass('not-dark');
					}
				}
				if( $header.hasClass('sticky-header') ) {
					SEMICOLON.header.stickyMenuClass();
				}
				SEMICOLON.header.logo();
			}
		},

		owlCaptionInit: function(){
			if( $owlCarouselEl.length > 0 ){
				$owlCarouselEl.each( function(){
					var element = $(this);
					if( element.find('.owl-dot').length > 0 ) {
						element.addClass('with-carousel-dots');
					}
				});
			}
		}

	};

