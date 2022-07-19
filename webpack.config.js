const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const isDev = process.env.NODE_ENV !== 'production';

const config = {
	mode: isDev ? 'development' : 'production',
	entry: './src/js/Game.ts',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	plugins: [
		new CleanWebpackPlugin(),
		new CopyPlugin([
			{ from: 'src/index.html' },
			{ from: 'src/css/style.css', to: 'css/' },
			{ from: 'src/images/player_0.png', to: 'images/' },
		]),
	],
	devServer: {
		contentBase: path.join(__dirname, 'dist'),
		compress: true,
		port: 8080,
		hot: true,
		open: true,
	},
	optimization: {
		minimize: !isDev,
	},
};

module.exports = config;
