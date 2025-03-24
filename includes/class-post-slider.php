<?php
/**
 * Main Post Slider plugin class
 */
class Post_Slider {
    /**
     * Plugin initialization
     */
    public function init() {
        // Register styles and scripts
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_assets'));
        add_action('enqueue_block_editor_assets', array($this, 'enqueue_editor_assets'));
        
        // Register Gutenberg block
        add_action('init', array($this, 'register_block'));
    }
    
    /**
     * Register Gutenberg block
     */
    public function register_block() {
        register_block_type(POST_SLIDER_PATH . 'blocks/post-slider/block.json', array(
            'render_callback' => 'post_slider_render_callback'
        ));
    }
    
    /**
     * Enqueue frontend styles and scripts
     */
    public function enqueue_frontend_assets() {
        /* wp_enqueue_style(
            'post-slider-style',
            POST_SLIDER_URL . 'assets/css/post-slider.css',
            array(),
            POST_SLIDER_VERSION
        ); */
        
        wp_enqueue_script(
            'post-slider-script',
            POST_SLIDER_URL . 'assets/js/post-slider.js',
            array('jquery'),
            POST_SLIDER_VERSION,
            true
        );
    }
    
    /**
     * Enqueue Gutenberg editor styles and scripts
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
     * Render slider block on frontend
     *
     * @param array $attributes Block attributes
     * @return string Block HTML code
     */
    public function render_post_slider($attributes) {
        $args = array(
            'posts_per_page' => isset($attributes['postsCount']) ? absint($attributes['postsCount']) : 5,
            'post_status'    => 'publish',
        );
        
        // Check if random posts mode is enabled
        if (isset($attributes['isRandomPosts']) && $attributes['isRandomPosts']) {
            // If random posts mode is enabled, use random sorting
            $args['orderby'] = 'rand';
        } else {
            // Otherwise use standard sorting settings
            $args['order'] = isset($attributes['order']) ? $attributes['order'] : 'DESC';
            $args['orderby'] = isset($attributes['orderBy']) ? $attributes['orderBy'] : 'date';
            
            // Filter by category if specified
            if (!empty($attributes['categories'])) {
                $args['category__in'] = $attributes['categories'];
            }
        }
        
        $posts_query = new WP_Query($args);
        $posts = $posts_query->posts;
        
        if (empty($posts)) {
            return '<div class="post-slider-empty">No posts available</div>';
        }
        
        ob_start();
        include POST_SLIDER_PATH . 'templates/post-slider-template.php';
        return ob_get_clean();
    }
} 