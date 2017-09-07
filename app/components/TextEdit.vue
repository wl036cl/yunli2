<template>
    <ul class="edit-ul">
        <li v-for="(item,index) in list">
            <mu-checkbox v-if="item.type==='checkbox'" v-model="item.value"
                         v-bind="{label:item.placeholder,uncheckIcon:item.uncheckIcon,checkedIcon:item.checkedIcon}" labelLeft/>
            <mu-date-picker v-else-if="item.type==='date'" v-model="item.value" autoOk
                         v-bind="{hintText:item.placeholder,maxDate:item.max}"/>
            <label v-else-if="item.type==='select'" v-show="!item.disabled">
                <span>{{item.placeholder}}</span>
            <mu-select-field v-model="item.value" :icon="item.icon" :disabled="item.disabled" @change="handleSelectChange" >
                <mu-menu-item v-for="option in item.list" :value="option.value" :title="option.text" />
            </mu-select-field></label>
            <mu-text-field v-else @input="handleChange(index,this)" fullWidth v-model="item.value"
                           v-bind="{type:item.type,
                           maxLength:item.maxlength,
                           hintText:item.placeholder,
                           icon:item.icon,
                           errorText:item.errmsg,
                           multiLine:item.type==='multiline',
                           rows:item.rows,
                           rowsMax:item.rowsMax
                           }" />
        </li>
    </ul>
</template>

<script>
    export default {
//        data () {
//            return {
//
//            }
//        },
        props: {
            list: {
                type: Array,
                required: true
            }
        },
        methods:{
            handleSelectChange(value){
                this.$emit('handleSelect',value);
            },
            handleChange (index) {
                this.$emit('handleInput',index);
            }
        },
    }
</script>
<style lang="less">
    .edit-ul label span{
        vertical-align: super;
    }
</style>