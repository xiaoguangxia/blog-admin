import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'

// element-ui css
import 'element-ui/lib/theme-chalk/index.css'

Vue.prototype.$axios = axios;
Vue.config.productionTip = false;
Vue.use(ElementUI);

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
