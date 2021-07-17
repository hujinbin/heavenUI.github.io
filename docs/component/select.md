#### Select 选择器



<InArticleAdsense
 style="display:block; text-align:center;"
    data-full-width-responsive="true"
    data-ad-format='auto'
    data-ad-client="ca-pub-7979174285252748"
    data-ad-slot="2903739942">
</InArticleAdsense>

#### 常用选择器

<ClientOnly>
<heaven-select></heaven-select>
</ClientOnly>


#### 基础用法

``` html
<template>
   <h-select  v-model="value" placeholder="请选择">
      <h-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
      </h-option>
    </h-select>
</template>
```
``` js
<script>
export default {
  data() {
    return {
        value:'',
          options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
    }
  },
};
</script>
```


### 配置选项
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|-|-|-|-|-|
| value / v-model | 绑定值 | boolean / string / number | - | - |