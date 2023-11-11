<template>
    <div class='deploy-top'>
        <el-form ref='form' :model='data.form' :rules='data.rules' label-position='left' label-suffix=':'
                 label-width='120px'
        >
            <el-form-item label='部署服务器' prop='ip'>
                <el-row :gutter='20'>
                    <el-col :span='12'>
                        <el-input v-model='data.form.ip' placeholder='可以被访问的IP'>
                            <template #prepend>IP</template>
                        </el-input>
                    </el-col>
                    <el-col :span='12'>
                        <el-input v-model='data.form.port' placeholder='开放的服务端口'>
                            <template #prepend>端口</template>
                        </el-input>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
    </div>
</template>

<script name='DeployServer' setup>
import { reactive, ref } from 'vue'
import { ImplDataChecker } from 'gsc-frontend-sdk/gfw/from-checker/dataCheckerImpl'

const form = ref(null)
const data = reactive({
    form: {
        ip: '127.0.0.1',
        port: 80
    },
    rules: {
        ip: [
            {
                required: true,
                message: '请输入IP',
                trigger: 'blur',
                validator: (rule, value, callback) => {
                    if (value.length > 15) {
                        callback(new Error('IP地址不能超过15个字符'))
                    } else if (!ImplDataChecker.IsIP(value)) {
                        callback(new Error('IP地址格式不正确'))
                    } else {
                        callback()
                    }
                }
            }
        ],
        port: [
            { required: true, message: '请输入端口' },
            { type: 'number', message: '端口必须是数字' }
        ]
    }
})

function getServerInfo () {
    return data.form.ip + ':' + String(data.form.port)
}

async function isOk () {
    return await form.value.validate()
}

defineExpose({ getServerInfo, isOk })
</script>

<style scoped>
.deploy-top {
    padding: 15px;
}
</style>
