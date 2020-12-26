const path = require('path');
const src = path.resolve(__dirname, 'src');
const dist = path.resolve(__dirname, 'dist');
const main = path.resolve(src, 'index.js');
const indexHtml = path.resolve(src, 'index.html');
const phoneSlider = path.resolve(src, 'lib/PhoneSlider.js');

const htmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack');

const config = {
    mode: 'production',
    devtool: 'cheap-module-source-map',
    entry: {
        PhoneSlider: phoneSlider,
        main: main
    },
    output: {
        path: dist,
        filename: '[name].js',
        library: 'PhoneSlider',
        libraryTarget: 'umd',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {loader: 'babel-loader'}
                ]
            },
            {
                test: /\.scss$/, use: [
                    MiniCssExtractPlugin.loader,
                    //'style-loader',
                    'css-loader',
                    'sass-loader',
                    'postcss-loader'
                ]
            },
            {
                test: /\.(png|jpg|jpeg)$/i, use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: './images',
                            name: '[name].[ext]'
                        }
                    }
                ]
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns: ['dist']
        }),
        new MiniCssExtractPlugin({
            filename: "./css/phone-slider.min.css",
        }),
        new htmlWebpackPlugin({
            filename: 'example.html',
            template: indexHtml,
            chunks: 'all',
            inject: true,
            minify: false
        }),
        new UglifyJsPlugin({
            parallel: true
        })
    ],
    optimization: {
        usedExports: true,
        minimizer: [
            new CssMinimizerPlugin(),
        ],
    }
};

module.exports = (env) => {
    if (env && env.dev) {
        config.mode = 'development';
        config.devServer = {
            contentBase: dist,
            open: true,
            openPage: 'example.html',
        }
    }
    return config;
}