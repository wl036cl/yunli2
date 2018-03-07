/**
 * Created by ll36 on 2017/8/15.
 */
import Vue from 'vue';
import VueResource from 'vue-resource';
import Config from './config';
import Common from './common';
import Router from './routers';
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import 'muse-ui/dist/theme-dark.css';
import "./../css/main.less";
import "./../css/iconfont/material-icons.css";

Vue.use(VueResource);
//解决跨域问题
Vue.http.options.xhr = { withCredentials: true};
//Vue全局配置
Common.deepClone(Config.vue, Vue.config);
// 使用 carbon 主题
Vue.use(MuseUI);

const app =new Vue({
        router:Router
}).$mount('#app');
