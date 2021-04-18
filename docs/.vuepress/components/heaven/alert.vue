<template>
  <div>
    <h-button type="danger" @click="showAlert">打开弹窗</h-button>
    <h-button type="info" @click="showMsgAlert">打开消息弹窗</h-button>
    <h-button type="info" @click="showLoading">打开加载</h-button>
  </div>
</template>

<script>

export default {
  components: {
  },
  data(){
    return{
    }
  },
 methods: {
    showAlert(){
      this.$alert('提示')
    },
    showMsgAlert(){
      this.$alert.Msg('提示')
    },
    showLoading(){
      this.$alert.Loading('提示')
    },
  },
}
</script>

<style>
</style>
