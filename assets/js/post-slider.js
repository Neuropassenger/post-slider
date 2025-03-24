/**
 * JavaScript для работы слайдера постов
 */
(function($) {
    'use strict';
    
    // Конструктор слайдера
    function PostSlider(options) {
        // Настройки по умолчанию
        this.settings = $.extend({
            slideDuration: 10000,      // Время показа слайда (10 секунд)
            animationDuration: 1200,   // Длительность анимации
            container: '.post-slider',
            slideSelector: '.post-slide',
            prevBtn: '.post-slider-prev',
            nextBtn: '.post-slider-next',
            readMoreBtn: '.post-slide-read-more',
            autoplay: true             // Автоматическое переключение по умолчанию
        }, options || {});
        
        // Инициализация переменных
        this.$container = $(this.settings.container);
        this.$slides = this.$container.find(this.settings.slideSelector);
        this.$prevBtn = $(this.settings.prevBtn);
        this.$nextBtn = $(this.settings.nextBtn);
        this.$readMoreBtns = $(this.settings.readMoreBtn);
        
        // Состояние слайдера
        this.currentIndex = 0;
        this.totalSlides = this.$slides.length;
        this.isAnimating = false;
        this.autoplayTimer = null;
        this.autoplayEnabled = this.settings.autoplay;
        this.autoplayPaused = false;
        
        // Инициализация, если есть слайды
        if (this.totalSlides > 0) {
            this.init();
        }
    }
    
    // Методы слайдера
    PostSlider.prototype = {
        // Инициализация слайдера
        init: function() {
            this.setupSlides();
            this.bindEvents();
            
            // Показываем первый слайд сразу же делаем его видимым
            this.$slides.eq(0).css({
                'opacity': '1',
                'z-index': '2',
                'transform': 'scale(1)',
                'filter': 'blur(0)'
            }).addClass('active');
            this.currentIndex = 0;
            
            // Запускаем автопрокрутку, если она включена
            if (this.autoplayEnabled) {
                this.startAutoplay();
            }
            
            console.log('Слайдер инициализирован');
        },
        
        // Настройка слайдов
        setupSlides: function() {
            var self = this;
            
            this.$slides.each(function() {
                $(this)
                    .css({
                        'opacity': '0',
                        'z-index': '1',
                        'transform': 'scale(1.05)',
                        'filter': 'blur(5px)',
                        'transition': 'none'
                    })
                    .removeClass('active');
            });
        },
        
        // Привязка обработчиков событий
        bindEvents: function() {
            var self = this;
            
            // Кнопки навигации
            this.$prevBtn.on('click', function(e) {
                e.preventDefault();
                // Только временно останавливаем автопрокрутку при переключении
                self.pauseAutoplay();
                self.prevSlide();
                // Возобновляем автопрокрутку после переключения
                self.resumeAutoplay();
            });
            
            this.$nextBtn.on('click', function(e) {
                e.preventDefault();
                // Только временно останавливаем автопрокрутку при переключении
                self.pauseAutoplay();
                self.nextSlide();
                // Возобновляем автопрокрутку после переключения
                self.resumeAutoplay();
            });
            
            // Наведение на слайдер
            this.$container.on({
                mouseenter: function() {
                    self.pauseAutoplay();
                },
                mouseleave: function() {
                    self.resumeAutoplay();
                }
            });
            
            // Наведение на кнопки "ЧИТАТЬ"
            this.$readMoreBtns.on({
                mouseenter: function(e) {
                    e.stopPropagation();
                    self.pauseAutoplay();
                    console.log('Курсор на кнопке ЧИТАТЬ');
                },
                mouseleave: function(e) {
                    e.stopPropagation();
                    self.resumeAutoplay();
                    console.log('Курсор ушел с кнопки ЧИТАТЬ');
                }
            });
            
            // Обработка видимости страницы
            $(document).on('visibilitychange', function() {
                if (document.hidden) {
                    self.pauseAutoplay();
                } else {
                    self.resumeAutoplay();
                }
            });
            
            // Обработка свайпов
            this.setupTouchEvents();
        },
        
        // Настройка событий касания
        setupTouchEvents: function() {
            var self = this;
            var touchStartX = 0;
            
            this.$container.on('touchstart', function(e) {
                touchStartX = e.originalEvent.touches[0].clientX;
            });
            
            this.$container.on('touchend', function(e) {
                var touchEndX = e.originalEvent.changedTouches[0].clientX;
                var diffX = touchStartX - touchEndX;
                
                if (Math.abs(diffX) > 50) {
                    // Временно останавливаем автопрокрутку при свайпе
                    self.pauseAutoplay();
                    
                    if (diffX > 0) {
                        self.nextSlide();
                    } else {
                        self.prevSlide();
                    }
                    
                    // Возобновляем автопрокрутку после свайпа
                    self.resumeAutoplay();
                }
            });
        },
        
        // Показ определенного слайда
        showSlide: function(index) {
            if (this.isAnimating || index === this.currentIndex) return;
            
            var prevIndex = this.currentIndex;
            this.currentIndex = index;
            
            this.animateSlideTransition(prevIndex, this.currentIndex);
        },
        
        // Переход к следующему слайду
        nextSlide: function() {
            if (this.isAnimating || this.totalSlides <= 1) return;
            
            var nextIndex = (this.currentIndex + 1) % this.totalSlides;
            this.showSlide(nextIndex);
        },
        
        // Переход к предыдущему слайду
        prevSlide: function() {
            if (this.isAnimating || this.totalSlides <= 1) return;
            
            var prevIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
            this.showSlide(prevIndex);
        },
        
        // Анимация перехода между слайдами
        animateSlideTransition: function(fromIndex, toIndex) {
            var self = this;
            this.isAnimating = true;
            
            var $currentSlide = this.$slides.eq(fromIndex);
            var $nextSlide = this.$slides.eq(toIndex);
            
            // Подготовка нового слайда
            $nextSlide.css({
                'opacity': '0',
                'z-index': '2',
                'transform': 'scale(1.05)',
                'filter': 'blur(5px)',
                'transition': 'none'
            });
            
            // Принудительная перерисовка
            this.$container[0].offsetHeight;
            
            // Анимация текущего слайда
            $currentSlide.css({
                'transition': 'opacity ' + this.settings.animationDuration + 'ms ease, transform ' + 
                               this.settings.animationDuration + 'ms ease, filter ' + 
                               this.settings.animationDuration + 'ms ease',
                'opacity': '0',
                'transform': 'scale(0.95)',
                'filter': 'blur(5px)',
                'z-index': '1'
            });
            
            // Анимация нового слайда
            $nextSlide.css({
                'transition': 'opacity ' + this.settings.animationDuration + 'ms ease, transform ' + 
                               this.settings.animationDuration + 'ms ease, filter ' + 
                               this.settings.animationDuration + 'ms ease',
                'opacity': '1',
                'transform': 'scale(1)',
                'filter': 'blur(0)'
            }).addClass('active');
            
            // Завершение анимации
            setTimeout(function() {
                $currentSlide.removeClass('active').css({
                    'transition': 'none'
                });
                
                self.isAnimating = false;
                console.log('Переход завершен: ' + fromIndex + ' -> ' + toIndex);
            }, this.settings.animationDuration);
        },
        
        // Запуск автопрокрутки
        startAutoplay: function() {
            var self = this;
            
            // Останавливаем предыдущий таймер, если он есть
            this.stopAutoplay();
            
            // Запускаем только если автопрокрутка включена и не на паузе
            if (!this.autoplayEnabled || this.autoplayPaused) {
                return;
            }
            
            console.log('Автопрокрутка запущена');
            this.autoplayTimer = setTimeout(function autoplayTick() {
                // Проверяем, должна ли продолжаться автопрокрутка
                if (!self.autoplayEnabled || self.autoplayPaused) {
                    return;
                }
                
                self.nextSlide();
                
                // Планируем следующее переключение
                self.autoplayTimer = setTimeout(autoplayTick, self.settings.slideDuration);
            }, this.settings.slideDuration);
        },
        
        // Остановка автопрокрутки
        stopAutoplay: function() {
            if (this.autoplayTimer) {
                clearTimeout(this.autoplayTimer);
                this.autoplayTimer = null;
            }
        },
        
        // Полное отключение автопрокрутки 
        disableAutoplay: function() {
            console.log('Автопрокрутка отключена навсегда');
            this.autoplayEnabled = false;
            this.stopAutoplay();
        },
        
        // Временная пауза автопрокрутки
        pauseAutoplay: function() {
            if (this.autoplayEnabled && !this.autoplayPaused) {
                console.log('Автопрокрутка на паузе');
                this.autoplayPaused = true;
                this.stopAutoplay();
            }
        },
        
        // Возобновление автопрокрутки
        resumeAutoplay: function() {
            if (this.autoplayEnabled && this.autoplayPaused) {
                console.log('Автопрокрутка возобновлена');
                this.autoplayPaused = false;
                this.startAutoplay();
            }
        }
    };
    
    // Инициализация слайдера при загрузке страницы
    $(document).ready(function() {
        // Создаем экземпляр слайдера
        window.postSlider = new PostSlider();
    });
    
})(jQuery); 