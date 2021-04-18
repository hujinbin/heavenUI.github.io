<template>
  <div class="heaven-icon-box">
    <div class="heaven-icon-item">
      <h-icon name="user"></h-icon>
      <p>user</p>
    </div>
    <div class="heaven-icon-item">
     <h-icon name="close"></h-icon>
      <p>close</p>
    </div>
    <div class="heaven-icon-item">
     <h-icon name="loading"></h-icon>
      <p>loading</p>
    </div>
    <div class="heaven-icon-item">
     <h-icon name="set"></h-icon>
      <p>set</p>
    </div>
     <div class="heaven-icon-item">
     <h-icon name="star-on"></h-icon>
      <p>star-on</p>
    </div>
     <div class="heaven-icon-item">
     <h-icon name="star-off"></h-icon>
      <p>star-off</p>
    </div>
      <div class="heaven-icon-item">
     <h-icon name="more"></h-icon>
      <p>more</p>
    </div>
      <div class="heaven-icon-item">
     <h-icon name="del"></h-icon>
      <p>del</p>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
    }
  },
  methods:{
  
  }
}
</script>

<style lang="less" scoped>
  .heaven-icon-box{
    display: flex;
    border:1px solid #dddddd; 
    margin: 20px 0;
    .heaven-icon-item{
      width: 25%;
      padding: 20px 0;
      text-align: center;
      border-bottom: 1px solid #dddddd;
      border-right: 1px solid #dddddd;
    }
  }
</style>
