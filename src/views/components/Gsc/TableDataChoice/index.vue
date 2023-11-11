<template>
    <el-input v-model='displayContent' :disabled='true' :placeholder='placeholder' class='input-append-white' v-loading='loading'>
        <template #append>
            <el-button :icon='Search' @click='showChoice'></el-button>
        </template>
    </el-input>
    <BasicModelForm :paddingTop='0' :width='modelWidth' :title='choiceConfig.title' v-model='myVisible' @submit='onSubmit' :no-button='choiceConfig.mode === "single"'>
        <div class='table-data-choice-container' v-loading='loading'>
            <div class='table-data-choice-table-wrap'>
                <CommonTable :default-filter='choiceConfig.filter' :field-config='choiceConfig.fieldConfig' :control-colum-width='100' :loader='choiceConfig.loader' ref='tableRef' :show-tool-button='false' :headerTop='0'>
                    <template #table-query-form='scope'>
                        <el-form class='table-query-form' :inline='true' ref='formRef' :model='queryForm' label-suffix='：' size='small'>
                            <el-form-item label='模板名称'>
                                <el-input v-model='queryForm.name'></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type='primary' icon='el-icon-search' @click='scope.querySubmit(queryForm)'>筛选
                                </el-button>
                            </el-form-item>
                        </el-form>
                    </template>
                    <!-- 控制按钮 -->
                    <template #control-button='scope'>
                        <el-button plain size='mini' type='primary' @click='onChoice(scope.data)'>选用</el-button>
                    </template>
                </CommonTable>
            </div>
            <div class='table-data-choice-list-wrap' v-if='choiceConfig.mode !== "single"'>
                <div class='table-data-choice-list-header'>
                    <p>已选数据</p>
                </div>
                <div class='table-data-choice-list'>
                    <template v-if='selected.length'>
                        <div class='list-item' v-for='item in selected' :key='item.id'>
                            <div class='name'>{{ item[choiceConfig.displayKey] }}</div>
                            <div class='control' @click='removeSelect(item)'>
                                <el-icon :size='24'>
                                    <CircleClose color='#F56C6C' />
                                </el-icon>
                            </div>
                        </div>
                    </template>
                    <el-empty :image-size='100' description='未选择数据' v-if='!selected.length'></el-empty>
                </div>
            </div>
        </div>
    </BasicModelForm>
</template>

<script setup>
import BasicModelForm from '@/views/components/Gsc/Dialog/BasicModelForm/index.vue'
import CommonTable from '@/views/components/Gsc/CommonTable/index.vue'
import { reactive, ref, toRaw, watch } from 'vue'
import { CircleClose, Search } from '@element-plus/icons-vue'

const props = defineProps({
    modelValue: {
        type: Object
    },
    modelWidth: {
        type: [String, Number]
    },
    placeholder: {
        type: String
    },
    displayContent: {
        type: [String, Number],
        default: ''
    },
    /**
     * displayKey: 输入框展示内容
     * valueKey: 实际传输内容
     * loader: 表格所用服务
     * title: 弹出层标题
     * filter: 初始数据筛选条件
     * mode: 单选多选[single | multiple]
     * fieldConfig: 目标数据表字段配置
     * submit: 确定选择时
     */
    choiceConfig: {
        type: Object
    }
})

const loading = ref(false)

const selected = ref([])

const displayContent = ref(props.displayContent)

//数据选择组件显隐控制
const myVisible = ref(false)

// 筛选表单值
const queryForm = reactive({
    name: ''
})

const emit = defineEmits(['update:modelValue', 'change', 'submit', 'display'])

//移除已选项
const removeSelect = (v) => {
    selected.value.splice(selected.value.indexOf(v), 1)
}

const onChoice = (v) => {
    displayContent.value = v[props.choiceConfig.displayKey]
    if (props.choiceConfig.mode === 'single') {
        selected.value[0] = v
        myVisible.value = false
        emit('update:modelValue', v[props.choiceConfig.valueKey])
        emit('change', v)
    } else {
        if( !selected.value.some( (_v, i, arr)=>{
            return _v[props.choiceConfig.valueKey] === v[props.choiceConfig.valueKey]
        }) ){
            selected.value.push(v)
        }
    }
}

const onSubmit = () => {
    emit('submit', toRaw(selected.value))
    myVisible.value = false
}

//第一次加载数据
const loadData = (value, firstTime) => {
    if( parseInt(value) > 0  ) {
        loading.value = true
        props.choiceConfig.loader.find(props.choiceConfig.valueKey, value).then(v => {
            if (v.status()) {
                let res = v.getRecord()
                selected.value[0] = res
                displayContent.value = res[props.choiceConfig.displayKey]
                if (!firstTime) {
                    emit('change', res)
                }
            }
        }).finally(v => {
            loading.value = false
        })
    }
}

watch(() => props.modelValue, (n, o) => {
    if (n === '' || n === undefined) {
        reset()
    } else {
        //如果是onChoice触发的更改,新的值和当前值相等,不做操作
        if (n == selected.value.map(v => v[props.choiceConfig.valueKey]).join(',')) {
            return
        }
        loadData(n)
    }
})

//编辑时带入值时获取对应数据
if (props.modelValue !== undefined && props.modelValue !== '') {
    //第一次不触发emit
    loadData(props.modelValue, true)
}

const reset = () => {
    selected.value = []
    displayContent.value = ''
}

//弹出数据选择组件
const showChoice = () => {
    myVisible.value = true
}

const getSelected = () => {
    return toRaw(selected.value)
}

// 导出方法
defineExpose({
    getSelected
})
</script>

<style lang='scss' scoped>
// scss
.table-data-choice-container {
    display: flex;

    .table-data-choice-table-wrap {
        flex-grow: 1;
    }

    .table-data-choice-list-wrap {
        margin-left: 20px;
        border: 1px #ebeef5 solid;

        .table-data-choice-list-header {
            height: 40px;
            line-height: 40px;
            padding: 0 10px;
            background: #f7f8fa;
            .p {
                margin: 0;
            }
        }

        .table-data-choice-list {
            width: 180px;

            .list-item {
                min-height: 35px;
                padding: 5px 10px;
                border-bottom: 1px #ebeef5 solid;
                display: flex;
                align-items: center;

                .name {
                    flex-grow: 1;
                }

                .control {
                    width: 30px;
                    margin-left: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>
