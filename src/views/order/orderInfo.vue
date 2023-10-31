<template>
    <div class="container">
        <span>任务详情</span>
        <el-divider />
        <el-row type="flex" justify="space-between" :gutter="12">
            <el-col :span="8">
                <el-row>
                    <span>任务：{{ orderInfo.ID }}</span>
                </el-row>
                <el-row style="margin-top: 10px" type="flex" justify="space-between" :gutter="12">
                    <el-col :span="8">
                        <span>任务描述：</span>
                    </el-col>
                    <el-col :span="16">
                        <span>{{ orderInfo.remark }}</span>
                    </el-col>
                </el-row>
                <el-row style="margin-top: 10px">
                    <div v-if="(orderInfo.platform!=Number(4) && orderInfo.platform!=Number(5))">
                        <span>商品链接：</span>
                        <span >{{ orderInfo.context }}</span>
                    </div>
                    <div v-else>
                        <el-row type="flex" justify="space-between" :gutter="12">
                            <el-col :span="10">
                                <span>商品二维码：</span>
                            </el-col>
                            <el-col :span="12">
                                <el-image style="width: 200px; height: 200px" loading="lazy" :src="orderInfo.context"/>
                            </el-col>
                        </el-row>
                    </div>
                </el-row>
            </el-col>
            <el-col :span="8">
                <el-row>
                    <span>任务平台：{{ orderInfo.platform_cn }}</span>
                </el-row>
                <el-row style="margin-top: 10px">
                    <span>开始时间：{{ transferTime(orderInfo.CreatedAt) }}</span>
                </el-row>
                <el-row style="margin-top: 10px">
                    <span>截止时间：{{ transferTime(orderInfo.finish_at) }}</span>
                </el-row>
            </el-col>
            <el-col :span="8">
                <el-row >
                    <span>状态：{{ orderInfo.state_cn }}</span>
                </el-row>
                <el-row style="margin-top: 10px">
                    <span>总进度：{{ orderInfo.total }}/{{ orderInfo.complete }}</span>
                </el-row>
                <el-row style="margin-top: 10px">
                    <span>已接单：{{ orderInfo.accept }}</span>
                </el-row>
                <el-row style="margin-top: 10px">
                    <span>待审核：{{ orderInfo.review }}</span>
                </el-row>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <el-row>
                </el-row>
            </el-col>
        </el-row>
    </div>
    <div class="container" style="margin-top: 10px">
        <span>派单详情</span>
        <el-row style="margin-top: 20px">
            <el-table :data="filterdata(subOrders, searchKey, search).slice(pageStart, pageEnd)">
                <el-table-column label="子任务 ID" align="center">
                    <template #default="scope">
                        <span>任务 {{ scope.row.ID }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="user_id" label="用户名" align="center" />
                <el-table-column prop="" label="状态" align="center" >
                    <template #default="scope">
                        <el-text  :type="stateColor[scope.row.state]">{{ scope.row.state_cn }}</el-text>
                    </template>
                </el-table-column>
                <el-table-column label="接单时间">
                    <template #default="scope">
                            <span>{{ transferTime(scope.row.CreatedAt) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="提交时间">
                    <template #default="scope">
                            <span>{{ transferTime(scope.row.UpdatedAt) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="220" align="center">
                    <template #header>
                        <el-input v-model="search" size="small" placeholder="输入关键字搜索" />
                    </template>
                    <template #default="scope">
                        <el-button type="primary" :disabled="scope.row.state!=2" link @click="handleReview(scope.row)">审核订单</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-row type="flex" justify="end" style="margin-top: 10px">
            <el-pagination
                :total="filterdata(subOrders, searchKey, search).length"
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

    <el-dialog
        v-model="showSubOrderInfo"
        title="任务详情">

        <el-carousel height="1000px" indicator-position="outside">
            <el-carousel-item class="center" v-for="item in currentImgs" :key="item">
                <el-image loading="lazy" :src="item" />
            </el-carousel-item>
        </el-carousel>

        <template #footer>
            <span class="dialog-footer">
                <el-button @click="showSubOrderInfo=false">取消</el-button>
                <el-button type="primary" @click="confirmReview">通过</el-button>
                <el-button type="danger" @click="confirmReject">驳回</el-button>
            </span>
        </template>
    </el-dialog>

    
</template>


<script>
import { getOrderInfoAPI, getSubOrdersAPI, reviewSubOrderAPI } from '../../api/index'
import { ElMessage, ElMessageBox } from 'element-plus'

export default ({
    data() {
        return {
            order_id: undefined,
            orderInfo: {
                ID: undefined,
                name: '',
                remark: '',
                context: '',
                platform: undefined,
                state: undefined,
                total: undefined,
                complete: undefined,
                finisi_at: '',
                CreatedAt: '',
            },

            stateColor: {
                1: 'default',
                2: 'primary',
                3: 'info',
                4: 'success',
                5: 'danger',
            },
            showSubOrderInfo: false,
            currentSubOrderInfo: {},
            currentImgs: [],


            subOrders: [],
            searchKey: ['ID', 'state'],
            search: '',
            currentPage: 1,
            currentPageSize: 20,
        }
    },
    created() {
        this.init()
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
    },
    methods: {
        init: function() {
            this.order_id = this.$route.query.order_id
            console.log('init page', this.order_id);
            this.showSubOrderInfo = false;
            this.getOrderInfo()
            this.getSubOrders()
        },
        getOrderInfo: async function() {
            const res = await getOrderInfoAPI('test', this.order_id)
            if (res.status != 200) {
                ElMessage({
                    showClose: true,
                    message: res.data.message,
                    type: 'error',
                })
            }

            this.orderInfo = res.data.order
        },
        getSubOrders: async function() {
            const res = await getSubOrdersAPI('test', this.order_id)
            if (res.status != 200) {
                ElMessage({
                    showClose: true,
                    message: res.data.message,
                    type: 'error',
                })
            }

            this.subOrders = res.data.sub_orders
        },
        reviewSubOrder: async function(sub_order_id, state) {
            const res = await reviewSubOrderAPI('test', this.order_id, sub_order_id, state)
            if (res.status != 200) {
                ElMessage({
                    showClose: true,
                    message: res.data.message,
                    type: 'error',
                })
            }

            this.init()
        },
        handleReview: function(row) {
            this.showSubOrderInfo = true;
            this.currentSubOrderInfo = row
            this.currentImgs = row.context.split(',')
        },
        confirmReview: function() {
            ElMessageBox.confirm('确定审核通过该订单？', '审核通过', {
                // if you want to disable its autofocus
                // autofocus: false,
                confirmButtonText: '通过',
                cancelButtonText: '取消',
                type: 'success',
            }).then(()=> {
                this.reviewSubOrder(this.currentSubOrderInfo.ID, 4)
            })
        },
        confirmReject: function() {
            ElMessageBox.confirm('确定驳回该订单？', '订单驳回', {
                // if you want to disable its autofocus
                // autofocus: false,
                confirmButtonText: '驳回',
                cancelButtonText: '取消',
                type: 'error',
            }).then(()=> {
                this.reviewSubOrder(this.currentSubOrderInfo.ID, 5)
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
    }
})
</script>

<style scoped>
.center {
  text-align: center;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>