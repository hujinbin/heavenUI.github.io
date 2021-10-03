<template>
<div class="main">
    <h1>主色调</h1>
    <div class="blue">蓝色</div>
    <div class="green">绿色</div>
    <div class="yellow">黄色</div>
    <div class="orange">橙色</div>
    <div class="red">红色</div>
    <div class="gray">灰色</div>
 
     <h1>字体颜色</h1>
      <div class="text-1">空</div>
       <div class="text-2">空</div>
        <div class="text-3">空</div>
         <div class="text-4">空</div>
          <div class="text-5">空</div>

 <h1>背景色，分隔线</h1>
 <div class="line-1">空</div>
  <div class="line-2">空</div>


</div>

</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.main{
    div{
        color: #ffffff;
        text-align: center;
    }
   
}
.blue{
  background: #0c80f9;
}
.green{
    background: #61d826;
}
.yellow{
    background: #ffe000;
}
.orange{
    background: #FFB800;
}
.red{
    background:#f13535;
}
.gray{
    background: #78797d;
}
  /*字体颜色*/
.text-1{
    background: #1B1C33;
}
.text-2{
    background: #5E5E66;
}
.text-3{
    background: #8D8E99;
}
.text-4{
    background: #B0B1B8;
}
.text-5{
    background: #D7D7DB;
}  
  /*背景色，分隔线*/
.line-1{
    background: #F7F8FA;
}
.line-2{
    background: #D7D7DB;
}  
</style>