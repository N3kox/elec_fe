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
      component: () => import('./views/Home.vue'),
      meta:{
        title:'电力运检领域知识图谱'
      }
    },
    {
      path: '/examples',
      name: 'examples',
      component: () => import('./views/Examples.vue'),
      meta:{
        title:'hello'
      },
      children: [
        {
          path: '/examples/helloworld',
          name: 'helloworld',
          component: () => import('./components/HelloWorld.vue'),
          meta:{
            title:'知识图谱主页'
          }
        },
        {
          path: '/examples/D3Network',
          name: 'D3Network',
          component: () => import('./components/D3Network.vue'),
          meta:{
            title:'d3'
          }
        },
        {
          path: '/examples/MissionTicketOverview',
          name: 'MissionTicketOverview',
          component: () => import('./components/MissionTicketOverview.vue'),
          meta:{
            title:'任务总览'
          }
        },
        {
          path: '/examples/DeviceOverview',
          name: 'DeviceOverview',
          component: () => import('./components/DeviceOverview.vue'),
          meta:{
            title:'设备总览'
          }
        },
        {
          path: '/examples/LogsView',
          name: 'LogsView',
          component: () => import('./components/LogsView.vue'),
          meta:{
            title:'历史记录'
          }
        },
        {
          path: '/examples/NodeUpdate',
          name: 'NodeUpdate',
          component: () => import('./components/NodeUpdate.vue'),
          meta:{
            title:'节点更新结果'
          }
        },
        {
          path: '/examples/SearchView',
          name: 'SearchView',
          component: () => import('./components/SearchView.vue'),
          meta:{
            title:'实体数据搜索'
          }
        },
        {
          path: '/examples/TermSearch',
          name: 'TermSearch',
          component: () => import('./components/TermSearch.vue'),
          meta:{
            title:'术语查询'
          }
        },
        {
          path: '/examples/CsvUpload',
          name: 'CsvUpload',
          component: () => import('./components/CsvUpload.vue'),
          meta:{
            title:'数据上传更新'
          }
        },
        {
          path: '/examples/SolutionSearchView',
          name: 'SolutionSearchView',
          component: () => import('./components/SolutionSearchView.vue'),
          meta:{
            title:'方案查询'
          }
        }
      ]
    },
    {
      path: '*',
      name: 'notfound',
      component: () => import('./views/NotFound.vue')
    }
  ]
})
