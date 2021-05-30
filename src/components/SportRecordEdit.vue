<template>
  <div class="sport-record-edit">
    <textEdit :list="textlist" @handleInput="handleError"></textEdit>
    <p class="errmsg" :class="{red:!msg.isRight,green:msg.isRight}">{{msg.content}}</p>
    <mu-raised-button :label="btntext" @click="test" secondary fullWidth :disabled="disabled" />
  </div>
</template>

<script>
import Config from './../js/config'
import Common from './../js/common'
import textEdit from './TextEdit.vue'
export default {
  components: { textEdit },
  data () {
    return {
      textlist: [
        {
          maxlength: 6,
          placeholder: '完成量',
          type: 'tel',
          value: '',
          errmsg: '',
          list: null
        },
        {
          maxlength: 200,
          placeholder: '完成时间',
          type: 'date',
          value: Common.dateFtt('yyyy-MM-dd', new Date()),
          max: Common.dateFtt('yyyy-MM-dd', new Date()),
          errmsg: '',
          list: null
        },
        {
          maxlength: 200,
          placeholder: '心得体会',
          type: 'multiline',
          rows: 2,
          rowsMax: 5,
          value: '',
          errmsg: '',
          list: null
        }
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
            if (!/^[\d|\.]{1,6}$/.test(item.value)) {
              this.textlist[index].errmsg = '完成量为6位内的正数！'
            }
          }
          break
      }
    },
    setData (data) {
      this.textlist[0].value = data.recordNum
      this.textlist[1].value = data.recordTime
      this.textlist[3].value = data.remark

      this.btntext = '更新'
    },
    getRecord: function () {
      if (this.userId && this.token) {
        if (this.sportId) {
          this.$http
            .jsonp(Config.apiUrl + Config.urlsEnum.getSport, {
              params: {
                uid: this.userId,
                token: this.token,
                sid: this.sportId
              }
            })
            .then(function (res) {
              res = res.data
              if (res.result == 1) {
                this.setData(res.data)
              } else {
                this.$emit('alert', { type: 'alert', msg: res.msg }, function (
                  that
                ) {
                  that.homePage.backUrl = ''
                  histroy.go(-1)
                })
              }
            })
        }
      } else {
        history.go(-1)
      }
    },
    editRecord () {
      if (this.userId && this.token && this.sid) {
        this.disabled = true
        this.$http
          .jsonp(Config.apiUrl + Config.urlsEnum.editSportRecord, {
            params: {
              uid: this.userId,
              token: this.token,
              sid: this.sid,
              rid: this.rid,
              num: this.textlist[0].value,
              time: this.textlist[1].value,
              remark: this.textlist[2].value
            }
          })
          .then(function (res) {
            res = res.data
            if (res.result == 1) {
              localStorage.removeItem('yunli_records_' + this.sid)
              localStorage.removeItem('yunli_sport_' + this.sid)
              localStorage.removeItem('yunli_sports_' + this.userId)
              this.$parent.list[0]['recordNum'] += 1 // 修改数量
              this.$parent.list[0]['lastTimeStr'] = Common.dateFtt(
                'yyyy-MM-dd',
                new Date()
              ) // 修改更新时间
              // this.$parent.allList[this.sindex]['recordNum']+=1;
              this.$emit('alert', {
                type: 'toast',
                msg: res.msg,
                callback: function () {
                  history.go(-1)
                }
              })
            } else {
              this.disabled = false
              this.$emit('alert', { type: 'alert', msg: res.msg })
            }
          })
      }
    },
    test () {
      if (Common.checkTextEdit(this.textlist)) {
        var msg = ''
        if (!Number(this.textlist[0].value)) {
          msg += '完成量为6位内的正数'
        }

        if (msg.length > 0) {
          this.msg.content = msg
          this.msg.isRight = false
        } else {
          this.editRecord()
        }
      }
    }
  },
  mounted () {
    this.userId = Common.getCache('yunli_uid')
    this.token = Common.getCache('yunli_token')
    this.sid = this.$route.params.sid || 0
    this.sindex = this.$route.params.sindex || 0
    this.rid = this.$route.params.rid || 0
    if (this.rid) {
      this.getRecord()
    }
  }
}
</script>
<style lang="less">
.sport-record-edit {
  width: 80%;
  margin: 0 auto;
  padding: 2rem 0 0;
}
</style>
