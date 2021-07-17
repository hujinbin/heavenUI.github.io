#### Input 输入框


<InArticleAdsense
 style="display:block; text-align:center;"
    data-full-width-responsive="true"
    data-ad-format='auto'
    data-ad-client="ca-pub-7979174285252748"
    data-ad-slot="2903739942">
</InArticleAdsense>

#### 常用输入框。


<ClientOnly>
<heaven-input></heaven-input>
</ClientOnly>


``` html
<template>
   <h-input v-model="value"></h-input>
    {{value}}
   <h-input type="textarea" v-model="value"></h-input>
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
| type | 类型 | String | text / textarea / 其他 原生 input 的 type 值 | text |
| value / v-model | 绑定值 | string / number | - | - |
| loading | 是否加载中状态 | Boolean | — | false |
| disabled | 是否禁用状态 | Boolean | — | — |
| readonly | 设置输入框为只读 | Boolean | — | false |
| placeholder | 占位文本 | String | — | — |