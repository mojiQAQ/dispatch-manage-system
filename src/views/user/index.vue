<template>
    <div>
      <div v-if="$route.path === '/user'">
        <userList />
      </div>
      <router-view v-else />
    </div>
  </template>
  
  <script>
  
  import userList from './userList.vue'
  export default {
    components: {
        userList
    }
  }
  </script>
  