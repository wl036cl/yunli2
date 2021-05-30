<template>
  <nav>
    <mu-drawer :open="open" :docked="docked" @close="toggle">
      <mu-list @itemClick="router">
        <mu-list-item value="user" :title="user.name">
          <mu-avatar :src="user.head" slot="leftAvatar" />
        </mu-list-item>
      </mu-list>
      <mu-divider />
      <mu-list @itemClick="router">
        <mu-list-item value="sport" title="运动项目">
          <mu-icon slot="left" value="directions_run" />
        </mu-list-item>
        <mu-list-item value="body" title="身体指数">
          <mu-icon slot="left" value="accessibility" />
        </mu-list-item>
      </mu-list>
      <mu-divider />
      <mu-list @itemClick="router">
        <mu-list-item value="set" title="设置">
          <mu-icon slot="left" value="settings" />
        </mu-list-item>
        <mu-list-item value="about" title="关于">
          <mu-icon slot="left" value="help" />
        </mu-list-item>
      </mu-list>
      <mu-divider />
      <mu-list @itemClick="router">
        <mu-list-item value="gobang" title="休息一刻">
          <mu-icon slot="left" value="blur_off" />
        </mu-list-item>
      </mu-list>
      <mu-list @itemClick="router">
        <mu-list-item value="close" title="注销">
          <mu-icon slot="left" value="power_settings_new" />
        </mu-list-item>
        <mu-list-item v-if="docked" @click.native="open = false" title="Close" />
      </mu-list>
    </mu-drawer>
  </nav>
</template>

<script>
import Common from '../js/common'
export default {
  data () {
    return {
      //                open:true,
      //                docked:true,
      user: { uid: 0, token: 0, head: '', name: '' }
    }
  },
  props: {
    open: {
      type: Boolean,
      required: false
    },
    docked: {
      type: Boolean,
      required: false
    }
  },
  methods: {
    toggle () {
      this.$emit('toggle')
    },
    router (e) {
      this.$emit('routerNav', e.value)
    }
  },
  mounted () {
    this.user.uid = Common.getCache('yunli_uid')
    this.user.token = Common.getCache('yunli_token')
    var $this = this
    if (this.user.uid && this.user.token) {
      Common.getUser(this, this.user.uid, this.user.token, function (res) {
        if (res.result == 1) {
          $this.user.head = Common.getUrl(res.uhead)
          $this.user.name = res.uname
        } else {
          Common.setCache([['yunli_uid'], ['yunli_token']])
        }
      })
    }
  }
}
</script>
