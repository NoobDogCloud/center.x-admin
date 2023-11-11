<template>
    <v-form-render
        ref="vFormRef" :form-data="renderOption.formData"
        :form-json="renderOption.formJson" :option-data="renderOption.optionData"
    >
        <slot/>
    </v-form-render>
</template>

<script setup>
import {reactive, ref, toRaw, watch} from 'vue'

const props = defineProps({
    template: {
        type: Object
    },
    renderData: {
        type: Object
    }
})

const vFormRef = ref(null)
const renderOption = reactive({
    formJson: props.template
        ? Object.assign({}, toRaw(props.template))
        : {
            'widgetList': [],
            'formConfig': {
                'modelName': 'formData',
                'refName': 'vForm',
                'rulesName': 'rules',
                'labelWidth': 80,
                'labelPosition': 'left',
                'size': '',
                'labelAlign': 'label-left-align',
                'cssCode': '',
                'customClass': '',
                'functions': '',
                'layoutType': 'PC',
                'onFormCreated': '',
                'onFormMounted': '',
                'onFormDataChange': '',
                'onFormValidate': ''
            }
        },
    // formJson: toRaw(props.template),
    formData: props.renderData ? props.renderData : {},
    optionData: {}
})

const getFormJson = () => {
    return vFormRef.value.getFormJson()
}

const setFormJson = v => {
    vFormRef.value.setFormJson(v)
}

const getFormData = (needValidation = true) => {
    return vFormRef.value.getFormData(needValidation)
}

const setFormData = data => {
    return vFormRef.value.setFormData(data)
}

const validateForm = fn => {
    return vFormRef.value.validateForm(fn)
}

const clearDesigner = () => {
    vFormRef.value.clearDesigner()
}

watch(() => props.template, (n, o) => {
    setFormJson(toRaw(n))
})

watch(() => props.renderData, (n, o) => {
    setFormData(toRaw(n))
})

// onMounted(() => {
//     setFormJson(toRaw(props.template))
// })

defineExpose({
    getFormJson,
    getFormData,
    setFormData,
    validateForm,
    clearDesigner
})
</script>

<style lang='scss' scoped>

</style>
