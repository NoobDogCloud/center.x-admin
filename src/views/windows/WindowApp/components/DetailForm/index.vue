<template>
    <div v-loading="data.loading">
        <el-form
            ref="form" :model="data.form" :rules="data.rules" class="inner-from" label-suffix="："
            label-width="100px"
        >
            <el-form-item label="名称" prop="name">
                <el-input v-model="data.form.name" placeholder="请输入应用名称(不支持中文)" />
            </el-form-item>
            <el-form-item label="说明" prop="desc">
                <el-input v-model="data.form.desc" placeholder="请输入应用说明" />
            </el-form-item>
            <el-form-item label="域名" prop="domain">
                <el-input v-model="data.form.domain" placeholder="请输入应用绑定域名(可空)" />
            </el-form-item>
            <el-form-item label="首页" prop="entry">
                <el-input v-model="data.form.entry" placeholder="请输入应用入口地址" />
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
            <el-form-item label="发布模式" prop="category">
                <el-select v-model="data.form.category" :value-key="data.form.category" placeholder="请选择">
                    <el-option
                        v-for="item in appPublishOptions"
                        :key="item.key"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="用户服务" prop="user_service_id">
                <el-select v-model="data.form.user_service_id" :value-key="data.form.user_service_id" placeholder="请选择">
                    <el-option
                        v-for="item in data.usersServiceArray"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item v-if="data.form.user_service_id>0" label="鉴权类型" prop="session_type">
                <el-select v-model="data.form.session_type" :value-key="data.form.session_type" placeholder="请选择">
                    <el-option
                        v-for="item in sessionTypeOptions"
                        :key="item.key"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="日志服务" prop="logs_service_id">
                <el-select v-model="data.form.logs_service_id" :value-key="data.form.logs_service_id" placeholder="请选择">
                    <el-option
                        v-for="item in data.logsServiceArray"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="工作流服务" prop="workflow_service_id">
                <el-select v-model="data.form.workflow_service_id" :value-key="data.form.workflow_service_id" placeholder="请选择">
                    <el-option
                        v-for="item in data.workflowServiceArray"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="主控地址" prop="master">
                <el-input v-model="data.form.master" placeholder="自定生成主控地址" />
            </el-form-item>
            <el-form-item label="主控秘钥" prop="secret">
                <el-input v-model="data.form.secret" placeholder="自动生成主控秘钥" />
            </el-form-item>
            <el-form-item label="开发秘钥" prop="secret">
                <el-input v-model="data.form.dev_secret" placeholder="自动生成开发秘钥" />
            </el-form-item>
            <el-form-item label="集群" prop="k8s">
                <el-select v-model="data.form.k8s" placeholder="请选择应用所属集群" value-key="data.form.k8s">
                    <el-option
                        v-for="item in data.k8sArray"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    />
                </el-select>
            </el-form-item>
            <div class="form-item-box">
                <p>配置</p>
                <div class="form-item-content">
                    <ConfigEditor ref="cfgEditor" :config="OneProps" />
                </div>
            </div>
            <div class="form-item-box">
                <p>应用角色</p>
                <div class="form-item-content" style="padding-right: 0">
                    <RolesEditor ref="rolesEditor" v-model="data.form.roles" :appid="id" />
                </div>
            </div>
        </el-form>
    </div>
</template>

<script setup>
import ConfigEditor from '@/views/components/Gsc/Config/index.vue'
import RolesEditor from '@/views/components/Gsc/Roles/index.vue'
import { computed, getCurrentInstance, onMounted, reactive, ref } from 'vue'
import appsApi, {AppPublishOptions, SessionTypeOptions} from '@/services/apps'
import servicesApi from '@/services/services'
import _ from 'lodash'
import k8sApi from '@/services/k8s'
import { getStateModel } from 'gsc-frontend-sdk/gfw/model/checkModel'
import { QueryBuilder } from 'gsc-frontend-sdk/gfw/rpc/queryBuilder'

const appPublishOptions = ref(AppPublishOptions)
const sessionTypeOptions = ref(SessionTypeOptions)

const { proxy } = getCurrentInstance()
const cfgEditor = ref(null)
const rolesEditor = ref(null)
const props = defineProps({
    id: {
        type: String,
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
    domain: {
        type: String,
        default: ''
    },
    config: {
        type: Object,
        default: () => {
        }
    },
    k8s: {
        type: [String, Number],
        default: 0
    },
    state: {
        type: Number,
        default: 1
    },
    master: {
        type: String,
        default: ''
    },
    secret: {
        type: String,
        default: ''
    },
    dev_secret: {
        type: String,
        default: ''
    },
    entry: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        default: 'no-publish'
    },
    user_service_id: {
        type: Number,
        default: 0
    },
    session_type: {
        type: String,
        default: ''
    },
    logs_service_id: {
        type: Number,
        default: 0
    },
    workflow_service_id: {
        type: Number,
        default: 0
    }
})

const data = reactive({
    loading: false,
    form: {
        id: props.id,
        name: props.name,
        desc: props.desc,
        domain: props.domain,
        config: props.config,
        state: props.state,
        k8s: props.k8s,
        master: props.master,
        entry: props.entry,
        secret: props.secret,
        dev_secret: props.dev_secret,
        category: props.category,
        user_service_id: props.user_service_id,
        session_type: props.session_type,
        logs_service_id: props.logs_service_id,
        workflow_service_id: props.workflow_service_id,
        roles: ''
    },
    rules: {
        name: [
            { required: true, message: '请输入应用名称', trigger: 'blur' }
        ]
    },
    k8sArray: [],
    usersServiceArray: [],
    logsServiceArray: [],
    workflowServiceArray: [],
    stateModel: getStateModel()
})

const cfgInfo = reactive({})
const OneProps = computed(() => {
    _.mapKeys(data.form.config, (v, k) => {
        cfgInfo[k] = v
    })
    return cfgInfo
})

async function getKubernetesList() {
    const res = await k8sApi.field(['id', 'name']).select()
    const info = res.getRecord()
    info.push({
        id: 0,
        name: '不使用集群',
        desc: '',
        state: 0
    })
    data.k8sArray = _.extend({}, data.k8sArray, info)
}

async function getKindService(kind){
    const q = QueryBuilder.build().eq('kind', kind)
    return  await servicesApi.field(['id', 'name']).selectAndQuery(q)
}

async function getUserKindService() {
    const res = await getKindService('user')
    const info = res.getRecord()
    info.push({
        id: 0,
        name: '无用户服务'
    })
    data.usersServiceArray = _.extend({}, data.usersServiceArray, info)
}

async function getLogsKindService() {
    const res = await getKindService('logs')
    const info = res.getRecord()
    info.push({
        id: 0,
        name: '无日志服务'
    })
    data.logsServiceArray = _.extend({}, data.logsServiceArray, info)
}

async function getWorkflowKindService() {
    const res = await getKindService('workflow')
    const info = res.getRecord()
    info.push({
        id: 0,
        name: '无工作流服务'
    })
    data.workflowServiceArray = _.extend({}, data.workflowServiceArray, info)
}

onMounted(async() => {
    if (data.form.id) {
        await getInfo()
    }
    await getKubernetesList()
    await getUserKindService()
    await getLogsKindService()
    await getWorkflowKindService()
})

async function getInfo() {
    data.loading = true
    const res = await appsApi.find('id', data.form.id)
    const info = res.getRecord()
    data.loading = false
    data.form = _.extend({}, data.form, info)
}

defineExpose({
    submit(callback, errcallback) {
        data.form.roles = rolesEditor.value.getRoles()
        data.form.config = cfgEditor.value.getContent()
        if (!data.form.id) {
            proxy.$refs.form.validate(async valid => {
                if (valid) {
                    const inputInfo = data.form
                    try {
                        const res = await appsApi.insert(inputInfo)

                        if (res.status()) {
                            proxy.$message.success({
                                message: '新增成功',
                                center: true
                            })
                            callback && callback(true)
                        } else {
                            proxy.$message.error({
                                message: res.getMessage(),
                                center: true
                            })
                            callback && callback()
                        }
                    } catch (e) {
                        callback && callback()
                    }
                } else {
                    errcallback()
                }
            })
        } else {
            proxy.$refs.form.validate(async valid => {
                if (valid) {
                    try {
                        const res = await appsApi.update(data.form.id, data.form)
                        if (res.status()) {
                            proxy.$message.success({
                                message: '修改成功',
                                center: true
                            })
                            callback && callback(true)
                        } else {
                            proxy.$message.error({
                                message: res.getMessage(),
                                center: true
                            })
                            callback && callback()
                        }
                    } catch (e) {
                        callback && callback()
                    }
                } else {
                    errcallback()
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
    }

    p {
        margin: 0;
        height: 40px;
        line-height: 40px;
        background: #f5f7fa;
        padding: 0 10px;
        font-size: 14px;
    }
}
</style>
