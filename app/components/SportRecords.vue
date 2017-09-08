<template>
    <div class="sport-record">
        <div v-if="list==null" class="loading">
            <mu-circular-progress :size="60" :strokeWidth="5" :color="color"/>
        </div>
    <div v-else-if="list.length">
        <mu-tabs :value="activeTab" @change="handleTabChange">
            <mu-tab value="tab1" icon="format_list_numbered" title="列表"/>
            <mu-tab value="tab2" icon="equalizer" title="线图"/>
        </mu-tabs>
        <mu-flexbox id="swiperWrap" class="swiper-wrap" :class="{right:activeTab==='tab2'}" :gutter="0">
            <mu-flexbox-item>
                <timeLine :list="list" :model="model" :color="color" @delete="deleteRecord"></timeLine>
            </mu-flexbox-item>
            <mu-flexbox-item >
                <div class="chart-menu">
                    <mu-radio name="chartCate" v-model="chartCate" label="近10次" nativeValue="0"/>
                    <mu-radio name="chartCate" v-model="chartCate" label="近8周" nativeValue="1"/>
                    <mu-radio name="chartCate" v-model="chartCate" label="近6个月" nativeValue="2"/>
                </div>
                <schart class="chart-canvas" :canvasId="chart.canvasId"
                            :type="chart.type"
                        :scale="chart.scale"
                            :width="chart.width"
                            :height="chart.height"
                            :data="chart.data"
                            :options="chart.options">
                </schart>
            </mu-flexbox-item>
        </mu-flexbox>
    </div>
        <p v-else class="sport-record">暂无数据</p>
        <mu-float-button v-if="add" icon="add" class="demo-float-button" @click="addRecord" />
    </div>
</template>
<script>
    import timeLine from './TimeLine.vue';
    import Config from './../js/config';
    import Schart from 'vue-schart';
    import Common from '../js/common';
    export default{
        data(){
            return{
                add:true,
                id:0,
                model:null,
                color:'',
                list:null,
                activeTab:"tab1",
                chartCate:"0",
                chart:{
                    category:-1,//0:近10次；1:近8周；2：近6个月
                    canvasId: 'myCanvas',
                    type: 'line',
                    //width:0,
                    //height:0,
                    width: Math.round(document.body.clientWidth *.96*Math.round(window.devicePixelRatio)),
                    height: Math.round(document.body.clientWidth *.96*Math.round(window.devicePixelRatio)/1.25),
                    data: [],
                    options: {
                        title: '近7次',
                        bgColor: '#ffffff',// The background color of chart
                        current : 50, // 当前加载柱状图高度的百分数
                        titleColor: '#000000',// Title Color
                        titlePosition: 'top',          // Title position: top / bottom
                    }
                }
            }
        },
        components: {timeLine,Schart},
        methods:{
            handleTabContent(el){
                Common.addEvent(el,'transitionend',function(){
                    let isRigh=el.className.indexOf('right')>-1;
                    el.children[0].style.visibility=  isRigh?'hidden':'visible';
                    el.children[1].style.visibility=  !isRigh?'hidden':'visible';
                });
            },
            handleTabChange (val) {
                //监听tab切换，
                let el=document.getElementById('swiperWrap');
                if(!this.tabHandle) {
                    this.handleTabContent(el);
                    this.tabHandle=true;
                }else{
                    el.children[0].style.visibility= 'visible';
                    el.children[1].style.visibility= 'visible';
                }
                this.activeTab = val;
                if (val === 'tab2')
                    this.getChart(this.chartCate);
            },
            addRecord() {
                this.$emit('routerContent', 'sportrecordedit',{sid:this.sid,sindex:this.sindex});
            },
            deleteRecordJsonP(index,rid){
                this.$http.jsonp(Config.apiUrl + Config.urlsEnum.deleteSportRecord,
                        {
                            params: {
                                uid: this.userId, token: this.token,
                                rid: rid
                            }
                        }).then(function (res) {
                    res = res.data;
                    if (res.result == 1) {
                        Common.setCache([["yunli_records_" + this.sid],["yunli_sport_" + this.sid],["yunli_sports_" + this.userId]]);
                        this.list.splice(index, 1);
                        this.$parent.list[0]['recordNum']-=1;
                        //this.$parent.allList[this.sindex]['recordNum']-=1;
                        this.$emit('alert', {type: 'toast', msg: res.msg})
                    }
                    else
                    {
                        this.$emit('alert', {type: 'alert', msg: res.msg});
                    }
                })
            },
            deleteRecord(index,rid){
                if (rid > 0 && this.list[index].recordId === rid) {
                    let $this = this;
                    this.$emit('alert', {
                        type: 'confirm', msg: '请确认是否删除？', callback: function () {
                            $this.deleteRecordJsonP(index, rid);
                            $this.chart.category = -1;
                        }
                    });
                }
            },
            getRecords() {
                if (this.userId && this.token && this.sid) {
                    let list = Common.getCache("yunli_records_" + this.sid), model = Common.getCache("yunli_sport_" + this.sid);
                    if (list&&list.length && model) {
                        this.model = model;
                        this.list = list;
                        return;
                    }
                    this.$http.jsonp(Config.apiUrl + Config.urlsEnum.getSportRecords,
                            {
                                params: {
                                    uid: this.userId, token: this.token,
                                    sid: this.sid,
                                    npage: 1
                                }
                            }).then(function (res) {
                        res = res.data;
                        if (res.result == 1) {
                            this.model = res.model || null;
                            this.list = res.data || [];
                            Common.setCache([["yunli_sport_" + this.sid, JSON.stringify(this.model), 10], ["yunli_records_" + this.sid, JSON.stringify(this.list), 10]]);
                        }
                    });

                } else
                    history.go(-1);
            },
            setChart(list,firstDay){
                if(list&&list.length) {
                    list =Common.arrSort(list,'recordTimeStr');
                    let _list = [], title = '';
                    if (this.chart.category === 0) {
                        for (let i = 0, len = list.length; i < len; i++) {
                            let m=list[i];
                            if (i == 0 || i == len - 1)
                                title += Common.dateFtt('yyyy.M.d', new Date(m.recordTimeStr)) + (i == 0 ? '-' : '');

                            let name = Common.dateFtt('M.d', new Date(m.recordTimeStr));
                            _list.push({
                                name: name,
                                value: m.recordNum
                            });
                        }
                    } else if (this.chart.category === 1) {
                        function toPushData(date, count, value) {
                            return {name: Common.dateFtt('M.d', date) + '~' + '(' + count + ')', value: value};
                        }

                        let count = 0, value = 0, sunday = firstDay || null;
                        title = Common.dateFtt('yyyy.M.d', firstDay) + '-';
                        for (let i = 0, len = list.length; i < len; i++) {
                            let m = list[i];
                            if (i == len - 1)
                                title += Common.dateFtt('yyyy.M.d', new Date(m.recordTimeStr));
                            let today = new Date(Common.dateFtt('yyyy.M.d', new Date(m.recordTimeStr)));
                            let _sunday = new Date(today.getTime() - today.getDay() * 24 * 3600 * 1000);
                            sunday = sunday || _sunday;
                            if (Common.dateFtt('yyyy-MM-dd', sunday) != Common.dateFtt('yyyy-MM-dd', _sunday)) {//新的一周（周日）
                                _list.push(toPushData(sunday, count, value));
                                let nextSunday = new Date(sunday.getTime() + 7 * 24 * 3600 * 1000);
                                while (Common.dateFtt('yyyy-MM-dd', _sunday) > Common.dateFtt('yyyy-MM-dd', nextSunday))//中途有周没有数据
                                {
                                    _list.push(toPushData(nextSunday, 0, 0));
                                    sunday = nextSunday;
                                    nextSunday = new Date(sunday.getTime() + 7 * 24 * 3600 * 1000);
                                }
                                sunday = _sunday;
                                value = 0;
                                count = 0;
                            }
                            value += m.recordNum;
                            count++;
                            if (i == len - 1) {
                                _list.push(toPushData(sunday, count, value));
                            }
                        }
                    }else if(this.chart.category === 2){
                        function toPushData(date, count, value) {
                            return {name: Common.dateFtt('M', date) + '月' + '(' + count + ')', value: value};
                        }

                        let count = 0, value = 0, firstday = firstDay || null;
                        title = Common.dateFtt('yyyy.M.d', firstDay) + '-';
                        for (let i = 0, len = list.length; i < len; i++) {
                            let m = list[i];
                            if (i == len - 1)
                                title += Common.dateFtt('yyyy.M.d', new Date(m.recordTimeStr));
                            let today = new Date(Common.dateFtt('yyyy.M.d', new Date(m.recordTimeStr)));
                            let _firstday =  new Date(Common.dateFtt('yyyy.M', today));
                            firstday = firstday || _firstday;
                            if (Common.dateFtt('yyyy-MM-dd', firstday) != Common.dateFtt('yyyy-MM-dd', _firstday)) {//新的一周（周日）
                                _list.push(toPushData(firstday, count, value));
                                let year=Number(Common.dateFtt('yyyy', firstday)),month=Number(Common.dateFtt('M', firstday));
                                month+=1;
                                year=month>12?(year+1):year;
                                month=month>12?(month-12):month;
                                let nextFirstday =new Date(year+'-'+month);
                                while (Common.dateFtt('yyyy-MM-dd', _firstday) > Common.dateFtt('yyyy-MM-dd', nextFirstday))//中途有月没有数据
                                {
                                    _list.push(toPushData(nextFirstday, 0, 0));
                                    firstday = nextFirstday;
                                    year=Number(Common.dateFtt('yyyy', firstday)),month=Number(Common.dateFtt('M', firstday));
                                    month+=1;
                                    year=month>12?(year+1):year;
                                    month=month>12?(month-12):month;
                                    nextFirstday =new Date(year+'-'+month);
                                    //nextFirstday = new Date(firstday.getTime() + 7 * 24 * 3600 * 1000);
                                }
                                firstday = _firstday;
                                value = 0;
                                count = 0;
                            }
                            value += m.recordNum;
                            count++;
                            if (i == len - 1) {
                                _list.push(toPushData(firstday, count, value));
                            }
                        }
                    }
                    if (_list.length) {
                        this.chart.options.title += '（' + title + '）';
                        this.chart.data = _list;
                    }
                }
            },
            dateLimit(list,date){
                var _list=[];
                for(let i= 0,len=list.length;i<len;i++){
                    if(new Date(list[i].recordTimeStr)>=date)
                        _list.push(list[i]);
                }
                return _list;
            },
            getChart(type){
                type=Number(type)||0;
                if(this.chart.category===type)
                return;
                if(this.chart.width===0){
                    this.chart.width=(this.$el.clientWidth*.96).toFixed(0);
                    this.chart.height=this.chart.width*4/5;
                }
                this.chart.category=type;
                this.chart.options.fillColor=this.color;
                if(this.list&&this.list.length) {
                    if (type === 0)//近10次
                    {
                        this.chart.type='line';
                        this.chart.options.title="近10次";
                        this.setChart(this.list.length > 10 ? this.list.slice(0, 10) : this.list);
                    }
                    else if (type === 1)//近8周
                    {
                        this.chart.type='bar';
                        this.chart.options.title="近8周";
                        //if (this.list.length > 10) {
                            let firstSunday=new Date(new Date(Common.dateFtt("yyyy-M-d",new Date(this.list[0].recordTimeStr))).getTime()-(7*7+new Date(this.list[0].recordTimeStr).getDay())*24*3600*1000);
                            this.setChart(this.dateLimit(this.list,firstSunday),firstSunday);
                        //}
                    }
                    else if (type === 2)//近6个月
                    {
                        this.chart.type='bar';
                        this.chart.options.title="近6个月";
                        //if (this.list.length > 10) {
                        let date=Common.dateFtt("yyyy-M",new Date(this.list[0].recordTimeStr));
                        let year=Number(date.split('-')[0]),month=Number(date.split('-')[1]);
                        month-=5;
                        year=month>0?year:(year-1);
                        month=month>0?month:(month+12);

                        let firstDay=new Date(year+'-'+month+'-1');
                        this.setChart(this.dateLimit(this.list,firstDay),firstDay);
                        //}
                    }
                }
            }
        },
        mounted: function () {
            this.userId = Common.getCache("yunli_uid");
            this.token =Common.getCache("yunli_token");
            this.sid = this.$route.params.sid || 0;
            this.sindex = this.$route.params.sindex || 0;
            if (this.userId&&this.token&&this.sid) {
                this.color= this.$parent.list[0].bgColor['background-color'];
                this.getRecords();
            }
        },
        watch:{
            "chartCate"(to){
                if(to!=this.chart.category){
                    this.getChart(to);
                }
            }
        }
    }
</script>
<style lang="less">
    p.sport-record{
        width: 96%;margin: 1rem auto;
        padding-top:3rem;
        text-align: center;
    }
    .sport-record .loading{
        text-align: center;
        padding-top: 3rem;
    }
    .sport-record .mu-tabs,.sport-record .timeline,.sport-record .chart-menu,.sport-record .chart-canvas {
        width: 96%;margin: 1rem auto;
    }
    .sport-record .mu-tabs{
        border-top-left-radius:.5rem ;
        border-top-right-radius:.5rem ;
    }
    .sport-record .chart-menu{
        text-align: right;
    }
    .sport-record .chart-menu .mu-radio-icon{
        margin-right: 2px;
    }
    .sport-record .mu-radio{
         margin-right: 12px;
    }
    .sport-record .swiper-wrap{
        align-items: flex-start;
    }
    .sport-record p.timeline{
        text-align: center;
    }
    .sport-record .mu-icon,.sport-record .mu-tab-text{
        display: inline-block;
        vertical-align: middle;margin-top:0;
    }
    .sport-record .chart-canvas canvas{
        display: block;
        margin: 0 auto;
        border-radius: .5rem;
        width: 100%;
    }
</style>