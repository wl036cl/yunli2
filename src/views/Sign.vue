<template>
  <section>
    <mu-flexbox class="swiper-wrap" :class="{right:!showLogin}" :gutter="0">
      <mu-flexbox-item>
        <signIn @checkLogin="checkLogin"></signIn>
      </mu-flexbox-item>
      <mu-flexbox-item>
        <signUp @checkLogin="checkLogin"></signUp>
      </mu-flexbox-item>
    </mu-flexbox>
    <p class="link-wrap">
      <mu-flat-button
        class="btn-link"
        :class="{right:!showLogin}"
        v-bind="{label:(showLogin?'Sign up':'Sign in'),
            primary:!showLogin,
            secondary:showLogin}"
        @click="showLogin=!showLogin"
      />
    </p>
  </section>
</template>

<script>
import signIn from '@/components/SignIn'
import signUp from '@/components/SignUp'

export default {
  name: 'sign',
  data () {
    return {
      showLogin: true
    }
  },
  methods: {
    checkLogin () {
      this.$emit('checkLogin')
    }
  },
  components: { signIn, signUp }
}
</script>
<style scoped>
</style>
