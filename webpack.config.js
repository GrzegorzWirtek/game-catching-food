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
			{ from: 'src/images/bcg.png', to: 'images/' },
			{ from: 'src/images/player.png', to: 'images/' },
			{ from: 'src/images/fruit0.png', to: 'images/' },
			{ from: 'src/images/fruit1.png', to: 'images/' },
			{ from: 'src/images/fruit2.png', to: 'images/' },
			{ from: 'src/images/fruit3.png', to: 'images/' },
			{ from: 'src/images/fruit4.png', to: 'images/' },
			{ from: 'src/images/fruit5.png', to: 'images/' },
			{ from: 'src/images/fruit6.png', to: 'images/' },
			{ from: 'src/images/fruit7.png', to: 'images/' },
			{ from: 'src/images/fruit8.png', to: 'images/' },
			{ from: 'src/images/fruit9.png', to: 'images/' },
			{ from: 'src/images/fruit10.png', to: 'images/' },
			{ from: 'src/images/fruit11.png', to: 'images/' },
			{ from: 'src/images/fruit12.png', to: 'images/' },
			{ from: 'src/images/fruit13.png', to: 'images/' },
			{ from: 'src/images/fruit14.png', to: 'images/' },
			{ from: 'src/images/fruit15.png', to: 'images/' },
			{ from: 'src/images/fruit16.png', to: 'images/' },
			{ from: 'src/images/fruit17.png', to: 'images/' },
			{ from: 'src/images/fruit18.png', to: 'images/' },
			{ from: 'src/images/fruit19.png', to: 'images/' },
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
