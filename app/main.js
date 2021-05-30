/**
 * Created by ll36 on 2017/8/15.
 */
import Vue from 'vue'
import App from './App'
import store from './store'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import 'muse-ui/dist/theme-dark.css'
import './styles/main.less'
import './styles/iconfont/material-icons.css'  // global styles

import router from './routes'

//解决跨域问题
//Vue.http.options.xhr = { withCredentials: true};
//Vue全局配置
//Common.deepClone(Config.vue, Vue.config);
// 使用 carbon 主题
Vue.use(MuseUI);

new Vue({
  el:'#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
