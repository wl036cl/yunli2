<template>
    <section class="app-bg">
        <img :src="imgUrl">
        <h1>{{msg}}</h1>
    </section>
</template>

<script>
import {getUrl} from '@/utils/fullUrl'
export default{
  name: 'notFound',
  data () {
    return {
      imgUrl: getUrl('/images/anchor.png'),
      msg: 'Welcome to Your Data'
    }
  }
}
</script>
<style lang="less">
    .app-bg {
        text-align: center;
        padding-top: 30%;
    }
</style>
