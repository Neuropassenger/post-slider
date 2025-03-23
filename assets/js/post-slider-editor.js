/**
 * Post Slider Block - Gutenberg Editor Script
 */
(function(wp) {
    const { registerBlockType } = wp.blocks;
    const { __ } = wp.i18n;
    const { useBlockProps, InspectorControls } = wp.blockEditor;
    const { PanelBody, RangeControl, SelectControl } = wp.components;
    const { useSelect } = wp.data;
    
    // Регистрация блока
    registerBlockType('post-slider/slider', {
        edit: function(props) {
            const { attributes, setAttributes } = props;
            const { postsCount, order, orderBy, categories } = attributes;
            const blockProps = useBlockProps();
            
            // Получение списка категорий для селектора
            const availableCategories = useSelect((select) => {
                return select('core').getEntityRecords('taxonomy', 'category', { per_page: -1 });
            }, []);
            
            const categoriesOptions = availableCategories
                ? availableCategories.map((category) => {
                    return {
                        label: category.name,
                        value: category.id
                    };
                  })
                : [];
            
            // Редактор блока
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
                        </PanelBody>
                    </InspectorControls>
                    
                    <div className="post-slider-editor-preview">
                        <div className="post-slider-editor-placeholder">
                            <h2>{__('Слайдер постов', 'post-slider')}</h2>
                            <p>{__('Отображает слайдер с последними постами блога.', 'post-slider')}</p>
                            <p>{__(`Выбрано постов: ${postsCount}`, 'post-slider')}</p>
                        </div>
                    </div>
                </div>
            );
        }
    });
})(window.wp); 