<template>
    <div class="sports" ref="sportUl">
        <transition-group name="list" tag="ul" class="sport-ul" >
        <li class="sport-li" v-for="(item,index) in list" @click="showRecord(index)" :key="item" :data-sid="item.sportId">
            <div class="li-content" :data-index="index" :style="[item.bgColor,item.transform]" >
                <span class="tip" :class="item.status">{{item.statusTip}}</span>
                <div class="content-wrap">
                    <p class="title">{{item.title}}</p>
                    <p class="target">目标：{{item.target}}&nbsp;{{item.unit}}</p>
                    <p class="remark">宣言：{{item.remark}}</p>
                </div>
                <p class="createtime">
                    <mu-row gutter>
                        <mu-col width="50" tablet="50" desktop="50">
                            <span>{{item.recordNum==0?"暂无":(item.recordNum+"条")}}记录</span>
                            <span v-if="item.isPrivate">私人项目</span>
                        </mu-col>
                        <mu-col width="50" tablet="50" desktop="50">
                            <span v-if="!!item.lastTimeStr">
                                {{item.lastTimeStr}}<font>更新</font>
                            </span>
                            <span v-else>
                                {{item.createTimeStr}}<font>创建</font>
                            </span>
                        </mu-col>
                    </mu-row>
                </p>
            </div>
            <ul class="actions-ul">
                <li class="edit-li" @click.stop="editSport(index)">
                    <mu-icon-button icon="edit" />
                    <br />
                    编辑</li>
                <li class="delete-li" @click.stop="deleteSport(index)">
                    <mu-icon-button icon="delete" touch />
                    <br />
                    删除</li>
            </ul>
        </li>
        </transition-group>
        <transition name="fade" mode="out-in">
            <router-view @alert="handleAlert" @routerContent="router" ></router-view>
        </transition>
    <mu-float-button v-if="add" icon="add" class="demo-float-button" @click="addSport" />
    </div>
</template>
<script>
    import Common from '../js/common';
    import Config from './../js/config';
    import Router from './../js/routers';
    export default{
        data(){
            return {
                //colors: ['#EB1C22', '#F15928', '#F46523', '#F8931F', '#FEF200', '#8CC540', '#21B24B', '#09B3CD', '#2E3192', '#262163', '#652C93', '#92278F'],
                bgColors: [ '#78ba00', '#008287', '#1faeff', '#006ac1', '#001e4e', '#252525', '#691bb8','#F8461F', '#f4b300'],
                list: null,
                allList: null,
                userId: null,
                token: null,
                add: true,
                touch: {x1: 0, x2: 0, y1: 0, y2: 0},
            }
        },
        methods: {
            handleAlert(opt){
                this.$emit('alert', opt);
            },
            getSports(){
                if (this.userId && this.token) {
                    let data = Common.getCache("yunli_sports_" + this.userId);
                    if (data && data.length && data.indexOf('[') == 0) {
                        this.setData(eval(data));
                        return;
                    }
                    let $this = this;
                    this.$http.jsonp(Config.apiUrl + Config.urlsEnum.getSports,
                            {
                                params: {
                                    uid: $this.userId,
                                    token: $this.token,
                                    npage: 1
                                }
                            }).then(function (res) {
                        res = res.data;
                        if (res.result == 1) {
                            Common.setCache("yunli_sports_" + $this.userId, JSON.stringify(res.data), 10);
                            $this.setData(res.data);
                        }
                    }, function (e) {
                        this.$emit('alert', {type: 'toast', msg: '网络抽风啦~'});
                    });
                }
            },
            setData(data) {
                if (data && data.length > 0) {
                    for (let i = 0; i < data.length; i++) {
                        data[i]['bgColor'] = {"background-color": this.bgColors[i % this.bgColors.length]};

                        data[i]['transform'] = {};

                        switch (Number(data[i].status)) {
                            case -1:
                                data[i].status = 'tip-deleted';
                                data[i].statusTip = '删除';
                                break;
                            case 0:
                                data[i].status = 'tip-deserted';
                                data[i].statusTip = '放弃';
                                break;
                            case 1:
                                data[i].status = 'tip-ing';
                                data[i].statusTip = '进行中';
                                break;
                            case 2:
                                data[i].status = 'tip-over';
                                data[i].statusTip = '成功';
                                break;
                            case 3:
                                data[i].status = 'tip-fail';
                                data[i].statusTip = '失败';
                                break;
                        }
                        data[i].isPrivate = (data[i].isPrivate == 1 ? true : false);
                    }
                }
                this.list = data;
                if (this.list)
                    this.bindTouch();
            },
            editSport(index){
                let sId = index > -1 ? this.list[index].sportId : 0;
                if (sId) {
                    this.$emit('routerContent', {to: 'sportedit', params: {id: sId}});
                }
            },
            deleteSprotJsonP(index) {
                let sId = index > -1 ? this.list[index].sportId : 0;
                this.$http.jsonp(Config.apiUrl + Config.urlsEnum.deleteSport,
                        {
                            params: {
                                uid: this.userId, token: this.token,
                                sid: sId
                            }
                        }).then(function (res) {
                    res = res.data;
                    if (res.result == 1) {
                        Common.setCache([["yunli_sports_" + this.userId],["yunli_sport_" + sId],["yunli_records_" + sId]]);
                        this.list.splice(index, 1);
                        this.$emit('alert', {type: 'toast', msg: res.msg})
                    }
                    else
                        this.$emit('alert', {type: 'alert', msg: res.msg});
                })
            },
            deleteSport(index) {
                if (index > -1 && this.userId && this.token) {
                    let $this = this;
                    this.$emit('alert', {
                        type: 'confirm', msg: '请确认是否删除？', callback: function () {
                            $this.deleteSprotJsonP(index);
                        }
                    });
                }
            },
            addSport() {
                this.$emit('routerContent', { to: 'sportedit'});
            },
            bindTouch(){
                let el = this.$refs.sportUl;
                touchMove.init(el, this.list);
            },
            router(to, params){
                Router.push({name: to, params: params});
            },
            showRecord(index){
                if (index > -1 && !touchMove.disabled) {
                    let temp = this.list[index];
                    if (temp&& temp.sportId)
                        this.router('sportrecords', {sindex: index, sid: temp.sportId});
                }
            }
        },
        mounted: function () {
            this.userId =Common.getCache("yunli_uid");
            this.token =Common.getCache("yunli_token");
            this.getSports();
            touchMove.disabled = false;
        },
        watch: {
            '$route' (to,from) {
                if (to.name === 'sport') {
                    this.add=true;
                    touchMove.disabled = false;
                    if (this.allList) {
                        this.list = this.allList;
                        this.allList = null;
                    }
                    else
                        this.getSports();
                }else{
                    this.add=false;
                    if (to.params.sindex > -1 && !touchMove.disabled) {
                        touchMove.transform(to.params.sindex , 0, true);
                        touchMove.disabled = true;
                        this.allList = this.list;
                        let temp = this.list[to.params.sindex];
                        if (temp && temp.sportId) {
                            this.list = [temp];
                        }
                    }
                }
            }
        },
    };
    var touchMove = {
        disabled:false,
        touch: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0
        },
        speed: 300,//单位ms
        _isPointerType: null,
        el: null,
        li_list: null,
        index: -1,
        win_width: 0,
        starmove_left: 0,
        ishorizontally: -1,//是否水平移动0:垂直；1:水平
        delta: 0,
        moveToPage: function (index) {
            if (index == 0) {
                this.transform(this.index, 0, true);
            }
            else if (index == 1) {
                //移除其他
                for(let i= 0,len=this.list.length;i<len;i++)
                {
                    this.transform(i,0,true);
                }
                this.transform(this.index, -(this.win_width / 2), true);
            }
        },
        transform: function (index, newposX, isduration) {
            //位移
            var newtranslate3d = "translate3d(" + newposX + "px,0,0)";
            if (isduration) {
                var speed = this.speed + "ms";
                this.list[index]['transform']={
                    "-webkit-transition-duration": speed,
                            "transition-duration": speed,
                            "-webkit-transform": newtranslate3d,
                            "transform": newtranslate3d,
                };
            } else {
                this.list[index]['transform']={
                    "-webkit-transition-duration": "0ms",
                    "transition-duration": "0ms",
                    "-webkit-transform": newtranslate3d,
                    "transform": newtranslate3d,
                };
            }
        },
        swipeDirection: function (x1, x2, y1, y2, onlyhorizontal) {
            if (onlyhorizontal)
                return (x1 - x2 > 0 ? 'Left' : 'Right');
            return Math.abs(x1 - x2) >=
            Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down');
        },
        isPointerEventType: function (e, type) {
            return (e.type == 'pointer' + type ||
            e.type.toLowerCase() == 'mspointer' + type)
        },
        isPrimaryTouch: function (event) {
            return (event.pointerType == 'touch' ||
                    event.pointerType == event.MSPOINTER_TYPE_TOUCH)
                    && event.isPrimary
        },
        findParent:function(el,className){
            for (var i = 0; i < 4; i++) {
                if (el.className.indexOf(className) > -1)
                    return el;
                el = el.parentNode;
            }
            return null;
        },
        bindEvent: function () {
            var $this = this;
            Common.addEvent(this.el,'touchstart mousedown',function(e){
                if (!$this.disabled&&($this._isPointerType = $this.isPointerEventType(e, 'down')) && !$this.isPrimaryTouch(e)) return;

                let el = e.target||e.srcElement ||event.srcElement||event.target ; //FF只能识别event.target
                el = $this.findParent(el, 'li-content');

                if (el) {
                    $this.index = el.getAttribute('data-index');

                    if(e.touches) {
                        var first_touch = $this._isPointerType ? e : e.touches[0];
                        $this.touch.x1 = first_touch.pageX;
                        $this.touch.y1 = first_touch.pageY;
                    }else{
                        $this.touch.x1 = e.x;
                        $this.touch.y1 = e.y;
                    }
                    $this.touch.x2 = 0;
                    $this.touch.y2 = 0;

                    $this.delta = new Date();
                    $this.starLeft = el.offsetLeft;//起始偏移量
                    $this.ishorizontally = -1;//是否水平移动0:垂直；1:水平
                }
                else
                    $this.index =-1;
            });
            Common.addEvent(this.el,'touchmove mousemove',function(e){
                if (!$this.disabled&&$this.index>-1) {
                    if ($this.ishorizontally == 0)//开始垂直，就不在水平移动
                        return;
                    if (($this._isPointerType = $this.isPointerEventType(e, 'move')) && !$this.isPrimaryTouch(e)) return;
                    if(e.touches&& e.touches.length) {
                        var move_touch = $this._isPointerType ? e : e.touches[0];
                        $this.touch.x2 = move_touch.pageX;
                        $this.touch.y2 = move_touch.pageY;
                    }else {
                        $this.touch.x2 = e.x;
                        $this.touch.y2 = e.y;
                    }
                    if (($this.touch.x1 != 0 || $this.touch.y1 != 0) && ($this.touch.x2 != 0 || $this.touch.y2 != 0)) {
                        var direction = $this.swipeDirection($this.touch.x1, $this.touch.x2, $this.touch.y1, $this.touch.y2);

                        $this.ishorizontally = ($this.ishorizontally != -1 ? $this.ishorizontally : (direction == "Left" || direction == "Right") ? 1 : 0);

                        if ($this.ishorizontally == 0)
                            return;

                        e.preventDefault();//可水平移动，去除系统(垂直)移动

                        var newPoint = $this.touch.x2 - $this.touch.x1 + $this.starLeft;
                        if (newPoint > $this.win_width * 0.2)
                            newPoint = $this.win_width * 0.2;
                        if (newPoint < $this.win_width * (1 + 0.2) * -1)
                            newPoint = $this.win_width * (1 + 0.2) * -1;
                        if (newPoint >= 0 || newPoint <= -$this.win_width * 0.5)
                            return;
                        $this.transform($this.index, newPoint);
                    }
                }
            });
            Common.addEvent(this.el,'touchend mouseup',function(e){
                if (!$this.disabled&&$this.index>-1) {
                    if (($this._isPointerType = $this.isPointerEventType(e, 'up')) && !$this.isPrimaryTouch(e)) return;

                    if ($this.ishorizontally == 0 || $this.touch.x2 == 0)//垂直运行的||没有move
                        return;

                    $this.delta = new Date() - $this.delta;
                    //快速滑动
                    if ($this.delta < 320 && Math.abs($this.touch.x2 - $this.touch.x1) > 10) {
                        var direction = $this.swipeDirection($this.touch.x1, $this.touch.x2, $this.touch.y1, $this.touch.y2, true);
                        if (direction == "Left") {
                            $this.moveToPage(1); return;
                        } else if (direction == "Right") {
                            $this.moveToPage(0); return;
                        }
                    }
                    var newPoint = $this.touch.x2 - $this.touch.x1 + $this.starLeft;
                    if (newPoint > $this.win_width * 0.2)
                        newPoint = $this.win_width * 0.2;
                    if (newPoint < $this.win_width * (1 + 0.2) * -1)
                        newPoint = $this.win_width * (1 + 0.2) * -1;
                    if (newPoint > $this.win_width * 0.15 * -1)
                        $this.moveToPage(0);
                    else
                        $this.moveToPage(1);
                }
            });
        },
        init: function (_el,list) {
            var $this = this;
            this.el = _el;
            this.list=list;
            this.win_width = _el.clientWidth*.96;
            this.bindEvent();
        }
    }
</script>
<style lang="less">
    .sports{
        position: relative;
        padding-bottom: 18%;
    }.sports .sport-ul{
        width: 96%;
             margin:0 auto;
         }
    .sports .sport-li {
        margin: 1rem auto 0;
        position: relative;
        color: #fff;
        line-height: 1.5;
    }

    .sports .li-content {
        border-radius: .5rem;
        overflow: hidden;
        position: relative;
        z-index: 2;
    }

    .sports .tip {
        position: absolute;
        right: -7%;
        top: 3%;
        -webkit-transform: rotate(45deg);
        transform: rotate(45deg);
        padding: .5rem 2rem;
        background: rgba(0, 255, 255, 0.6);
        font-size: 13px;
    }

    .sports .tip-fail {
        background: rgba(255, 0, 0, 0.6);
    }
    .sports .tip-over {
        background: rgba(0, 255, 0, 0.6);
    }
    .sports .tip-deserted, .sports .tip-deleted {
        background: rgba(0, 0, 0, 0.6);
    }

    .sports .tip-over,.sports .tip-fail, .sports .tip-deserted, .sports .tip-deleted {
        padding: .5rem 2.5rem;
        top: 2%;
        right: -7%;
    }

    .sports .content-wrap {
        padding: 1rem;
        font-size: 13px;
    }

    .sports .content-wrap .title {
        font-size: 16px;
    }

    .sports .content-wrap .target {
        font-size: 14px;
    }

    .sports .createtime {
        padding: .5rem 1rem;
        background: rgba(0,0,0,0.1);
        font-size: 13px;
    }
    .sports .createtime .row div:last-child{
        text-align: right;
    }
    .sports .createtime .row div:last-child font{
        font-size:11px;
        vertical-align: text-bottom;
        padding-left:.5rem;
    }
    .sports .createtime .row div:first-child span:first-child{
        margin-right:1rem;
    }

    .sports .actions-ul {
        position: absolute;
        top: 1%;
        right: 0;
        width: 48%;
        height: 98%;
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
    }

    .sports .actions-ul li {
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        flex: 1;
        text-align: center;
        padding-top: 12%;
        border-radius: .5rem;
    }

    .sports .actions-ul .edit-li {
        background-color: #00CD4B;
        margin-right: .5rem;
    }

    .sports .actions-ul .delete-li {
        background-color: #686868;
    }
    .sports .mu-float-button{
        position: fixed;
        bottom:2%;margin: 0 auto;
        left:0;right: 0;z-index: 10;
        opacity: .8;
    }
    .sports .sport-li{
        transition: all 1s;
    }

    /*timeline*/
    .sports .timeline-wrap{

        border-radius: .5rem;
        line-height: 1.3;
        position: relative;
    }
</style>