<template>
	<div class="container">
        <div >交易记录</div>
        <div style="margin-top: 20px">
            <el-row>
                <el-table :data="filterdata(tableData, searchKey, search).slice(pageStart, pageEnd)">
                    <el-table-column label="交易 ID" align="start" width="320">
                        <template #default="scope">
                            <span>{{ scope.row.trade_id }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="交易类型" align="center">
                        <template #default="scope">
                            <span>{{ scope.row.type_cn }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="用户 ID" align="center" width="100">
                        <template #default="scope">
                            <el-text>{{ scope.row.user_id }}</el-text>
                        </template>
                    </el-table-column>
                    <el-table-column label="用户名" align="center" width="100">
                        <template #default="scope">
                            <el-text>{{ userid2name[scope.row.user_id] ? userid2name[scope.row.user_id] : '微信用户' }}</el-text>
                        </template>
                    </el-table-column>
                    <el-table-column label="交易金额（元）" align="center">
                        <template #default="scope">
                            <span>{{ scope.row.amount/100 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="余额（元）" align="center">
                        <template #default="scope">
                            <span>{{ scope.row.balance/100 }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="发生时间">
                        <template #default="scope">
                            <span>{{ transferTime(scope.row.CreatedAt) }}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label="操作" width="220" align="center">
                        <template #header>
                            <el-input v-model="search" size="small" placeholder="输入关键字搜索" />
                        </template>
                        <template #default="scope">
                            <el-button type="primary" link @click="toOrderInfo(scope.row.ID)">查看详情</el-button>
                        </template>
                    </el-table-column> -->
                </el-table>
            </el-row>
            <el-row type="flex" justify="end" style="margin-top: 10px">
                <el-pagination
                    :total="filterdata(tableData, searchKey, search).length"
                    :v-model:current-page="currentPage"
                    :v-model:page-size="currentPageSize"
                    :page-sizes="[10, 20, 50, 100]"
                    :pager-count="3"
                    layout="total, sizes, prev, pager, next"
                    @size-change="currentPageSize=$event"
                    @current-change="currentPage=$event"
                />
            </el-row>
        </div>
    </div>
</template>

<script>

import { getTradesAPI, getUsersAPI } from '../../api/index'
import { ElMessage } from 'element-plus'

export default {
    data() {
        return {
            userid2name: {},
            tableData: [],
            searchKey: ['ID', 'type_cn', 'trade_id'],
            search: '',
            currentPage: 1,
            currentPageSize: 10,
        }
    },
    methods: {
        getTableData: async function() {
            let res = await getTradesAPI()
            if (res.status != 200) {
                ElMessage({
                    showClose: true,
                    message: res.data.message,
                    type: 'error',
                })
            }

            this.tableData = res.data.trades
            console.log('get tabledata', res);
        },
        getUserList: async function() {
            let res = await getUsersAPI()
            if (res.status != 200) {
                ElMessage({
                    showClose: true,
                    message: res.data.message,
                    type: 'error',
                })
            }

            var users = res.data.users
            var userid2name = {}
            users.forEach(element => {
                userid2name[element.ID] = element.name
            });
            this.userid2name = userid2name;
            console.log('get tabledata', this.userid2name);
        },
        toOrderInfo: function(order_id) {
            this.$router.push({
                path: '/order/info',
                query: {
                    order_id: order_id
                }
            })
        },
        filterdata: function(data, filterKey, filter) {
            if (data === null || data.length === 0) { return data }
            const filterRes = data.filter(item => {
                return Object.keys(item).some(key => {
                if (filterKey.indexOf(key) === -1) return false
                return (
                    String(item[key])
                    .toLowerCase()
                    .indexOf(filter.toLowerCase()) > -1
                )
                })
            })

            return filterRes
        },
        transferTime(t) {
            if (t === undefined) return ''
            if (t === '0001-01-01T00:00:00Z') return '0000-00-00'
            return t
                .slice(0, -6)
                .split('T')
                .join(' ')
        }
    },
    created() {
        this.getUserList()
        this.getTableData()
    },
    computed: { 
        pageStart: function() {
            console.log('page', this.currentPage);
            return (this.currentPage - Number(1)) * this.currentPageSize
        },
        pageEnd: function() {
            console.log('pagesize', this.currentPageSize);
            return this.currentPage * this.currentPageSize
        },
    }
}
</script>
