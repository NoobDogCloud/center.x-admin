<template>
    <div class='deploy-info'>
        <el-form ref='form' :model='data.form' label-position='left' :rules='data.rules' label-suffix=':'
                 label-width='120px'
        >
            <el-form-item class='deploy-line' label='字段名称' prop='name'>
                <el-autocomplete
                    :fit-input-width = 'true'
                    v-model='data.form.name'
                    :fetch-suggestions='querySearchDefaultField'
                    placeholder='数据表字段名称(英文)'
                    @select='onFieldChange'
                    :disabled="data.current.mode!=='add'">
                    <template #default='{ item }'>
                        <span class='desc'>{{ item.desc }}</span>
                        <div class='value'>{{ item.value }}</div>
                    </template>
                </el-autocomplete>
            </el-form-item>
            <el-form-item class='deploy-line' label='业务名称' prop='text'>
                <el-input v-model='data.form.text' placeholder='请输入业务场景名称' />
            </el-form-item>
            <el-form-item class='deploy-line' label='字段类型' prop='type'>
                <el-select v-model='data.form.type' placeholder='请选择' value-key='public'>
                    <el-option key='public' :value='0' label='公开字段' />
                    <el-option key='mask' :value='1' label='隐藏字段' />
                    <el-option key='protected' :value='2' label='受保护字段' />
                    <el-option key='locked' :value='9' label='锁定字段' />
                </el-select>
            </el-form-item>
            <el-form-item class='deploy-line' label='初始值' prop='init'>
                <el-autocomplete
                    v-model='data.form.init' :fetch-suggestions='querySearchSuggests'
                    placeholder='请输入字段初始默认值'
                >
                    <template #default='{ item }'>
                        <span class='desc'>{{ item.desc }}</span>
                        <div class='value'>{{ item.value }}</div>
                    </template>
                </el-autocomplete>
            </el-form-item>
            <el-form-item class='deploy-line' label='替代错误值' prop='failed'>
                <el-autocomplete
                    v-model='data.form.failed' :fetch-suggestions='querySearchSuggests'
                    placeholder='请输入错误值的替代默认值'
                >
                    <template #default='{ item }'>
                        <span class='desc'>{{ item.desc }}</span>
                        <div class='value'>{{ item.value }}</div>
                    </template>
                </el-autocomplete>
            </el-form-item>
            <el-form-item class='deploy-line' label='业务校验类型' prop='checkId'>
                <el-select v-model='data.checker.id' placeholder='请选择' value-key='0'>
                    <el-option key='0' :value='0' label='无' />
                    <el-option key='1' :value='1' label='不为空' />
                    <el-option key='2' :value='2' label='为空' />
                    <el-option key='3' :value='3' label='大于0' />
                    <el-option key='4' :value='4' label='小于0' />
                    <el-option key='5' :value='5' label='等于0' />
                    <el-option key='6' :value='6' label='整数' />
                    <el-option key='7' :value='7' label='自然数(包括小数)' />
                    <el-option key='8' :value='8' label='小数点后2位(货币)' />
                    <el-option key='9' :value='9' label='小数' />
                    <el-option key='10' :value='10' label='Email' />
                    <el-option key='11' :value='11' label='中国大陆手机号' />
                    <el-option key='12' :value='12' label='统一认证编码(工商识别号)' />
                    <el-option key='13' :value='13' label='中文' />
                    <el-option key='14' :value='14' label='不包含空格' />
                    <el-option key='15' :value='15' label='真实姓名' />
                    <el-option key='16' :value='16' label='中国大陆身份证号码' />
                    <el-option key='18' :value='18' label='星期' />
                    <el-option key='19' :value='19' label='月' />
                    <el-option key='20' :value='20' label='IP' />
                    <el-option key='21' :value='21' label='URL/网址' />
                    <el-option key='22' :value='22' label='密码' />
                    <el-option key='23' :value='23' label='中国大陆邮政编码' />
                    <el-option key='26' :value='26' label='用户名/ID' />
                    <el-option key='27' :value='27' label='时间戳' />
                    <el-option key='28' :value='28' label='银行卡号' />
                    <el-option key='29' :value='29' label='MongoDB的ObjectId' />
                    <el-option key='30' :value='30' label='严格的ID(不支持“_”)' />
                    <el-option key='31' :value='31' label='版本号(x.y.z)' />
                    <el-option key='32' :value='32' label='布尔值(true/false或者1/0)' />
                </el-select>
            </el-form-item>
            <el-form-item class='deploy-line' label='最小字符长度' prop='checkMin'>
                <el-input v-model='data.checker.min' placeholder='不限制' />
            </el-form-item>
            <el-form-item class='deploy-line' label='最大字符长度' prop='checkMax'>
                <el-input v-model='data.checker.max' placeholder='不限制' />
            </el-form-item>
            <el-form-item class='deploy-line' label='必须' prop='required'>
                <el-radio-group v-model='data.form.required'>
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item class='deploy-line' label='编辑' prop='edit'>
                <el-radio-group v-model='data.form.edit'>
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item class='deploy-line' label='搜索' prop='search'>
                <el-radio-group v-model='data.form.search'>
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item class='deploy-line' label='唯一' prop='unique'>
                <el-radio-group v-model='data.form.unique'>
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item class='deploy-line' label='多选' prop='multiple'>
                <el-radio-group v-model='data.form.multiple'>
                    <el-radio :label='1'>是</el-radio>
                    <el-radio :label='0'>否</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item class='deploy-line' label='控件类型(界面)' prop='control'>
                <el-autocomplete
                    v-model='data.form.control' :fetch-suggestions='querySearchControls'
                    placeholder='请选择控件类型'
                >
                    <template #default='{ item }'>
                        <span class='desc'>{{ item.desc }}</span>
                        <div class='value'>{{ item.value }}</div>
                    </template>
                </el-autocomplete>
            </el-form-item>
            <el-form-item class='deploy-line' label='预载字典'>
                <el-radio-group v-model='data.current.hasPreinstall'>
                    <el-radio :label='1'>有</el-radio>
                    <el-radio :label='0'>无</el-radio>
                    <el-icon v-if='data.current.hasPreinstall===1' ref='buttonRef' class='dictionary-hover' :size='16'>
                        <svg-icon name='bi:arrow-right-square'></svg-icon>
                    </el-icon>
                </el-radio-group>
                <DictEditor :buttonRef='buttonRef' v-if='data.current.hasPreinstall===1' ref='refPreinstall'
                            :content='data.form.preinstall' @content-change='preinstallChange'
                />
            </el-form-item>
            <el-form-item class='deploy-line' label='字段连接'>
                <el-radio-group v-model='data.current.hasJoin'>
                    <el-radio :label='1'>有</el-radio>
                    <el-radio :label='0'>无</el-radio>
                    <el-icon v-if='data.current.hasJoin===1' ref='hasJoinButtonRef' class='dictionary-hover' :size='16'>
                        <svg-icon name='bi:arrow-right-square'></svg-icon>
                    </el-icon>
                </el-radio-group>
                <MMBlockEditor :appid='appid' :buttonRef='hasJoinButtonRef' v-if='data.current.hasJoin===1'
                               ref='refJoin' :config='data.form.join' @content-change='joinChange'
                />
                <!-- <MMBlock :buttonRef='hasJoinButtonRef' v-if='data.current.hasJoin===1' ref='refJoin' :config='data.form.join' /> -->
            </el-form-item>
            <el-form-item class='deploy-line' style='margin-left: 120px'>
                <el-button style='width: 100px' v-if="data.current.mode === 'add'" type='primary'
                           @click='notifyDeployModelFormInsert'
                >
                    添加
                </el-button>
                <el-button style='width: 100px' v-else type='primary' @click='notifyDeployModelFormDelete'>
                    删除
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script name='ModelEdit' setup>
import { getCurrentInstance, onMounted, reactive, ref, toRefs, watch, toRaw } from 'vue'
import MMBlockEditor from '@/views/components/Gsc/MMBlockEditor/index.vue'
import DictEditor from '@/views/components/Gsc/DictEditor/index.vue'
import {buildChecker, buildCheckerId} from 'gsc-frontend-sdk/gfw/from-checker/fromChecker'
import _ from 'lodash'

const { proxy } = getCurrentInstance()
const emit = defineEmits(['updateRule', 'insertRule', 'deleteRule'])
const refJoin = ref(null)
const refPreinstall = ref(null)
const props = defineProps({
    fieldContent: {
        type: Object,
        default: () => {
            return {
                name: '',
                type: 0,
                init: '',
                failed: '',
                checkId: 0,
                text: '',
                required: false,
                unique: false,
                multiple: false,
                edit: true,
                search: true,
                hasPreinstall: false,
                hasJoin: false
            }
        }
    },
    appid: {
        type: [String, Number]
    },
    mode: {
        type: String,
        default: 'add'
    }
})
const buttonRef = ref()
const hasJoinButtonRef = ref()
const defaultField = ref([])
const suggests = ref([])
const controls = ref([])
const data = reactive({
    form: {
        name: props.fieldContent.name,
        text: props.fieldContent.text,
        type: props.fieldContent.type ?? 0,
        init: props.fieldContent.init ?? '',
        failed: props.fieldContent.failed ?? '',
        checkId: props.fieldContent.checkId,
        edit: props.fieldContent.edit ? 1: 0,
        search: props.fieldContent.search ? 1: 0,
        required: props.fieldContent.required ? 1 : 0,
        unique: props.fieldContent.unique ? 1 : 0,
        multiple: props.fieldContent.multiple ? 1 : 0,
        control: props.fieldContent.control ?? '',
        join: props.fieldContent.join,
        preinstall: props.fieldContent.preinstall,
    },
    checker: {
        id: buildChecker(props.fieldContent.checkId).id ?? 0,
        min: buildChecker(props.fieldContent.checkId).min,
        max: buildChecker(props.fieldContent.checkId).max,
    },
    current: {
        hasJoin: _.has(props.fieldContent, 'join') ? 1 : 0,
        hasPreinstall: _.has(props.fieldContent, 'preinstall') ? 1 : 0,
        mode: props.mode,
        id: props.fieldContent.name
    }
})

const updateChecker = checkId =>{
    const v = buildChecker(checkId)
    data.checker.id = v.id ?? 0
    data.checker.min = v.min
    data.checker.max = v.max
}

//表单组件对象
const form = ref(null)

const querySearchDefaultField = (queryString, cb) => {
    const results = queryString
        ? defaultField.value.filter(createFilter(queryString))
        : defaultField.value
    // call callback function to return suggestions
    cb(results)
}

const querySearchSuggests = (queryString, cb) => {
    const results = queryString
        ? suggests.value.filter(createFilter(queryString))
        : suggests.value
    // call callback function to return suggestions
    cb(results)
}

const querySearchControls = (queryString, cb) => {
    const results = queryString
        ? controls.value.filter(createFilter(queryString))
        : controls.value
    // call callback function to return suggestions
    cb(results)
}

const createFilter = queryString => {
    return targetRef => {
        return (
            targetRef.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
    }
}

const onFieldChange = val => {
    data.form.init = val.init ?? ''
    data.form.text = val.desc ?? ''

    const checkId = val.checkId ?? 0
    data.form.checkId = String(checkId)
    updateChecker(checkId)

    data.form.preinstall = val.preinstall ?? {}
    if( Object.keys(data.form.preinstall).length > 0 ){
        data.current.hasPreinstall = true
    }
}

watch(() => data.form, (v1, v2) => {
    notifyDeployModelForm()
}, { deep: true })

watch(() => data.checker, (v1, v2) => {
    notifyDeployModelForm()
}, { deep: true })

watch(() => data.current.hasJoin, (v1, v2) => {
    notifyDeployModelForm()
}, { deep: true })

watch(() => data.current.hasPreinstall, (v1, v2) => {
    notifyDeployModelForm()
}, { deep: true })

onMounted(() => {
    // 默认字段
    defaultField.value = [
        { value: '_userId', desc: '用户id', init: ':user', checkId: 0, },
        { value: '_groupId', desc: '用户组id', init: ':group', checkId: 0,},
        { value: '_weight', desc: '账号权重', init: 0, checkId: 6, },
        { value: '_father', desc: '上级', checkId: 0,  },
        { value: '_visible', desc: '可见状态', init: 1, checkId: 6, },
        { value: '_delete', desc: '软删除状态', init: 0, checkId: 6, },
        { value: '_status', desc: '状态', init: 0, checkId: 6, preinstall: {
            "0": {"text":"正常", value: 0},
            "1": {"text":"已激活", value: 1},
            "2": {"text":"待激活", value: 2},
            "3": {"text":"已取消", value: 3},
            "4": {"text":"已禁止", value: 4},
            "5": {"text":"已恢复", value: 5},
            "10": {"text":"成功", value: 10},
            "20": {"text":"失败", value: 20},
            } },
        { value: '_sort', desc: '排序值', init: 0, checkId: 6, },
        { value: '_level', desc: '等级', init: 0, checkId: 6, },
        { value: '_child', desc: '子数据列', checkId: 0, },
        { value: '_admin_weight', desc: '管理权重', init: 0, checkId: 6, },
        { value: '_createAt', desc: '创建时间', init: ':timestamp', checkId: 27, },
        { value: '_updateAt', desc: '更新数据', init: 0, checkId: 27, },
        { value: '_removeAt', desc: '软删除时间', init: 0, checkId: 27, },
    ]
    // 默认值
    suggests.value = [
        { value: ':timestamp', desc: '填入当前时间戳' },
        { value: ':user', desc: '填入当前用户名' },
        { value: ':group', desc: '填入当前用户组' },
        { value: ':random#8', desc: '填入随机8个字符串' }
    ]
    // 可用控件类型
    controls.value = [
        { value: 'radio', desc: '单选框' },
        { value: 'select', desc: '下拉框' }
    ]
})
// 导出模型字段
const getModelField = () => {
    const commonField = _.cloneDeep(toRaw(data.form))
    if (data.current.hasJoin && refJoin.value != null) {
        commonField.join = refJoin.value.getMMBlock()
    } else {
        delete commonField['join']
    }
    if (data.current.hasPreinstall && refPreinstall.value != null) {
        commonField.preinstall = refPreinstall.value.getContent()
    } else{
        delete commonField['preinstall']
    }
    const commonChecker = toRaw(data.checker)
    if( commonChecker.max > 0 && commonChecker.min >= commonChecker.max ){
        proxy.$message.error({
            message: '最小值不能大于最大值',
            center: true
        })
    }
    commonField.checkId = buildCheckerId(commonChecker.id, commonChecker.min, commonChecker.max)
    return commonField
}

const resetFields = () => {
    data.form = {
        name: '',
        text: '',
        type: 0,
        init: '',
        failed: '',
        checkId: 0,
        required: 0,
        unique: 0,
        multiple: 0,
        edit: 0,
        search: 0,
        control: '',
        join: '',
        preinstall: '',
    }
    data.checker = {
        id: 0,
        min: 0,
        max: 0,
    }
    data.current.hasJoin = 0
    data.current.hasPreinstall = 0
}

// 通知父组件刷新 content
const notifyDeployModelForm = () => {
    // console.log('尝试触发父组件方法')
    if (data.form.name === '') {
        return
    }
    // console.log('当前id', data.current.id)
    const v = getModelField()
    v.name = data.current.id
    emit('updateRule', v)
}

const notifyDeployModelFormInsert = () => {
    if (data.form.name === '') {
        return
    }
    emit('insertRule', getModelField())
    resetFields()
}

const notifyDeployModelFormDelete = () => {
    if (data.form.name === '') {
        return
    }
    const content = getModelField()
    if( content.name ){
        // 显示确认框
        proxy
            .$confirm(`确认删除「${content.name}」吗？`, '确认信息')
            .then(() => {
                emit('deleteRule', content)
                resetFields()
                proxy.$message.success({
                    message: '删除成功',
                    center: true
                })
            })
            .catch(() => {})
    }
}

function preinstallChange(content){
    data.form.preinstall = content
}

function joinChange(content){
    data.form.join = content
}

</script>
<style scoped lang='scss'>
.deploy-info {
    overflow: scroll;
}

.deploy-line {
    margin-bottom: 15px;
}

.dictionary-hover {
    color: $text-primary;
    cursor: pointer;
}
</style>
