<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="sidebar.collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in items">
                <template v-if="item.index">
                    <el-menu-item :index="item.index" :key="item.index" v-permiss="item.permiss">
                        <template #title>
                            <el-icon>
                                <component :is="item.icon"></component>
                            </el-icon>
                            <span>{{ item.title }}</span>
                        </template>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSidebarStore } from '../store/sidebar';
import { useRoute } from 'vue-router';

const items = [
    // {
    //     icon: 'Odometer',
    //     index: '/dashboard',
    //     title: '系统首页',
    //     permiss: '1',
    // },
    {
        icon: 'Calendar',
        index: '/user',
        title: '用户管理',
        permiss: '2',
    },
    {
        icon: 'DocumentCopy',
        index: '/order',
        title: '订单管理',
        permiss: '3',
    },
    {
        icon: 'DocumentCopy',
        index: '/trade',
        title: '交易记录',
        permiss: '4',
    },
    // {
    //     icon: 'Warning',
    //     index: '/permission',
    //     title: '权限管理',
    //     permiss: '5',
    // }
];

const route = useRoute();
const onRoutes = computed(() => {
    return route.path;
});

const sidebar = useSidebarStore();
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
