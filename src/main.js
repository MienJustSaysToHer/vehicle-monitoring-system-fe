// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import BaiduMap from 'vue-baidu-map'
import App from './App'
import router from './router'

Vue.config.productionTip = false

Vue.use(ElementUI)

Vue.use(BaiduMap, {
  ak: '8pDsIpN3UBbraSvg9yV02GuOK5su0R4T'
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
