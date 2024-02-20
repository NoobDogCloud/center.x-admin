<template>
    <FullscreenModel v-model="myVisible" title="配置编辑器">
        <TemplateForm :form-data="formData" @submit="submit" />
    </FullscreenModel>
</template>

<script setup>
import FullscreenModel from '@/views/components/Gsc/Dialog/FullScreenModel/index.vue'
import TemplateForm from '@/views/components/Gsc/Template/index.vue'
import templateApi from '@/services/template'
import { computed, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()

const props = defineProps({
    modelValue: {
        type: Boolean,
        name: String,
        version: String,
        default: false
    },
    formData: {
        template: Object,
        type: Object,
        version: Object,
        name: Object
    }
})

// success事件,通知父组件进行提交完成后的操作,如刷新数据等
const emit = defineEmits(['update:modelValue', 'success'])

const myVisible = computed({
    get: function() {
        return props.modelValue
    },
    set: function(val) {
        emit('update:modelValue', val)
    }
})

/**
 * 提交数据
 * 根据入参决定是新增还是编辑
 * v:需要提交的表单数据
 * callback: 通知表单进行提交完成操作,如取消加载,初始化表单数据等
 */
const submit = async(v, callback) => {
    // 新增or修改
    const is_insert = !props.formData
    const res = !is_insert ? await templateApi.update(props.formData.id, v) : await templateApi.insert(v)
    if (res.status()) {
        proxy.$message.success({
            message: is_insert ? '新增成功' : '修改成功',
            center: true
        })
        myVisible.value = false
        emit('success')
    } else {
        proxy.$message.error({
            message: res.getMessage(),
            center: true
        })
    }
    callback && callback()
}
</script>

<style lang='scss' scoped>
</style>
