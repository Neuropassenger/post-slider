<?php
/**
 * Plugin Name: Post Slider
 * Description: Gutenberg блок для отображения слайдера с постами блога
 * Version: 1.0.0
 * Author: DevGale
 * Text Domain: post-slider
 */

// Выход при прямом доступе
if (!defined('ABSPATH')) {
    exit;
}

// Определение констант плагина
define('POST_SLIDER_PATH', plugin_dir_path(__FILE__));
define('POST_SLIDER_URL', plugin_dir_url(__FILE__));
define('POST_SLIDER_VERSION', '1.0.0');

// Подключение файлов плагина
require_once POST_SLIDER_PATH . 'includes/class-post-slider.php';

// Инициализация плагина
function post_slider_init() {
    $post_slider = new Post_Slider();
    $post_slider->init();
}
add_action('plugins_loaded', 'post_slider_init'); 