<template>
    <div>
        <el-dialog
            v-if="props.mode === 'dialog'" v-model="myVisible" :close-on-click-modal="false" :title="title"
            append-to-body destroy-on-close width="1000px" @close="onCancel"
        >
            <!-- 详细内容 -->
            <el-steps :active="data.progress.step" finish-status="success" simple style="margin-top: 20px">
                <el-step title="基本信息" />
                <el-step title="编辑模型" />
                <el-step title="设置配置" />
                <el-step title="部署确认" />
                <el-step title="完成部署" />
            </el-steps>
            <div v-show="data.progress.step===0">
                <DeployBaseFrom ref="deployBase" :service-id="props.id" />
            </div>
            <div v-show="data.progress.step===1">
                <DeployModelFrom ref="deployModel" :appid="data.payload.appid" :content="data.payload.datamodel" />
            </div>
            <div v-show="data.progress.step===2">
                <div class="deploy-top" >
                    <div class="form-item-box" v-if="data.payload.container===1">
                        <p>服务代理</p>
                        <div class="form-item-content">
                            <ProxyServiceEditor
                                ref="proxyServiceEditor" :app-id="data.payload.appid"
                                :service-id="props.id"
                            />
                        </div>
                    </div>
                    <div class="form-item-box">
                        <p>部署配置</p>
                        <div class="form-item-content">
                            <ConfigEditor ref="cfgEditor" :config="data.payload.config" />
                        </div>
                    </div>
                </div>
            </div>
            <div v-show="data.progress.step===3">
                <DeployDetail :payload="data.payload" />
            </div>
            <div v-show="data.progress.step===4">
                <transition name="loader-visible">
                    <el-result :icon="data.progress.result.icon">
                        <template #title>
                            <h1 class="deploy-loading-title">{{ data.progress.result.text }}</h1>
                        </template>
                        <template v-if="data.progress.result.icon === 'success'" #sub-title>
                            <p class="result-tips">配置<span>接口权限</span>也可跳过稍后在部署编辑时完成</p>
                        </template>
                    </el-result>
                </transition>
                <transition name="loader-visible">
                    <div v-show="data.progress.loading" class="loader-box">
                        <span class="loader" />
                    </div>
                </transition>
                <!--                <transition name='loader-visible'>-->
                <!--                    <DeployAuthForm v-if='!data.progress.loading' ref='deployAuthForm' />-->
                <!--                </transition>-->
            </div>
            <template #footer>
                <el-button @click="onCancel">取 消</el-button>
                <el-button v-if="data.progress.step > 0 && !data.progress.done" @click="onPrevious">上一步</el-button>
                <el-button :loading="data.progress.loading" type="primary" @click="onSubmit">
                    {{ data.progress.text }}
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { computed, getCurrentInstance, reactive, ref, toRaw, watch } from 'vue'
import ProxyServiceEditor from '@/views/components/Gsc/ProxyServiceEditor/index.vue'
import DeployBaseFrom from '@/views/components/Gsc/Deploy/DeployBaseForm/index.vue'
import DeployModelFrom from '@/views/components/Gsc/Deploy/DeployModelForm/index.vue'
import DeployDetail from '@/views/components/Gsc/Deploy/DeployDetail/index.vue'
import ConfigEditor from '@/views/components/Gsc/Config/index.vue'
import servicesDeployApi from '@/services/servicesdeploy'
import servicesApi from '@/services/services'

const { proxy } = getCurrentInstance()
const deployBase = ref(null)
const deployModel = ref(null)
const cfgEditor = ref(null)
const proxyServiceEditor = ref(null)
// const dplServer = ref(null)
// const deployAuthForm = ref(null)

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    mode: {
        type: String,
        default: 'dialog',
        validator: val => ['dialog'].includes(val)
    },
    progress: {
        type: Object,
        default: () => ({
            id: '',
            step: 0,
            text: '下一步'
        })
    },
    id: {
        type: [String, Number],
        default: ''
    }
})

const data = reactive({
    id: props.id,
    k8s: '', // k8s 的 id -> 选择应用后会自动带入应用对应的K8S集群ID
    progress: {
        text: props.progress.text,
        step: props.progress.step,
        loading: false,
        result: {
            icon: '',
            text: ''
        }
    },
    payload: {
        appid: 0,
        name: '',
        text: '',
        state: 0,
        debug: 0,
        container: 0,
        serviceid: props.id,
        datamodel: '',
        secure: 0,
        replicaset: 1,
        target_port: 0,
        proxy_target: [],
        open: 0,
        config: {}
    }
})

watch(() => props.id, n => {
    data.id = n
    data.payload.serviceid = n
})

watch(() => props.progress, n => {
    data.progress.text = n.text
    data.progress.step = n.step
})

const emit = defineEmits(['update:modelValue', 'success'])

const myVisible = computed({
    get: function() {
        return props.modelValue
    },
    set: function(val) {
        emit('update:modelValue', val)
    }
})

const title = '部署新服务'

function onPrevious() {
    if (data.progress.step > 0) {
        data.progress.step--
        data.progress.text = '下一步'
    }
    if (data.progress.step >= 3) {
        data.progress.text = '部署'
    }
}

async function getServiceInfo(serviceId) {
    const res = await servicesApi.find('id', serviceId)
    return res.getRecord()
}

async function onSubmit() {
    switch (data.progress.step) {
        // 应用选择
        case 0: {
            // 检测输入数据
            const baseInfo = await deployBase.value.getContent()
            if (!baseInfo) {
                return
            }

            const serviceInfo = await getServiceInfo(baseInfo.serviceId)

            // 正常流程
            data.progress.step++
            data.payload.appid = baseInfo.appId
            data.payload.name = baseInfo.name
            data.payload.text = baseInfo.text
            data.payload.debug = baseInfo.debug
            data.payload.container = baseInfo.container
            data.payload.state = 1
            data.payload.replicaset = baseInfo.replicaset
            data.payload.open = baseInfo.open
            data.payload.target_port = baseInfo.target_port
            data.payload.serviceid = props.id

            try {
                data.payload.datamodel = JSON.parse(serviceInfo.datamodel)
            } catch (e) {
                data.payload.datamodel = {}
            }

            try {
                data.payload.config = JSON.parse(toRaw(serviceInfo.config))
            } catch (e) {
                data.payload.config = {}
            }

            break
        }
        // 模型和权限构造
        case 1: {
            const content = deployModel.value.getContent()
            // console.log('当前content', content)
            // 检测是否有模型名或者表名为空, 检测是否有模型内字段名为空
            for (const key in content) {
                if (!key) {
                    proxy.$message.error('包含空的模型名')
                    return
                }
                const block = content[key]
                if (!block.tableName) {
                    proxy.$message.error('包含空的数据表名')
                    return
                }
                const fieldArr = block.rule
                for (const item of fieldArr) {
                    if (!item.name) {
                        proxy.$message.error('包含空的字段名')
                        return
                    }
                }
            }
            data.payload.datamodel = content
            // console.log('编辑模型')
            data.progress.step++
            // 预载服务数据
            await proxyServiceEditor.value.getServiceList(data.payload.appid, data.id)
            break
        }
        // 配置设置
        case 2:
            data.payload.config = cfgEditor.value.getContent()
            data.payload.proxy_target = proxyServiceEditor.value.getContent()
            // console.log('设置配置')
            data.progress.step++

            data.progress.text = '部 署'
            // 开始正式部署（一个异步方法）
            // 是否包含K8S
            // 是-> 部署服务到 k8s
            // 否-> 要求写入部署服务器的可访问IP和端口
            // 生成部署JSON信息写入到数据库
            break
        // 验证部署
        case 3: {
            // 生成部署json
            const deployInfo = toRaw(data.payload)
            // console.log('部署信息', deployInfo)
            data.progress.loading = true
            data.progress.step++
            data.progress.result.icon = 'info'
            data.progress.result.text = '部署中'
            servicesDeployApi.insert(deployInfo).then(res => {
                data.progress.loading = false
                data.progress.result.icon = res.status() ? 'success' : 'error'
                data.progress.result.text = res.status() ? '部署成功' : '部署失败'
                data.progress.done = res.status()
                data.progress.text = '关闭'
            }).finally(
                () => {
                    data.progress.loading = false
                }
            )
            return
        }
        case 4: {
            // data.progress.loading = true
            // deployAuthForm.value.getApiAuth()
            // 刷新部署列表(如果不是列表存在的话)
            proxy.$window.reload('WindowDeploy')
            onCancel()
            break
        }
        default:
    }
}

function onCancel() {
    myVisible.value = false
    data.progress.step = 0
    data.progress.text = '下一步'
    data.progress.loading = false
}
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

.deploy-top {
    margin-top: 50px;
}

.deploy-loading-title {
    font-size: 26px;
    text-align: center;
}

.result-tips {
    span {
        color: $text-primary;
        font-weight: bold;
        cursor: pointer;
    }
}

.loader-box {
    height: 10px;
}

.loader {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    display: block;
    margin: 15px auto;
    position: relative;
    color: #FFF;
    left: -100px;
    box-sizing: border-box;
    animation: shadowRolling 2s linear infinite;
}

.loader-visible-leave-active,
.loader-visible-enter-active {
    transition: all 0.4s linear;
}

.loader-visible-enter-from,
.loader-visible-leave-active {
    opacity: 0;
}

@keyframes shadowRolling {
    0% {
        box-shadow: 0 0 rgba(255, 61, 0, 0), 0 0 rgba(255, 61, 0, 0), 0 0 rgba(255, 61, 0, 0), 0 0 rgba(255, 61, 0, 0);
    }
    12% {
        box-shadow: 100px 0 #409eff, 0 0 rgba(255, 61, 0, 0), 0 0 rgba(255, 61, 0, 0), 0 0 rgba(255, 61, 0, 0);
    }
    25% {
        box-shadow: 110px 0 #409eff, 100px 0 #409eff, 0 0 rgba(255, 61, 0, 0), 0 0 rgba(255, 61, 0, 0);
    }
    36% {
        box-shadow: 120px 0 #409eff, 110px 0 #409eff, 100px 0 #409eff, 0 0 rgba(255, 61, 0, 0);
    }
    50% {
        box-shadow: 130px 0 #409eff, 120px 0 #409eff, 110px 0 #409eff, 100px 0 #409eff;
    }
    62% {
        box-shadow: 200px 0 rgba(255, 61, 0, 0), 130px 0 #409eff, 120px 0 #409eff, 110px 0 #409eff;
    }
    75% {
        box-shadow: 200px 0 rgba(255, 61, 0, 0), 200px 0 rgba(255, 61, 0, 0), 130px 0 #409eff, 120px 0 #409eff;
    }
    87% {
        box-shadow: 200px 0 rgba(255, 61, 0, 0), 200px 0 rgba(255, 61, 0, 0), 200px 0 rgba(255, 61, 0, 0), 130px 0 #409eff;
    }
    100% {
        box-shadow: 200px 0 rgba(255, 61, 0, 0), 200px 0 rgba(255, 61, 0, 0), 200px 0 rgba(255, 61, 0, 0), 200px 0 rgba(255, 61, 0, 0);
    }
}
</style>
