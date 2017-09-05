/**
 * Created by ll36 on 2017/8/15.
 */
import Vue from 'vue';
import VueResource from 'vue-resource';
Vue.use(VueResource);
//解决跨域问题
Vue.http.options.xhr = { withCredentials: true};
import Config from './config';
import Common from './common';
Common.deepClone(Config.vue, Vue.config);//Vue全局配置
import Router from './routers';

import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import 'muse-ui/dist/theme-dark.css'; // 使用 carbon 主题
Vue.use(MuseUI);
import "./../css/main.less";
import "./../css/iconfont/material-icons.css";

const app =new Vue({
        router:Router
}).$mount('#app');
