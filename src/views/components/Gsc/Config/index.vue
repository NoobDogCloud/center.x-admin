<template>
    <div class='layout'>
        <el-form ref='form' v-model='data.configValue' class='inner-from' label-suffix=':' label-width='100px'>
            <el-form-item label='数据库' prop='db'>
                <el-select v-model='data.configValue.db' placeholder='请选择' value-key='db'>
                    <el-option
                        v-for='item in data.supportConfig.db'
                        :key='item.id'
                        :label='item.name'
                        :value='item.id'
                    />
                </el-select>
            </el-form-item>
            <el-form-item label='缓存' prop='cache'>
                <el-select v-model='data.configValue.cache' placeholder='请选择' value-key='cache'>
                    <el-option
                        v-for='item in data.supportConfig.cache'
                        :key='item.id'
                        :label='item.name'
                        :value='item.id'
                    />
                </el-select>
            </el-form-item>
            <el-form-item label='队列' prop='mq'>
                <el-select v-model='data.configValue.mq' placeholder='请选择' value-key='mq'>
                    <el-option
                        v-for='item in data.supportConfig.mq'
                        :key='item.id'
                        :label='item.name'
                        :value='item.id'
                    />
                </el-select>
            </el-form-item>
            <el-form-item label='存储' prop='store'>
                <el-select v-model='data.configValue.store' placeholder='请选择' value-key='store'>
                    <el-option
                        v-for='item in data.supportConfig.store'
                        :key='item.id'
                        :label='item.name'
                        :value='item.id'
                    />
                </el-select>
            </el-form-item>
            <el-form-item label='流式计算' prop='streamComputer'>
                <el-select v-model='data.configValue.streamComputer' placeholder='请选择' value-key='streamComputer'>
                    <el-option
                        v-for='item in data.supportConfig.streamComputer'
                        :key='item.id'
                        :label='item.name'
                        :value='item.id'
                    />
                </el-select>
            </el-form-item>
            <el-form-item label='块式计算' prop='blockComputer'>
                <el-select v-model='data.configValue.blockComputer' placeholder='请选择' value-key='blockComputer'>
                    <el-option
                        v-for='item in data.supportConfig.blockComputer'
                        :key='item.id'
                        :label='item.name'
                        :value='item.id'
                    />
                </el-select>
            </el-form-item>
            <el-form-item label='自定义' prop='other'>
                <el-input
                    v-model='prettyOther' :autosize='{ minRows: 5, maxRows: 6 }' maxlength='20480'
                    placeholder='自定义配置' show-word-limit
                    type='textarea'
                    @input="checkJson"
                />
                <el-alert v-if="data.configState.state===1" show-icon :title="data.configState.message" type="success"/>
                <el-alert v-if="data.configState.state===2" :title="data.configState.message" type="error" show-icon/>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import {onMounted, reactive, watchEffect} from 'vue'
import configsApi from '@/services/configs'
import _ from 'lodash'
import {jsonlint} from 'gsc-frontend-sdk/gfw/jsonlint'
import {util} from 'gsc-frontend-sdk/gfw/util/util'

const props = defineProps({
    config: {
        type: Object,
        default: () => {
            return {}
        }
    }
})

const data = reactive({
    configValue: props.config,
    supportConfig: {
        db: [],
        cache: [],
        mq: [],
        store: [],
        streamComputer: [],
        blockComputer: [],
        other: ''
    },
    configState: {
        state: 0,
        message: ''
    }
})

const prettyOther = computed({
    get: function() {
        return util.pretty(data.configValue.other)
    },
    set: function(v){
        data.configValue.other = v
    }
})

watchEffect(() => {
    data.configValue = util.toObject(props.config)
})

onMounted(async () => {
    await getSupportInfo()
})

function checkJson() {
    const v = data.configState;
    if( data.configValue.other === '' ){
        v.state = 0
        return
    }
    try{
        jsonlint.parse(data.configValue.other)
        v.message = '格式正确'
        v.state = 1
    }
    catch (e){
        v.message = e
        v.state = 2
    }
}

async function getSupportInfo() {
    const res = await configsApi.call('support')
    data.supportConfig = res.asJson()
    _.mapKeys(data.supportConfig, (v, k) => {
        v.push({
            id: '',
            name: '不使用配置'
        })
    })
}

const getContent = () => {
    const v = {}
    const r = toRaw(data.configValue)
    if( r.db && r.db !== '' ){
        v.db = r.db
    }
    if( r.cache && r.cache !== '' ){
        v.cache = r.cache
    }
    if( r.mq && r.mq !== '' ){
        v.mq = r.mq
    }
    if( r.store && r.store !== '' ){
        v.store = r.store
    }
    if( r.streamComputer && r.streamComputer !== '' ){
        v.streamComputer = r.streamComputer
    }
    if( r.blockComputer && r.blockComputer !== '' ){
        v.blockComputer = r.blockComputer
    }
    if( r.other && r.other !== '' ){
        v.other = util.compress(r.other)
    }
    return util.toString(v)
}

defineExpose({getContent})
</script>

<style lang='scss' scoped>
// scss
.inner-from {
    margin-top: 15px;

    .inner-from .el-form-item {
        margin-bottom: 22px;
    }
}

</style>
