<template>
    <CommonTable
        v-on='props.config.events && props.config.events.table' :default-filter='props.config.defaultFilter'
        ref='tableRef' :control-colum-width='props.config.controlColumWidth || 200'
        :showFieldFilterNotInConfig='props.config.showFieldFilterNotInConfig' :field-config='props.config.fieldConfig'
        :loader='props.config.loader' createAble='props.config.createAble'
    >
        <!-- 筛选表单 -->
        <template #query-form-compact='scope'>
            <slot name='query-form-compact'></slot>
        </template>
        <template #query-form-complete='scope' v-if='$slots["query-form-complete"]'>
            <slot name='query-form-complete'></slot>
        </template>
        <template #create-button>
            <el-button size='default' v-if='props.config.createAble !== undefined' type='primary' @click='onCreate()'>
                {{ props.config.createAble !== '' ? props.config.createAble : '新增' }}
            </el-button>
        </template>
        <template v-for='(idx, slotName) in slotList' #[slotName]='scope'>
            <slot :name='slotName' :data='scope.data'></slot>
        </template>
        <!-- 控制按钮 -->
        <template #control-button='scope'>
            <slot name='control-button' :data='scope.data'></slot>
            <el-button size='default' type='primary' @click='onEdit(scope.data)' text>编辑</el-button>
            <el-popconfirm title='确定删除该条数据吗?' @confirm='onDel(scope.data)'>
                <template #reference>
                    <el-button :loading='removeLoading[scope.data.id]' size='default' type='danger' text>
                        删除
                    </el-button>
                </template>
            </el-popconfirm>
        </template>
    </CommonTable>
    <CurdForm
        :loader='props.config.loader'
        v-on='props.config.events && props.config.events.form'
        v-if='!hasCustomizeCurdForm'
        :formTemplateId='props.config.formTemplateId'
        @submit='onSubmit'
        ref='curdForm' v-model='curdFormModelProps.visible' :form-data='curdFormModelProps.formData'
    ></CurdForm>
    <slot v-if='hasCustomizeCurdForm' name='curd-form'></slot>
</template>

<script setup>
import CommonTable from '@/views/components/Gsc/CommonTable/index.vue'
import CurdForm from '@/views/components/Gsc/Curd/CurdForm.vue'
import { computed, getCurrentInstance, reactive, ref, useSlots } from 'vue'

/**
 * Curd配置项说明
 * eventObj:{
 *     table:表格事件
 *     form: curdForm事件
 * }
 *
 * config:{
 *     loader: [services]数据加载服务对象
 *     formTemplateId: [string]所使用表单模板ID
 *     createAble: [string]是否可以新增,内容为新增按钮文本
 *     showFieldFilterNotInConfig: [Boolean]不在fieldConfig中的字段筛选中是否展示
 *     events: [eventObj]事件处理
 *     controlColumWidth: [number]表格控制按钮列宽度
 *     fieldConfig: [fieldConfig]表格字段配置
 *     defaultFilter: [Object]数据默认筛选条件
 * }
 */
const props = defineProps({
    config: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['onShowForm'])
const { proxy } = getCurrentInstance()
//插槽列表
let slots = useSlots()

//使用者是否使用自定义表单插槽
const hasCustomizeCurdForm = ref(!!slots['curd-form'])

/**
 * 删除按钮loading状态
 * 每个数据都有自己独立的loading状态
 */
const removeLoading = reactive({})

/**
 * 表格搜索
 */
const tableQuery = function (query) {
    tableRef.value.querySubmit(query)
}

// 表格ref对象
const tableRef = ref(null)
//curdForm对象
const curdForm = ref(null)

//curd表单显隐
const curdFormVisible = ref(false)

const slotList = computed(function () {
    let rs = reactive({})
    for (const slotsKey in slots) {
        //剔除预设插槽
        if (slotsKey !== 'batch' && slotsKey !== 'table-query-form' && slotsKey !== 'query-form-compact' && slotsKey !== 'control-button' && slotsKey !== 'curd-form') {
            rs[slotsKey] = slots[slotsKey]
        }
    }
    return rs
})

// 表单属性
const curdFormModelProps = reactive({
    visible: false,
    formData: undefined
})

function onCreate () {
    curdFormModelProps.formData = undefined
    curdFormModelProps.visible = true
    if (hasCustomizeCurdForm.value) {
        emit('onShowForm')
    } else {
        showCurdForm()
    }
}

// 编辑数据
const onEdit = v => {
    curdFormModelProps.formData = v
    curdFormModelProps.visible = true
    if (hasCustomizeCurdForm.value) {
        emit('onShowForm', v)
    } else {
        showCurdForm()
    }
}

const onDel = async v => {
    removeLoading[v.id] = true
    const res = await props.config.loader.remove(v.id)
    if (res.status()) {
        proxy.$message.success({
            message: '删除成功',
            center: true
        })
    } else {
        proxy.$message.error({
            message: '删除失败',
            center: true
        })
    }
    removeLoading[v.id] = false
    tableRef.value.refresh()
}

const onSubmit = async(v, done) => {
    const res = curdFormModelProps.formData.id ? await props.config.loader.update(curdFormModelProps.formData.id, v) : await props.config.loader.insert(v)
    if (res.status()) {
        proxy.$message.success({
            message: curdFormModelProps.formData.id ? '修改成功' : '新增成功',
            center: true
        })
        done && done()
    } else {
        proxy.$message.error({
            message: res.getMessage(),
            center: true
        })
    }
}

const showCurdForm = () => {
    curdFormVisible.value = true
}

const getTable = () => {
    return tableRef.value
}

const getCurdForm = () => {
    return curdForm.value
}

const refreshTable = () => {
    tableRef.value.refresh()
}

defineExpose({
    tableQuery,
    getTable,
    getCurdForm,
    showCurdForm
})
</script>

<style scoped lang='scss'>

</style>
