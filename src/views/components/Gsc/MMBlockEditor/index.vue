<template>
    <el-popover
        placement='right'
        ref='popoverRef'
        :virtual-ref='props.buttonRef'
        trigger='click'
        title='连接配置'
        :hide-after='0'
        :width='300'
        virtual-triggering
        @after-leave='onAfterLeave'
    >
        <div class='layout'>
            <el-form :model='data.configValue' :rules='data.rules' style='margin-top: 20px' label-suffix=':'>
                <el-form-item label='服务' prop='service'>
                    <el-select v-model='data.configValue.service' placeholder='选择关联的服务' value-key='null'
                               :teleported='false'
                               @change='serviceSelected'
                    >
                        <el-option
                            v-for='item in data.supportInfo.services'
                            :key='item.key'
                            :label='item.text'
                            :value='item.key'
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label='模型' prop='item'>
                    <el-select v-model='data.configValue.item' placeholder='选择服务模型' value-key='null'
                               :teleported='false'
                               @change='itemSelected'
                    >
                        <el-option
                            v-for='item in data.supportInfo.items'
                            :key='item.key'
                            :label='item.text'
                            :value='item.key'
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label='字段' prop='key'>
                    <el-select v-model='data.configValue.key' placeholder='选择模型字段' value-key='null' :teleported='false'>
                        <el-option
                            v-for='item in data.supportInfo.keys'
                            :key='item.key'
                            :label='item.text'
                            :value='item.key'
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label='显示' prop='key'>
                    <el-select v-model='data.configValue.label' placeholder='选择显示字段' value-key='null' :teleported='false'>
                        <el-option
                            v-for='item in data.supportInfo.keys'
                            :key='item.key'
                            :label='item.text'
                            :value='item.key'
                        />
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
    </el-popover>
</template>

<script name='DictEditor' setup>
import { onMounted, reactive, inject } from 'vue'
import { Application } from 'gsc-frontend-sdk/gfw/appliction/application'
import _ from 'lodash'

const props = defineProps({
    buttonRef: {},
    config: {
        type: Object,
        default: () => {
            return {
                service: '',
                item: '',
                key: '',
                label: '',
            }
        }
    },
    appid: {
        type: [String, Number]
    },
})
const emit = defineEmits(['contentChange'])
const getModelCurrent = inject('deploy-model')
const data = reactive({
    configValue: {
        service: props.config.service || 'null',
        item: props.config.item,
        key: props.config.key,
        label: props.config.label ?? props.config.key
    },

    supportInfo: {
        services: [{
            text: '不关联服务',
            key: 'null',
            model: {}
        }],
        items: [{
            text: '不关联模型',
            key: 'null',
            model: {}
        }],
        keys: [{
            text: '不关联字段',
            key: 'null'
        }]
    }
})

onMounted(async() => {
    await getSupportServiceInfo()
    const modelCurrent = getModelCurrent()
    if( modelCurrent ){
        model2Support(modelCurrent)
    }
})

const onAfterLeave = () => {
    emit('contentChange', getMMBlock())
}

function model2Support(model){
    data.supportInfo.items = [{
        model: {},
        text: '不关联模型',
        key: 'null',
    }]
    _.mapKeys(model, (value, key) => {
        try {
            const m = value.rule
            data.supportInfo.items.push({
                model: m,
                text: key,
                key
            })
        } catch (e) {}
    })
}

function serviceSelected (val) {
    const info = data.supportInfo.services.find(v => v.key === val)
    if (!info) {
        return
    }
    const model = info.model
    model2Support(model)
}

function itemSelected (val) {
    const info = data.supportInfo.items.find(v => v.key === val)
    if (!info) {
        return
    }
    const fieldArr = info.model
    data.supportInfo.keys = [{
        text: '不关联字段',
        key: 'null'
    }]
    _.forEach(fieldArr, v => {
        const key = v.name
        data.supportInfo.keys.push({
            text: key,
            key
        })
    })
}

async function getSupportServiceInfo () {
    const appCtx = await Application.build(props.appid).load()
    _.mapKeys(appCtx.services, (value, key) => {
        try {
            const m = JSON.parse(value.datamodel)
            data.supportInfo.services.push({
                model: m,
                text: key,
                key
            })
        } catch (e) {}
    })
    serviceSelected(props.config.service)
    itemSelected(props.config.item)
}

// 输出获得MMBlock的配置方法
const getMMBlock = () => {
    const MMBlock = {}
    if( data.configValue.item ){
        MMBlock.item = data.configValue.item
    }
    if( data.configValue.key ){
        MMBlock.key = data.configValue.key
    }
    if (data.configValue.service !== 'null') {
        MMBlock.service = data.configValue.service
    }
    if (data.configValue.label ) {
        MMBlock.label = data.configValue.label
    }
    return MMBlock
}
defineExpose({ getMMBlock })
</script>

<style scoped>

</style>
