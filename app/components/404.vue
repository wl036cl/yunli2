<template>
    <div class="tip-404">
        <img :src="imgUrl">
        <h1>{{msg}}</h1>
    </div>
</template>
<script>
    import Common from '../js/common';
    export default{
        data(){
            return{
            imgUrl:Common.getUrl('/image/anchor.png'),
                msg:'404！页面不存在！'
            }
        }
    }
</script>
<style lang="less">
    .tip-404 {
        text-align: center;
        padding-top: 30%;
    }
</style>