/**
 * 路由配置
 * Created by ll36 on 2017/8/15.
 */
import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

const Home=resolve => require(['./../components/Home.vue'], resolve);
const NotFound=resolve => require(['./../components/404.vue'], resolve);

const Sprots=resolve => require(['./../components/Sports.vue'], resolve);
const SportEdit=resolve => require(['./../components/SportEdit.vue'], resolve);
const SportRecords=resolve => require(['./../components/SportRecords.vue'], resolve);
const SportRecordEdit=resolve => require(['./../components/SportRecordEdit.vue'], resolve);
const UserInfo=resolve => require(['./../components/UserInfo.vue'], resolve);
const About=resolve => require(['./../components/About.vue'], resolve);
const Setting=resolve => require(['./../components/Setting.vue'], resolve);

const Gobang=resolve => require(['./../components/game/Gobang.vue'], resolve);

const router = new VueRouter({
        mode: 'history',//hash(默认),history,abstract(基于nodejs)
        routes: [
            {path:'/index.html', component: Home},
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
                            {name: 'sportrecordedit', path: 'sportrecordedit/:sid/:sindex', component: SportRecordEdit},
                        ]
                    }
                ]
            },
            {name: 'gobang', path: '/Gobang', component: Gobang},
            {path: '*', component: NotFound}
        ],
        scrollBehavior: function (to, from, savedPosition) {
            return {x: 0, y: 0}
        }
    }
);

export default router; //将路由器导出