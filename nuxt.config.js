module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'starter',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [{
      src: 'http://g.tbcdn.cn/mtb/lib-flexible/0.3.4/??flexible_css.js,flexible.js'
    }, {
      src: 'http://res.wx.qq.com/open/js/jweixin-1.2.0.js'
    }]
  },
  /*
  ** Global CSS
  */
  css: [{src: 'static/sass/base.sass', lang: 'sass?indentedSyntax=true'}],
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#3B8070' }
}
