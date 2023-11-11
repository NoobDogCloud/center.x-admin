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
        <!--        <template #query-form-complete>-->
        <!--            <el-form ref='formRef' :inline='true' :model='queryForm' class='table-query-form' label-suffix='：'>-->
        <!--                <el-form-item label='模板名称'>-->
        <!--                    <el-input v-model='queryForm.name' />-->
        <!--                </el-form-item>-->
        <!--                <el-form-item>-->
        <!--                    <el-button :icon='Search' type='primary' @click='curdQuery()'>搜索</el-button>-->
        <!--                </el-form-item>-->
        <!--            </el-form>-->
        <!--        </template>-->
        <template #curd-form>

        </template>
    </Curd>
</template>

<script name='WindowCurd' setup>
import Curd from '@/views/components/Gsc/Curd/index.vue'
import { reactive, ref } from 'vue'
import { Search } from '@element-plus/icons-vue'
import configsApi from '@/services/configs'

// 筛选表单值
const queryForm = reactive({
    name: ''
})

const curd = ref(null)

const curdQuery = function () {
    curd.value.tableQuery(queryForm)
}

const onTableLoad = (v) => {

}

const onShowForm = () => {
    debugger;
}

//Curd配置,详见组件内注释
const curdConfig = reactive({
    formTemplateId: 5,
    createAble: '创建配置',
    loader: configsApi,
    showFieldFilterNotInConfig: false,
    fieldConfig: [
        { label: 'id', key: 'id' },
        { label: '名称', key: 'name' },
        { label: '说明', key: 'desc' },
        { label: '类型', key: 'type' },
        { label: '配置内容', key: 'config', slot: true, align: 'center' }
    ],
    events: {
        table: {
            onLoad: onTableLoad
        }
    }
})
</script>

<style lang='scss' scoped>
.query-form-item {
    width: $curd-query-common-form-width;
    margin: $curd-query-common-form-margin;
}
</style>
