<template>
    <div v-loading='data.loading'>
        <el-form ref='form' :model='data.form' :rules='data.rules' label-suffix='：' label-width='120px'>
            <el-form-item label='名称' prop='name'>
                <el-input v-model='data.form.name' placeholder='请输入集群名称' />
            </el-form-item>
            <el-form-item label='说明' prop='desc'>
                <el-input v-model='data.form.desc' placeholder='请输入集群说明' />
            </el-form-item>
            <el-form-item label='节点公网ip组' prop='nodeips'>
                <el-input v-model='data.form.nodeips' placeholder='请输入集群节点公网ip(多个ip用,隔开)' />
            </el-form-item>
            <el-form-item label='状态' prop='state'>
                <el-select v-model='data.form.state' :value-key='data.form.state' placeholder='请选择'>
                    <el-option
                        v-for='item in data.stateModel'
                        :key='item.id'
                        :label='item.name'
                        :value='item.id'
                    />
                </el-select>
            </el-form-item>
            <el-form-item label='认证文件' prop='desc'>
                <el-input v-model='data.form.config' placeholder='kube.config' type='textarea' />
            </el-form-item>
            <el-form-item label='证书' prop='cert'>
                <el-input v-model='data.form.cert' placeholder='请输入证书信息' type='textarea' />
            </el-form-item>
            <!--            <el-form-item label="私有仓库" prop="registry">-->
            <!--                <el-input v-model="data.form.registry" placeholder="请输入仓库配置" type="textarea" />-->
            <!--            </el-form-item>-->
            <div class='form-item-box'>
                <p>私有仓库</p>
                <div class='form-item-content'>
                    <RegistryEditor v-model='data.form.registry' />
                </div>
            </div>
        </el-form>
    </div>
</template>

<script setup>
import { getCurrentInstance, onMounted, ref } from 'vue'
import _ from 'lodash'
import k8sApi from '@/services/k8s'
import { getStateModel } from 'gsc-frontend-sdk/gfw/model/checkModel'
import RegistryEditor from './registryEditor.vue'

const { proxy } = getCurrentInstance()

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
    config: {
        type: String,
        default: ''
    },
    cert: {
        type: String,
        default: ''
    },
    state: {
        type: Number,
        default: 1
    },
    registry: {
        type: Object,
        default: () => {}
    },
    nodeips: {
        type: String,
        default: ''
    }
})

const data = ref({
    loading: false,
    form: {
        id: props.id,
        name: props.name,
        desc: props.desc,
        config: props.config,
        cert: props.cert,
        state: props.state,
        registry: props.registry,
        nodeips: props.nodeips
    },
    rules: {
        name: [
            { required: true, message: '请输入集群名称', trigger: 'blur' }
        ]
    },
    stateModel: getStateModel()
})

onMounted(async() => {
    if (data.value.form.id !== '') {
        await getInfo()
    }
})

async function getInfo () {
    data.value.loading = true
    const res = await k8sApi.find('id', data.value.form.id)
    const info = res.getRecord()
    data.value.loading = false
    data.value.form = _.extend({}, data.value.form, info)
}

defineExpose({
    submit (callback) {
        debugger;
        if (data.value.form.id === '') {
            proxy.$refs.form.validate(async valid => {
                if (valid) {
                    const inputInfo = data.value.form
                    const res = await k8sApi.insert(inputInfo)
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
                    const res = await k8sApi.update(data.value.form.id, data.value.form)
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
        padding-top: 18px;

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
