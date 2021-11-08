const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')

module.exports = {
    entry: "./src/main.js",
    output: {
        path: path.resolve(__dirname, 'dist/'),
        publicPath: 'dist',
        libraryTarget: "commonjs2",
    },
    devtool: false,
    devServer: {
        quiet: true
    },
    externals: {
        uxp: "uxp",
        scenegraph: "scenegraph",
        assets: "assets"
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader"
            },
            {
                test: /\.scss$/,
                use: ["style-loader", "css-loader", 'sass-loader']
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new FriendlyErrorsWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [{ from: 'static', to: '' }]
        }),
    ]
};
