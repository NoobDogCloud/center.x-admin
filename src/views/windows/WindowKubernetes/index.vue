<template>
    <Curd ref='curd' :config='curdConfig' @onShowForm='onShowForm'>
        <!-- 字段插槽 -->
        <template #query-form-compact>
            <el-input class='query-form-item' clearable v-model='queryForm.name' placeholder='集群名称'
                      @clear='curdQuery()'
            >
                <template #append>
                    <el-button :icon='Search' @click='curdQuery()' />
                </template>
            </el-input>
        </template>
        <template #curd-form>
            <FormMode :id='data.formModeProps.id' v-model='data.formModeProps.visible' :mode='data.formMode'
                      @success='refreshTableData'
            />
        </template>
    </Curd>
</template>

<script name='WindowKubernetes' setup>
import Curd from '@/views/components/Gsc/Curd/index.vue'
import FormMode from './components/FormMode/index.vue'
import { reactive, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import k8sApi from '@/services/k8s'
import { getStateText } from 'gsc-frontend-sdk/gfw/model/checkModel'

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

const curd = ref(null)

const curdQuery = function () {
    curd.value.tableQuery(queryForm)
}

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
    }
})

const refreshTableData = () => {
    curd.value.getTable().refresh()
}

const onShowForm = (v) => {
    const d = data.value.formModeProps
    if (v) {
        d.id = v.id
        d.visible = true
    } else {
        d.id = undefined
        d.visible = true
    }
}

//Curd配置,详见组件内注释
const curdConfig = reactive({
    createAble: '添加集群',
    loader: k8sApi,
    showFieldFilterNotInConfig: false,
    fieldConfig: [
        { label: 'id', key: 'id' },
        { label: '部署名称', key: 'name' },
        { label: '状态', key: 'state', formatter: getStateText },
        { label: '说明', key: 'desc' }
    ]
})
</script>

<style lang='scss' scoped>
.query-form-item {
    width: $curd-query-common-form-width;
    margin: $curd-query-common-form-margin;
}
</style>
