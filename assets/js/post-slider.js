/**
 * JavaScript for posts slider functionality
 */
(function($) {
    'use strict';
    
    // Slider constructor
    function PostSlider(options) {
        // Default settings
        this.settings = $.extend({
            slideDuration: 10000,      // Slide display time (10 seconds)
            animationDuration: 1200,   // Base animation duration (back to 1200)
            container: '.post-slider',
            slideSelector: '.post-slide',
            prevBtn: '.post-slider-prev',
            nextBtn: '.post-slider-next',
            readMoreBtn: '.post-slide-read-more',
            autoplay: true             // Autoplay enabled by default
        }, options || {});
        
        // Initialize variables
        this.$container = $(this.settings.container);
        this.$slides = this.$container.find(this.settings.slideSelector);
        this.$prevBtn = $(this.settings.prevBtn);
        this.$nextBtn = $(this.settings.nextBtn);
        this.$readMoreBtns = $(this.settings.readMoreBtn);
        
        // Slider state
        this.currentIndex = 0;
        this.totalSlides = this.$slides.length;
        this.isAnimating = false;
        this.autoplayTimer = null;
        this.autoplayEnabled = this.settings.autoplay;
        this.autoplayPaused = false;
        
        // Initialize if there are slides
        if (this.totalSlides > 0) {
            this.init();
        }
    }
    
    // Slider methods
    PostSlider.prototype = {
        // Initialize slider
        init: function() {
            this.setupSlides();
            this.bindEvents();
            
            // Show first slide immediately with zoom out effect
            var $firstSlide = this.$slides.eq(0);
            
            // Set initial state
            $firstSlide.css({
                'opacity': '0',
                'z-index': '2',
                'transform': 'scale(1.15)',
                'filter': 'blur(5px)',
                'transition': 'none'
            });
            
            // Force reflow
            this.$container[0].offsetHeight;
            
            // Start animation for first slide
            var zoomOutDuration = this.settings.slideDuration; // Change to slide display duration
            
            $firstSlide.css({
                'transition': 'opacity ' + this.settings.animationDuration + 'ms ease, transform ' + 
                               zoomOutDuration + 'ms cubic-bezier(0.01, 0.01, 0.05, 0.95), filter ' + 
                               this.settings.animationDuration + 'ms ease',
                'opacity': '1',
                'transform': 'scale(1)',
                'filter': 'blur(0)'
            }).addClass('active');
            
            this.currentIndex = 0;
            
            // Start autoplay if enabled
            if (this.autoplayEnabled) {
                this.startAutoplay();
            }
            
            console.log('Slider initialized');
        },
        
        // Setup slides
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
        
        // Bind event handlers
        bindEvents: function() {
            var self = this;
            
            // Navigation buttons
            this.$prevBtn.on({
                click: function(e) {
                    e.preventDefault();
                    self.prevSlide();
                },
                mouseenter: function() {
                    self.pauseAutoplay();
                },
                mouseleave: function() {
                    self.resumeAutoplay();
                }
            });
            
            this.$nextBtn.on({
                click: function(e) {
                    e.preventDefault();
                    self.nextSlide();
                },
                mouseenter: function() {
                    self.pauseAutoplay();
                },
                mouseleave: function() {
                    self.resumeAutoplay();
                }
            });
            
            // Hover on "READ" buttons
            this.$readMoreBtns.on({
                mouseenter: function(e) {
                    self.pauseAutoplay();
                    console.log('Cursor on READ button');
                },
                mouseleave: function(e) {
                    self.resumeAutoplay();
                    console.log('Cursor left READ button');
                }
            });
            
            // Handle page visibility
            $(document).on('visibilitychange', function() {
                if (document.hidden) {
                    self.pauseAutoplay();
                } else {
                    self.resumeAutoplay();
                }
            });
            
            // Handle swipes
            this.setupTouchEvents();
        },
        
        // Setup touch events
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
                    // Temporarily pause autoplay on swipe
                    self.pauseAutoplay();
                    
                    if (diffX > 0) {
                        self.nextSlide();
                    } else {
                        self.prevSlide();
                    }
                    
                    // Resume autoplay after swipe
                    self.resumeAutoplay();
                }
            });
        },
        
        // Show specific slide
        showSlide: function(index) {
            if (this.isAnimating || index === this.currentIndex) return;
            
            var prevIndex = this.currentIndex;
            this.currentIndex = index;
            
            this.animateSlideTransition(prevIndex, this.currentIndex);
        },
        
        // Go to next slide
        nextSlide: function() {
            if (this.isAnimating || this.totalSlides <= 1) return;
            
            var nextIndex = (this.currentIndex + 1) % this.totalSlides;
            this.showSlide(nextIndex);
        },
        
        // Go to previous slide
        prevSlide: function() {
            if (this.isAnimating || this.totalSlides <= 1) return;
            
            var prevIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
            this.showSlide(prevIndex);
        },
        
        // Animate slide transition
        animateSlideTransition: function(fromIndex, toIndex) {
            var self = this;
            this.isAnimating = true;
            
            var $currentSlide = this.$slides.eq(fromIndex);
            var $nextSlide = this.$slides.eq(toIndex);
            
            // Prepare new slide - start with zoomed view for zoom out effect
            $nextSlide.css({
                'opacity': '0',
                'z-index': '2',
                'transform': 'scale(1.15)', // Start with larger scale for zoom out effect
                'filter': 'blur(5px)',
                'transition': 'none'
            });
            
            // Force reflow
            this.$container[0].offsetHeight;
            
            // Animate current slide
            $currentSlide.css({
                'transition': 'opacity ' + this.settings.animationDuration + 'ms ease, transform ' + 
                               this.settings.animationDuration + 'ms ease, filter ' + 
                               this.settings.animationDuration + 'ms ease',
                'opacity': '0',
                'transform': 'scale(0.95)',
                'filter': 'blur(5px)',
                'z-index': '1'
            });
            
            // Animate new slide - add slow zoom out
            var zoomOutDuration = this.settings.slideDuration; // Change to slide display duration
            
            $nextSlide.css({
                'transition': 'opacity ' + this.settings.animationDuration + 'ms ease, transform ' + 
                               zoomOutDuration + 'ms cubic-bezier(0.01, 0.01, 0.05, 0.95), filter ' + 
                               this.settings.animationDuration + 'ms ease', // Use cubic-bezier for smooth deceleration
                'opacity': '1',
                'transform': 'scale(1)', // Final scale 1, creating zoom out effect
                'filter': 'blur(0)'
            }).addClass('active');
            
            // Complete animation
            setTimeout(function() {
                $currentSlide.removeClass('active').css({
                    'transition': 'none'
                });
                
                self.isAnimating = false;
                console.log('Transition completed: ' + fromIndex + ' -> ' + toIndex);
            }, this.settings.animationDuration); // Use regular animation duration
        },
        
        // Start autoplay
        startAutoplay: function() {
            var self = this;
            
            // Stop previous timer if exists
            this.stopAutoplay();
            
            // Start only if autoplay is enabled and not paused
            if (!this.autoplayEnabled || this.autoplayPaused) {
                return;
            }
            
            console.log('Autoplay started');
            this.autoplayTimer = setTimeout(function autoplayTick() {
                // Check if autoplay should continue
                if (!self.autoplayEnabled || self.autoplayPaused) {
                    return;
                }
                
                self.nextSlide();
                
                // Schedule next switch
                self.autoplayTimer = setTimeout(autoplayTick, self.settings.slideDuration);
            }, this.settings.slideDuration);
        },
        
        // Stop autoplay
        stopAutoplay: function() {
            if (this.autoplayTimer) {
                clearTimeout(this.autoplayTimer);
                this.autoplayTimer = null;
            }
        },
        
        // Completely disable autoplay
        disableAutoplay: function() {
            console.log('Autoplay disabled permanently');
            this.autoplayEnabled = false;
            this.stopAutoplay();
        },
        
        // Temporarily pause autoplay
        pauseAutoplay: function() {
            if (this.autoplayEnabled && !this.autoplayPaused) {
                console.log('Autoplay paused');
                this.autoplayPaused = true;
                this.stopAutoplay();
            }
        },
        
        // Resume autoplay
        resumeAutoplay: function() {
            if (this.autoplayEnabled && this.autoplayPaused) {
                console.log('Autoplay resumed');
                this.autoplayPaused = false;
                this.startAutoplay();
            }
        }
    };
    
    // Initialize slider when page loads
    $(document).ready(function() {
        // Create slider instance
        window.postSlider = new PostSlider();
    });
    
})(jQuery); 