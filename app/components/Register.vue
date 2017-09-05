<template>
    <div class="login">
    <textEdit :list="textlist" @handleInput="handleError"></textEdit>
    <p class="errmsg" :class="{red:!msg.isRight,green:msg.isRight}">
        {{msg.content}}
    </p>
        <mu-raised-button label="Sign up" @click="test" secondary fullWidth/>
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
                textlist: [
                    {icon: 'person', type: 'text', placeholder: 'Account', errmsg:'',value: '', maxlength: 20},
                    {icon: 'email', type: 'email', placeholder: 'Email',  errmsg:'',value: '',maxlength: 20},
                    {icon: 'lock',  type: 'password',placeholder: 'Password',errmsg:'', value: '', maxlength: 20},
                    {icon: 'lock', type: 'password',placeholder: 'Password' ,errmsg:'', value: '', maxlength: 20}
                ],
                msg: {
                    isRight: true,
                    content: ''
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
                        if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(item.value))
                            this.textlist[index].errmsg = "email格式不正确！";
                    }
                        break;
                    case 2:
                    {
                        if (!/^\w{6,20}$/.test(item.value))
                            this.textlist[index].errmsg = "密码为6-20位数字或字母组合！";
                    }
                        break;
                    case 3:
                    {
                        if (item.value!= this.textlist[2].value)
                            this.textlist[index].errmsg = "两次密码不一致！";
                    }
                        break;
                }
            },
            signUp(oauthUId, oauthToken, type){
                var $this = this;
                $this.$http.jsonp(Config.apiUrl + Config.urlsEnum.register,
                        {
                            params: {phone: this.textlist[0].value,
                            email: this.textlist[1].value,
                            password: this.textlist[2].value,
                            password2: this.textlist[3].value
                            }
                        }).then(function (res) {
                    res=res.data;
                    if (res.result == 1) {
                        $this.msg.isRight = true;
                        $this.msg.content = res.msg;
                        //$this.toLogin();
                        setTimeout(function(){
                            //window.location.reload();
                            $this.textlist[0].value='';
                            $this.textlist[1].value='';
                            $this.textlist[2].value='';
                            $this.textlist[3].value='';
                            $this.$emit('checkLogin');
                        },1000);
                    }
                    else {
                        $this.msg.isRight =false;
                        $this.msg.content = "注册失败！";
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
                    else if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.textlist[1].value))
                        msg += "email格式不正确！";
                    else if (!/^\w{6,20}$/.test(this.textlist[2].value))
                        msg += "密码为6-20位数字或字母组合！";
                    else if (this.textlist[2].value != this.textlist[3].value)
                        msg += "两次密码不一致！";
                    if (msg.length > 0) {
                        this.msg.content = msg;
                        this.msg.isRight = false;
                        return;
                    }
                    else {
                        this.signUp();
                    }
                }
            }
        }
    }
</script>