<template>
    <pull-refresh @refresh="refresh">
    <div class="content">
      <p class="text">基础用法</p>
      刷新次数：{{ num }}
    </div>
  </pull-refresh>
</template>

<script>
import  { pullRefresh }  from 'pull-refresh-vue';
export default {
components: {
	   pullRefresh,
  },
  data(){
        return{ 
            num:20
        }
    },
    methods:{
        loadMore(){
            setTimeout(()=>{
                this.num = this.num + 20
                console.log('加载次数='+(this.num/20))
            },2000)
        },
    }
}
</script>

<style>
</style>