#### Rate 评分


#### 基础用法

<ClientOnly>
<heaven-rate></heaven-rate>
</ClientOnly>



``` html
<template>
   <h-rate v-model="value"></h-rate>
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
| max | 最大分值 | number | — | 5 |