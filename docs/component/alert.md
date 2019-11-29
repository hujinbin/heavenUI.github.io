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

| 方法名 | 说明 | 参数 | 返回值 |
|-|-|-|-|-|
| $alert | 展示提示 | options/message | $alert实例 |
| $alert.msg | 展示提示 | options/message | $alert实例 |