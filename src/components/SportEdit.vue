<template>
    <div class="sport-edit">
        <textEdit :list="textlist" @handleInput="handleError" @handleSelect="handleSelect"></textEdit>
        <p class="errmsg" :class="{red:!msg.isRight,green:msg.isRight}">
            {{msg.content}}
        </p>
        <mu-raised-button :label="btntext" @click="test" secondary fullWidth :disabled="disabled"/>
    </div>
</template>

<script>
import Config from './../js/config'
import Common from './../js/common'
import textEdit from './TextEdit.vue'
export default {
  components: {textEdit},
  data () {
    return {
      textlist: [
        { maxlength: 10, placeholder: '项目名称', type: 'text', value: '', errmsg: '' },
        { maxlength: 6, placeholder: '项目目标', type: 'tel', value: '', errmsg: '' },
        { maxlength: 4, placeholder: '计量单位', type: 'text', value: '', errmsg: '' },
        { maxlength: 100, placeholder: '运动宣言', type: 'multiline', rows: 2, rowsMax: 5, value: '', errmsg: '' },
        { placeholder: '状态',
          name: 'status',
          type: 'select',
          value: 1,
          icon: 'show_chart',
          disabled: true,
          list: [{value: 1, text: '启动', icon: 'show_chart'},
            {value: 2, text: '成功', icon: 'check'},
            {value: 3, text: '失败', icon: 'close'}
          ] },
        { placeholder: '是否公开', type: 'checkbox', uncheckIcon: 'visibility_off', checkedIcon: 'visibility', value: true}
      ],
      msg: {
        isRight: true,
        content: ''
      },
      disabled: false,
      btntext: '添加'
    }
  },
  methods: {
    handleError (index) {
      var item = this.textlist[index]
      this.textlist[index].errmsg = ''
      if (!item.value || !item.value.length) {
        return
      }
      if (item.value.length > item.maxlength) {
        this.textlist[index].errmsg = '超过了'
      }
      switch (index) {
        case 0:
          {
            if (!/^[\u4e00-\u9fa5|\w]{1,10}$/.test(item.value)) { this.textlist[index].errmsg = '项目名称为10个字以内！' }
          }
          break
        case 1:
          {
            if (!/^[\d|\.]{1,6}$/.test(item.value)) { this.textlist[index].errmsg = '项目目标为6位内的正数！' }
          }
          break
      }
    },
    handleSelect (value) {
      this.textlist[4].icon = this.textlist[4].list[Number(value) - 1].icon
    },
    setData (data) {
      this.textlist[0].value = data.title
      this.textlist[1].value = data.target
      this.textlist[2].value = data.unit
      this.textlist[3].value = data.remark
      this.textlist[4].value = data.status
      this.textlist[4].disabled = false
      this.handleSelect(data.status)
      this.textlist[5].value = (data.isPrivate != 1)

      this.btntext = '更新'
    },
    getSport: function () {
      if (this.userId && this.token) {
        if (this.Id) {
          this.$http.jsonp(Config.apiUrl + Config.urlsEnum.getSport,
            {
              params: {
                uid: this.userId,
                token: this.token,
                sid: this.Id
              }
            }).then(function (res) {
            res = res.data
            if (res.result == 1) {
              this.setData(res.data)
            } else {
              this.$emit('alert', {type: 'alert', msg: res.msg}, function (that) {
                that.homePage.backUrl = ''
                histroy.go(-1)
              })
            }
          })
        }
      } else { history.go(-1) }
    },
    editSport () {
      if (this.userId && this.token) {
        this.disabled = true
        this.$http.jsonp(Config.apiUrl + Config.urlsEnum.editSport,
          {
            params: {
              uid: this.userId,
              token: this.token,
              sid: this.Id,
              title: this.textlist[0].value,
              target: this.textlist[1].value,
              unit: this.textlist[2].value,
              remark: this.textlist[3].value,
              status: this.textlist[4].value,
              isprivate: !this.textlist[5].value
            }
          }).then(function (res) {
          res = res.data
          if (res.result == 1) {
            var $this = this
            this.$emit('alert', {
              type: 'toast',
              msg: res.msg,
              callback: function (that) {
                Common.setCache('yunli_sports_' + $this.userId)
                Common.setCache('yunli_sport_' + $this.Id)
                that.homePage.backUrl = ''
                history.go(-1)
              }
            })
          } else {
            this.disabled = false
            this.$emit('alert', {type: 'alert', msg: res.msg})
          }
        })
      }
    },
    test () {
      if (Common.checkTextEdit(this.textlist)) {
        var msg = ''
        if (!this.textlist[0].value.length) { msg += '名称不能为空' } else if (!Number(this.textlist[1].value)) { msg += '目标不能为空' } else if (!this.textlist[2].value.length) { msg += '计量单位不能为空' } else if (!this.textlist[3].value.length) { msg += '运动宣言不能为空' }

        if (msg.length > 0) {
          this.msg.content = msg
          this.msg.isRight = false
        } else {
          this.editSport()
        }
      }
    }
  },
  mounted () {
    this.userId = Common.getCache('yunli_uid')
    this.token = Common.getCache('yunli_token')
    this.Id = this.$route.params.id || 0
    if (this.Id) { this.getSport() }
  }
}
</script>
<style lang="less">
    .sport-edit{
        width:80%;
        margin: 0 auto;
        padding:2rem 0 0;

    }
</style>
