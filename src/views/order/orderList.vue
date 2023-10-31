<template>
	<div class="container">
        <div >查询订单</div>
        <el-divider />
        <div >订单列表</div>
        <div style="margin-top: 20px">
            <el-row>
                <el-table :data="filterdata(tableData, searchKey, search).slice(pageStart, pageEnd)">
                    <el-table-column label="任务 ID" align="center">
                        <template #default="scope">
                            <span>任务 {{ scope.row.ID }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="平台" align="center">
                        <template #default="scope">
                            <span>{{ scope.row.platform_cn }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="订单状态" align="center">
                        <template #default="scope">
                            <span>{{ scope.row.state_cn }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="完成进度" align="center">
                        <template #default="scope">
                            <span>{{ scope.row.total }}/{{ scope.row.complete }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="accept" label="已接受" align="center" width="100" />
                    <el-table-column prop="review" label="待审核" align="center" width="100" />
                    <el-table-column label="发布时间">
                        <template #default="scope">
                            <span>{{ transferTime(scope.row.CreatedAt) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="截止时间">
                        <template #default="scope">
                            <span>{{ transferTime(scope.row.finish_at) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="220" align="center">
                        <template #header>
                            <el-input v-model="search" size="small" placeholder="输入关键字搜索" />
                        </template>
                        <template #default="scope">
                            <el-button type="primary" link @click="toOrderInfo(scope.row.ID)">查看详情</el-button>
                        </template>
                    </el-table-column>
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

import { getOrdersAPI } from '../../api/index'
import { ElMessage } from 'element-plus'

export default {
    data() {
        return {

            tableData: [],
            searchKey: ['ID', 'state_cn', 'platform_cn'],
            search: '',
            currentPage: 1,
            currentPageSize: 20,
        }
    },
    methods: {
        getTableData: async function() {
            let res = await getOrdersAPI('test')
            if (res.status != 200) {
                ElMessage({
                    showClose: true,
                    message: res.data.message,
                    type: 'error',
                })
            }

            this.tableData = res.data.orders
            console.log('get tabledata', res);
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
