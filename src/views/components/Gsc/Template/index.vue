<template>
    <FormDesigner ref="designer" :template="data.template">
        <template #header>
            <div class="form-header">
                <!-- 选择sdk版本 -->
                <el-select v-model="data.sdk_id" size="default" placeholder="请选择SDK版本" style="width: 150px" @change="SDKVersionChange">
                    <el-option v-for="item in SDKVersionOptions" :key="item.key" :label="item.name" :value="item.key" />
                </el-select>
                <!-- 选择配置项目 -->
                <el-select v-if="data.sdk_id" v-model="data.name" size="default" placeholder="请选择配置项" style="width: 150px" @change="ConfigNameChange">
                    <el-option v-for="item in VersionConfigNameOptions" :key="item.key" :label="item.name" :value="item.key" />
                </el-select>
                <!-- 选择配置类型 -->
                <el-select v-if="data.name" v-model="data.type" size="default" placeholder="请选择配置类型" style="width: 150px" disabled>
                    <el-option v-for="item in ConfigTypeOptions" :key="item.key" :label="item.name" :value="item.key" />
                </el-select>
                <!--
                <el-input v-model="data.name" size="default" placeholder="请输入模板名称" class="input-append-white">
                    <template #append>
                        <el-select v-model="data.type" size="default" placeholder="请选择模板类型" style="width: 150px">
                            <el-option v-for="item in ConfigTypeOptions" :key="item.key" :label="item.name" :value="item.key" />
                        </el-select>
                    </template>
                </el-input>
                -->
            </div>
        </template>
        <template #button>
            <el-button size="default" text type="primary" @click="save($event)">
                <svg-icon v-if="!loading" style="margin-right: 3px;width: 18px;" name="toolbar-save" />
                <svg-icon v-if="loading" style="margin-right: 3px;width: 18px;" name="loading" class="ani-rotate" />保存
            </el-button>
        </template>
    </FormDesigner>
</template>

<script setup>
import FormDesigner from '../VFormDesigner/index.vue'
import { reactive, toRaw, ref, onMounted, getCurrentInstance } from 'vue'
// import { Plus } from '@element-plus/icons-vue'
import { ConfigTypeMap, middlewareTypeMap } from '@/services/configs'
import sdkApi from '@/services/sdk'

const { proxy } = getCurrentInstance()

const ConfigTypeOptions = ref(ConfigTypeMap)
const VersionConfigNameOptions = ref([])
const VersionConfigNameMaps = ref({})
const SDKVersionArray = ref([])

const props = defineProps({
    formData: {
        template: Object,
        type: Object,
        sdk_id: Object,
        name: Object
    }
})

const designer = ref(null)
const emit = defineEmits(['submit'])
const loading = ref(false)

let data = reactive(Object.assign({}, toRaw(props.formData)))

// 获得全部SDK版本
onMounted(async() => {
    // 获取SDK版本
    const res = await sdkApi.select()
    SDKVersionArray.value = res.getRecord()
    if (data.sdk_id) {
        buildSDKVersionOptions()
        SDKVersionChange(data.sdk_id)
    }
})

const buildSDKVersionOptions = () => {
    const tVersionItem = {}
    const rArray = SDKVersionArray.value.map(item => {
        tVersionItem[item.id] = Object.keys(item.dependencies_template)
        return {
            key: item.id,
            name: item.name
        }
    })
    VersionConfigNameMaps.value = tVersionItem
    return rArray
}

const SDKVersionOptions = computed(() => {
    return buildSDKVersionOptions()
})

const SDKVersionChange = v => {
    VersionConfigNameOptions.value = VersionConfigNameMaps.value[v].map(item => {
        return {
            key: item,
            name: item
        }
    })
}

const ConfigNameChange = v => {
    data.type = middlewareTypeMap[v] || 'null'
}

const save = () => {
    const template = designer.value.getFormJson()
    const name = data.name
    const type = data.type
    const sdk_id = data.sdk_id
    if (!name) {
        proxy.$message.error({
            message: '配置模板名称不能为空!',
            center: true
        })
        return
    }
    if (!type) {
        proxy.$message.error({
            message: '未选择配置模板类型!',
            center: true
        })
        return
    }
    if (!sdk_id) {
        proxy.$message.error({
            message: '配置模板对应的SDK版本未设置!',
            center: true
        })
        return
    }
    loading.value = true
    emit('submit', { template, name, type, sdk_id }, () => {
        loading.value = false
    })
}
</script>

<style lang='scss' scoped>
.form-header {
    width: auto;
    display: flex;
}
.form-header .el-select {
    margin-right: 5px;
}
</style>
