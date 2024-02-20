<template>
    <Curd ref="curd" :config="curdConfig" @onShowForm="onShowForm">
        <!-- 字段插槽 -->
        <template #query-form-compact>
            <el-input
                v-model="queryForm.id" class="query-form-item" clearable placeholder="版本号"
                @clear="curdQuery()"
            >
                <template #append>
                    <el-button :icon="Search" @click="curdQuery()" />
                </template>
            </el-input>
        </template>
        <template #curd-form>
            <FormMode
                :id="data.formModeProps.id" v-model="data.formModeProps.visible" :pom="data.formModeProps.pom" :mode="data.formMode"
                @success="refreshTableData"
            />
        </template>
    </Curd>
</template>

<script name='WindowSDK' setup>
import Curd from '@/views/components/Gsc/Curd/index.vue'
import FormMode from './components/FormMode/index.vue'
import { reactive, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import sdkApi from '@/services/sdk'

// 筛选表单值
const queryForm = reactive({
    id: ''
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
        pom: '',
        id: ''
    }
})

function refreshTableData() {
    curd.value.getTable().refresh()
}

const curd = ref(null)

const curdQuery = function() {
    curd.value.tableQuery(queryForm)
}

const onShowForm = v => {
    if (v) {
        data.value.formModeProps.id = v.id
        data.value.formModeProps.pom = v.text
        data.value.formModeProps.visible = true
    } else {
        data.value.formModeProps.id = ''
        data.value.formModeProps.pom = ''
        data.value.formModeProps.visible = true
    }
}

// Curd配置,详见组件内注释
const curdConfig = reactive({
    createAble: '新增SDK',
    controlColumWidth: 300,
    loader: sdkApi,
    showFieldFilterNotInConfig: false,
    fieldConfig: [
        { label: '版本', key: 'id' }
    ]
})
</script>

<style lang='scss' scoped>
.query-form-item {
    width: $curd-query-common-form-width;
    margin: $curd-query-common-form-margin;
}
</style>
