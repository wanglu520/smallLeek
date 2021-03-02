import Vue from 'vue'
import App from './App'
import myRequest from '@/api/myRequest.js'

Vue.config.productionTip = false
Vue.prototype.$myRequest = myRequest

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
