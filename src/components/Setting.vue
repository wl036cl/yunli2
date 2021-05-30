<template>
    <div class="setting">
        <img :src="imgUrl">
        <h1>{{msg}}</h1>
    </div>
</template>
<script>
import Common from '../js/common'
export default{
  data () {
    return {
      imgUrl: Common.getUrl('/images/anchor.png'),
      msg: '设置'
    }
  }
}
</script>
<style lang="less">
    .setting{
        text-align: center;
        padding-top: 30%;
    }
</style>
