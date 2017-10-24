<template>
        <canvas :id="id"
                :width="width"
                :height="height"></canvas>
</template>
<script>
    import goBang from '../../extend/gobang'
    export default{
        data(){
            return {
                id: 'mygoBang',
                width: Math.round(document.body.clientWidth*Math.round(window.devicePixelRatio)),
                height: Math.round(document.body.clientWidth*Math.round(window.devicePixelRatio)/23*31),
            }
        },
        methods:{

        },
        mounted: function () {
            goBang("mygoBang", { mode: 'auto' });
        }
    }
</script>
<style lang="less">
    canvas{
        width: 100%;
        box-shadow: -2px -2px 2px #1b1b1b, 5px 5px 5px #1b1b1b;
        cursor: pointer;
        display: block;
        margin: 0 auto;
    }
</style>