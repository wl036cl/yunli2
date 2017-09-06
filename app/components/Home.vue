<template>
    <section v-if="page==='app'" :style="{height:height}">
        <app></app>
    </section>
    <section v-else-if="page==='login'" class="login-bg" :style="{height:height}">
        <mu-flexbox class="swiper-wrap" :class="{right:!loginPage.isShowLogin}" :gutter="0">
            <mu-flexbox-item >
                <login @checkLogin="checkLogin"></login>
            </mu-flexbox-item>
            <mu-flexbox-item >
                <register @checkLogin="checkLogin"></register>
            </mu-flexbox-item>
        </mu-flexbox>
        <p class="link-wrap">
            <mu-flat-button class="btn-link" :class="{right:!loginPage.isShowLogin}"
                            v-bind="{label:(loginPage.isShowLogin?'Sign up':'Sign in'),
            primary:!loginPage.isShowLogin,
            secondary:loginPage.isShowLogin}"
                            @click="loginPage.isShowLogin=!loginPage.isShowLogin" />
        </p>
    </section>
    <section v-else class="home">
        <mu-toast v-if="toast" :message="msg" @close="hideToast"/>
        <mu-dialog v-if="dialog" :open="dialog" title="提示">
            {{msg}}
            <mu-flat-button v-show="isconfirm" slot="actions" @click="hideDialog(false)" primary label="取消"/>
            <mu-flat-button slot="actions" primary @click="hideDialog(true)" label="确定"/>
        </mu-dialog>
        <mu-appbar :title="homePage.title" :zDepth="1">
            <mu-icon-button :style="{visibility:this.homePage.backUrl.length?'visible':'hidden'}" icon="chevron_left" slot="left" @click="goBack" />
            <mu-icon-button icon="menu" slot="right" @click="homePage.navOpen=!homePage.navOpen"/>
        </mu-appbar>
        <leftnav :open="homePage.navOpen" :docked="false" @toggle="toggleNav" @routerNav="routerNav"></leftnav>
        <div id="content">
            <transition name="fade" mode="out-in">
                <router-view @routerContent="routerContent" @alert="handleAlert" @goBack="goBack" ></router-view>
            </transition>
        </div>
        <mu-back-top/>
    </section>
</template>
<script>
    import app from './app.vue';
    import login from './login.vue';
    import register from './register.vue';
    import leftnav from './Nav.vue';
    import Common from './../js/common';
    import Router from './../js/routers';
    export default {
        data () {
            return {
                toast:false,
                dialog:false,
                isconfirm:false,
                callback:null,
                msg:'',
                page: 'app',
                height:window.screen.height+'px',
                loginPage: {
                    isShowLogin: true
                },
                homePage: {
                    title:'运力',
                    backUrl:'',
                    uid: 0,
                    token: '',
                    navOpen:false,
                }
            }
        },
        components: {app,login, register,leftnav},
        methods: {
            handleAlert(opt){
                if(opt.callback)
                    this.callback=opt.callback;
                else
                    this.callback=null;
                if(opt.type=='toast')
                {
                    this.showToast(opt.msg,opt.hasOwnProperty('time')?opt.time:1000);
                }
                else if(opt.type=='alert'||opt.type=='confirm'){
                    this.showDialog(opt.msg,opt.type=='confirm');
                }
            },
            showDialog(msg,isconfirm){
                this.msg=msg;
                this.dialog = true;
                this.isconfirm=isconfirm;
            },
            hideDialog (tf) {
                this.dialog = false;
                if (tf && this.callback)
                {
                    this.callback(this);
                    this.callback=null;
                }
            },
            showToast (msg,time) {
                this.msg = msg;
                this.toast = true;
                if (this.toastTimer)
                    clearTimeout(this.toastTimer);
                let $this=this;
                this.toastTimer = setTimeout(function () {
                    $this.hideToast();
                }, time||1000);
            },
            hideToast () {
                if (this.callback) {
                    this.callback(this);
                    this.callback = null;
                }
                this.toast = false;
                if (this.toastTimer)
                    clearTimeout(this.toastTimer);
            },
            checkLogin(){
                this.homePage.uid =Common.getCache("yunli_uid");
                this.homePage.token =Common.getCache("yunli_token");
                if (this.homePage.uid && this.homePage.token) {
                    var $this=this;
                    Common.signIn(this, this.homePage.uid, this.homePage.token, 2, function (res) {
                        if (res.result == 1) {
                            $this.routerNav('sport');
                            $this.page = "home";
                        } else
                            $this.page = "login";
                    });
                } else {
                    if (!this.loginPage.isShowLogin)
                        this.loginPage.isShowLogin = true;
                    this.page = "login";
                }
            },
            goBack(){
                //var hash=this.homePage.backUrl.split('/');
                //this.homePage.backUrl =hash.length>0?hash[0]:'';
                history.go(-1);
            },
            toggleNav(){
                this.homePage.navOpen=!this.homePage.navOpen;
            },
            routerNav(type){
                let $this=this;
                switch (type){
                    case 'close':
                        Common.signOut(this,function(){
                            $this.checkLogin();
                        });
                        break;
                    default:
                        Router.replace({name: type});
                }
                this.homePage.navOpen=false;
                //this.toggleNav();
            },
            routerContent(opt){
                //if (opt.hasOwnProperty('from'))
                //    this.homePage.backUrl = opt.from;
                if (opt.hasOwnProperty('to'))
                    Router.push({name: opt.to, params: opt['params']});
            }
        },
        mounted: function () {
            var $this=this;
            setTimeout(function(){
                $this.checkLogin();
            },1000);
            Common.reSize();
        },
        watch: {
            '$route' (to) {
                //if (to.name === 'sport') {
                    //this.homePage.backUrl=to.path;
                var path=to.path.replace(/^\//,'').split('/');
                this.homePage.backUrl=(path.length>1||path[0].indexOf('edit')>0)?path:'';
                //}
            },
        },
    }
</script>
<style lang="less" type="text/css">
    @import "../css/home.less";
</style>
