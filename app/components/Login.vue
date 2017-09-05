<template>
    <div class="login">
        <textEdit :list="textlist" @handleInput="handleError"></textEdit>
            <p class="errmsg" :class="{red:!msg.isRight,green:msg.isRight}">
            {{msg.content}}
            </p>
        <mu-raised-button label="Sign in" @click="test" primary fullWidth/>
    </div>
</template>

<script>
    import Config from './../js/config';
    import Common from './../js/common';
    import textEdit from './TextEdit.vue';
    export default {
        components: {textEdit},
        data () {
            return {
                textlist:[
                    {icon:'person',type:'text',placeholder:'Account',errmsg:'',value:'',maxlength:20},
                    {icon:'lock',type:'password',placeholder:'Password',errmsg:'',value:'',maxlength:20},
                    {icon:'message',type:'tel',placeholder:'Verification',errmsg:'',value:'',maxlength:6},
                ],
                msg: {
                    isRight:true,
                    content: ' '
                }
            }
        },
        methods: {
            handleError(index){
                var item = this.textlist[index];
                this.textlist[index].errmsg = "";
                if (!item.value || !item.value.length) {
                    return;
                }
                if (item.value.length > item.maxlength) {
                    this.textlist[index].errmsg = "超过了";
                }
                switch (index) {
                    case 0:
                    {
                        if (!/^[\u4e00-\u9fa5|\w]{6,20}$/.test(item.value))
                            this.textlist[index].errmsg = "帐号为6-20位汉字，数字或字母组合！";
                    }
                        break;
                    case 1:
                    {
                        if (!/^\w{6,20}$/.test(item.value))
                            this.textlist[index].errmsg = "密码为6-20位数字或字母组合！";
                    }
                        break;
                }
            },
            signIn(oauthUId, oauthToken){
                var $this = this;
                Common.signIn(this,oauthUId, oauthToken, 1,function(res){
                    if (res.result == 1) {
                        $this.msg.isRight = true;
                        $this.msg.content = res.msg;

                        //本地缓存
                        Common.setCache([["yunli_uid", res.uid],["yunli_token",res.token]]);
                        setTimeout(function () {
                            $this.textlist[0].value='';
                            $this.textlist[1].value='';
                            $this.textlist[2].value='';
                            $this.$emit('checkLogin');
                            //window.location.reload();
                        }, 1000);
                    }
                    else {
                        $this.msg.isRight = false;
                        $this.msg.content = '登陆失败';
                        if (res.result == 0)
                            $this.msg.content = res.msg;
                    }
                });
            },
            test(){
                if (Common.checkTextEdit(this.textlist)) {
                    var msg = "";
                    if (!/^[\u4e00-\u9fa5|\w]{6,20}$/.test(this.textlist[0].value))
                        msg += "帐号为6-20位汉字，数字或字母组合！";
                    else if (!/^\w{6,20}$/.test(this.textlist[1].value))
                        msg += "密码为6-20位数字或字母组合！";
                    if (msg.length > 0) {
                        this.msg.content = msg;
                        this.msg.isRight = false;
                    }
                    else {
                        this.signIn(this.textlist[0].value, this.textlist[1].value);
                    }
                }
            }
        }
    }
</script>