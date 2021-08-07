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
// import 'pull-refresh-vue/index.css'
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
        refresh (done) {
            setTimeout(() => {
              this.num++
              done()    //把状态归0
            }, 500)
        }
    }
}
</script>

<style>
</style>