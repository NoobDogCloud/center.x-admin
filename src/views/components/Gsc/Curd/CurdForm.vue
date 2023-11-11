<template>
    <BasicModelForm ref='modelForm' :title='title' v-model='myVisible' @submit='onSubmit'>
        <FormRender ref='vFormRender' :template='renderTemplate' v-show='renderTemplate'></FormRender>
    </BasicModelForm>
</template>

<script setup>
import BasicModelForm from '@/views/components/Gsc/Dialog/BasicModelForm/index.vue'
import FormRender from '@/views/components/Gsc/VFormRender/index.vue'
import templateApi from '@/services/template'
import { computed, nextTick, ref } from 'vue'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    formTemplateId: {
        type: [String, Number],
        required: true
    },
    formData: {
        type: Object
    }
})

const vFormRender = ref(null)
const modelForm = ref(null)

const renderTemplate = ref(undefined)

const emit = defineEmits(['update:modelValue', 'submit'])

const myVisible = computed({
    get: function () {
        if (props.modelValue && props.formData) {
            nextTick(() => {
                vFormRender.value.setFormData(props.formData)
            })
        }
        return props.modelValue
    },
    set: function (val) {
        emit('update:modelValue', val)
    }
})

const title = computed(() => props.id === '' ? '新增系统配置' : '编辑系统配置')

function onSubmit () {
    vFormRender.value.getFormData().then((v) => {
        modelForm.value.setButtonLoading(true)
        emit('submit', v, () => {
            modelForm.value.setButtonLoading(false)
            onCancel();
        })
    }).catch(() => {

    })
}

templateApi.find('id', props.formTemplateId).then(v => {
    const res = v.getRecord()
    renderTemplate.value = res.template
})

function onCancel () {
    myVisible.value = false
}
</script>

<style scoped lang='scss'>

</style>
