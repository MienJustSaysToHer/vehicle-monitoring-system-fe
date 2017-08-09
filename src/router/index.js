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
          path: '/vehicles',
          component: resolve => require(['../components/page/Vehicles.vue'], resolve)
        },
        {
          path: '/transportorders',
          component: resolve => require(['../components/page/TransportOrders.vue'], resolve)
        },
        {
          path: '/',
          component: resolve => require(['../components/page/VehicleMonitoring.vue'], resolve)
        },
        {
          path: '/transportorder',
          component: resolve => require(['../components/page/TransportOrder.vue'], resolve)
        },
        {
          path: '/distribution',
          component: resolve => require(['../components/page/VehicleDistribution.vue'], resolve)
        }
      ]
    }
  ]
})
