<template>
    <div v-loading="data.loading">
        <el-upload
            ref="upload"
            class="upload-demo"
            drag action="#"
            accept="application/xml, text/xml"
            :auto-upload="false"
            :limit="1"
            :show-file-list="false"
            :on-change="startUpload"
            :on-exceed="handleExceed"
        >
            请上传SDK的[pom.xml]文件
        </el-upload>
        <DependenciesView v-if="data.pom !== ''" ref="dependenciesView" :pom="data.pom" />
    </div>
</template>

<script setup>
import DependenciesView from '@/views/components/Gsc/DependenciesView/index.vue'
import { getCurrentInstance, reactive, ref } from 'vue'
import sdkApi from '@/services/sdk'
import { genFileId } from 'element-plus'
import { stringCompression } from '@/util/tool'

const { proxy } = getCurrentInstance()
const dependenciesView = ref(null)
const props = defineProps({
    id: {
        type: String
    },
    pom: {
        type: String
    }
})

const data = reactive({
    loading: false,
    pom: props.pom
})

const upload = ref(null)
const handleExceed = files => {
    upload.value.clearFiles()
    const file = files[0]
    file.uid = genFileId()
    upload.value.handleStart(file)
}

const startUpload = uploadFile => {
    if (uploadFile.name.toLowerCase() !== 'pom.xml') {
        proxy.$message.error('只能上传pom.xml文件')
        return
    }
    // 读取文件
    const reader = new FileReader()
    reader.onload = function(e) {
        data.pom = e.target.result
    }
    reader.readAsText(uploadFile.raw)
}

defineExpose({
    submit(callback) {
        if (data.pom === '') {
            proxy.$message.error('请上传pom.xml文件')
            return
        }
        const dependenciesJson = dependenciesView.value.getDependency()
        const inputInfo = {
            id: dependenciesJson.version,
            dependencies_template: dependenciesJson.dependencies,
            text: stringCompression(data.pom)
        }
        if (!props.id) {
            // 新增
            const createFn = async() => {
                try {
                    const res = await sdkApi.insert(inputInfo)
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
            }
            createFn()
        } else {
            // 编辑
            const editFn = async() => {
                try {
                    const res = await sdkApi.update(props.id, inputInfo)
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
            }
            editFn()
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
