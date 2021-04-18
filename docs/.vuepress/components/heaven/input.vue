<template>
<div>
   <h-input v-model="value"></h-input>
    当前值{{ value }}
    <h-input type="textarea" v-model="value"></h-input>
</div>
</template>

<script>
export default {
  data(){
    return{
        value:'',
    }
  },
  methods:{
  
  }
}
</script>

<style>

</style>
