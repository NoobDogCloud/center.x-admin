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
        <template #config='scope'>
            <el-button size='default' text type='primary' @click='preview(scope.data)'>查看</el-button>
        </template>
        <template #curd-form>
            <FormModel :id='formModelProps.id' v-model='formModelProps.visible' :form-data='formModelProps.formData'
                       @success='refreshTableData'
            />
        </template>
    </Curd>
    <BasicModelForm v-model='previewDialogVisible' append-to-body destroy-on-close
                    title='配置信息'
                    width='80%'
                    @submit='onSubmit'
    >
        <FormRender ref='formRender' :template='previewDialogTemplate' :render-data='previewDialogData'></FormRender>
    </BasicModelForm>
</template>

<script name='WindowConfig' setup>
import BasicModelForm from '@/views/components/Gsc/Dialog/BasicModelForm/index.vue'
import FormRender from '@/views/components/Gsc/VFormRender/index.vue'
import Curd from '@/views/components/Gsc/Curd/index.vue'
import FormModel from './components/FormModel/index.vue'
import { getCurrentInstance, reactive, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import configsApi from '@/services/configs'
import templateApi from '@/services/template'

const { proxy } = getCurrentInstance()

// 筛选表单值
const queryForm = reactive({
    name: ''
})

// 预览窗口属性
const previewDialogVisible = ref(false)
const previewDialogTemplate = ref({})
const previewDialogData = ref({})
const formRender = ref(null)

// 表单属性
const formModelProps = reactive({
    visible: false,
    formData: '',
    selectedId: '',
    id: ''
})

const curd = ref(null)

const curdQuery = function () {
    curd.value.tableQuery(queryForm)
}

// 配置预览onom dev
const preview = async v => {
    previewDialogVisible.value = true
    formModelProps.selectedId = v.id
    const resp = await templateApi.find('id', v.templateid)
    const res = resp.getRecord()
    previewDialogTemplate.value = res.template
    previewDialogData.value = JSON.parse(v.config)
}

// 提交配置编辑
function onSubmit () {
    const form = formRender.value
    form.getFormData().then(v => {
        form.validateForm(async valid => {
            if (valid) {
                if (formModelProps.selectedId) {
                    const data = { config: v }
                    const res = await configsApi.update(formModelProps.selectedId, data)
                    if (res.status()) {
                        proxy.$message.success({
                            message: '更新成功',
                            center: true
                        })
                        previewDialogVisible.value = false
                    } else {
                        proxy.$message.error({
                            message: res.getMessage(),
                            center: true
                        })
                    }
                }
            }
        })
    }).catch(v => {

    })
}

const onShowForm = (v) => {
    if (v) {
        formModelProps.formData = v
        formModelProps.id = v.id
    } else {
        formModelProps.id = ''
        formModelProps.formData = undefined
    }
    formModelProps.visible = true
}

function refreshTableData () {
    curd.value.getTable().refresh()
}

//Curd配置,详见组件内注释
const curdConfig = reactive({
    createAble: '创建配置',
    loader: configsApi,
    showFieldFilterNotInConfig: false,
    fieldConfig: [
        { label: 'id', key: 'id' },
        { label: '名称', key: 'name' },
        { label: '说明', key: 'desc' },
        { label: '类型', key: 'type' },
        { label: '配置内容', key: 'config', slot: true, align: 'center' }
    ]
})
</script>

<style lang='scss' scoped>
.query-form-item {
    width: $curd-query-common-form-width;
    margin: $curd-query-common-form-margin;
}
</style>
