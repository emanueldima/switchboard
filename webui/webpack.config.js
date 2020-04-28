const path = require('path');
const webpack = require('webpack');
const PATHS = {
    compiled_app: __dirname+"/../backend/src/main/resources/webui",
};
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    entry: ['./src/index.jsx'],
    devtool: 'source-map',
    output: {
        path: PATHS.compiled_app,
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {   test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                include: path.join(__dirname, 'src')
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            // {
            //     test: /\.(png|woff|woff2|eot|ttf|svg)/,
            //     loader: 'url-loader?limit=100000'
            // },
            // {
            //     test: /\.(png|jpg)$/,
            //     loader: 'file-loader?name=[name].[ext]',
            //     include: path.join(__dirname, 'src/images')
            // },
        ]
    },
    // plugins: [new BundleAnalyzerPlugin()],
    devServer: {
        contentBase: PATHS.compiled_app,
        historyApiFallback: true,
        proxy: {
            '/api/**': {
                target :'http://localhost:8080',
                changeOrigin: true,
                secure: false
            }
        }
    }
};
