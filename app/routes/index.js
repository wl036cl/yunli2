/**
 * Author:ll36
 * Create Time:2018/03/21 18:15
 * Descripttion:
 */
/**
 * 路由配置
 * Created by ll36 on 2017/8/15.
 */
import Vue from 'vue';
import Router from 'vue-router'

Vue.use(Router)

const Sign = () => import('../views/Sign')
const NotFound = () => import('../views/NotFound')
const Home = () => import('../views/Home')

const Gobang=()=> import('../components/Gobang')
const SportEdit = () => import('../components/SportEdit')
const Sprots = () => import('../components/Sprots')
const SportRecords = () => import('../components/SportRecords')
const SportRecordEdit = () => import('../components/SportRecordEdit')

const UserInfo = () => import('../components/UserInfo')
const About = resolve => import('../components/About')
const Setting = resolve => import('../components/Setting')

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
  mode: 'history',//hash(默认),history,abstract(基于nodejs)
  routes: [
    {
      path: '/sign', component: Sign
    },
    {
      path: '/404', component: NotFound
    },
    {
      path: '/', component: Home,
      children: [
        {name: 'user', path: 'user', component: UserInfo},
        {name: 'about', path: 'about', component: About},
        {name: 'set', path: 'set', component: Setting},
        {name: 'sportedit', path: 'sportedit', component: SportEdit},
        {
          name: 'sport', path: 'sport', component: Sprots,
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
  scrollBehavior:()=> {//回退后返回顶部
    return {y: 0}
  }
});

export default router; //将路由器导出