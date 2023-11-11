<template>
    <div class='role-container' v-loading='data.loading'>
        <div class='role-header'>
            <div class='item'>角色Key</div>
            <div class='item'>角色名称</div>
            <div class='item'>权值</div>
            <div class='item'>从属关系</div>
            <div class='item control'></div>
        </div>
        <div class='role-content' v-for='item in data.systemRoles'>
            <div class='item'>
                <el-input v-model='item.key' disabled />
            </div>
            <div class='item'>
                <el-input v-model='item.name' disabled />
            </div>
            <div class='item'>
                <el-input-number v-model='item.weight' :min='1' :controls='false' disabled />
            </div>
            <div class='item'>
                <el-input v-model='item.elder' disabled />
            </div>
            <div class='item control'></div>
        </div>
        <div class='role-content' v-for='(item, idx) in data.roles'>
            <div class='item'>
                <el-input v-model='item.key' placeholder='请输入角色Key值' />
            </div>
            <div class='item'>
                <el-input v-model='item.name' placeholder='请输入角色名称' />
            </div>
            <div class='item'>
                <el-input-number v-model='item.weight' :min='1' :controls='false' placeholder='请输入角色权值' @change='weightChange' />
            </div>
            <div class='item'>
                <el-select clearable v-model='item.elder' placeholder='请选择角色从属关系'>
                    <el-option v-for='option in item.elderOptions' :hidden='option.key === item.key' :label='option.label' :value='option.value' />
                </el-select>
            </div>
            <div class='item control'>
                <button class='remove' @click='removeRole(item, idx)'>
                    <SemiSelect color='#fff' />
                </button>
            </div>
        </div>
        <div class='role-content'>
            <div class='item'>
                <el-input v-model='newRole.key' placeholder='请输入角色Key值' />
            </div>
            <div class='item'>
                <el-input v-model='newRole.name' placeholder='请输入角色名称' />
            </div>
            <div class='item'>
                <el-input-number v-model='newRole.weight' :min='1' :controls='false' placeholder='请输入角色权值' @change='weightChange' />
            </div>
            <div class='item'>
                <el-select clearable v-model='newRole.elder' placeholder='请选择角色从属关系'>
                    <el-option v-for='option in newRole.elderOptions' :label='option.label' :value='option.value' />
                </el-select>
            </div>
            <div class='item control'>
                <button class='plus' @click='insertRole'>
                    <Plus color='#fff' />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, toRaw } from 'vue'
// import { Plus, SemiSelect } from '@element-plus/icons-vue'
import contextApi from '@/services/context'
import { ElMessage } from 'element-plus'

const props = defineProps({
    appid: {
        type: [String, Number]
    }
})

//系统角色源数据,用于剔除接口填充的系统角色
let systemRolesSource = {}

const data = reactive({
    loading: true,
    systemRoles: [],
    roles: []
})

//插入角色表单对象
const newRole = reactive({
    key: '',
    name: '',
    weight: 1,
    elder: '',
    elderOptions: []
})

let LoadingCount = 2

//获取系统角色
const getSystemRoles = async () => {
    const appCtx = await contextApi.defaultRoles()
    systemRolesSource = appCtx.getRecord()

    //系统角色转为Array方便模板遍历
    let systemRoles = []
    for (const key in systemRolesSource) {
        systemRoles.push(Object.assign(systemRolesSource[key], { key: key }))
    }

    data.systemRoles = systemRoles

    if (--LoadingCount === 0) {
        data.loading = false
        initElderOptions()
    }
}

getSystemRoles()

//初始化应用角色
const initRoles = async () => {
    const appCtx = await contextApi.get(props.appid)
    let roles = appCtx.getRecord().roles

    for (const key in systemRolesSource) {
        if (roles[key]) {
            delete roles[key]
        }
    }

    for (const key in roles) {
        data.roles.push(Object.assign(roles[key], { key: key }))
    }

    if (--LoadingCount === 0) {
        data.loading = false
        initElderOptions()
    }
}

//新增时不需要初始化应用角色
if (props.appid) {
    initRoles()
} else {
    --LoadingCount
}

//初始化角色从属选项列表
//因为联动关系,每个角色都有自己的选项列表
const initElderOptions = (newRoleLoop) => {
    const loopData = newRoleLoop ? [newRole] : data.roles
    for (let i = 0; i < loopData.length; i++) {
        const current = loopData[i]

        //确认当前从属关系由于用户对权值变更后是否合法
        //重置选项前执行
        if (current.elder) {
            //整合系统角色和应用角色
            let l = data.roles.concat(data.systemRoles)
            for (let j = 0; j < l.length; j++) {
                const c_o = l[j]
                //获取从属对应角色的数据
                if (c_o.key === current.elder) {
                    if (current.weight >= c_o.weight) {
                        current.elder = ''
                    }
                }
            }
        }

        current.elderOptions = []
        //初始化系统角色选项列表
        for (let n = 0; n < data.systemRoles.length; n++) {
            const c_sr = data.systemRoles[n]
            //仅能从属于权值更大的角色
            if (current.weight < c_sr.weight) {
                current.elderOptions.push({ value: c_sr.key, label: c_sr.name || c_sr.key, key: c_sr.key })
            }
        }
        //初始化应用角色选项列表
        for (let x = 0; x < data.roles.length; x++) {
            const c_r = data.roles[x]
            //跳过自身
            if (current.key === c_r.key) {
                continue
            }
            //仅能从属于权值更大的角色
            if (current.weight < c_r.weight) {
                current.elderOptions.push({ value: c_r.key, label: c_r.name || c_r.key, key: c_r.key })
            }
        }
    }
    if (!newRoleLoop) {
        initElderOptions(true)
    }
}

//权值变更后确认所有角色的从属列表
//由新的权值确定是否能够维持各个角色已设置的从属关系
const weightChange = (v) => {
    initElderOptions()
}

const roles = reactive({})

//移除角色
const removeRole = (v, idx) => {
    data.roles.splice(idx, 1)
    return false
}

//插入角色
const insertRole = () => {
    if (newRole.key == '') {
        ElMessage({
            message: '角色Key不可为空',
            type: 'error'
        })
        return
    }

    data.roles.push(Object.assign({}, toRaw(newRole)))
    newRole.key = ''
    newRole.name = ''
    newRole.weight = 1
    newRole.elder = ''
    newRole.elderOptions = []
    initElderOptions()
    return false
}

const getRoles = () => {
    let rs = {}
    for (let i = 0; i < data.roles.length; i++) {
        const current = data.roles[i]
        rs[current.key] = {
            name: current.name,
            weight: current.weight,
            elder: current.elder
        }
    }
    // emit('update:modelValue', rs)
    return rs
}

defineExpose({
    getRoles
})

</script>

<style scoped lang='scss'>
.role-container {
    padding: 10px;

    .role-header, .role-content {
        display: flex;
        align-items: center;
        justify-content: center;
        border-left: 1px #e5e7eb solid;
        border-top: 1px #e5e7eb solid;

        .item {
            width: 25%;
            height: 40px;
            display: flex;
            align-items: center;
            padding: 8px 10px;
            border-right: 1px #e5e7eb solid;
            border-bottom: 1px #e5e7eb solid;
        }

        .control {
            width: 50px;
        }
    }

    .role-content {
        border-top: none;

        .item {
            height: 57px;
        }

        .el-select {
            width: 100%;
        }

        .control {
            button {
                width: 26px;
                height: 26px;
                border: none;
                border-radius: 50%;
                transition: background .2s;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;

                &.plus {
                    background: #95d475;
                }

                &.plus:hover {
                    background: #67c23a;
                }

                &.remove {
                    background: #f89898;
                }

                &.remove:hover {
                    background: #f56c6c;
                }
            }
        }

        .el-input-number {
            width: 100%;

            :deep(input) {
                text-align: left;
                padding: 0 7px;
            }
        }
    }

}
</style>
