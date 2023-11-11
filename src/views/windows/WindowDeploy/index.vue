<template>
    <Curd ref='curd' :config='curdConfig' @onShowForm='onShowForm'>
        <!-- 字段插槽 -->
        <template #query-form-compact>
            <el-select @change='curdQuery()' class='query-form-item' v-model='queryForm.appid' placeholder='部署应用'>
                <el-option v-for='item in queryApp' :label='item.label' :value='item.value' />
            </el-select>
            <el-input class='query-form-item' clearable v-model='queryForm.name' placeholder='部署名称'
                      @clear='curdQuery()'
            >
                <template #append>
                    <el-button :icon='Search' @click='curdQuery()' />
                </template>
            </el-input>
        </template>
        <template #id='scope'>
            <el-button size='default' text type='primary' @click='previewApi(scope.data)'>查看Api</el-button>
        </template>
        <template #curd-form>
            <FormMode
                :appid='data.formModeProps.appid'
                :id='data.formModeProps.id' v-model='data.formModeProps.visible' :mode='data.formMode'
                @success='refreshTableData'
            />
        </template>
    </Curd>
    <BasicModelForm v-model='apiViewerVisible' append-to-body destroy-on-close noButton
                    title='接口信息查看'
                    width='80%'
    >
        <ApiViewer />
    </BasicModelForm>
</template>

<script name='WindowDeploy' setup>
import BasicModelForm from '@/views/components/Gsc/Dialog/BasicModelForm/index.vue'
import Curd from '@/views/components/Gsc/Curd/index.vue'
import ApiViewer from '@/views/components/Gsc/ApiViewer/index.vue'
import FormMode from './components/FormMode/index.vue'
import { reactive, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import servicesDeployApi, { getDeploySecureText } from '@/services/servicesdeploy'
import { getDebugText } from 'gsc-frontend-sdk/gfw/model/debugModel'
import { getStateText } from 'gsc-frontend-sdk/gfw/model/checkModel'
import appsApi from '@/services/apps'
// 筛选表单值
const queryForm = reactive({
    name: ''
})

const props = defineProps({
    appId: {
        type: [String, Number],
        default: ''
    },
    serviceId: {
        type: [String, Number],
        default: ''
    }
})

const apiViewerVisible = ref(false)
const curd = ref(null)
const queryApp = ref([{ label: '应用加载中', value: '' }])

appsApi.select().then(res => {
    queryApp.value = [{ label: '请选择应用', value: '' }].concat(res.getRecord().map(v => {
        return { label: v.name, value: v.id }
    }))
})

const curdQuery = function () {
    curd.value.tableQuery(queryForm)
}

const data = reactive({
    loading: false,
    /**
     * 详情展示模式
     * dialog 对话框
     * drawer 抽屉
     */
    formMode: 'dialog',
    // 详情
    formModeProps: {
        visible: false,
        id: '',
        appid: props.appid
    }
})

const refreshTableData = () => {
    curd.value.getTable().refresh()
}

const onShowForm = (v) => {
    if (v) {
        data.formModeProps.id = v.id
        data.formModeProps.appid = v.appid
        data.formModeProps.visible = true
    }
}

//Curd配置,详见组件内注释
const curdConfig = reactive({
    loader: servicesDeployApi,
    showFieldFilterNotInConfig: false,
    defaultFilter: {
        appid: props.appId,
        serviceId: props.serviceId
    },
    fieldConfig: [
        // { label: 'id', key: 'id' },
        { label: '应用', key: 'appname', width: 200 },
        { label: '部署名称', key: 'name', width: 200 },
        { label: '调试', key: 'debug', formatter: getDebugText, width: 100 },
        { label: '容器化', key: 'container', formatter: getDebugText, width: 100 },
        { label: '加密', key: 'secure', formatter: getDeploySecureText, width: 100 },
        { label: '状态', key: 'state', formatter: getStateText, width: 100 },
        // { label: '说明', key: 'desc' },
        { label: '内部地址', key: 'clusteraddr', width: 250 },
        { label: '外部地址', key: 'subaddr', width: 250 },
        { label: '版本', key: 'version', width: 150 },
        // { label: '创建时间', key: 'createat', width: 200 }
        { label: '使用', key: 'id', slot: true, align: 'center' }
        // { label: '服务', key: 'servicename' }
    ]
})

// 查看Api
const previewApi = async v => {
    apiViewerVisible.value = true
}
</script>

<style lang='scss' scoped>
.query-form-item {
    width: $curd-query-common-form-width;
    margin: $curd-query-common-form-margin;
}
</style>
