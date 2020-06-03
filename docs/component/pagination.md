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