<template>
    <el-drawer v-model="drawer" title="自动节点配置" direction="rtl" :before-close="handleClose" :size="400">
        <el-form label-position="left" label-suffix=":" label-width="80px" :model="formData">
            <el-form-item label="标题">
                <el-input v-model="formData.title"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">确定</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
</template>

<script setup>
import {computed, reactive, watch} from "vue";

const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    //当前节点
    node: {
        type: Object
    }
})

//监听node变化实时更新数据
watch(() => props.node, (newValue) => {
    const data = props.node.getData();
    formData.title = data.title;
});

const formData = reactive({
    title: ''
})

const onSubmit = () => {
    props.node.setData(formData);
    drawer.value = false;
}

const update = defineEmits(['update:visible'])

const drawer = computed({
    get() {
        return props.visible;
    },
    set(v) {
        update('update:visible', v);
    }
})

const handleClose = (done) => {
    drawer.value = false;
    done();
}
</script>

<style scoped lang="scss">
:deep(.el-drawer__header) {
    margin-bottom: 15px;
}
</style>