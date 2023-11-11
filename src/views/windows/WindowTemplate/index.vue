<template>
    <Curd ref='curd' :config='curdConfig' @onShowForm='onShowForm'>
        <!-- 字段插槽 -->
        <template #query-form-compact>
            <el-input class='query-form-item' clearable v-model='queryForm.name' placeholder='模板名称'
                      @clear='curdQuery()'
            >
                <template #append>
                    <el-button :icon='Search' @click='curdQuery()' />
                </template>
            </el-input>
        </template>
        <template #template='scope'>
            <el-button size='default' text type='primary' @click='preview(scope.data)'>查看</el-button>
        </template>
        <template #curd-form>
            <FormModel v-model='formModelProps.visible' :form-data='formModelProps.formData'
                       @success='refreshTableData'
            />
        </template>
    </Curd>
    <el-dialog v-model='previewDialogVisible' append-to-body destroy-on-close title='模板预览' width='80%'>
        <FormRender :template='previewDialogTemplate'></FormRender>
    </el-dialog>
</template>

<script name='WindowTemplate' setup>
import Curd from '@/views/components/Gsc/Curd/index.vue'
import FormRender from '@/views/components/Gsc/VFormRender/index.vue'
import FormModel from './FormModel/index.vue'
import { reactive, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import templateApi from '@/services/template'

// 筛选表单值
const queryForm = reactive({
    name: ''
})

// 预览窗口属性
const previewDialogVisible = ref(false)
const previewDialogTemplate = ref({})

// 表单属性
const formModelProps = reactive({
    visible: false,
    formData: undefined
})

const curd = ref(null)

function refreshTableData () {
    curd.value.getTable().refresh()
}

const curdQuery = function () {
    curd.value.tableQuery(queryForm)
}

// 配置预览
const preview = v => {
    previewDialogVisible.value = true
    previewDialogTemplate.value = v.template
}

const onShowForm = (v) => {
    if (v) {
        formModelProps.formData = v
        formModelProps.visible = true
    } else {
        formModelProps.formData = undefined
        formModelProps.visible = true
    }
}

//Curd配置,详见组件内注释
const curdConfig = reactive({
    createAble: '创建模板',
    loader: templateApi,
    showFieldFilterNotInConfig: false,
    fieldConfig: [
        { label: '模板名称', key: 'name' },
        { label: '模板类型', key: 'type' },
        { label: '模板配置', key: 'template', slot: true, align: 'center' }
    ]
})
</script>

<style lang='scss' scoped>
.query-form-item {
    width: $curd-query-common-form-width;
    margin: $curd-query-common-form-margin;
}
</style>
