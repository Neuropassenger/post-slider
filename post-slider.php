<?php
/**
 * Plugin Name: Post Slider
 * Description: Gutenberg block for displaying blog posts slider
 * Version: 1.0.32
 * Author: Oleg Sokolov
 * Text Domain: post-slider
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('POST_SLIDER_PATH', plugin_dir_path(__FILE__));
define('POST_SLIDER_URL', plugin_dir_url(__FILE__));
define('POST_SLIDER_VERSION', '1.0.32');

// Include plugin files
require_once POST_SLIDER_PATH . 'includes/class-post-slider.php';

/**
 * Callback function for rendering the slider block
 *
 * @param array $attributes Block attributes
 * @return string Block HTML code
 */
function post_slider_render_callback($attributes) {
    $post_slider = new Post_Slider();
    return $post_slider->render_post_slider($attributes);
}

// Plugin initialization
function post_slider_init() {
    $post_slider = new Post_Slider();
    $post_slider->init();
}
add_action('plugins_loaded', 'post_slider_init'); 