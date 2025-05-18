<template>
    <div class="layout">
        <el-transfer
            v-model="data.form.proxy_target"
            :data="services_selected"
            :titles="['全部服务', '已代理服务']"
        />
    </div>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue'
import _ from 'lodash'
import { QueryBuilder } from 'gsc-frontend-sdk/gfw/rpc/queryBuilder'
import servicesDeployApi from '@/services/servicesdeploy'

// 数据定义区
const props = defineProps({
    appId: {
        type: [Number, String],
        default: ''
    },
    serviceId: {
        type: Number,
        default: 0
    }
})

const data = reactive({
    form: {
        proxy_target: []
    },
    appId: props.appId,
    serviceId: props.serviceId,
    services: []
})

// 渲染加强区
const services_selected = computed({
    get: () => {
        const result = []
        _.forEach(data.services, v => {
            result.push({
                key: v,
                label: v
            })
        })
        return result
    },
    set: param => {
        const result = []
        _.forEach(param, v => {
            result.push(v.key)
        })
        data.services = result
    }
})

// 生命周期区
onMounted(async() => {
    if (props.appId !== 0 && props.appId !== '' && props.serviceId !== 0) {
        await getServiceList(props.appId, props.serviceId)
    }
})

// 方法区
async function getServiceList(appId, serviceId) {
    // 获得数据
    const q = QueryBuilder.build().eq('appid', appId)
    const res = await servicesDeployApi.selectAndQuery(q)
    const info = res.getRecord()
    const result = []
    _.forEach(info, v => {
        if (v.id !== serviceId && v.service_category === 'classic') {
            result.push(v.name)
        }
    })
    data.services = result
    // 刷新数据
    data.appId = appId
    data.serviceId = serviceId
}

const getContent = () => {
    return data.form.proxy_target
}

// 开放区
defineExpose({
    getContent,
    getServiceList
})

</script>

<style lang='scss' scoped>
// scss
.el-transfer {
    margin-top: 15px;
    text-align: center;
}
</style>
