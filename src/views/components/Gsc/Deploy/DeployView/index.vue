<template>
    <div>
        <el-dialog
            v-if="props.mode === 'dialog'" v-model="myVisible" :close-on-click-modal="false" :title="title"
            append-to-body destroy-on-close width="1000px"
        >
            <WindowDeploy :app-id="props.appId" :service-id="props.serviceId" />
        </el-dialog>
    </div>
</template>

<script name='DeployView' setup>
import { computed } from 'vue'
import WindowDeploy from '@/views/windows/WindowDeploy/index.vue'

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    mode: {
        type: String,
        default: 'dialog',
        validator: val => ['dialog', 'drawer'].includes(val)
    },
    appId: {
        type: [String, Number],
        default: ''
    },
    serviceId: {
        type: [String, Number],
        default: ''
    },
    name: {
        type: String,
        default: ''
    }
})

const myVisible = computed({
    get: function() {
        return props.modelValue
    },
    set: function(val) {
        emit('update:modelValue', val)
    }
})

const title = computed(() => {
    return `[${props.name}]`
})
</script>

<style scoped>

</style>
