<template>
    <v-form-designer ref="form">
        <template #header>
            <slot name="header"></slot>
        </template>
        <template #button>
            <!-- <el-button size="small" type="text" @click="clearFormWidget">保存</el-button> -->
            <slot name="button"></slot>
        </template>
    </v-form-designer>
</template>

<script setup>
import { toRaw, ref, nextTick } from "vue"

const props = defineProps({
    template: {
        type: Object
    }
})

const form = ref(null);

const getFormJson = () => {
    return form.value.getFormJson();
}

const setFormJson = (v) => {
    form.value.setFormJson(v);
}

const clearDesigner = () => {
    form.value.clearDesigner();
}

onMounted(() => {
    nextTick(() => {
        clearDesigner({});
        nextTick(() => {
            setFormJson(toRaw(props.template));
        });
    });
})

defineExpose({
    getFormJson,
    clearDesigner
})
</script>


<style lang='scss' scoped>

</style>
