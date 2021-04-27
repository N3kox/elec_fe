import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./views/Home.vue')
    },
    {
      path: '/examples',
      name: 'examples',
      component: () => import('./views/Examples.vue'),
      children: [
        {
          path: '/examples/helloworld',
          name: 'helloworld',
          component: () => import('./components/HelloWorld.vue')
        },
        {
          path: '/examples/D3Network',
          name: 'D3Network',
          component: () => import('./components/D3Network.vue')
        },
        {
          path: '/examples/MissionTicketOverview',
          name: 'MissionTicketOverview',
          component: () => import('./components/MissionTicketOverview.vue')
        },
        {
          path: '/examples/DeviceOverview',
          name: 'DeviceOverview',
          component: () => import('./components/DeviceOverview.vue')
        },
        {
          path: '/examples/NodeUpdate',
          name: 'NodeUpdate',
          component: () => import('./components/NodeUpdate.vue')
        },
        {
          path: '/examples/SearchView',
          name: 'SearchView',
          component: () => import('./components/SearchView.vue')
        },
      ]
    },
    {
      path: '*',
      name: 'notfound',
      component: () => import('./views/NotFound.vue')
    }
  ]
})
