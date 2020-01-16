#### Alert 提示


#### 常用提示弹窗。

``` html
<template>
    <h-button type="danger" @click="showAlert">打开弹窗</h-button>
    <h-button type="info" @click="showMsgAlert">打开消息弹窗</h-button>
    <h-button type="info" @click="showLoading">打开加载</h-button>
</template>
```
``` js
<script>
export default {
  data() {
    return {
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
};
</script>
```


### 配置选项

| 方法名 | 说明 | 返回值 |
|-|-|-|-|
| change | 点击任意日期时触发 | 选中的时间戳 |