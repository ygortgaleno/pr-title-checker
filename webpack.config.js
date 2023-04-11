const path = require('path');

module.exports = {
	mode: 'production',
	entry: './src/index.ts',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
	},
	resolve: {
		extensions: ['.ts', '.js'],
		fallback: {
			fs: false,
			tls: false,
			net: false,
			path: false,
			http: false,
			https: false,
			stream: false,
			crypto: false,
			util: false,
			assert: false,
			os: false,
		},
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
};
