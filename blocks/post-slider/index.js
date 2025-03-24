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
 * Регистрация блока слайдера постов
 */
registerBlockType(metadata.name, {
    /**
     * @see ./block.json
     */
    ...metadata,
    
    /**
     * Функция редактирования блока
     */
    edit: ({ attributes, setAttributes }) => {
        const { postsCount, order, orderBy, categories, isRandomPosts } = attributes;
        const blockProps = useBlockProps({
            className: 'post-slider-editor',
        });
        
        // Получение категорий для настроек
        const availableCategories = useSelect(
            (select) => {
                return select(coreStore).getEntityRecords('taxonomy', 'category', {
                    per_page: -1,
                });
            },
            []
        );
        
        // Формирование опций для селектора категорий
        const categoriesOptions = availableCategories
            ? availableCategories.map((category) => ({
                label: category.name,
                value: category.id,
              }))
            : [];
        
        return (
            <div {...blockProps}>
                <InspectorControls>
                    <PanelBody title={__('Настройки слайдера', 'post-slider')} initialOpen={true}>
                        <RangeControl
                            label={__('Количество постов', 'post-slider')}
                            value={postsCount}
                            onChange={(value) => setAttributes({ postsCount: value })}
                            min={1}
                            max={10}
                        />
                        
                        <ToggleControl
                            label={__('Случайные статьи', 'post-slider')}
                            help={isRandomPosts ? __('Отображаются случайные статьи со всего сайта', 'post-slider') : __('Отображаются статьи согласно настройкам сортировки', 'post-slider')}
                            checked={isRandomPosts}
                            onChange={(value) => setAttributes({ isRandomPosts: value })}
                        />
                        
                        {!isRandomPosts && (
                            <>
                                <SelectControl
                                    label={__('Сортировка', 'post-slider')}
                                    value={order}
                                    options={[
                                        { label: __('По убыванию', 'post-slider'), value: 'DESC' },
                                        { label: __('По возрастанию', 'post-slider'), value: 'ASC' }
                                    ]}
                                    onChange={(value) => setAttributes({ order: value })}
                                />
                                
                                <SelectControl
                                    label={__('Сортировать по', 'post-slider')}
                                    value={orderBy}
                                    options={[
                                        { label: __('Дате', 'post-slider'), value: 'date' },
                                        { label: __('Заголовку', 'post-slider'), value: 'title' },
                                        { label: __('Популярности', 'post-slider'), value: 'comment_count' }
                                    ]}
                                    onChange={(value) => setAttributes({ orderBy: value })}
                                />
                                
                                {categoriesOptions.length > 0 && (
                                    <SelectControl
                                        multiple
                                        label={__('Категории', 'post-slider')}
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
                        <h2>{__('Слайдер постов', 'post-slider')}</h2>
                        <p>{__('Отображает слайдер с последними постами блога.', 'post-slider')}</p>
                        {isRandomPosts ? (
                            <p>{__(`Отображаются ${postsCount} случайных статей со всего сайта`, 'post-slider')}</p>
                        ) : (
                            <p>{__(`Выбрано постов: ${postsCount}`, 'post-slider')}</p>
                        )}
                    </div>
                </div>
            </div>
        );
    },
    
    /**
     * Функция сохранения блока (пустая, т.к. рендер на стороне сервера)
     */
    save: () => {
        return null;
    }
}); 