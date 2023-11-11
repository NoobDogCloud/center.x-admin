<template>
    <FormDesigner ref="designer" :template="data.template">
        <template #header>
            <div class="form-header">
                <el-input size="default" v-model="data.name" placeholder="请输入模板名称" class="input-append-white">
                    <template #append>
                        <el-select size="default" v-model="data.type" placeholder="请选择模板类型" style="width: 150px">
                            <el-option v-for='item in ConfigTypeOptions' :key='item.key' :label='item.name' :value='item.key' />
                        </el-select>
                    </template>
                </el-input>
            </div>
        </template>
        <template #button>
            <el-button size="default" text type="primary" @click="save($event)">
                <svg-icon v-if="!loading" style="margin-right: 3px;width: 18px;" name="toolbar-save" />
                <svg-icon v-if="loading" style="margin-right: 3px;width: 18px;" name="loading" class="ani-rotate" />保存
            </el-button>
        </template>
    </FormDesigner>
</template>

<script setup>
import FormDesigner from "../VFormDesigner/index.vue"
import { reactive, toRaw, ref, onMounted, getCurrentInstance } from 'vue'
// import { Plus } from '@element-plus/icons-vue'
import { ConfigTypeMap } from '@/services/configs'

const { proxy } = getCurrentInstance()

const ConfigTypeOptions = ref(ConfigTypeMap)

const props = defineProps({
    formData: {
        type: Object
    }
})

const designer = ref(null);
const emit = defineEmits(['submit']);
const loading = ref(false);

let data = reactive(Object.assign({}, toRaw(props.formData)));
if (!data.type) {
    data.type = "db";
}

const save = (v) => {
    let template = designer.value.getFormJson();
    let name = data.name;
    let type = data.type;
    if (!name) {
        proxy.$message.error({
            message: '模板名称不能为空!',
            center: true
        })
        return;
    }
    loading.value = true;
    emit("submit", { template, name, type }, () => {
        loading.value = false;
    });
}
</script>


<style lang='scss' scoped>
.form-header {
    width: 100%;
    padding: 0 40px 0 0;
}
</style>
