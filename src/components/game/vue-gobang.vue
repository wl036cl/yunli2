<template>
        <canvas :id="id"
                :width="width"
                :height="height"></canvas>
</template>
<script>
import GoBang from './gobang'
export default{
  data () {
    return {
      id: 'mygoBang',
      width: Math.round(Math.round(window.devicePixelRatio) * (document.body.clientWidth < document.documentElement.offsetHeight ? document.body.clientWidth : document.documentElement.offsetHeight)),
      height: Math.round(Math.round(window.devicePixelRatio) * (document.body.clientWidth / 23 * 31 < document.documentElement.offsetHeight ? document.body.clientWidth / 23 * 31 : (document.body.clientWidth > document.documentElement.offsetHeight ? document.documentElement.offsetHeight : document.body.clientWidth))) // 高度远大于宽度

      // width: Math.round(document.body.clientWidth*Math.round(window.devicePixelRatio)),
      // height: Math.round(document.body.clientWidth*Math.round(window.devicePixelRatio)/23*31),
    }
  },
  methods: {

  },
  mounted: function () {
    GoBang('mygoBang', { mode: 'auto' })
  }
}
</script>
<style lang="less">
    canvas{
        width: 100%;
        box-shadow: -2px -2px 2px #1b1b1b, 5px 5px 5px #1b1b1b;
        cursor: pointer;
        display: block;
        margin:0 auto;
    }
</style>
