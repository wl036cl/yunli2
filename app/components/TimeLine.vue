<template>
    <div class="timeline">
            <transition-group class="timeline-ul" name="list" tag="ul">
            <li class="timeline-li" v-for="(item,index) in list" :key="item">
                <div class="line-wrap">
                    <img class="run-img" :style="imgStyle" :src="imgUrl" />
                </div>
                <div class="record-wrap">
                    <p class="time" :style="{color:color}">{{item.recordTimeStr}}</p>
                    <p class="num">完成：{{item.recordNum}}&nbsp;{{model.unit}}</p>
                    <p class="remark" v-if="item.remark&&item.remark.length">心得：{{item.remark}}</p>
                    <mu-flat-button label="删除" @click="deleteItem(index,item.recordId)" class="btn-delete" secondary/>
                </div>
            </li>
                </transition-group>
    </div>
</template>
<script>
    import Common from './../js/common';
    export default{
        data(){
            return{
                imgUrl:Common.getUrl('/images/run.svg'),
                imgStyle:{filter:"drop-shadow(-2rem 0 "+this.color+")"},
            }
        },
        props: ['list','model','color'],
        methods:{
            deleteItem(index,rid){
                this.$emit('delete',index,rid);
            }
        },
        mounted: function () {

        }
    }
</script>
<style lang="less">
    .timeline .timeline-ul{
        position:relative ;
    }
    .timeline .timeline-ul:after{
        content: '';
        position: absolute;
        top:0;
        bottom: 0;
        left:0;
        border-left:2px dashed #fff;
        animation:lineBack 1s infinite;
        -webkit-animation:lineBack 1s linear infinite; /* Safari 和 Chrome */
    }
    .timeline li{
        display: -webkit-box;
        -webkit-box-pack: justify;
        display: -webkit-flex;
        display: flex;
    }
    .timeline .line-wrap{
        position: relative;
        text-align: center;
        width:10%;

    }
    .timeline .run-img{
        transform: scale(-1,1) rotate(-90deg);
    }
    .timeline .btn-delete{
        transform: scale(1,1) translateX(10px) rotate(0);
    }
    .timeline .record-wrap{
        color:#000;
        position: relative;
        width: 88%;
        margin-bottom: 2rem;
        background-color: #fff;
        border-radius: .5rem;
        padding: 1rem;
        line-height: 1.5;
    }
    .timeline .record-wrap .time{
        font-size:13px;
    }
    .timeline .record-wrap .remark{
        width: 80%;
        font-size:13px;
    }
    .timeline .btn-delete{
        position: absolute;
        right:0;
        top:47%;
        transform:translateY(-50%);
    }
    @keyframes lineBack {
        from { transform:translateY(0);}
        to { transform:translateY(13px);}
    }
    @-webkit-keyframes lineBack /*Safari and Chrome*/
    {
        from { transform:translateY(0);}
        to { transform:translateY(13px);}
    }
</style>