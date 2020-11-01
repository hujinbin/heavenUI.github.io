#### pagination 分页器


#### 基本分页器。



``` html
<template>
   <h-pagination :pageCount="5" @onChange="pageChange"></h-pagination>
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
      pageChange(val){

      },
  },
};
</script>
```

### 配置选项
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|-|-|-|-|-|
| pageSize | 每页显示条目个数，支持 .sync 修饰符 | number | - | 10 |
| pageCount | 总条目数 | number | — | — |
| pagerCount | 总页数，pageCount 和 pagerCount 设置任意一个就可以达到显示页码的功能； | number | — | false |
| currentPage | 当前页数，支持 .sync 修饰符 | number | — | — |
| disabled | 是否禁用状态 | Boolean | — | — |