<template>
    <el-popover
        ref="popoverRef"
        :hide-after="0"
        :virtual-ref="props.buttonRef"
        :width="300"
        placement="right"
        title="字段连接"
        trigger="click"
        virtual-triggering
    >
        <div class="layout">
            <el-form ref="form" v-model="data.configValue" class="inner-from" label-suffix=":" label-width="120px">
                <el-form-item label="关联服务" prop="joinService">
                    <el-select v-model="data.configValue.joinService" placeholder="选择关联的服务" value-key="null">
                        <el-option
                            v-for="item in data.supportInfo.services"
                            :key="item.key"
                            :label="item.text"
                            :value="item.key"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="关联分类" prop="joinItem">
                    <el-input
                        v-model="data.configValue.joinItem" maxlength="512" placeholder="自定义关联分类"
                    />
                </el-form-item>
                <el-form-item label="关联字段" prop="joinField">
                    <el-input
                        v-model="data.configValue.joinField" maxlength="512" placeholder="自定义关联字段"
                    />
                </el-form-item>
                <el-form-item label="显示字段" prop="joinField">
                    <el-input
                        v-model="data.configValue.joinLabel" maxlength="512" placeholder="自定义显示字段"
                    />
                </el-form-item>
            </el-form>
        </div>
    </el-popover>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import _ from 'lodash'
import { Application } from 'gsc-frontend-sdk/gfw/appliction/application'

const props = defineProps({
    buttonRef: {},
    config: {
        type: Object,
        default: () => {
            return {
                joinService: '',
                joinItem: '',
                joinField: '',
                joinLabel: ''
            }
        }
    }
})
const data = reactive({
    configValue: {
        joinService: _.indexOf(props.config, 'service') ? props.config.joinService : 'null',
        joinItem: props.config.item,
        joinField: props.config.key
    },
    supportInfo: {
        services: [{
            text: '不关联服务',
            key: 'null'
        }]
    }
})

onMounted(async() => {
    await getSupportServiceInfo()
})

async function getSupportServiceInfo() {
    const appCtx = await Application.build().getContext()
    _.mapKeys(appCtx.services, (value, key) => {
        data.supportInfo.services.push({
            text: key,
            key
        })
    })
}

// 输出获得MMBlock的配置方法
const getMMBlock = () => {
    const MMBlock = {
        label: data.configValue.joinLabel ?? data.configValue.joinField,
        item: data.configValue.joinItem,
        key: data.configValue.joinField
    }
    if (data.configValue.joinService !== 'null') {
        MMBlock.service = data.configValue.joinService
    }
    return MMBlock
}
defineExpose({ getMMBlock })
</script>

<style scoped>

</style>
