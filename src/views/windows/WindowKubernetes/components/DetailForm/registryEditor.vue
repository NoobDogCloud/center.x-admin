<template>
    <el-form :model='form' label-suffix='：' label-width='120px'>
        <el-form-item label='主机' prop='domain'>
            <el-input @change='updateJson' v-model='form.domain' placeholder='请输入主机' />
        </el-form-item>
        <el-form-item label='端口' prop='port'>
            <el-input @change='updateJson' v-model='form.port' placeholder='请输入端口' type='number' />
        </el-form-item>
        <el-form-item label='用户名' prop='id'>
            <el-input @change='updateJson' v-model='form.id' placeholder='请输入仓库用户名' />
        </el-form-item>
        <el-form-item label='密码' prop='password'>
            <el-input @change='updateJson' v-model='form.password' placeholder='请输入仓库密码' type='password' />
        </el-form-item>
    </el-form>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    modelValue: {
        type: String
    }
})

const form = ref({})

watch(() => props.modelValue, value => {
    try {
        form.value = JSON.parse(props.modelValue)
    } catch (e) {
        form.value = {}
    }
})

const emit = defineEmits(['update:modelValue'])

const updateJson = () => {
    emit('update:modelValue', JSON.stringify(form.value))
}
</script>

<style lang='scss' scoped>
// scss
</style>
