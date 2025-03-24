/**
 * JavaScript для работы слайдера постов
 */
(function($) {
    'use strict';
    
    $(document).ready(function() {
        const $slider = $('.post-slider');
        const $slides = $('.post-slide');
        const $prevBtn = $('.post-slider-prev');
        const $nextBtn = $('.post-slider-next');
        let currentIndex = 0;
        let slideCount = $slides.length;
        let interval;
        
        /**
         * Переключение на следующий слайд
         */
        function nextSlide() {
            let nextIndex = (currentIndex + 1) % slideCount;
            showSlide(nextIndex);
        }
        
        /**
         * Переключение на предыдущий слайд
         */
        function prevSlide() {
            let prevIndex = (currentIndex - 1 + slideCount) % slideCount;
            showSlide(prevIndex);
        }
        
        /**
         * Показ указанного слайда
         */
        function showSlide(index) {
            $slides.removeClass('active');
            $slides.eq(index).addClass('active');
            currentIndex = index;
        }
        
        /**
         * Запуск автоматического прокручивания слайдов
         */
        function startAutoSlide() {
            interval = setInterval(nextSlide, 25000);
        }
        
        /**
         * Остановка автоматического прокручивания
         */
        function stopAutoSlide() {
            clearInterval(interval);
        }
        
        // Обработчики событий
        $nextBtn.on('click', function() {
            stopAutoSlide();
            nextSlide();
            startAutoSlide();
        });
        
        $prevBtn.on('click', function() {
            stopAutoSlide();
            prevSlide();
            startAutoSlide();
        });
        
        // Остановка автоматического прокручивания при наведении
        $slider.hover(
            function() {
                stopAutoSlide();
            },
            function() {
                startAutoSlide();
            }
        );
        
        // Запуск автоматического прокручивания при загрузке
        startAutoSlide();
        
        // Обработка свайпов на мобильных устройствах
        let touchStartX = 0;
        let touchEndX = 0;
        
        $slider.on('touchstart', function(e) {
            touchStartX = e.originalEvent.touches[0].clientX;
        });
        
        $slider.on('touchend', function(e) {
            touchEndX = e.originalEvent.changedTouches[0].clientX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeDiff = touchStartX - touchEndX;
            
            if (Math.abs(swipeDiff) > 50) {
                stopAutoSlide();
                
                if (swipeDiff > 0) {
                    // Свайп влево - следующий слайд
                    nextSlide();
                } else {
                    // Свайп вправо - предыдущий слайд
                    prevSlide();
                }
                
                startAutoSlide();
            }
        }
    });
})(jQuery); 