<template>
    <div>
        <h-radio :label="1" v-model="radioValue">男</h-radio>
    <h-radio :label="2" v-model="radioValue">女</h-radio>
    <h-radio :label="1" v-model="radioValue" disabled>男</h-radio>
    <h-radio :label="2" v-model="radioValue" disabled>女</h-radio>
    <br />单选框组
    <h-radio-group v-model="radio">
      <h-radio :label="1">备选项</h-radio>
      <h-radio :label="2">备选项</h-radio>
      <h-radio :label="3">备选项</h-radio>
    </h-radio-group>
    </div>
</template>

<script>
export default {
 data() {
    return {
        radioValue:1,
        radio:'',
    }
}
}
</script>

<style>

</style>
