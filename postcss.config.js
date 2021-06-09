const path = require('path');

module.exports = {
    plugins: {
        'postcss-preset-env'        : { stage: 0 },
        'postcss-custom-properties' : { preserve: true},
        'postcss-color-function'    : { preserveCustomProps : false}
    }
};