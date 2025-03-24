/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { 
    PanelBody, 
    RangeControl,
    SelectControl,
    ToggleControl
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

/**
 * Internal dependencies
 */
import metadata from './block.json';

/**
 * Register posts slider block
 */
registerBlockType(metadata.name, {
    /**
     * @see ./block.json
     */
    ...metadata,
    
    /**
     * Block edit function
     */
    edit: ({ attributes, setAttributes }) => {
        const { postsCount, order, orderBy, categories, isRandomPosts } = attributes;
        const blockProps = useBlockProps({
            className: 'post-slider-editor',
        });
        
        // Get categories for settings
        const availableCategories = useSelect(
            (select) => {
                return select(coreStore).getEntityRecords('taxonomy', 'category', {
                    per_page: -1,
                });
            },
            []
        );
        
        // Create options for category selector
        const categoriesOptions = availableCategories
            ? availableCategories.map((category) => ({
                label: category.name,
                value: category.id,
              }))
            : [];
        
        return (
            <div {...blockProps}>
                <InspectorControls>
                    <PanelBody title={__('Slider Settings', 'post-slider')} initialOpen={true}>
                        <RangeControl
                            label={__('Number of Posts', 'post-slider')}
                            value={postsCount}
                            onChange={(value) => setAttributes({ postsCount: value })}
                            min={1}
                            max={10}
                        />
                        
                        <ToggleControl
                            label={__('Random Posts', 'post-slider')}
                            help={isRandomPosts ? __('Displaying random posts from the entire site', 'post-slider') : __('Displaying posts according to sorting settings', 'post-slider')}
                            checked={isRandomPosts}
                            onChange={(value) => setAttributes({ isRandomPosts: value })}
                        />
                        
                        {!isRandomPosts && (
                            <>
                                <SelectControl
                                    label={__('Order', 'post-slider')}
                                    value={order}
                                    options={[
                                        { label: __('Descending', 'post-slider'), value: 'DESC' },
                                        { label: __('Ascending', 'post-slider'), value: 'ASC' }
                                    ]}
                                    onChange={(value) => setAttributes({ order: value })}
                                />
                                
                                <SelectControl
                                    label={__('Order By', 'post-slider')}
                                    value={orderBy}
                                    options={[
                                        { label: __('Date', 'post-slider'), value: 'date' },
                                        { label: __('Title', 'post-slider'), value: 'title' },
                                        { label: __('Popularity', 'post-slider'), value: 'comment_count' }
                                    ]}
                                    onChange={(value) => setAttributes({ orderBy: value })}
                                />
                                
                                {categoriesOptions.length > 0 && (
                                    <SelectControl
                                        multiple
                                        label={__('Categories', 'post-slider')}
                                        value={categories}
                                        options={categoriesOptions}
                                        onChange={(value) => setAttributes({ categories: value })}
                                    />
                                )}
                            </>
                        )}
                    </PanelBody>
                </InspectorControls>
                
                <div className="post-slider-editor-preview">
                    <div className="post-slider-editor-placeholder">
                        <h2>{__('Posts Slider', 'post-slider')}</h2>
                        <p>{__('Displays a slider with the latest blog posts.', 'post-slider')}</p>
                        {isRandomPosts ? (
                            <p>{__(`Displaying ${postsCount} random posts from the entire site`, 'post-slider')}</p>
                        ) : (
                            <p>{__(`Selected posts: ${postsCount}`, 'post-slider')}</p>
                        )}
                    </div>
                </div>
            </div>
        );
    },
    
    /**
     * Block save function (empty because rendering is done on server side)
     */
    save: () => {
        return null;
    }
}); 