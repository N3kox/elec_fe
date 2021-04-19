module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/vue-d3-examples/'
    : '/',
  outputDir: 'docs',
  lintOnSave: false,
  devServer: {
    host : '0.0.0.0',
    port : 9999,
    overlay: {
        warning: false,
        errors: false
    }
  }
}
