<template>
<div id="example-1">
    <button @click="show = !show">
        Toggle render
    </button>
    <transition name="slide-fade">
        <p v-if="show">hello</p>
    </transition>
</div>
    </template>
<script>
    export default {
        data() {
            return{show: true}
        }
    };
</script>
<style>

</style>