const path =    require('path');

const {CleanWebpackPlugin}          = require('clean-webpack-plugin');
const MiniCssExtractPlugin          = require("mini-css-extract-plugin");
const HtmlWebpackPlugin             = require('html-webpack-plugin');

const antdImports                   = require('ts-import-plugin');


module.exports = {
    mode        : "development",
    devServer   : {
        contentBase     : path.join(__dirname, 'dist'),
        compress        : true,
        port            : 9000,
        historyApiFallback  : true
    },
    devtool     : "source-map",
    resolve     : {extensions: [".ts", ".tsx", ".css", ".js"]},
    entry       : {
        app     : path.resolve(__dirname, 'development')
    },
    output      : {
        path        : path.resolve(__dirname, 'dist'),
        filename    : 'antd-components.dev.js'
    },
    module      : {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {loader: "ts-loader", options: {
                        configFile: path.resolve(__dirname, 'tsconfig.dev.json'),
                        transpileOnly: true,
                        getCustomTransformers: () => ({
                            before: [ antdImports({style: "css"}) ]
                        }),
                    }}
                ]
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader  : 'css-loader',
                        options: {
                            modules         : {
                                localIdentName  : '[name]__[local]'
                            },
                            importLoaders   : 1
                        }
                    },
                    {loader: 'postcss-loader'}
                ]
            },
            {
                test: /\.css$/,
                include: [path.resolve(__dirname, 'node_modules','antd')],
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            }
        ]
    },
    externals           : {
        "react"         : "React",
        "react-dom"     : "ReactDOM"
    },
    plugins             : [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename        : "antd-components.dev.css",
            chunkFilename   : "[id].css"
        }),
        new HtmlWebpackPlugin({
            title           : "Atnd components development",
            template        : path.resolve(__dirname, 'development', 'index.html')
        })
    ]
};