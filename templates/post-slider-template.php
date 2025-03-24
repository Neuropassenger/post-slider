<?php
/**
 * Template for displaying posts slider
 *
 * @var array $posts Array of posts to display
 * @var array $attributes Block attributes
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}
?>
<div class="post-slider-container">
    <div class="post-slider">
        <?php foreach ($posts as $index => $post) : 
            $post_id = $post->ID;
            $post_title = get_the_title($post_id);
            $post_date = get_the_date('d.m.Y', $post_id);
            $post_permalink = get_permalink($post_id);
            $featured_image = get_the_post_thumbnail_url($post_id, 'full');
            if (!$featured_image) {
                $featured_image = POST_SLIDER_URL . 'assets/images/default-background.jpg';
            }
        ?>
            <div class="post-slide<?php echo ($index === 0) ? ' active' : ''; ?>" data-index="<?php echo esc_attr($index); ?>">
                <div class="post-slide-background" style="background-image: url('<?php echo esc_url($featured_image); ?>');">
                    <div class="post-slide-content">
                        <div class="post-slide-date"><?php echo esc_html($post_date); ?></div>
                        <h2 class="post-slide-title"><?php echo esc_html($post_title); ?></h2>
                        <div class="post-slide-button">
                            <a href="<?php echo esc_url($post_permalink); ?>" class="post-slide-read-more">ЧИТАТЬ</a>
                        </div>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
        
        <div class="post-slider-navigation">
            <button class="post-slider-prev" aria-label="Предыдущий слайд">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
            <button class="post-slider-next" aria-label="Следующий слайд">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
    </div>
</div> 