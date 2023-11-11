<template>
    <div class='deploy-info'>
        <el-form ref='form' :model='data.form' :rules='data.rules' label-position='left' label-suffix=':' label-width='100px'>
            <el-form-item class='deploy-line' label='权限类型' prop='type'>
                <el-select v-model='data.form.type' placeholder='请选择' value-key='user'>
                    <el-option key='user' label='用户' value='user' />
                    <el-option key='group' label='角色' value='group' />
                </el-select>
            </el-form-item>
            <el-form-item v-if="data.form.type === 'group'" class='deploy-line' label='权限关系' prop='logic'>
                <el-select v-model='data.form.logic' placeholder='请选择' value-key='gt'>
                    <el-option key='gt' label='大于等于' value='>' />
                    <el-option key='lt' label='小于等于' value='<' />
                </el-select>
            </el-form-item>
            <el-form-item v-if="data.form.type === 'group'" class='deploy-line' label='权限对象' prop='perm'>
                <el-select
                    v-model='data.form.perm'
                    allow-create
                    default-first-option
                    filterable
                    multiple
                    placeholder='请选择(多选)'
                    @change='showSelect'
                >
                    <el-option
                        v-for='item in roles'
                        :key='item.key' :label='item.text' :value='item.key'
                    />
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script name='PermEdit' setup>
import { onMounted, onUpdated, reactive, ref, toRefs, watch } from 'vue'
import _ from 'lodash'
import contextApi from '@/services/context'

const emit = defineEmits(['updatePerm'])

const props = defineProps({
    permContent: {
        type: Object,
        default: () => {
            return {
                type: '',
                logic: '=',
                value: ''
            }
        }
    },
    appid: {
        type: [String, Number]
    }
    // roles: {
    //     type: []
    // }
})

const roles = ref([])

const data = reactive({
    form: {
        perm: props.permContent.value.split(','),
        logic: props.permContent.logic,
        type: props.permContent.type
    }
})

// 获得应用全部角色
const loadRoles = async () => {
    // const appCtx = (await Application.build()).getContext()
    const appCtx = props.appid ? await contextApi.get(props.appid) : await contextApi.defaultRoles()
    const rRoles = props.appid ? appCtx.getRecord().roles : appCtx.getRecord()
    const localRoles = []
    // 从服务器结构转成本地结构
    _.forOwn(rRoles, (v, k) => {
        localRoles.push({
            name: v.text,
            key: k
        })
    })
    return localRoles
}

const showSelect = v => {
    console.log(v)
}

onMounted(async () => {
    // console.log(`${data.form}`)
    roles.value = await loadRoles()
})

onUpdated(() => {
    console.log('content')
    // computedFieldIdx()
})
// 导出模型字段
const getModelPerm = () => {
    data.form.value = data.form.perm.join(',')
    return toRefs(data.form)
}

const notifyDeployModelForm = () => {
    // console.log('尝试触发父组件方法')
    emit('updatePerm', getModelPerm())
}

watch(() => data.form, () => {
    notifyDeployModelForm()
}, { deep: true })
</script>
<style scoped>
.deploy-info {
    overflow: scroll;
}

.deploy-line {
    margin-bottom: 10px;
}

:deep(.el-select) {
    width: 100%;
}
</style>
