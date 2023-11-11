<template>
    <div>
        <el-dialog custom-class='fullscreen-model' :show-close='false' fullscreen v-model='myVisible' :close-on-click-modal='false' :title='title' append-to-body destroy-on-close>
            <div class='maximize-exit' @click='onCancel'>
                <el-icon>
                    <i-ri-picture-in-picture-2-line />
                </el-icon>
            </div>
            <slot></slot>
        </el-dialog>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    title: {
        type: String,
        default: '123'
    },
    modelValue: {
        type: Boolean,
        default: false
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

function onCancel () {
    myVisible.value = false
}
</script>

<style lang='scss'>
.fullscreen-model > .el-dialog__body {
    flex-grow: 1;
    padding: 0;
}

.fullscreen-model > .el-dialog__header {
    display: none;
}
</style>

<style lang='scss' scoped>
.maximize-exit {
    position: fixed;
    z-index: 2010;
    right: -40px;
    top: -40px;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: rgb(0 0 0 / 30%);
    cursor: pointer;
    transition: 0.3s;
    .el-icon {
        position: absolute;
        bottom: 16px;
        left: 16px;
        transition: 0.3s;
    }
    &:hover {
        background-color: rgb(0 0 0 / 70%);
        .el-icon {
            color: #fff;
        }
    }
}
</style>
