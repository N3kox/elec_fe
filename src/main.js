import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { vuetify, i18n } from '@/plugins/vuetify'
import VueParticles from 'vue-particles'
import base from './base'
import element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueResource from 'vue-resource'
import axios from 'axios'

Vue.config.productionTip = false
Vue.use(VueParticles)
Vue.use(base)
Vue.use(element)
Vue.use(VueResource)
Vue.prototype.$axios = axios
axios.defaults.baseURL="/query"
axios.defaults.headers.get['Content-Type'] = 'application/json';

new Vue({
  router,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount('#app')
