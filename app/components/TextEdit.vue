<template>
    <ul class="edit-ul">
        <li v-for="(item,index) in list">
            <mu-checkbox v-if="item.type==='checkbox'" v-model="item.value"
                         v-bind="{label:item.placeholder,uncheckIcon:item.uncheckIcon,checkedIcon:item.checkedIcon}" labelLeft/>
            <mu-date-picker v-else-if="item.type==='date'" v-model="item.value" autoOk
                         v-bind="{hintText:item.placeholder,maxDate:item.max}"/>
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
            handleChange (index) {
                this.$emit('handleInput',index);
            }
        },
    }
</script>