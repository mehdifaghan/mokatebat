window.onbeforeunload = function () {
	window.scrollTo(0, 0);
}
	(function () {

		'use strict';

		// iPad and iPod detection	
		var isiPad = function () {
			return (navigator.platform.indexOf("iPad") != -1);
		};

		var isiPhone = function () {
			return (
				(navigator.platform.indexOf("iPhone") != -1) ||
				(navigator.platform.indexOf("iPod") != -1)
			);
		};

		if (document.body.dataset.hasGuest !== "true") {
			$('.__loader').fadeOut(1000);
		}


		var sliderMain = function () {

			$('#qbootstrap-slider-hero .flexslider').flexslider({
				animation: "fade",
				slideshowSpeed: 5000,
				directionNav: true,
				start: function () {
					setTimeout(function () {
						$('.slider-text').removeClass('animated fadeInUp');
						$('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp');
					}, 500);
				},
				before: function () {
					setTimeout(function () {
						$('.slider-text').removeClass('animated fadeInUp');
						$('.flex-active-slide').find('.slider-text').addClass('animated fadeInUp');
					}, 500);
				}

			});

		};



		// animate-box
		var contentWayPoint = function () {

			$('.animate-box').waypoint(function (direction) {

				if (direction === 'down' && !$(this).hasClass('animated')) {

					$(this.element).addClass('fadeInUp animated');

				}

			}, { offset: '75%' });

		};


		// Burger Menu
		var burgerMenu = function () {

			$('body').on('click', '.js-qbootstrap-nav-toggle', function (event) {

				if ($('#navbar').is(':visible')) {
					$(this).removeClass('active');
				} else {
					$(this).addClass('active');
				}

				event.preventDefault();

			});

		};


		// Parallax
		var parallax = function () {
			if (!isiPad() || !isiPhone()) {
				$(window).stellar();
			}
		};



		// Page Nav
		var clickMenu = function () {

			$('a:not([class="external"])').click(function (event) {
				var section = $(this).data('nav-section'),
					navbar = $('#navbar');
				$('html, body').animate({
					scrollTop: $('[data-section="' + section + '"]').offset().top
				}, 500);

				if (navbar.is(':visible')) {
					navbar.removeClass('in');
					navbar.attr('aria-expanded', 'false');
					$('.js-qbootstrap-nav-toggle').removeClass('active');
				}

				event.preventDefault();
				return false;
			});

		};

		// Reflect scrolling in navigation
		var navActive = function (section) {

			var $el = $('#navbar > ul');
			$el.find('li').removeClass('active');
			$el.each(function () {
	
				$(this).find('a[data-nav-section="' + section + '"]').closest('li').addClass('active');
			});

		};
		var navigationSection = function () {

			var $section = $('div[data-section]');
	
			$section.waypoint(function (direction) {
				console.log('down');
				if (direction === 'down') {
					navActive($(this.element).data('section'));
				}
			}, {
				offset: function () { return -$(this.element).height() - 155; }
			});

			$section.waypoint(function (direction) {
				console.log('up');
				if (direction === 'up') {
					navActive($(this.element).data('section'));
				}
			}, {
				offset: function () { return -$(this.element).height() + 155; }
			});

		};


		// Window Scroll
		var windowScroll = function () {
			var lastScrollTop = 0;

			$(window).scroll(function (event) {

				var header = $('#qbootstrap-header'),
					scrlTop = $(this).scrollTop();

				if (scrlTop > 500 && scrlTop <= 2000) {
					header.addClass('fix-navbar qbootstrap-animated slideInDown');
				} else if (scrlTop <= 500) {
					if (header.hasClass('fix-navbar')) {
						header.addClass('fix-navbar qbootstrap-animated slideOutUp');
						setTimeout(function () {
							header.removeClass('fix-navbar qbootstrap-animated slideInDown slideOutUp');
						}, 100);
					}
				}

			});
		};



		// Animations
		var contentWayPoint = function () {
			var i = 0;
			$('.animate-box').waypoint(function (direction) {

				if (direction === 'down' && !$(this.element).hasClass('animated')) {

					i++;

					$(this.element).addClass('item-animate');
					setTimeout(function () {

						$('body .animate-box.item-animate').each(function (k) {
							var el = $(this);
							setTimeout(function () {
								var effect = el.data('animate-effect');
								if (effect === 'fadeIn') {
									el.addClass('fadeIn animated');
								} else if (effect === 'fadeInLeft') {
									el.addClass('fadeInLeft animated');
								} else if (effect === 'fadeInRight') {
									el.addClass('fadeInRight animated');
								} else {
									el.addClass('fadeInUp animated');
								}

								el.removeClass('item-animate');
							}, k * 50, 'easeInOutExpo');
						});

					}, 50);

				}

			}, { offset: '85%' });
		};


		var inlineSVG = function () {
			$('img.svg').each(function () {
				var $img = $(this);
				var imgID = $img.attr('id');
				var imgClass = $img.attr('class');
				var imgURL = $img.attr('src');

				$.get(imgURL, function (data) {
					// Get the SVG tag, ignore the rest
					var $svg = jQuery(data).find('svg');

					// Add replaced image's ID to the new SVG
					if (typeof imgID !== 'undefined') {
						$svg = $svg.attr('id', imgID);
					}
					// Add replaced image's classes to the new SVG
					if (typeof imgClass !== 'undefined') {
						$svg = $svg.attr('class', imgClass + ' replaced-svg');
					}

					// Remove any invalid XML tags as per http://validator.w3.org
					$svg = $svg.removeAttr('xmlns:a');

					// Replace image with new SVG
					$img.replaceWith($svg);

				}, 'xml');

			});
		};


		// Set the date we're counting down to
		let __date = document.querySelector('[data-date]').dataset.date;
		console.log(new Date(parseInt(__date * 1000)));
		var countDownDate = new Date(parseInt(__date * 1000)).getTime();
		var cardTemplate = document.querySelector('body').dataset.template;
		// Update the count down every 1 second
		var x = setInterval(function () {

			// Get todays date and time
			var now = new Date().getTime();

			// Find the distance between now an the count down date
			var distance = countDownDate - now;

			// Time calculations for days, hours, minutes and seconds
			var month = Math.floor(distance / (1000 * 60 * 60 * 24 * 30));
			var days = 0;
			month > 0
				? days = Math.floor((distance / (1000 * 60 * 60 * 24)) - (month * 30))
				: days = Math.floor(distance / (1000 * 60 * 60 * 24))

			var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			var seconds = Math.floor((distance % (1000 * 60)) / 1000);

			// Display the result in an element with id="demo"
			// document.getElementById("demo").innerHTML = days + "Days " + hours + "Hours "
			// + minutes + "Minutes " + seconds + "Seconds ";

			// Display the result in an element with id="demo"
			month > 0 ? document.querySelector('.countdown').classList.add('long-time') : '';
			document.getElementById("month").innerHTML = Math.abs(month) + `<small style="${cardTemplate == 'islamic' ? 'font-family:shabnam;' : ''}">${cardTemplate == 'islamic' ? 'ماه' : 'month'}</small>`;
			document.getElementById("days").innerHTML = Math.abs(days) + `<small style="${cardTemplate == 'islamic' ? 'font-family:shabnam;' : ''}">${cardTemplate == 'islamic' ? 'روز' : 'day'}</small>`;
			document.getElementById("hours").innerHTML = Math.abs(hours) + `<small style="${cardTemplate == 'islamic' ? 'font-family:shabnam;' : ''}">${cardTemplate == 'islamic' ? 'ساعت' : 'hours'}</small>`;
			document.getElementById("minutes").innerHTML = Math.abs(minutes) + `<small style="${cardTemplate == 'islamic' ? 'font-family:shabnam;' : ''}">${cardTemplate == 'islamic' ? 'دقیقه' : 'minutes'}</small>`;
			document.getElementById("seconds").innerHTML = Math.abs(seconds) + `<small style="${cardTemplate == 'islamic' ? 'font-family:shabnam;' : ''}">${cardTemplate == 'islamic' ? 'ثانیه' : 'seconds'}</small>`;

			// If the count down is finished, write some text 
			if (distance < 0) {
				document.querySelector('.common-life').textContent = "روز های سپری شده از  زندگی مشترک";
				//clearInterval(x);
				document.getElementById("demo").innerHTML = "<span style='font-size:14px;text-align:center;display:block;padding:5px 0 ;'>با آرزوی خوشبختی این مراسم به اتمام رسیده است. تالارکده</span>";
			}
		}, 1000);





		// Document on load.
		$(function () {
			burgerMenu();
			// testimonialCarousel();
			sliderMain();
			clickMenu();
			//parallax();
			windowScroll();
			//navigationSection();
			contentWayPoint();
			inlineSVG();
		});

		// $('.owl-carousel').owlCarousel({
		// 	animateOut: 'fadeOut',
		// 		items: 1,
		// 		loop: true,
		// 		margin: 0,
		// 		nav: false,
		// 		dots: true,
		// 		smartSpeed: 800,
		// 		autoHeight: false
		// })

		var swiper = new Swiper(".comments_swiper", {
			slidesPerView: "auto",
			spaceBetween: 5,
			speed: 1000,
			autoHeight: true,
			autoplay: {
				delay: 2500,
			},
			breakpoints: {
				320: {
					autoplay: false,
				},
				720: {
					slidesPerView: 2,
					spaceBetween: 30,
					autoHeight: false,
					autoplay: {
						delay: 2500,
					},
				},
				1024: {
					slidesPerView: 3,
					spaceBetween: 30,
					autoHeight: false,
					autoplay: {
						delay: 2500,
					},
				}
			}
		});

		let artRadioBtn = document.querySelectorAll(".art_radio");
		artRadioBtn.forEach(btn => {
			btn.addEventListener('click', (e) => {
				artRadioBtn.forEach(btn => {
					btn.classList.remove('active')
				})
				let target = e.target.closest('label')
				target.classList.add('active')
			})
		})


		//==========================================================
		let audio = document.querySelector('audio')
		let stop = false;
		let openSongBtn = document.querySelector('.player__list')
		openSongBtn &&  openSongBtn.addEventListener('click', open_song) 

		let playBox = document.querySelector('.player__play')
		playBox && playBox.addEventListener('click', toggle_music) 

		let resetBtn = document.querySelector('.player__prev')
		resetBtn && resetBtn.addEventListener('click', reset_music) 

		function reset_music() {
			audio.currentTime = 0;
			
		}

		function open_song() {
			let playBtn = document.querySelector('.player')

			playBtn.classList.toggle('active')
			if (playBtn.classList.contains('active')) {
				playBtn.querySelector('svg').classList.add('d-none')
				playBtn.querySelector('.player__icon-volume').classList.remove('d-none')
			} else {
				playBtn.querySelector('svg').classList.remove('d-none')
				playBtn.querySelector('.player__icon-volume').classList.add('d-none')
			}
			if (stop) {
				stop = false
				return;
			}
			audio.play();
			playBox.innerHTML = `<div class="player__icon player__icon-pause icon-pause"></div>`

		}

		function open_song_first(e) {
			let el = e.target.closest('.player__list'); 

			if (el) return ;
			
			let playBtn = document.querySelector('.player')

			playBtn.classList.toggle('active')
			if (playBtn.classList.contains('active')) {
				playBtn.querySelector('svg').classList.add('d-none')
				playBtn.querySelector('.player__icon-volume').classList.remove('d-none')
			} else {
				playBtn.querySelector('svg').classList.remove('d-none')
				playBtn.querySelector('.player__icon-volume').classList.add('d-none')
			}
			if (stop) {
				stop = false
				return;
			}

			audio.play();
			playBox.innerHTML = `<div class="player__icon player__icon-pause icon-pause"></div>`

		}

		function toggle_music() {
			if (audio.paused) {
				audio.play()
				playBox.innerHTML = `<div class="player__icon player__icon-pause icon-pause"></div>`
			} else {
				audio.pause()
				playBox.innerHTML = `<div class="player__icon player__icon-play icon-play"></div>`
				stop = true;
			}
		}

		document.body.addEventListener('click', open_song_first, { once: true })
		document.body.addEventListener('touch', open_song_first, { once: true })


		// Scroll trigger
		const scrollTrigger = (selector, activeClass = "active") => {
			// Find the item we want to animate on scroll
			let targets = document.querySelectorAll(selector);
			let baits = document.querySelectorAll("[data-nav-section]");

		
			// Call this function when it enters/leaves the viewport
			let callback = function (entries, observer) {
			  entries.forEach((entry) => {
				if (entry.isIntersecting) {
					baits.forEach((bait) => bait.closest('li').classList.remove(activeClass));
					baits.forEach((bait) => {
					if (bait.dataset.navSection == entry.target.dataset.section) {
					  bait.closest('li').classList.add(activeClass);
					}
				  });
				}
			  });
			};
				
		
			// Create our observer
			targets.forEach((target) => {
			  let observer = new IntersectionObserver(callback, { threshold: 1 });
			  observer.observe(target);
			});
		  };
		
		  scrollTrigger('[data-section]')
	}());