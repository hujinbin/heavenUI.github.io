<template>
   <h-input v-model="value"></h-input>
    {{ value }}
    <h-input type="textarea" v-model="value"></h-input>
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
