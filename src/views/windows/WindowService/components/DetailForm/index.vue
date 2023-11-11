<template>
    <div v-loading="data.loading">
        <el-form ref="form" :model="data.form" :rules="data.rules" label-suffix=":" label-width="120px">
            <el-form-item label="名称" prop="name">
                <el-input v-model="data.form.name" placeholder="请输入服务名称(不支持中文)" />
            </el-form-item>
            <el-form-item label="说明" prop="desc">
                <el-input v-model="data.form.desc" placeholder="请输入应用说明" />
            </el-form-item>
            <el-form-item label="通讯方式" prop="transfer">
                <el-select v-model="data.form.transfer" placeholder="请选择" value-key="http">
                    <el-option
                        v-for="item in transferOptions"
                        :key="item.key"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item
                v-if="data.form.transfer!=='http' && data.form.transfer!=='https'" label="端点接口"
                prop="mq_config"
            >
                <el-select v-model="data.form.mq_config" placeholder="请选择" value-key="">
                    <el-option
                        v-for="item in data.options.messageQueue"
                        :key="item.key"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>

            <el-form-item label="端口" prop="port">
                <el-input v-model="data.form.port" placeholder="原始端口" type="number" />
            </el-form-item>

            <el-form-item label="服务类型" prop="category">
                <el-select v-model="data.form.category" placeholder="请选择" value-key="classic">
                    <el-option
                        v-for="item in serviceCategoryOptions"
                        :key="item.key"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="服务业务种类" prop="kind">
                <el-select v-model="data.form.kind" placeholder="请选择" value-key="data">
                    <el-option
                        v-for="item in serviceKindOptions"
                        :key="item.key"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="调试" prop="debug">
                <el-radio-group v-model="data.form.debug">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="网络协议" prop="protocol">
                <el-select v-model="data.form.protocol" placeholder="请选择" value-key="TCP">
                    <el-option
                        v-for="item in NetProtocolOption"
                        :key="item.key"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="容器镜像" prop="dockerimage">
                <el-input v-model="data.form.dockerimage" placeholder="" />
            </el-form-item>
            <el-form-item label="最新版本" prop="version">
                <el-input v-model="data.form.version" placeholder="" />
            </el-form-item>
            <div class="form-item-box">
                <p>部署模型</p>
                <div class="form-item-content">
                    <DeployModelFrom ref="deployModel" :content="data.form.datamodel" />
                </div>
            </div>
            <div class="form-item-box">
                <p>部署配置</p>
                <div class="form-item-content">
                    <ConfigEditor ref="cfgEditor" :config="data.form.config" />
                </div>
            </div>
        </el-form>
    </div>
</template>

<script setup>
import { getCurrentInstance, onMounted, reactive, ref, toRaw } from 'vue'
import _ from 'lodash'
import servicesApi, {
    NetProtocolOption,
    ServiceCategoryOptions,
    ServiceKindOptions,
    TransferOptions
} from '@/services/services'
import configsApi from '@/services/configs'
import { QueryBuilder } from 'gsc-frontend-sdk/gfw/rpc/queryBuilder'
import { ImplDataChecker } from 'gsc-frontend-sdk/gfw/from-checker/dataCheckerImpl'
import DeployModelFrom from '@/views/components/Gsc/Deploy/DeployModelForm/index.vue'
import ConfigEditor from '@/views/components/Gsc/Config/index.vue'

const transferOptions = ref(
    TransferOptions
)

const serviceCategoryOptions = ref(
    ServiceCategoryOptions
)

const serviceKindOptions = ref(
    ServiceKindOptions
)

const { proxy } = getCurrentInstance()

const deployModel = ref(null)
const cfgEditor = ref(null)

const props = defineProps({
    id: {
        type: [Number, String],
        default: ''
    },
    name: {
        type: String,
        default: ''
    },
    desc: {
        type: String,
        default: ''
    },
    transfer: {
        type: [String],
        default: 'http',
        validator: val => TransferOptions.map(v => v.key).includes(val)
    },
    port: {
        type: [Number],
        default: 0
    },
    mq_config: {
        type: [String],
        default: ''
    },
    dockerimage: {
        type: [String],
        default: ''
    },
    datamodel: {
        type: Object,
        default: () => {
            return {}
        }
    },
    config: {
        type: Object,
        default: () => {
            return {}
        }
    },
    category: {
        type: String,
        default: 'classic'
    },
    debug: {
        type: Number,
        default: 0
    },
    kind: {
        type: String,
        default: 'data'
    },
    protocol: {
        type: String,
        default: 'TCP',
        validator: val => NetProtocolOption.map(v => v.key).includes(val)
    }
})

const data = reactive({
    loading: false,
    form: {
        id: props.id,
        name: props.name,
        desc: props.desc,
        debug: props.debug,
        transfer: props.transfer,
        category: props.category,
        mq_config: props.mq_config,
        port: props.port,
        datamodel: props.datamodel,
        dockerimage: props.dockerimage,
        protocol: props.protocol
    },
    rules: {
        name: [
            {
                required: true,
                trigger: 'blur',
                validator: (rule, value, callback) => {
                    if (value === '') {
                        callback(new Error('请输入服务名称'))
                    } else if (!ImplDataChecker.IsID(value, 64)) {
                        callback(new Error('英文字母开头,可包含数字和下划线'))
                    } else {
                        callback()
                    }
                }
            }
        ]
    },
    options:{
        messageQueue: [],
    }
})

onMounted(async() => {
    if (data.form.id) {
        await getInfo()
    }
    await getMessageQueue()
})

async function getInfo() {
    data.loading = true
    const res = await servicesApi.find('id', data.form.id)
    const info = res.getRecord()
    data.loading = false
    if (info.datamodel && typeof info.datamodel === 'string') {
        try {
            info.datamodel = JSON.parse(info.datamodel)
        } catch (e) {
            info.datamodel = {}
        }
    } else {
        info.datamodel = {}
    }
    if (info.config && typeof info.config === 'string') {
        try {
            info.config = JSON.parse(info.config)
        } catch (e) {
            info.config = {}
        }
    } else {
        info.config = {}
    }
    data.form = _.extend({}, data.form, info)
}


async function getMessageQueue(){
    const q = QueryBuilder.build().eq('type', 'mq')
    const res = await configsApi.selectAndQuery(q)
    const configArr = res.asJsonArray()
    data.options.messageQueue = []
    _.forEach(configArr, (config) => {
        data.options.messageQueue.push({
            key: config.name,
            label: config.name,
            value: config.name,
        })
    })
}

defineExpose({
    submit(callback) {
        if (!data.form.id) {
            proxy.$refs.form.validate(async valid => {
                if (valid) {
                    const inputInfo = data.form
                    inputInfo.datamodel = toRaw(deployModel.value.getContent())
                    inputInfo.config = toRaw(cfgEditor.value.getContent())
                    const res = await servicesApi.insert(inputInfo)
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
                    const res = await servicesApi.update(data.form.id, data.form)
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
