<template>
    <div v-loading="data.loading" class="deploy-top">
        <el-form ref="form" :model="data.form" :rules="data.rules" label-suffix=":" label-width="120px">
            <el-form-item label="部署到应用" prop="appId">
                <el-select v-model="data.form.appId" placeholder="请选择" value-key="null">
                    <el-option
                        v-for="item in data.apps"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="系统名称" prop="name">
                <el-input v-model="data.form.name" placeholder="请输入部署名称(不支持中文)" />
            </el-form-item>
            <el-form-item label="业务名称" prop="text">
                <el-input v-model="data.form.text" placeholder="请输入部署业务名称" />
            </el-form-item>
            <el-form-item label="调试" prop="debug">
                <el-radio-group v-model="data.form.debug">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="默认加密" prop="secure">
                <el-radio-group v-model="data.form.secure">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="容器化" prop="container">
                <el-radio-group v-model="data.form.container">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <div v-if="data.form.container===1">
                <el-form-item label="发布方式" prop="open">
                    <el-select v-model="data.form.open" placeholder="请选择" value-key="cluster">
                        <el-option
                            v-for="item in publishOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="data.form.open===1" label="发布端口" prop="target_port">
                    <el-input v-model="data.form.target_port" placeholder="请输入发布端口" type="number" />
                </el-form-item>
                <el-form-item label="实例数量" prop="replicaset">
                    <el-select v-model="data.form.replicaset" :value-key="data.form.replicaset" placeholder="请选择">
                        <el-option
                            v-for="item in data.replicaSetSelect"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>
            </div>
        </el-form>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import _ from 'lodash'
import { ImplDataChecker } from 'gsc-frontend-sdk/gfw/from-checker/dataCheckerImpl'
import appsApi from '@/services/apps'
import { replicaSetNumber } from '@/services/servicesdeploy'
import { PublishOptions } from '@/services/services'

const publishOptions = ref(
    PublishOptions
)

const props = defineProps({
    appId: {
        type: [Number, String],
        default: ''
    },
    serviceId: {
        type: [Number, String],
        default: ''
    },
    name: {
        type: String,
        default: ''
    },
    text: {
        type: String,
        default: ''
    },
    state: {
        type: Number,
        default: 0
    },
    debug: {
        type: Number,
        default: 0
    },
    container: {
        type: Number,
        default: 0
    },
    replicaset: {
        type: Number,
        default: 1
    },
    open: {
        type: Number,
        default: 0
    },
    target_port: {
        type: Number,
        default: 0
    },
    secure: {
        type: Number,
        default: 0
    }
})

onMounted(async() => {
    await getAppList()
})

async function getAppList() {
    data.loading = true
    const res = await appsApi.select()
    const info = res.getRecord()
    data.loading = false
    data.apps = _.extend({}, data.apps, info)
}

const data = reactive({
    loading: false,
    apps: [],
    form: {
        appId: props.appId,
        serviceId: props.serviceId,
        name: props.name,
        text: props.text,
        state: props.state,
        debug: props.debug,
        container: props.container,
        secure: props.secure,
        replicaset: props.replicaset,
        open: props.open,
        target_port: props.target_port
    },
    rules: {
        name: [
            {
                required: true,
                trigger: 'blur',
                validator: (rule, value, callback) => {
                    if (value === '') {
                        callback(new Error('请输入部署名称'))
                    } else if (!ImplDataChecker.IsID(value, 64)) {
                        callback(new Error('请输入英文字母开头,可包含数字和横杠'))
                    } else {
                        callback()
                    }
                }
            }
        ],
        appId: [
            {
                required: true,
                trigger: 'blur',
                message: '请选择部署应用'
            }
        ]
    },
    replicaSetSelect: replicaSetNumber()
})

const form = ref(null)

defineExpose({
    getContent() {
        return new Promise(resolve => {
            let isValid = false
            form.value.validate(valid => {
                isValid = valid
                if (isValid) {
                    resolve({
                        appId: data.form.appId,
                        serviceId: data.form.serviceId,
                        name: data.form.name,
                        text: data.form.text,
                        state: data.form.state,
                        debug: data.form.debug,
                        container: data.form.container,
                        secure: data.form.secure,
                        replicaset: data.form.replicaset,
                        open: data.form.open,
                        target_port: data.form.target_port
                    })
                } else {
                    resolve(false)
                }
            })
        })
    }
})
</script>

<style scoped>
.deploy-top {
    margin-top: 50px;
}
</style>
