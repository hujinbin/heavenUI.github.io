### calendar-selector 基于 vue 2.0 开发的轻量，高性能日历组件

#### calendar-selector
基于 vue 2.0 开发的轻量，高性能日历组件
占用内存小，性能好，样式好看，可扩展性强
原生 js 开发，没引入第三方库


### 示例
<ClientOnly>
<example-calendar></example-calendar>
</ClientOnly>


``` html
<template>
  <calendar @change="change"></calendar>
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
    change(val){

    }
  },
};
</script>
```

### 配置选项
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|-|-|-|-|-|
| value | 默认选中日期时间戳 | Number | - | 当前日期 |
| startDate | 最小日期时间戳 | Number | - | 当前日期 |
| startDate | 最大日期时间戳 | Number | - | - |
| multiple | 是否开启日期区间 | Boolean | - | false |



### 方法
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|-|-|-|-|-|
| value | 默认选中日期时间戳 | Number | - | 当前日期 |
| startDate | 最小日期时间戳 | Number | - | 当前日期 |
| startDate | 最大日期时间戳 | Number | - | - |
| multiple | 是否开启日期区间 | Boolean | - | false |