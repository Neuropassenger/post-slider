const defaultConfig = require('@wordpress/scripts/config/webpack.config');

module.exports = {
    ...defaultConfig,
    entry: {
        'post-slider': './blocks/post-slider/index.js'
    }
}; 