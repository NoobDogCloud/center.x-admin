<template>
    <Curd ref='curd' :config='curdConfig' @onShowForm='onShowForm'>
        <!-- 字段插槽 -->
        <template #query-form-compact>
            <el-input class='query-form-item' clearable v-model='queryForm.name' placeholder='应用名称'
                      @clear='curdQuery()'
            >
                <template #append>
                    <el-button :icon='Search' @click='curdQuery()' />
                </template>
            </el-input>
        </template>
        <template #control-button='scope'>
            <el-button text size='default' type='info' @click='onViewDeploy(scope.data)'>查看服务</el-button>
        </template>
        <template #curd-form>
            <FormMode :id='data.formModeProps.id' v-model='data.formModeProps.visible' :mode='data.formMode'
                      @success='refreshTableData'
            />
            <DeployView v-model='data.formDeployProps.visible' :app-id='data.formDeployProps.id' :mode='data.formMode'
                        :name='data.formDeployProps.name'
            />
        </template>
    </Curd>
</template>

<script name='WindowApp' setup>
import Curd from '@/views/components/Gsc/Curd/index.vue'
import FormMode from './components/FormMode/index.vue'
import DeployView from '@/views/components/Gsc/Deploy/DeployView/index.vue'
import { reactive, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import appsApi, { getAppPublishText } from '@/services/apps'
import { getStateText } from 'gsc-frontend-sdk/gfw/model/checkModel'

// 筛选表单值
const queryForm = reactive({
    name: ''
})

const data = ref({
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
        id: ''
    },
    // 查看部署
    formDeployProps: {
        visible: false,
        id: '',
        name: ''
    }
})

function refreshTableData () {
    curd.value.getTable().refresh()
}

function onViewDeploy (row) {
    data.value.formDeployProps.id = row.id
    data.value.formDeployProps.name = row.name
    data.value.formDeployProps.visible = true
}

const curd = ref(null)

const curdQuery = function () {
    curd.value.tableQuery(queryForm)
}

const onShowForm = (v) => {
    if (v) {
        data.value.formModeProps.id = v.id
        data.value.formModeProps.visible = true
    } else {
        data.value.formModeProps.id = ''
        data.value.formModeProps.visible = true
    }
}

//Curd配置,详见组件内注释
const curdConfig = reactive({
    createAble: '创建应用',
    controlColumWidth: 300,
    loader: appsApi,
    showFieldFilterNotInConfig: false,
    fieldConfig: [
        { label: 'id', key: 'id' },
        { label: '应用名称', key: 'name' },
        { label: '发布模式', key: 'category', formatter: getAppPublishText },
        // { label: '说明', key: 'desc' },
        { label: '域名', key: 'domain' },
        { label: '首页', key: 'entry' },
        { label: '主控', key: 'master' },
        { label: '状态', key: 'state', formatter: getStateText },
        {
            label: '创建时间',
            key: 'createat',
            width: 200,
            filterPipe: [
                { tool: 'formatDate' },
                { tool: 'textOverflow', arg: [10] }
            ]
        }
    ]
})
</script>

<style lang='scss' scoped>
.query-form-item {
    width: $curd-query-common-form-width;
    margin: $curd-query-common-form-margin;
}
</style>
