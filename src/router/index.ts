import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { usePermissStore } from '../store/permiss';
import Home from '../views/home.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/',
        name: 'Home',
        component: Home,
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                meta: {
                    title: '系统首页',
                    permiss: '1',
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard.vue'),
            },
            {
                path: '/user',
                name: 'user',
                meta: {
                    title: '用户管理',
                    permiss: '2'
                },
                component: () => import(/* webpackChunkName: "dashboard" */ '../views/user/index.vue'),
            },
            {
                path: '/order',
                name: 'order',
                meta: {
                    title: '订单管理',
                    permiss: '3',
                },
                component: () => import(/* webpackChunkName: "permission" */ '../views/order/index.vue'),
                children: [
                    {
                        path: 'info',
                        name: 'orderinfo',
                        meta: {
                            title: '订单详情',
                            permiss: '7',
                        },
                        component: () => import(/* webpackChunkName: "permission" */ '../views/order/orderInfo.vue'),
                    }
                ]
            },
            {
                path: '/trade',
                name: 'trade',
                meta: {
                    title: '交易记录',
                    permiss: '4',
                },
                component: () => import(/* webpackChunkName: "icon" */ '../views/trade/index.vue'),
            },
            {
                path: '/permission',
                name: 'permission',
                meta: {
                    title: '订单管理',
                    permiss: '3',
                },
                component: () => import(/* webpackChunkName: "permission" */ '../views/permission.vue'),
            },
        ],
    },
    {
        path: '/login',
        name: 'Login',
        meta: {
            title: '登录',
        },
        component: () => import(/* webpackChunkName: "login" */ '../views/login.vue'),
    },
    {
        path: '/403',
        name: '403',
        meta: {
            title: '没有权限',
        },
        component: () => import(/* webpackChunkName: "403" */ '../views/403.vue'),
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | vue-manage-system`;
    const role = localStorage.getItem('ms_username');
    const permiss = usePermissStore();
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permiss && !permiss.key.includes(to.meta.permiss)) {
        // 如果没有权限，则进入403
        next('/403');
    } else {
        next();
    }
});

export default router;
