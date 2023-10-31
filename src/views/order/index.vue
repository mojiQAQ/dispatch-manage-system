<template>
    <div>
      <div v-if="$route.path === '/order'">
        <OrderList />
      </div>
      <router-view v-else />
    </div>
  </template>
  
  <script>
  
  import OrderList from './orderList.vue'
  export default {
    components: {
        OrderList
    }
  }
  </script>
  