<template>
  <infinite-scroll @infinite-scroll="loadMore">
    <div class="content" v-for="n in num" :key="n">
      <p class="text">当前列{{n}}</p>
    </div>
  </infinite-scroll>
</template>

<script>
import  { infiniteScroll }  from 'infinite-scroll-vue';
// import 'infinite-scroll-vue/index.css'
export default {
 components: {
	   infiniteScroll,
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