<template>
    <Curd ref="curd" :config="curdConfig" @onShowForm="onShowForm">
        <!-- 字段插槽 -->
        <template #query-form-compact>
            <el-input
                v-model="queryForm.name" class="query-form-item" clearable placeholder="服务名称"
                @clear="curdQuery()"
            >
                <template #append>
                    <el-button :icon="Search" @click="curdQuery()" />
                </template>
            </el-input>
        </template>
        <template #dev="scope">
            <el-button v-if="scope.data.kind==='data'" size="default" text type="warning" @click="downPom(scope.data)">pom.xml</el-button>
            <el-button size="default" text type="warning" @click="onDeploy(scope.data)">部署</el-button>
        </template>
        <!--
        <template #control-button="scope">
            <el-button size="default" text type="info" @click="onViewDeploy(scope.data)">查看</el-button>
        </template>
        -->
        <template #curd-form>
            <FormMode
                :id="data.formModeProps.id" v-model="data.formModeProps.visible" :mode="data.formMode"
                @success="refreshTableData"
            />
            <DeployMode
                :id="data.deployModeProps.id" v-model="data.deployModeProps.visible"
                :sdk-id="data.deployModeProps.sdkId"
                :progress="data.deployModeProps.progress" @close="onDeployModeClose"
            />
            <DeployView
                v-model="data.formDeployProps.visible" :mode="data.formMode" :name="data.formDeployProps.name"
                :service-id="data.formDeployProps.id"
            />
        </template>
    </Curd>
</template>

<script name='WindowService' setup>
import Curd from '@/views/components/Gsc/Curd/index.vue'
import FormMode from './components/FormMode/index.vue'
import DeployMode from './components/DeployMode/index.vue'
import DeployView from '@/views/components/Gsc/Deploy/DeployView/index.vue'
import { reactive, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import servicesApi, {
    getPublishText,
    NetProtocolOption,
    ServiceCategoryOptions,
    ServiceKindOptions
} from '@/services/services'

// 筛选表单值
const queryForm = reactive({
    name: ''
})

const data = reactive({
    loading: false,
    /**
     * 详情展示模式
     * dialog 对话框
     * drawer 抽屉
     */
    formMode: 'dialog',
    // 部署
    deployModeProps: {
        visible: false,
        id: '',
        sdkId: '',
        progress: {
            text: '下一步',
            step: 0
        }
    },
    // 查看部署
    formDeployProps: {
        visible: false,
        id: '',
        name: ''
    },
    // 详情
    formModeProps: {
        visible: false,
        id: ''
    }
})

const curd = ref(null)

const curdQuery = function() {
    curd.value.tableQuery(queryForm)
}

function onDeployModeClose() {
    data.deployModeProps.progress.step = 0
    data.deployModeProps.progress.text = '下一步'
}

function onDeploy(row) {
    data.deployModeProps.id = row.id
    data.deployModeProps.sdkId = row.sdk_id
    data.deployModeProps.visible = true
    data.deployModeProps.progress.step = 0
    data.deployModeProps.progress.text = '下一步'
}

function onViewDeploy(row) {
    data.formDeployProps.id = row.id
    data.formDeployProps.name = row.name
    data.formDeployProps.visible = true
}

// 检查 sdk 版本,获得对应 sdk 的 xml 内容,生成构造 pom.xml
function downPom(row) {
    servicesApi.call("downloadPom", row.id).then(res => {
        if (res.status()) {
            const blob = new Blob([res.asString()], { type: 'text/xml' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'pom.xml'
            a.click()
            window.URL.revokeObjectURL(url)
        }
    })
}

const onShowForm = v => {
    if (v) {
        data.formModeProps.id = v.id
        data.formModeProps.visible = true
    } else {
        data.formModeProps.id = ''
        data.formModeProps.visible = true
    }
}

function refreshTableData() {
    curd.value.getTable().refresh()
}

// Curd配置,详见组件内注释
const curdConfig = reactive({
    createAble: '创建服务',
    loader: servicesApi,
    controlColumWidth: 350,
    showFieldFilterNotInConfig: false,
    fieldConfig: [
        { label: 'id', key: 'id', width: 80 },
        { label: '名称', key: 'name' },
        { label: 'SDK版本', key: 'sdk_id', width: 100 },
        // { label: '说明', key: 'desc' },
        { label: '服务端口', key: 'port', width: 80 },
        {
            label: '网络协议', key: 'protocol',
            width: 80,
            filterPipe: [
                { tool: 'dictionary', arg: [NetProtocolOption] }
            ]
        },
        {
            label: '服务类型', key: 'category',
            width: 150,
            filterPipe: [
                { tool: 'dictionary', arg: [ServiceCategoryOptions] }
            ]
        },
        {
            label: '业务类型', key: 'kind',
            width: 150,
            filterPipe: [
                { tool: 'dictionary', arg: [ServiceKindOptions] }
            ]
        },
        // { label: '通讯方式', key: 'transfer', width: 80 },
        // { label: '调试', key: 'debug', formatter: getDebugText },
        // { label: '端点接口', key: 'peeraddr' },
        { label: '发布方式', key: 'open', formatter: getPublishText, width: 150 },
        // { label: '创建时间', key: 'create_time' },
        // { label: '更新时间', key: 'update_time' },
        { label: '最新版本', key: 'version', width: 100 },
        { label: '开发', key: 'dev', slot: true, align: 'center' }
    ]
})
</script>

<style lang='scss' scoped>
.query-form-item {
    width: $curd-query-common-form-width;
    margin: $curd-query-common-form-margin;
}
</style>
