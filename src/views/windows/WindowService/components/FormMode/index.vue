<template>
    <div>
        <el-dialog
            v-if="props.mode === 'dialog'" v-model="myVisible" :close-on-click-modal="false" :title="title"
            append-to-body destroy-on-close width="1000px"
        >
            <DetailForm ref="form" v-bind="$props" />
            <template #footer>
                <el-button @click="onCancel">取 消</el-button>
                <el-button type="primary" @click="onSubmit">确 定</el-button>
            </template>
        </el-dialog>
        <el-drawer
            v-else-if="props.mode === 'drawer'" v-model="myVisible" :close-on-click-modal="false" :title="title"
            custom-class="form-mode-drawer" destroy-on-close size="600px"
        >
            <DetailForm ref="form" class="form-container" v-bind="$props" />
            <div class="buttons">
                <el-button @click="onCancel">取 消</el-button>
                <el-button type="primary" @click="onSubmit">确 定</el-button>
            </div>
        </el-drawer>
    </div>
</template>

<script setup>
import DetailForm from '../DetailForm/index.vue'
import { computed, getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()

const props = defineProps({
    ...DetailForm.props,
    modelValue: {
        type: Boolean,
        default: false
    },
    mode: {
        type: String,
        default: 'dialog',
        validator: val => ['dialog', 'drawer'].includes(val)
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

const title = computed(() => props.id === '' ? '新增系统服务' : '编辑系统服务')

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
