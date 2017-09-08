<template>
    <div class="about">
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
                msg:'关于我！'
            }
        }
    }
</script>
<style lang="less">
    .about {
        text-align: center;
        padding-top: 30%;
    }
</style>