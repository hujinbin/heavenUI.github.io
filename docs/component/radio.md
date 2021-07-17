#### Radio 单选框

<InArticleAdsense
 style="display:block; text-align:center;"
    data-full-width-responsive="true"
    data-ad-format='auto'
    data-ad-client="ca-pub-7979174285252748"
    data-ad-slot="2903739942">
</InArticleAdsense>

#### 常用单选框。

<ClientOnly>
<heaven-radio></heaven-radio>
</ClientOnly>

``` html
<template>
    <h-radio :label="1" v-model="value">男</h-radio>
    <h-radio :label="2" v-model="value">女</h-radio>
</template>
```
``` js
<script>
export default {
  data() {
    return {
        value:''
    }
  },
};
</script>
```


### 配置选项
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|-|-|-|-|-|
| value / v-model | 绑定值 | string / number | - | - |
| disabled | 是否禁用状态 | String | — | — |
| readonly | 设置输入框为只读 | Boolean | — | false |
| name | 原生 name 属性 | String | — | — |