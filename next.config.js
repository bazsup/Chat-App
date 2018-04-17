const withCss = require('@zeit/next-css')
const webpack = require('webpack')

const env = Object.keys(process.env).reduce(function (o, k) {
  o['process.env.' + k] = JSON.stringify(process.env[k])
  return o
}, {})

module.exports = withCss({
  webpack (config) {
    config.module.rules.push({
      test: /\.(png|svg|eot|otf|ttf|woff|woff2)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000,
          publicPath: './',
          outputPath: 'static/',
          name: '[name].[ext]'
        }
      }
    })
    config.plugins.push(
      new webpack.DefinePlugin(env)
    )

    return config
  }
})
