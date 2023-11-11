<template>
    <div v-loading='data.loading'>
        <el-form ref='form' :model='data.form' :rules='data.rules' label-suffix=':' label-width='120px'>
            <el-form-item label='名称' prop='name'>
                <el-input v-model='data.form.name' placeholder='请输入配置名称(不支持中文)' />
            </el-form-item>
            <el-form-item label='说明' prop='desc'>
                <el-input v-model='data.form.desc' placeholder='请输入配置说明' />
            </el-form-item>
            <el-form-item label='配置类型' prop='type'>
                <el-select v-model='data.form.type' placeholder='请选择' value-key='null' style='width: 100%;'
                           @change='filterChange'
                >
                    <el-option v-for='item in ConfigTypeOptions' :key='item.key' :label='item.name' :value='item.key' />
                </el-select>
            </el-form-item>
            <el-form-item label='配置模板' prop='templateid'>
                <TableDataChoice model-width='80%'
                                 v-model='data.form.templateid'
                                 placeholder='请选择配置模板'
                                 :choiceConfig='choiceConfig'
                />
                <!-- @submit='onTemplateSelected' -->
            </el-form-item>
            <el-form-item label='配置' v-if=" parseInt(data.form.templateid) > 0">
                <div>
                <FormRender ref='formRender' :template='data.content.template' :render-data='data.content.config'></FormRender>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { getCurrentInstance, reactive, ref, toRaw, watch, onMounted } from 'vue'
import { ImplDataChecker } from 'gsc-frontend-sdk/gfw/from-checker/dataCheckerImpl'
import mapConvert from '@/util/mapConvert'
import { QueryBuilder } from 'gsc-frontend-sdk/gfw/rpc/queryBuilder'
import TableDataChoice from '@/views/components/Gsc/TableDataChoice/index.vue'
import FormRender from '@/views/components/Gsc/VFormRender/index.vue'
import configApi, { ConfigTypeMap } from '@/services/configs'
import templateApi from '@/services/template'
import {isString} from "lodash";

const ConfigTypeOptions = ref(ConfigTypeMap)
const formRender = ref(null)

const { proxy } = getCurrentInstance()

const props = defineProps({
    formData: {
        type: Object
    }
})

/**
 * 表单配置
 * loading: 表单提交loading
 * form: 回显数据由父组件传入
 * rules: 表单验证规则
 */
const data = reactive({
    loading: false,
    //以获取数据为转义后的,这里需要转换成原始数据
    form: Object.assign({}, toRaw(props.formData), { type: props.formData ? mapConvert.toValue(ConfigTypeMap, props.formData.type) : 'db' }),
    rules: {
        name: [
            {
                required: true,
                trigger: 'blur',
                validator: (rule, value, callback) => {
                    if (value === '') {
                        callback(new Error('请输入配置名称'))
                    } else if (!ImplDataChecker.IsID(value, 64)) {
                        callback(new Error('请输入英文字母开头,可包含数字和下划线'))
                    } else {
                        callback()
                    }
                }
            }
        ]
    },
    content:{
        template: {},
        config:{}
    }
})
// multiple
const choiceConfig = reactive({
    displayKey: 'name',
    valueKey: 'id',
    loader: templateApi,
    mode: 'single',
    title: '模板选择',
    filter: { type: data.form.type },
    fieldConfig: [
        { label: '模板名称', key: 'name' },
        { label: '模板类型', key: 'type', formatter: v => mapConvert.toDisplay(ConfigTypeMap, v) }
    ]
})

//类型改变后模板清空,模板筛选条件变更
const filterChange = (v) => {
    choiceConfig.filter = { type: v }
    data.form.templateid = ''
    data.form.config = {}
    data.content.template = {}
    data.content.config = {}
}

// 获得配置模板
const findTemplate = async (id) => {
    const resp = await templateApi.find('id', id)
    const res = resp.getRecord()
    data.content.template = res.template
}

// 多选回调测试
/*
const onTemplateSelected = (arr) => {
    console.log(arr)
}
*/

// 监视模板id
watch( ()=> data.form.templateid, async (value, org)=> {
    if( value === '' || value === undefined || value === null || value === org || parseInt(value) === 0 ){
        return
    }
    await findTemplate(value)
} )

const getConfigValue = () => {
    const v = toRaw(data.form.config)
    return isString(v) ? JSON.parse(v) : v;
}

onMounted(async() => {
    if( props.formData && props.formData.templateid ) {
        await findTemplate(props.formData.templateid)
        data.content.config = getConfigValue()
    }
})

defineExpose({
    submit (callback) {
        if( formRender.value ){
            formRender.value.getFormData().then( v => {
                data.form.config = toRaw(v)
                if (data.form.id === '' || data.form.id ===undefined || data.form.id === null) {
                    proxy.$refs.form.validate(async valid => {
                        if (valid) {
                            const inputInfo = data.form
                            const res = await configApi.insert(inputInfo)
                            if (res.status()) {
                                proxy.$message.success({
                                    message: '新增成功',
                                    center: true
                                })
                                callback && callback()
                            } else {
                                proxy.$message.error({
                                    message: res.getMessage(),
                                    center: true
                                })
                            }
                        }
                    })
                } else {
                    proxy.$refs.form.validate(async valid => {
                        if (valid) {
                            const res = await configApi.update(data.form.id, data.form)
                            if (res.status()) {
                                proxy.$message.success({
                                    message: '修改成功',
                                    center: true
                                })
                                callback && callback()
                            } else {
                                proxy.$message.error({
                                    message: res.getMessage(),
                                    center: true
                                })
                            }
                        }
                    })
                }
            })
        }
    }
})
</script>

<style lang='scss' scoped>
// scss
.el-select {
    width: 100%;
}
</style>
<style>
.field-wrapper{
    margin-bottom: 18px;
}
</style>
