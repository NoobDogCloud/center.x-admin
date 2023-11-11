<template>
    <div>
        <el-dialog top='10vh' v-if="props.mode === 'dialog'" v-model='myVisible' :width='width || "50%"'
                   :close-on-click-modal='false' :title='title' append-to-body destroy-on-close
        >
            <slot></slot>
            <template #footer v-if='!noButton'>
                <el-button @click='onCancel'>取 消</el-button>
                <el-button type='primary' @click='onSubmit' :loading='buttonLoading'>确 定</el-button>
            </template>
        </el-dialog>
        <el-drawer v-else-if="props.mode === 'drawer'" v-model='myVisible' :close-on-click-modal='false' :title='title'
                   custom-class='form-mode-drawer' destroy-on-close :size='width || "50%"'
        >
            <slot></slot>
            <template #footer v-if='!noButton'>
                <el-button @click='onCancel'>取 消</el-button>
                <el-button type='primary' @click='onSubmit' :loading='buttonLoading'>确 定</el-button>
            </template>
        </el-drawer>
    </div>
</template>

<script setup>
import { computed, getCurrentInstance, ref } from 'vue'

const { proxy } = getCurrentInstance()

const props = defineProps({
    mode: {
        type: String,
        default: 'dialog',
        validator: val => ['dialog', 'drawer'].includes(val)
    },
    noButton: {
        type: Boolean
    },
    title: {
        type: String
    },
    width: {
        type: [String, Number]
    },
    paddingTop: {
        type: [String, Number]
    },
    modelValue: {
        type: Boolean,
        default: false
    }
})

const buttonLoading = ref(false)

const emit = defineEmits(['update:modelValue', 'submit'])

const myVisible = computed({
    get: function () {
        return props.modelValue
    },
    set: function (val) {
        emit('update:modelValue', val)
    }
})

const setButtonLoading = (b = true) => {
    buttonLoading.value = b
}

function onSubmit () {
    emit('submit')
}

function onCancel () {
    myVisible.value = false
}

defineExpose({
    setButtonLoading
})
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
