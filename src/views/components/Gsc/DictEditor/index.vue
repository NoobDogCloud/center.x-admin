<template>
    <el-popover
        placement='right'
        ref='popoverRef'
        :virtual-ref='props.buttonRef'
        trigger='click'
        title='字典内容'
        :hide-after='0'
        :width='650'
        virtual-triggering
        @after-leave='onAfterLeave'
    >
        <div class='layout'>
            <el-table :data='tableContent' style='width: 100%'>
                <el-table-column label='索引' prop='name' width='180' />
                <el-table-column label='内容' prop='content' />
                <el-table-column label='业务名' prop='text' />
                <el-table-column label='操作' prop='content'>
                    <template #default='scope'>
                        <el-button plain size='default' type='danger' @click='onDelete(scope.row)'>删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-form :inline='true' :model='data.form' :rules='data.rules' style='margin-top: 20px' class='demo-form-inline' label-suffix=':'>
                <el-form-item>
                    <el-input v-model='data.form.name' placeholder='索引' style='width: 150px' />
                </el-form-item>
                <el-form-item>
                    <el-input v-model='data.form.value' placeholder='内容' style='width: 180px' />
                </el-form-item>
                <el-form-item>
                    <el-input v-model='data.form.text' placeholder='业务名' style='width: 180px' />
                </el-form-item>
                <el-form-item>
                    <el-button @click='onReset'>重置</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type='primary' @click='onSubmit'>新增</el-button>
                </el-form-item>
                <el-form-item>
                    <el-dropdown @command="handleCommand" :popperAppendToBody="false">
                        <span class="el-dropdown-link">
                          预设字典
                          <el-icon class="el-icon--right">
                            <arrow-down />
                          </el-icon>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item command="status">默认状态</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </el-form-item>
            </el-form>
        </div>
    </el-popover>
</template>

<script name='DictEditor' setup>
import { computed, reactive } from 'vue'
import {isObject} from "lodash";

const emit = defineEmits(['contentChange'])

const props = defineProps({
    content: {
        type: Object,
        default: () => {}
    },
    buttonRef: {}
})

const data = reactive({
    form: {
        name: '',
        value: '',
        text: '',
    },
    content: isObject(props.content) ? props.content : {},
})

const tableContent = computed(() => {
    const content = data.content
    const keys = Object.keys(content)
    return keys.map(key => {
        const c = content[key]
        return {
            name: key,
            content: c.value,
            text: c.text,
        }
    })
})

const handleCommand = (command) => {
    switch (command){
        case "status": {
            data.content = {
                "0":{ text: "默认", value: 0},
                "1":{ text: "激活", value: 1},
                "2":{ text: "等待", value: 2},
                "3":{ text: "取消", value: 3},
                "4":{ text: "禁止", value: 4},
                "5":{ text: "驳回", value: 5},
                "10":{ text: "成功", value: 10},
                "20":{ text: "失败", value: 20},
            }
            break
        }
    }
}

const onAfterLeave = () => {
    emit('contentChange', getContent())
}

function onReset (){
    data.content = {}
}

function onSubmit () {
    const { name, value, text } = data.form
    if (!name || !value) {
        return
    }
    data.content[name] = {
        value: value,
        text: ( text === '' || text === null || text === undefined ) ? name : text
    }
    data.form.name = ''
    data.form.value = ''
    data.form.text = ''
}

function onDelete (row) {
    delete data.content[row.name]
}

const getContent = () => {
    return Object.keys(data.content).length > 0 ? data.content : {}
}

defineExpose({ getContent })
</script>

<style scoped>

</style>
