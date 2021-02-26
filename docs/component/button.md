#### Button 按钮


#### 常用的操作按钮。
<ClientOnly>
<heaven-button-default></heaven-button-default>
</ClientOnly>


``` html
<template>
   <h-button>默认按钮</h-button>
   <h-button type="primary">主要按钮</h-button>
   <h-button type="success">成功按钮</h-button>
   <h-button type="warning">警告按钮</h-button>
   <h-button type="danger">危险按钮</h-button>
   <h-button type="info">信息按钮</h-button>
</template>
```


#### 按钮组。


``` html
<template>
<h-button-group>
  <h-button>默认</h-button>
    <h-button type="primary">简约</h-button>
    <h-button type="success">成功</h-button>
    <h-button type="warning" size="mini">警告</h-button>
    <h-button type="danger" loading>加载按钮</h-button>
    <h-button type="primary" icon="edit"></h-button>
</h-button-group>
</template>
```


#### 加载中
<ClientOnly>
<heaven-button-loading></heaven-button-loading>
</ClientOnly>


``` html
<template>
  <h-button type="primary" loading>加载按钮</h-button> 
</template>
```


### 配置选项
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
|-|-|-|-|-|
| type | 类型 | String | default / primary / success / warning / danger / info | default |
| size | 尺寸 | String | mini / small / normal / large | normal |
| loading | 是否加载中状态 | Boolean | — | false |
| disabled | 是否禁用状态 | String | — | — |
| icon | 图标类名 | Boolean | — | false |

