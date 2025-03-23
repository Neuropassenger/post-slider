<?php
/**
 * Основной класс плагина Post Slider
 */
class Post_Slider {
    /**
     * Инициализация плагина
     */
    public function init() {
        // Регистрация стилей и скриптов
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_assets'));
        add_action('enqueue_block_editor_assets', array($this, 'enqueue_editor_assets'));
        
        // Регистрация блока Gutenberg
        add_action('init', array($this, 'register_block'));
    }
    
    /**
     * Регистрация блока Gutenberg
     */
    public function register_block() {
        register_block_type(POST_SLIDER_PATH . 'blocks/post-slider/block.json', array(
            'render_callback' => 'post_slider_render_callback'
        ));
    }
    
    /**
     * Подключение стилей и скриптов для фронтенда
     */
    public function enqueue_frontend_assets() {
        wp_enqueue_style(
            'post-slider-style',
            POST_SLIDER_URL . 'assets/css/post-slider.css',
            array(),
            POST_SLIDER_VERSION
        );
        
        wp_enqueue_script(
            'post-slider-script',
            POST_SLIDER_URL . 'assets/js/post-slider.js',
            array('jquery'),
            POST_SLIDER_VERSION,
            true
        );
    }
    
    /**
     * Подключение стилей и скриптов для редактора Gutenberg
     */
    public function enqueue_editor_assets() {
        wp_enqueue_style(
            'post-slider-editor-style',
            POST_SLIDER_URL . 'assets/css/post-slider-editor.css',
            array(),
            POST_SLIDER_VERSION
        );
    }
    
    /**
     * Рендер блока слайдера на фронтенде
     *
     * @param array $attributes Атрибуты блока
     * @return string HTML код блока
     */
    public function render_post_slider($attributes) {
        $args = array(
            'posts_per_page' => isset($attributes['postsCount']) ? absint($attributes['postsCount']) : 5,
            'post_status'    => 'publish',
            'order'          => isset($attributes['order']) ? $attributes['order'] : 'DESC',
            'orderby'        => isset($attributes['orderBy']) ? $attributes['orderBy'] : 'date',
        );
        
        // Фильтрация по категории, если указана
        if (!empty($attributes['categories'])) {
            $args['category__in'] = $attributes['categories'];
        }
        
        $posts_query = new WP_Query($args);
        $posts = $posts_query->posts;
        
        if (empty($posts)) {
            return '<div class="post-slider-empty">Нет доступных постов</div>';
        }
        
        ob_start();
        include POST_SLIDER_PATH . 'templates/post-slider-template.php';
        return ob_get_clean();
    }
} 