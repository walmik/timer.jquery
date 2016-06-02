module.exports = {
	entry:  './src/index.js',
	output: {
		path:     'dist',
		filename: 'timer.jquery.js',
	},
	module: {
		loaders: [
			{
				test: /\.js?$/,
				exclude: 'node_modules',
				loader: 'babel', // 'babel-loader' is also a legal name to reference 
				query: {
					presets: ['es2015']
				}
			}
		]
	}
};
