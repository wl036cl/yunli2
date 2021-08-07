<template>
  <section v-if="page==='index'" :style="{height:height}">
    <index></index>
  </section>
  <section v-else-if="page==='login'" class="login-bg" :style="{height:height}">
    <sign @checkLogin="checkLogin"></sign>
  </section>
  <section v-else class="home">
    <mu-toast v-if="toast" :message="msg" @close="hideToast" />
    <mu-dialog v-if="dialog" :open="dialog" title="提示">
      {{msg}}
      <mu-flat-button
        v-show="isconfirm"
        slot="actions"
        @click="hideDialog(false)"
        primary
        label="取消"
      />
      <mu-flat-button slot="actions" primary @click="hideDialog(true)" label="确定" />
    </mu-dialog>
    <mu-appbar :title="homePage.title" :zDepth="1">
      <mu-icon-button
        :style="{visibility:this.homePage.backUrl.length?'visible':'hidden'}"
        icon="chevron_left"
        slot="left"
        @click="goBack"
      />
      <mu-icon-button icon="menu" slot="right" @click="homePage.navOpen=!homePage.navOpen" />
    </mu-appbar>
    <sideBar :open="homePage.navOpen" :docked="false" @toggle="toggleNav" @routerNav="routerNav"></sideBar>
    <div id="content">
      <transition name="fade" mode="out-in">
        <router-view @routerContent="routerContent" @alert="handleAlert" @goBack="goBack"></router-view>
      </transition>
    </div>
    <mu-back-top />
  </section>
</template>
<script>
import index from './main/Index'
import sign from '@/views/Sign.vue'

import sideBar from '@/components/SideBar.vue'
import Router from '@/router'
import Common from './../js/common'

export default {
  name: 'home',
  data () {
    return {
      toast: false,
      dialog: false,
      isconfirm: false,
      callback: null,
      msg: '',
      page: 'index',
      loginPage: {
        isShowLogin: true
      },
      height: document.body.parentNode.clientHeight + 'px',
      // height: '100vh',
      homePage: {
        title: '运力',
        backUrl: '',
        uid: 0,
        token: '',
        navOpen: false
      }
    }
  },
  components: { sign, index, sideBar },
  methods: {
    handleAlert (opt) {
      if (opt.callback) {
        this.callback = opt.callback
      } else {
        this.callback = null
      }
      if (opt.type === 'toast') {
        this.showToast(opt.msg, opt.hasOwnProperty('time') ? opt.time : 1000)
      } else if (opt.type === 'alert' || opt.type === 'confirm') {
        this.showDialog(opt.msg, opt.type === 'confirm')
      }
    },
    showDialog (msg, isconfirm) {
      this.msg = msg
      this.dialog = true
      this.isconfirm = isconfirm
    },
    hideDialog (tf) {
      this.dialog = false
      if (tf && this.callback) {
        this.callback(this)
        this.callback = null
      }
    },
    showToast (msg, time) {
      this.msg = msg
      this.toast = true
      if (this.toastTimer) {
        clearTimeout(this.toastTimer)
      }
      let $this = this
      this.toastTimer = setTimeout(function () {
        $this.hideToast()
      }, time || 1000)
    },
    hideToast () {
      if (this.callback) {
        this.callback(this)
        this.callback = null
      }
      this.toast = false
      if (this.toastTimer) {
        clearTimeout(this.toastTimer)
      }
    },
    checkLogin () {
      this.homePage.uid = Common.getCache('yunli_uid')
      this.homePage.token = Common.getCache('yunli_token')
      if (this.homePage.uid && this.homePage.token) {
        let $this = this
        Common.signIn(this, this.homePage.uid, this.homePage.token, 2, res => {
          if (Number(res.result) === 1) {
            $this.routerNav('sport')
            $this.page = 'home'
          } else {
            $this.page = 'login'
          }
        })
      } else {
        if (!this.loginPage.isShowLogin) {
          this.loginPage.isShowLogin = true
        }
        this.page = 'login'
      }
    },
    goBack () {
      history.go(-1)
    },
    toggleNav () {
      this.homePage.navOpen = !this.homePage.navOpen
    },
    routerNav (type) {
      let $this = this
      switch (type) {
        case 'close':
          Common.signOut(this, function () {
            $this.checkLogin()
          })
          break
        case 'gobang':
          Router.push({ name: type })
          break
        default:
          Router.replace({ name: type })
      }
      this.homePage.navOpen = false
    },
    routerContent (opt) {
      if (opt.hasOwnProperty('to')) {
        Router.push({ name: opt.to, params: opt['params'] })
      }
    }
  },
  mounted () {
    var $this = this
    document.title = '运力'
    setTimeout(function () {
      $this.checkLogin()
    }, 1000)
    // Common.reSize();
  },
  watch: {
    $route (to) {
      var path = to.path.replace(/^\//, '').split('/')
      this.homePage.backUrl =
        path.length > 1 || path[0].indexOf('edit') > 0 ? path : ''
    }
  }
}
</script>
<style lang="less" type="text/css">
@import "../styles/home.less";
</style>
