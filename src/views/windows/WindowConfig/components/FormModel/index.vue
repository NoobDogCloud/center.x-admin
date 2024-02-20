<template>
    <BasicModelForm v-model="myVisible" :title="title" @submit="onSubmit">
        <DetailForm ref="form" :form-data="formData" />
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
    formData: {
        type: Object
    },
    id: {
        type: [String, Number],
        default: ''
    }
})

const emit = defineEmits(['update:modelValue', 'success'])

const myVisible = computed({
    get: function() {
        return props.modelValue
    },
    set: function(val) {
        emit('update:modelValue', val)
    }
})

const title = computed(() => props.id === '' ? '新增系统配置' : '编辑系统配置')

function onSubmit() {
    // submit() 为组件内部方法
    proxy.$refs.form.submit(() => {
        emit('success')
        onCancel()
    })
}

function onCancel() {
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
