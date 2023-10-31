<template>
    <div>
      <div v-if="$route.path === '/trade'">
        <tradeList />
      </div>
      <router-view v-else />
    </div>
  </template>
  
  <script>
  
  import tradeList from './tradeList.vue'
  export default {
    components: {
        tradeList
    }
  }
  </script>
  