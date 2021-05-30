/**
 * Author:ll36
 * Create Time:2018/03/21 18:15
 * Descripttion:
 */
/**
 * 路由配置
 * Created by ll36 on 2017/8/15.
 */
import Vue from 'vue'
import Router from 'vue-router'
import Sign from '@/views/Sign'
import NotFound from '@/views/NotFound'
import Home from '@/views/Home'

import Gobang from '@/components/game/vue-gobang'
import SportEdit from '@/components/SportEdit'
import Sports from '@/components/Sports'
import Figures from '@/components/Figures'
import SportRecords from '@/components/SportRecords'
import SportRecordEdit from '@/components/SportRecordEdit'

import UserInfo from '@/components/UserInfo'
import About from '@/components/About'
import Setting from '@/components/Setting'

Vue.use(Router)

// const Sign = () => import('../views/Sign')
// const NotFound = () => import('../views/NotFound')
// const Home = () => import('../views/Home')

// const Gobang = () => import('../components/Gobang')
// const SportEdit = () => import('../components/SportEdit')
// const Sports = () => import('../components/Sports')
// const SportRecords = () => import('../components/SportRecords')
// const SportRecordEdit = () => import('../components/SportRecordEdit')

// const UserInfo = () => import('../components/UserInfo')
// const About = resolve => import('../components/About')
// const Setting = resolve => import('../components/Setting')

// const Home = resolve => require(['./../components/Home.vue'], resolve);
// const NotFound = resolve => require(['./../components/NotFound.vue'], resolve);
//
// const Sprots = resolve => require(['./../components/Sports.vue'], resolve);
// const SportEdit = resolve => require(['./../components/SportEdit.vue'], resolve);
// const SportRecords = resolve => require(['./../components/SportRecords.vue'], resolve);
// const SportRecordEdit = resolve => require(['./../components/SportRecordEdit.vue'], resolve);
// const UserInfo = resolve => require(['./../components/UserInfo.vue'], resolve);
// const About = resolve => require(['./../components/About.vue'], resolve);
// const Setting = resolve => require(['./../components/Setting.vue'], resolve);
//
// const Gobang = resolve => require(['./../components/game/Gobang.vue'], resolve);

const router = new Router({
  // mode: 'history', // hash(默认),history,abstract(基于nodejs) （使用history服务器上运行存在问题）
  routes: [
    {
      path: '/sign', component: Sign
    },
    {
      path: '/404', component: NotFound
    },
    {
      path: '/',
      component: Home,
      children: [
        {name: 'user', path: 'user', component: UserInfo},
        {name: 'about', path: 'about', component: About},
        {name: 'set', path: 'set', component: Setting},
        {name: 'sportedit', path: 'sportedit', component: SportEdit},
        {name: 'figure', path: 'figure', component: Figures},
        {
          name: 'sport',
          path: 'sport',
          component: Sports,
          children: [
            {name: 'sportrecords', path: 'sportrecords/:sid/:sindex', component: SportRecords},
            {name: 'sportrecordedit', path: 'sportrecordedit/:sid/:sindex', component: SportRecordEdit}
          ]
        }
      ]
    },
    {name: 'gobang', path: '/Gobang', component: Gobang},
    {path: '*', component: NotFound}
  ],
  scrollBehavior: () => { // 回退后返回顶部
    return {y: 0}
  }
})
router.beforeEach((to, from, next) => {
  next()
})

export default router // 将路由器导出
