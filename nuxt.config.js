import webpack from 'webpack'
import vi from 'vee-validate/dist/locale/vi.json'
import en from 'vee-validate/dist/locale/en.json'

export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - SmartGateway',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#0abb87' },
  /*
   ** Global CSS
   */
  css: ['~/assets/sass/app.scss', '~/assets/sass/vendors.scss'],
  // ...
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/vue2-perfect-scrollbar', mode: 'client' },
    { src: '~/plugins/vue2-editor', mode: 'client', ssr: false },
    { src: '~/plugins/vue-fragment', mode: 'client', ssr: false },
    { src: '~/plugins/axios' },
    { src: '~/plugins/i18n' },
    { src: '~/plugins/vee-validate' },
    { src: '~/plugins/vue-bootstrap-datetimepicker', mode: 'client' },
    { src: '~/plugins/element-ui' },
    { src: '~/plugins/persistedState.client' },
    { src: '~/plugins/vue-json-excel' }
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: ['bootstrap-vue/nuxt', '@nuxtjs/axios', '@nuxtjs/auth', 'nuxt-i18n'],
  bootstrapVue: {
    bootstrapCSS: false,
    bootstrapVueCSS: false
  },
  i18n: {
    locales: [
      {
        code: 'vi',
        file: 'vi.js'
      },
      {
        code: 'en',
        file: 'en.js'
      }
    ],
    defaultLocale: 'vi',
    strategy: 'prefix_and_default',
    vueI18n: {
      fallbackLocale: 'en',
      messages: {
        en: {
          validation: en.messages
        },
        vi: {
          validation: vi.messages
        }
      }
    },
    lazy: true,
    langDir: 'lang/'
  },
  auth: {
    plugins: ['~/plugins/auth'],
    // Options
    redirect: {
      login: '/auth/login',
      logout: '/auth/login',
      callback: false
      // home: '/brokers'
    },
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/admin/users/login',
            method: 'POST',
            propertyName: 'token'
          },
          logout: { url: '/admin/users/logout', method: 'post' },
          user: { url: '/admin/users/me', method: 'post', propertyName: 'user' }
        }
      }
    }
  },
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: process.env.API_URL
  },
  /*
   ** Build configuration
   */
  router: {
    middleware: ['page', 'check-permission']
  },
  build: {
    vendor: ['jquery'],
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        // jQuery: 'jquery'
        moment: 'moment'
      })
    ],
    /*
     ** You can extend webpack config here
     */
    // Add exception
    transpile: ['vee-validate/dist/rules'],
    extend(config, ctx) { }
  }
}
