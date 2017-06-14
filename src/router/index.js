import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      children: [
        {
          path: '/',
          component: resolve => require(['../components/page/VehicleMonitoring.vue'], resolve)
        },
        {
          path: '/basetable',
          component: resolve => require(['../components/page/BaseTable.vue'], resolve)
        }
      ]
    }
  ]
})
