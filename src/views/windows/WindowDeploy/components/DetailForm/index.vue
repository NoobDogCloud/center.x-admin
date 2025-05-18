<template>
    <div v-loading="data.loading">
        <el-form
            ref="form" :label-width="100" :model="data.form" :rules="data.rules" label-position="right"
            label-suffix="："
        >
            <el-form-item label="部署到应用" prop="appid">
                <el-select v-model="data.form.appid" :disabled="true" :value-key="data.form.appid" placeholder="请选择">
                    <el-option
                        v-for="item in data.apps"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="服务引用" prop="serviceid">
                <el-select v-model="data.form.serviceid" :value-key="data.form.serviceid" placeholder="请选择">
                    <el-option
                        v-for="item in data.services"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="部署名称" prop="name">
                <el-input v-model="data.form.name" placeholder="请输入部署名称" />
            </el-form-item>
            <el-form-item label="业务名称" prop="name">
                <el-input v-model="data.form.text" placeholder="请输入业务名称" />
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
            <el-form-item label="状态" prop="state">
                <el-select v-model="data.form.state" :value-key="data.form.state" placeholder="请选择">
                    <el-option
                        v-for="item in data.stateModel"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="副本数量" prop="replicaset" v-if="data.form.container===1">
                <el-select
                    v-model="data.form.replicaset" :value-key="data.form.replicaset" allow-create
                    placeholder="请选择"
                >
                    <el-option
                        v-for="item in data.replicaSetSelect"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="发布方式" prop="open" v-if="data.form.container===1">
                <el-select v-model="data.form.open" :value-key="data.form.open" placeholder="请选择">
                    <el-option
                        v-for="item in publishOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
            <div class="form-item-box" v-if="data.form.container===1">
                <p>代理服务</p>
                <div class="form-item-content">
                    <ProxyServiceEditor ref="proxyServiceEditor" :app-id="data.form.appid" :service-id="props.id" />
                </div>
            </div>
            <div class="form-item-box">
                <p>部署模型</p>
                <div class="form-item-content">
                    <DeployModelFrom
                        v-if="data.form.appid" ref="deployModel" :appid="data.form.appid"
                        :content="data.form.datamodel" @model-change="modelChange"
                    />
                </div>
            </div>
            <div class="form-item-box">
                <p>接口权限</p>
                <div class="form-item-content" style="padding: 20px">
                    <DeployAuthForm
                        ref="deployAuthForm" :appid="data.form.appid" :deploy-name="data.form.name"
                        :model="currentModel"
                    />
                </div>
            </div>
            <div class="form-item-box">
                <p>部署配置</p>
                <div class="form-item-content">
                    <ConfigEditor ref="cfgEditor" :sdk-id="serviceSdkId" :config="data.form.config" />
                </div>
            </div>
            <el-form-item label="容器化" prop="container">
                <el-radio-group v-model="data.form.container">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="内部节点" prop="clusteraddr">
                <el-input v-model="data.form.clusteraddr" :disabled="data.form.container===1" placeholder="" >
                </el-input>
            </el-form-item>
            <el-form-item label="外部节点" prop="subaddr">
                <el-input v-model="data.form.subaddr" :disabled="data.form.container===1" placeholder="">
                </el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
// 这是编辑页
import { getCurrentInstance, onMounted, reactive, ref, toRaw } from 'vue'
import servicesDeployApi, { replicaSetNumber } from '@/services/servicesdeploy'
import { PublishOptions } from '@/services/services'
import _ from 'lodash'
import appsApi from '@/services/apps'
import servicesApi from '@/services/services'
import DeployModelFrom from '@/views/components/Gsc/Deploy/DeployModelForm/index.vue'
import DeployAuthForm from '@/views/components/Gsc/Deploy/DeployAuthForm/index.vue'
import ProxyServiceEditor from '@/views/components/Gsc/ProxyServiceEditor/index.vue'
import ConfigEditor from '@/views/components/Gsc/Config/index.vue'
import { getStateModel } from 'gsc-frontend-sdk/gfw/model/checkModel'

const publishOptions = ref(
    PublishOptions
)

const currentModel = ref()

const { proxy } = getCurrentInstance()
const deployModel = ref(null)
const cfgEditor = ref(null)
const proxyServiceEditor = ref(null)
const serviceSdkId = ref('')

const props = defineProps({
    id: {
        type: [Number, String],
        default: ''
    },
    appid: {
        type: [Number, String],
        default: ''
    },
    serviceid: {
        type: [Number],
        default: 0
    },
    name: {
        type: [String],
        default: ''
    },
    text: {
        type: [String],
        default: ''
    },
    open: {
        type: [String],
        default: 'cluster',
        validator: val => PublishOptions.map(v => v.key).includes(val)
    },
    replicaset: {
        type: [Number],
        default: 1
    },
    state: {
        type: [Number],
        default: 1
    },
    container: {
        type: [Number],
        default: 0
    },
    debug: {
        type: [Number],
        default: 0
    },
    secure: {
        type: [Number],
        default: 0
    },
    clusteraddr: {
        type: [String],
        default: ''
    },
    subaddr: {
        type: [String],
        default: ''
    },
    proxy_target: {
        type: Array,
        default: () => {
            return []
        }
    },
    service_category: {
        type: [String],
        default: ''
    }
})

const data = reactive({
    loading: false,
    apps: [],
    services: [],
    form: {
        config: {},
        datamodel: {},
        replicaset: props.replicaset,
        open: props.open,
        name: props.name,
        text: props.text,
        appid: props.appid,
        serviceid: props.serviceid,
        state: props.state,
        debug: props.debug,
        container: props.container,
        clusteraddr: props.clusteraddr,
        subaddr: props.subaddr,
        proxy_target: props.proxy_target,
        service_category: props.service_category
    },
    rules: {
        name: [
            { required: true, message: '请输入部署名称', trigger: 'blur' }
        ]
    },
    state: {},
    stateModel: getStateModel(),
    replicaSetSelect: replicaSetNumber()
})

onMounted(async() => {
    if (props.id !== '') {
        await getAppList()
        await getServiceList()
        await getInfo()
    }
})

function modelChange(v) {
    currentModel.value = v
}

async function getInfo() {
    data.loading = true
    const res = await servicesDeployApi.find('id', props.id)
    const info = res.getRecord()
    data.loading = false
    data.form = _.extend({}, data.form, info)
}

async function getAppList() {
    data.loading = true
    const res = await appsApi.select()
    const info = res.getRecord()
    data.loading = false
    data.apps = _.extend({}, data.apps, info)
}

async function getServiceList() {
    data.loading = true
    const res = await servicesApi.select()
    const info = res.getRecord()
    data.loading = false
    data.services = _.extend({}, data.services, info)
}

// 获得同应用所有服务名集合

defineExpose({
    submit(callback) {
        if (props.id) {
            proxy.$refs.form.validate(async valid => {
                if (valid) {
                    // 获得新的配置信息
                    const inputInfo = toRaw(data.form)
                    if (proxyServiceEditor.value) {
                        inputInfo.proxy_target = toRaw(proxyServiceEditor.value.getContent())
                    }

                    inputInfo.datamodel = toRaw(deployModel.value.getContent())
                    inputInfo.config = toRaw(cfgEditor.value.getContent())
                    delete inputInfo.service_category
                    const res = await servicesDeployApi.update(inputInfo.id, inputInfo)
                    if (res.status()) {
                        proxy.$message.success({
                            message: '更新成功',
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
            proxy.$message.error({
                message: '未知异常',
                center: true
            })
        }
    }
})
</script>

<style lang='scss' scoped>
// scss
.form-item-box {
    border: 1px #ebeef5 solid;
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;

    .form-item-content {
        flex-grow: 1;
        padding-right: 20px;

        :deep(.deploy-top) {
            margin-top: 20px;
        }
    }

    p {
        height: 40px;
        line-height: 40px;
        background: #f5f7fa;
        padding: 0 15px;
        font-size: 14px;
        margin: 0;
    }
}
</style>
