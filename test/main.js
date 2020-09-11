import Vue from 'vue'
import App from './App.vue'
import TreeSelect from '../src/main.js'

Vue.config.productionTip = false

Vue.use(TreeSelect)

new Vue({
  render: h => h(App)
}).$mount('#app')
