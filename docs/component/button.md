#### Button 按钮


#### 常用的操作按钮。


``` html
<template>
   <h-button>默认</h-button>
    <h-button type="primary">简约</h-button>
    <h-button type="success">成功</h-button>
    <h-button type="warning" size="mini">警告</h-button>
    <h-button type="danger" loading>加载按钮</h-button>
    <h-button type="primary" icon="edit"></h-button>
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
  },
};
</script>
```

### 配置选项
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|-|-|-|-|-|
| type | 类型 | String | default / primary / success / warning / danger / info | default |
| size | 尺寸 | String | mini / small / normal / large | normal |