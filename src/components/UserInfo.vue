<template>
    <div class="userInfo">
        <img :src="imgUrl">
        <h1>{{msg}}</h1>
    </div>
</template>
<script>
    import Common from '../js/common';
    export default{
        data(){
            return{
            imgUrl:Common.getUrl('/images/anchor.png'),
                msg:'个人中心'
            }
        }
    }
</script>
<style lang="less">
    .userInfo {
        text-align: center;
        padding-top: 30%;
    }
</style>