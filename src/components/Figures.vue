<template>
  <div class="figures">
    <img :src="imgUrl" />
    <h1>{{msg}}</h1>
  </div>
</template>
<script>
import Common from '../js/common'
export default {
  data () {
    return {
      imgUrl: Common.getUrl('/images/anchor.png'),
      msg: '身体指数'
    }
  }
}
</script>
<style lang="less">
.figures {
  text-align: center;
  padding-top: 30%;
}
</style>
