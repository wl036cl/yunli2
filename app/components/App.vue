<template>
    <section class="app-bg">
        <img :src="imgUrl">
    <h1>{{msg}}</h1></section>
</template>
<script>
    import Common from '../js/common';
    export default{
        data(){
            return{
                imgUrl:Common.getUrl('/image/anchor.png'),
                msg:'Welcome to Your Data'
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
