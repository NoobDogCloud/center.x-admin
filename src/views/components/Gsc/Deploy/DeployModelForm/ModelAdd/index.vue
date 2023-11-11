<template>
    <div class='deploy-top'>
        <el-dialog v-if="props.mode === 'dialog'" v-model='myVisible' :close-on-click-modal='false' :title='title'
                   append-to-body destroy-on-close width='1000px'
        >
            <el-form ref='form' :model='data.form' :rules='data.rules' label-suffix=':' label-width='120px' @submit.prevent>
                <el-form-item label='模型名称' prop='modelName'>
                    <el-input v-model='data.form.modelName' placeholder='请输入模型名称(不支持中文)'/>
                </el-form-item>
                <el-form-item>
                    <el-button @click='onCancel'>取 消</el-button>
                    <el-button type='primary' @click='onSubmit'>确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script name='ModelAdd' setup>
import {computed, reactive, ref, toRefs} from 'vue'
import {ImplDataChecker} from 'gsc-frontend-sdk/gfw/from-checker/dataCheckerImpl'

const emit = defineEmits(['update:modelValue', 'addModel'])
const title = '新增业务模型'
const permDefault = {
    type: 'group',
    logic: '>',
    value: 'everyone'
}
const data = reactive({
    form: {
        modelName: '',
        tableName: '',
        perm: {
            c: permDefault,
            u: permDefault,
            r: permDefault,
            d: permDefault,
            o: permDefault
        },
        rule: []
    },
    rules: {
        modelName: [
            {
                required: true,
                trigger: 'blur',
                validator: (rule, value, callback) => {
                    if (value === '') {
                        callback(new Error('请输入模型名称'))
                    } else if (!ImplDataChecker.IsID(value, 64)) {
                        callback(new Error('英文字母开头,可包含小写字母,数字和下划线'))
                    } else {
                        callback()
                    }
                }
            }
        ]
    }
})

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    mode: {
        type: String,
        default: 'dialog',
        validator: val => ['dialog'].includes(val)
    }
})

const myVisible = computed({
    get: function () {
        return props.modelValue
    },
    set: function (val) {
        emit('update:modelValue', val)
    }
})

function resetField(){
    data.form.modelName = ''
    data.form.tableName = ''
    data.form.perm = {
        c: permDefault,
        u: permDefault,
        r: permDefault,
        d: permDefault,
        o: permDefault
    }
    data.form.rule = []
}

function onCancel() {
    myVisible.value = false
    resetField()
}

const form = ref(null)

function onSubmit() {
    let isValid = false
    form.value.validate(valid => {
        isValid = valid
        if (isValid) {
            emit('addModel', toRefs(data.form))
            onCancel()
        }
    })
    return false
}

</script>

<style scoped>

</style>
