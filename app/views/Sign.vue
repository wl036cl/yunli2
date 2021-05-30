<template>
    <section class="login-bg" :style="{height:height}">
        <mu-flexbox class="swiper-wrap" :class="{right:!showLogin}" :gutter="0">
            <mu-flexbox-item>
                <login @checkLogin="checkLogin"></login>
            </mu-flexbox-item>
            <mu-flexbox-item>
                <register @checkLogin="checkLogin"></register>
            </mu-flexbox-item>
        </mu-flexbox>
        <p class="link-wrap">
            <mu-flat-button class="btn-link" :class="{right:!showLogin}"
                            v-bind="{label:(showLogin?'Sign up':'Sign in'),
            primary:!showLogin,
            secondary:showLogin}"
                            @click="showLogin=!showLogin"/>
        </p>
    </section>
</template>

<script>
  import {signIn,signUp} from '../components'
  export default {
    name: 'sign',
    data(){
      return {
        showLogin:true
      }
    },
    components:{signIn,signUp}
  }
</script>
<style scoped>

</style>