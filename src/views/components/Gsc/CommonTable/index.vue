<template>
    <div v-loading="loading">
        <!-- 新增按钮/批量操作按钮 -->
        <div v-if="props.showToolButton" class="tool-box">
            <!-- 简介筛选表单 新增 -->
            <div class="tool-box-left">
                <slot name="create-button" />
                <slot v-if="queryFormState === 0" :query-submit="querySubmit" name="query-form-compact" />
            </div>
            <!-- 表格工具 -->
            <div class="tool-box-right">
                <slot name="tools" />
                <el-button v-if="$slots['query-form-complete']" text type="primary" @click="changeQueryFormState()">
                    {{ queryFormState === 0 ? '高级搜索' : '普通搜索' }}
                </el-button>
                <!-- 字段筛选 -->
                <div class="tool-button" @click="fieldFilter($event)">
                    <el-icon :size="14">
                        <Setting />
                    </el-icon>
                    <transition name="field-filter">
                        <ul
                            v-show="filterCheckboxVisible" class="field-filter"
                            @mouseleave="filterCheckboxVisible = false"
                        >
                            <li v-for="(item, key) in filterVisibleState" :key="key">
                                <el-checkbox v-model="filterVisibleState[key].visible" @change="setFieldFilter(key)">
                                    {{ item.label }}
                                </el-checkbox>
                            </li>
                        </ul>
                    </transition>
                </div>
                <!-- 数据刷新 -->
                <div class="tool-button" @click="refresh()">
                    <el-icon :size="14">
                        <Refresh />
                    </el-icon>
                </div>
            </div>
        </div>
        <!-- 完整筛选表单 -->
        <div v-if="queryFormState === 1" class="table-query-form-wrap">
            <slot name="query-form-complete" />
        </div>
        <!-- 表格主体 -->
        <div
            class="common-table"
            :style="{'--marginTop':headerTop}"
        >
            <el-table :data="data" class="list-table">
                <template v-for="item in fieldList">
                    <el-table-column
                        v-if="filterVisibleState[item.key] && filterVisibleState[item.key].visible" :key="item.key"
                        :align="item.align"
                        :formatter="item.formatter" :label="item.label" :prop="item.key"
                        :width="item.width || undefined"
                    >
                        <template v-if="item.slot === true" #default="scope">
                            <slot :data="scope.row" :name="item.key" />
                        </template>
                        <template v-else-if="item.filterPipe" #default="scope">
                            <span :title="scope.row[item.key]">
                                {{ getFilterPipeData(scope.row[item.key], item.filterPipe) }}
                            </span>
                        </template>
                        <template v-else-if="item.formatter" #default="scope">
                            <span>
                                {{ item.formatter(scope.row[item.key]) }}
                            </span>
                        </template>
                    </el-table-column>
                </template>
                <el-table-column v-if="hasControl" :width="controlColumWidth" align="center" label="操作">
                    <template #default="scope">
                        <slot :data="scope.row" name="control-button" />
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-pagination
            v-model:currentPage="pagination.page" v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 50, 100]" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper"
            small="small" @size-change="handleSizeChange" @current-change="handleCurrentChange"
        />
    </div>
</template>

<script setup>
import { computed, reactive, ref, useSlots, watch } from 'vue'
import { QueryBuilder } from 'gsc-frontend-sdk/gfw/rpc/queryBuilder'
import { Refresh, Setting } from '@element-plus/icons-vue'
import * as Tool from '@/util/tool'

const props = defineProps({
    // 表格配置
    fieldConfig: {
        type: Object,
        required: true
    },
    controlColumWidth: {
        type: Number
    },
    // 数据加载器
    loader: {
        type: Object,
        required: true
    },
    // 不在fieldConfig中的字段筛选中是否展示
    showFieldFilterNotInConfig: {
        type: Boolean,
        default: false
    },
    showToolButton: {
        type: Boolean,
        default: true
    },
    // 默认筛选参数
    defaultFilter: {
        type: Object
    },
    // top属性
    headerTop: {
        type: Number,
        default: 10
    }

})

const emit = defineEmits(['onLoad'])

// textOverflow的tooltips使用状态
// const tooltipRef = ref()
// const visible = ref()

const hasControl = ref(!!useSlots()['control-button'])
// 表格加载状态
const loading = ref(true)
// 显示字段配置窗口显隐
const filterCheckboxVisible = ref(false)
// 字段过滤状态
const filterVisibleState = reactive({})
// 字段过滤列表
const fieldFilterList = ref([])
// 字段列表和字段配置合并展示
const fieldList = computed(() => {
    return props.fieldConfig.concat(fieldFilterList.value)
})
// 搜索表单状态  0:精简  1:完整
const queryFormState = ref(0)
// 表格分页信息
const pagination = reactive({
    page: 1,
    pageSize: 10,
    total: 0
})

// const showTooltips = (v) => {
//     return function (e) {
//         tooltipRef.value = e.currentTarget
//         visible.value = true
//     }
// }

// 数据字段过滤
const getFilterPipeData = (v, p) => {
    for (let i = 0; i < p.length; i++) {
        let funcInfo = p[i]
        if (!funcInfo.arg) {
            funcInfo.arg = []
        }
        v = Tool[funcInfo.tool](v, ...funcInfo.arg)
    }

    return v
}

const queryBuilder = QueryBuilder.build()

// 筛选表单数据
let queryForm = reactive({})

watch(props.defaultFilter, () => {
    querySubmit()
})

const changeQueryFormState = () => {
    queryFormState.value = queryFormState.value === 1 ? 0 : 1
}

// 分页大小变更
const handleSizeChange = v => {
    pagination.pageSize = v
    loadData()
}

// 当前页变更
const handleCurrentChange = v => {
    pagination.page = v
    loadData()
}

// 表单筛选提交
const querySubmit = v => {
    queryForm = v
    loadData()
}

// 刷新数据
const refresh = () => {
    loadData()
}

// 显示字段配置
const fieldFilter = e => {
    if (e.target === e.currentTarget || e.target.nodeName === 'svg') {
        filterCheckboxVisible.value = !filterCheckboxVisible.value
    }
}

// 根据选择或配置设置显示字段
const setFieldFilter = key => {
    const exist = isFieldExistInConfig(key)
    if (exist === undefined) {
        fieldFilterList.value.push({ label: key, key: key })
    }
}

// 表单数据
const data = ref([])

// 构建筛选条件
const buildQuery = () => {
    queryBuilder.reInit()
    for (const tmp in queryForm) {
        if (queryForm[tmp]) {
            queryBuilder.like(tmp, `%${queryForm[tmp]}%`)
        }
    }
    if (props.defaultFilter) {
        for (const tmp in props.defaultFilter) {
            if (props.defaultFilter[tmp]) {
                queryBuilder.eq(tmp, `${props.defaultFilter[tmp]}`)
            }
        }
    }
}

const isFieldExistInConfig = function(key) {
    for (let i = 0; i < props.fieldConfig.length; i++) {
        if (props.fieldConfig[i].key === key) {
            return props.fieldConfig[i].visible === undefined ? true : props.fieldConfig[i].visible
        }
    }
}

// 数据加载
const loadData = () => {
    loading.value = true
    buildQuery()
    props.loader.pageAndQuery(pagination.page, pagination.pageSize, queryBuilder || {}).then(v => {
        loading.value = false
        const info = v.asPageInfo()
        data.value = info.record
        emit('onLoad', data.value)
        pagination.total = info.totalSize
        // 每个字段检查一遍
        for (let i = 0; i < props.fieldConfig.length; i++) {
            const item = props.fieldConfig[i]
            if (filterVisibleState[item.key] === undefined) {
                // 针对 显示不在字段配置中 或 已经存在于字段配置中 的字段初始化状态
                const visible = (item.visible === undefined ? true : item.visible)
                if (props.showFieldFilterNotInConfig || visible) {
                    filterVisibleState[item.key] = { visible, label: item.label }
                }
            }
        }
    })
}
loadData()

defineExpose({
    refresh,
    querySubmit
})
</script>

<style>

.window-container.maximize .tool-box-right {
    padding-right: 35px;
}
</style>

<style lang='scss' scoped>
.common-table {
    margin-top: var(--marginTop);
}
.table-query-form-wrap {
    position: relative;
    padding-top: 10px;
}

:deep(.el-table th.el-table__cell) {
    background: #eff3f8;
}

:deep(.el-pagination) {
    margin-top: 20px;
    justify-content: center;
}

.field-filter-leave-active,
.field-filter-enter-active {
    transition: all 0.2s linear;
}

.field-filter-enter-from,
.field-filter-leave-active {
    opacity: 0;
    transform: scaleY(0.5);
}

.tool-box {
    display: flex;
    position: relative;
    margin-bottom: 16px;

    .field-filter {
        position: absolute;
        transform-origin: 0 0;
        top: 35px;
        right: 0;
        z-index: 1010;
        animation-duration: .3s;
        animation-timing-function: ease;
        background: #fff;
        border: 1px solid #c0c6cc;
        border-radius: 2px;
        box-shadow: 0 2px 4px 0 rgb(0 0 0 / 16%);
        font-size: 12px;
        list-style: none;
        margin: 0;
        padding: 2px 10px;
        min-width: 100px;

        li {
            display: flex;
            align-items: center;
            height: 30px;
        }

        :deep(&.el-checkbox) {
            height: 100%;
        }
    }

    .tool-box-left {
        display: flex;
        align-items: center;
        flex-grow: 1;

        :deep(&>div) {
            margin: 0 8px;
        }
    }

    .tool-box-right {
        display: flex;
        align-items: center;
        padding-left: 20px;

        @include toolButton();
    }
}
</style>
