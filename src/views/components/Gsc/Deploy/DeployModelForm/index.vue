<template>
    <div class="deploy-top">
        <el-form ref="form" :model="data.form" :rules="data.rules" label-suffix=":" label-width="100px">
            <el-form-item label="当前模型" prop="tabName">
                <el-select
                    v-model="data.current.modelName" clearable placeholder="请选择" value-key="null"
                    @change="modelChange"
                    @clear="modelClear"
                >
                    <el-option v-for="(value,key) in data.content" :key="key" :label="key" :value="key" />
                </el-select>
                <el-button plain style="margin-left: 10px" type="primary" @click="onAddModel()">
                    <el-icon style="margin-right: 5px;">
                        <svg-icon name="akar-icons:plus" />
                    </el-icon>
                    新增模型
                </el-button>
                <el-button plain style="margin-left: 10px" type="success" @click="onImportModel()">
                    <el-icon style="margin-right: 5px;">
                        <svg-icon name="bxs:file-import" />
                    </el-icon>
                    粘贴模型
                </el-button>
                <el-button plain style="margin-left: 10px" type="warning" @click="onExportModel()">
                    <el-icon style="margin-right: 5px;">
                        <svg-icon name="bxs:file-export" />
                    </el-icon>
                    复制模型
                </el-button>
            </el-form-item>
            <div v-if="data.current.modelName">
                <el-form-item label="表名称" prop="tableName">
                    <el-input v-model="data.form.tableName" placeholder="请输入数据表名称(不支持中文)" />
                </el-form-item>
                <el-form-item label="业务名称" prop="text">
                    <el-input v-model="data.form.text" placeholder="请输入模型业务名称" />
                </el-form-item>
                <el-form-item label="分类" prop="tabName">
                    <el-tabs class="category" style="flex-grow: 1" type="border-card">
                        <el-tab-pane label="模型">
                            <el-tabs
                                v-model="data.current.tabPosition" :tab-position="tabPosition"
                                @tab-click="tabClick"
                            >
                                <el-tab-pane v-for="item in rule" :key="item.name" :label="item.text">
                                    <div class="tab-wrap">
                                        <ModelEdit
                                            :appid="appid"
                                            :field-content="item.content" :mode="item.mode" style=""
                                            @update-rule="updateRule"
                                            @insert-rule="insertRule"
                                            @delete-rule="deleteRule"
                                        />
                                    </div>
                                </el-tab-pane>
                            </el-tabs>
                        </el-tab-pane>
                        <el-tab-pane label="权限">
                            <el-tabs v-model="data.current.permMode" :tab-position="tabPosition">
                                <el-tab-pane v-for="item in perm" :key="item.mode" :label="item.name" :name="item.mode">
                                    <div class="tab-wrap">
                                        <PermEdit
                                            :appid="appid" :perm-content="item.content"
                                            @update-perm="updatePerm"
                                        />
                                    </div>
                                </el-tab-pane>
                            </el-tabs>
                        </el-tab-pane>
                    </el-tabs>
                </el-form-item>
                <el-form-item label="主字段" prop="primaryKey">
                    <el-select
                        v-model="data.form.primaryKey" clearable placeholder="请选择" :value-key="data.form.primaryKey"
                        @change="primaryKeyChange"
                        @clear="primaryKeyClear"
                    >
                        <el-option v-for="v in keyFields" :key="v.key" :label="v.text" :value="v.key" />
                    </el-select>
                </el-form-item>
                <el-form-item label="业务名字段" prop="textKey">
                    <el-select
                        v-model="data.form.textKey" clearable placeholder="请选择" :value-key="data.form.textKey"
                        @change="textKeyChange"
                        @clear="textKeyClear"
                    >
                        <el-option v-for="v in keyFields" :key="v.key" :label="v.text" :value="v.key" />
                    </el-select>
                </el-form-item>
                <el-form-item class='deploy-line' label='软删除' prop='softMode'>
                    <el-radio-group v-model='data.form.softMode' @change="softModeChange">
                        <el-radio :label='1'>是</el-radio>
                        <el-radio :label='0'>否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </div>
        </el-form>
        <ModelAdd v-model="data.addModelVisible" :mode="data.formMode" @add-model="addModel" />
    </div>
</template>
<script name='DeployModel' setup>
import clipboard from 'clipboardy'
import { computed, getCurrentInstance, onMounted, reactive, ref, watch, watchEffect, provide, toRaw } from 'vue'
import _, { isObject } from 'lodash'
import ModelEdit from '@/views/components/Gsc/Deploy/DeployModelForm/ModelEdit/index.vue'
import PermEdit from '@/views/components/Gsc/Deploy/DeployModelForm/PermEdit/index.vue'
import ModelAdd from '@/views/components/Gsc/Deploy/DeployModelForm/ModelAdd/index.vue'
import { ImplDataChecker } from 'gsc-frontend-sdk/gfw/from-checker/dataCheckerImpl'

const { proxy } = getCurrentInstance()
const tabPosition = ref('left')

const props = defineProps({
    content: {
        type: Object,
        default: () => {
            return {}
        }
    },
    appid: {
        type: [String, Number]
    }
})

const emit = defineEmits(['model-change'])

const data = reactive({
    formMode: 'dialog',
    form: {
        modelName: '',
        tabName: '',
        name: '',
        tableName: '',
        primaryKey: '',
        textKey: '',
        softMode: '1',
    },
    content: props.content, // 完整模型字段内容
    current: {
        modelName: '',
        permMode: 'c',
        tabPosition: 0
    },
    addModelVisible: false,
    rules: {
        modelName: [
            {
                required: true,
                trigger: 'blur',
                validator: (rule, value, callback) => {
                    if (value === '') {
                        callback(new Error('请输入模型名称'))
                    } else if (!ImplDataChecker.IsID(value, 64)) {
                        callback(new Error('英文字母开头,可包含数字和下划线'))
                    } else {
                        callback()
                    }
                }
            }
        ],
        tableName: [
            {
                required: true,
                trigger: 'blur',
                validator: (rule, value, callback) => {
                    if (value === '') {
                        callback(new Error('请输入数据表名称'))
                    } else if (!ImplDataChecker.IsID(value, 64)) {
                        callback(new Error('英文字母开头,可包含数字和下划线'))
                    } else {
                        callback()
                    }
                }
            }
        ]
    },
})

provide('deploy-model', ()=> data.content)
onMounted(async() => {
    // console.log('content', props.content)
})

const modelClear = () => {
    debugger
    const modelName = data.form.modelName
    data.form.modelName = ''
    data.form.tabName = ''
    data.form.tableName = ''
    data.form.text = ''
    data.form.primaryKey = ''
    data.form.textKey = ''
    data.form.softMode = '1'
    if (modelName !== '') {
        delete data.content[modelName]
    }
}

const tabClick = () => {
}

const modelChange = modelName => {
    if (modelName !== '') {
        data.form.modelName = modelName
        data.form.tableName = data.content[modelName].tableName
        data.form.text = data.content[modelName].text
        data.form.primaryKey = data.content[modelName].primaryKey
        data.form.textKey = data.content[modelName].textKey
        data.form.softMode = data.content[modelName].softMode
        if (data.content[modelName].rule.length < data.current.tabPosition) {
            data.current.tabPosition = '0'
        }
    }
    emit('model-change', modelName)
}

const softModeChange = value => {
    if( data.form.modelName !== '' ) {
        data.content[data.form.modelName].softMode = value
    }
}

const primaryKeyChange = primaryKey => {
    data.form.primaryKey = primaryKey
    if( data.form.modelName !== '' ){
        data.content[data.form.modelName].primaryKey = primaryKey
    }
}

const primaryKeyClear = () => {
    data.form.primaryKey = ''
    if( data.form.modelName !== '' ){
        data.content[data.form.modelName].primaryKey = ''
    }
}

const textKeyChange = textKey => {
    data.form.textKey = textKey
    if( data.form.modelName !== '' ){
        data.content[data.form.modelName].textKey = textKey
    }
}

const textKeyClear = () => {
    data.form.textKey = ''
    if( data.form.modelName !== '' ){
        data.content[data.form.modelName].textKey = ''
    }
}

const perm = computed(() => {
    const result = []
    if (isObject(data.content) && _.has(data.content, data.current.modelName)) {
        const perms = data.content[data.current.modelName].perm
        result.push({
            name: '创建',
            mode: 'c',
            content: perms.c ?? undefined
        })
        result.push({
            name: '更新',
            mode: 'u',
            content: perms.u ?? undefined
        })
        result.push({
            name: '读取',
            mode: 'r',
            content: perms.r ?? undefined
        })
        result.push({
            name: '删除',
            mode: 'd',
            content: perms.d ?? undefined
        })
        result.push({
            name: '管理',
            mode: 'o',
            content: perms.o ?? undefined
        })
    }
    return result
})

const rule = computed(() => {
    const result = []
    if (isObject(data.content) && _.has(data.content, data.current.modelName)) {
        const rules = data.content[data.current.modelName].rule
        for (const item of rules) {
            result.push({
                text: item.text === undefined || item.text === '' ? item.name : item.text,
                name: item.name,
                mode: 'edit',
                content: item
            })
        }
    }
    result.push({
        text: '新增',
        name: 'new',
        mode: 'add', // add or edit
        content: {}
    })
    return result
})

const keyFields = computed(() => {
    const result = []
    if (isObject(data.content) && _.has(data.content, data.current.modelName)) {
        const rules = data.content[data.current.modelName].rule
        for (const item of rules) {
            result.push({
                key: item.name,
                value: item.name,
                text: item.text ?? item.name,
            })
        }
    }
    result.push({
        key: '',
        value: '',
        text: '依赖表设置',
    })
    return result
})

watch(() => data.form.tableName,
    n => {
        if (isObject(data.content) && _.has(data.content, data.current.modelName)) {
            data.content[data.current.modelName].tableName = n
        }
})

watch(() => data.form.text,
    n => {
        if (isObject(data.content) && _.has(data.content, data.current.modelName)) {
            data.content[data.current.modelName].text = n
        }
})

watchEffect(() => {
    // console.log('监视Props', props.content)
    data.content = props.content
})

const updatePerm = permContent => {
    // console.log('permContent', permContent)
    // console.log('data.current.permMode', data.current.permMode)
    if (isObject(data.content) && _.has(data.content, data.current.modelName)) {
        const perms = data.content[data.current.modelName].perm
        let p = perms[data.current.permMode]
        // 类型为o(全部)时,可能存在undefined导致报错的情况
        if (!p) {
            p = {}
        }
        if (permContent.type.value !== undefined) {
            p.type = permContent.type.value
        }

        if (permContent.logic.value !== undefined) {
            p.logic = permContent.logic.value
        }

        if (permContent.value.value !== undefined) {
            p.value = permContent.perm.value.join(',')
        }
    }
    // console.log('Perm更新', data.content)
}

const insertRule = (fieldContent, callback) => {
    if (isObject(data.content) && _.has(data.content, data.current.modelName)) {
        if (fieldContent.name === '' || fieldContent.name === undefined) {
            proxy.$message.error({
                message: '字段名称为空',
                center: true
            })
            return
        }
        const rules = data.content[data.current.modelName].rule
        // 如果找到同名字段，报错
        const v = _.findIndex(rules, item => {
            // console.log(`${item.name} === ${fieldContent.name.value}`)
            return (item.name === fieldContent.name)
        })
        // console.log('find', v)
        if (v >= 0) {
            proxy.$message.error({
                message: '字段名称重复',
                center: true
            })
        } else {
            const context = {}
            _.forOwn(fieldContent, (v, k) => {
                // id 是附加的普通字符串，不是ref
                if (k !== 'id' && v !== undefined) {
                    context[k] = v
                }
            })
            rules.push(context)
            callback && callback()
            // console.log('Model新增', data.content)
        }
    }
}

const updateRule = fieldContent => {
    if (isObject(data.content) && _.has(data.content, data.current.modelName)) {
        if (fieldContent.name === '' || fieldContent.name === undefined) {
            return
        }
        const rules = data.content[data.current.modelName].rule
        // rules 某个子项目的name字段为 fieldContent.name.value,对象替换
        for(let i = 0; i < rules.length; i++) {
            if (rules[i].name === fieldContent.name) {
                rules[i] = fieldContent
                break
            }
        }
    }
    // console.log('Model更新', data.content)
}

const deleteRule = fieldContent => {
    if (isObject(data.content) && _.has(data.content, data.current.modelName)) {
        const rules = data.content[data.current.modelName].rule
        // rules 某个子项目的name字段为 fieldContent.name.value,对象替换
        _.remove(rules, item => {
            return item.name === fieldContent.name
        })
        if( data.form.primaryKey === fieldContent.name) {
            data.form.primaryKey = ''
        }
    }
    // console.log('Model删除', data.content)
}

const updatePermInfo = (modelPerm, resultPerm, mode) => {
    // console.log('modelPerm', modelPerm)
    if (modelPerm[mode]) {
        resultPerm[mode] = {
            type: modelPerm[mode].type
        }
        if (modelPerm[mode].logic) {
            resultPerm[mode].logic = modelPerm[mode].logic
        }
        if (modelPerm[mode].value) {
            resultPerm[mode].value = modelPerm[mode].value
        }
    }
}

const addModel = modelContent => {
    debugger
    if (isObject(data.content)) {
        const result = {}
        // console.log('modelContent.tableName', modelContent.tableName)
        result.tableName = ''
        result.text = ''
        result.rule = []
        result.perm = {}
        result.primaryKey = ''
        updatePermInfo(modelContent.perm.value, result.perm, 'c')
        updatePermInfo(modelContent.perm.value, result.perm, 'u')
        updatePermInfo(modelContent.perm.value, result.perm, 'r')
        updatePermInfo(modelContent.perm.value, result.perm, 'd')
        updatePermInfo(modelContent.perm.value, result.perm, 'o')
        data.content[modelContent.modelName.value] = result
        data.current.modelName = modelContent.modelName.value
        data.form.modelName = data.current.modelName
        data.form.tableName = result.tableName
        data.form.text = result.text
        data.form.primaryKey = ''
        data.form.textKey = ''
        data.form.softMode = '1'
    }
    // console.log('新增业务模型', data.content)
}

function onAddModel() {
    data.addModelVisible = true
}

// 导出模型JSON到剪贴板
function onExportModel() {
    const json = JSON.stringify(data.content)
    // console.log('导出模型JSON', json)
    clipboard.write(json).then(() => {
        proxy.$message.success({
            message: '模型已复制到剪贴板',
            center: true
        })
    })
}

function onImportModel() {
    clipboard.read().then(json => {
        // console.log('导入模型JSON', json)
        // const json_str = JSON.stringify(json)
        try {
            data.content = JSON.parse(json)
            proxy.$message.success({
                message: '模型已从剪贴板导入',
                center: true
            })
        } catch (e) {
            // console.log(e)
            proxy.$message.error({
                message: '剪贴板内容不是有效的模型',
                center: true
            })
        }
    })
}

const getContent = () => {
    return data.content
}
defineExpose({ getContent })
</script>
<style scoped>
.deploy-top {
    margin-top: 50px;
}

.tab-wrap {
    padding: 0 15px;
}

:deep(.category>.el-tabs__content) {
    padding: 15px 0;
}
</style>

