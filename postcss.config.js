const path = require('path');

module.exports = {
    plugins: {
        'postcss-preset-env'        : { stage: 0 },
        'postcss-custom-properties' : { importFrom : path.resolve(__dirname,'components/styles/variables.css'), preserve: true},
        'postcss-color-function'    : { preserveCustomProps : false}
    }
};