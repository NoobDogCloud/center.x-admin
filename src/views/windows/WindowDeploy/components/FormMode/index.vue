<template>
    <BasicModelForm :title='title' v-model='myVisible' @submit='onSubmit' @cancel='onCancel' width='80%'>
        <DetailForm ref='form' :id='props.id' :appid='props.appid' />
    </BasicModelForm>
</template>

<script setup>
import BasicModelForm from '@/views/components/Gsc/Dialog/BasicModelForm/index.vue'
import DetailForm from '../DetailForm/index.vue'
import { computed, getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    id: {
        type: [Number, String],
        default: ''
    },
    appid: {
        type: [Number, String],
        default: ''
    },
    mode: {
        type: String,
        default: 'dialog',
        validator: val => ['dialog', 'drawer'].includes(val)
    }
})

const emit = defineEmits(['update:modelValue', 'success'])

const myVisible = computed({
    get: function () {
        return props.modelValue
    },
    set: function (val) {
        emit('update:modelValue', val)
    }
})

const title = computed(() => props.id === '' ? '新增已部署模块' : '编辑已部署模块')

function onSubmit () {
    // submit() 为组件内部方法
    proxy.$refs.form.submit(() => {
        emit('success')
        onCancel()
    })
}

function onCancel () {
    myVisible.value = false
}
</script>

<style lang='scss' scoped>
:deep(.el-drawer__body) {
    display: flex;
    flex-direction: column;
    overflow: auto;
    padding: 0;
}

.form-mode-drawer {
    .form-container {
        padding: 0 15px;
        overflow: auto;
        flex: 1;
    }

    .buttons {
        padding: 15px;
        text-align: right;
        background-color: #fff;
        border-top: 1px solid #ddd;
    }
}
</style>
