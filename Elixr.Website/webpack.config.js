module.exports = {  
  entry: {
    app: './app.ts',
    vendor: './vendor.ts'
  },
  output: {
    path: __dirname,
    filename: '/dist/[name]/bundle.js'
  },
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  module: {
    loaders: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  }
}