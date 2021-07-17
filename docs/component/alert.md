#### Alert 提示

<InArticleAdsense
 style="display:block; text-align:center;"
    data-full-width-responsive="true"
    data-ad-format='auto'
    data-ad-client="ca-pub-7979174285252748"
    data-ad-slot="2903739942">
</InArticleAdsense>

#### 常用提示弹窗。

<ClientOnly>
<heaven-alert></heaven-alert>
</ClientOnly>

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


### API

| 方法名 | 说明 | 参数 | 返回值 |
|-|-|-|-|-|
| $alert | 展示提示 | options \ message | $alert实例 |