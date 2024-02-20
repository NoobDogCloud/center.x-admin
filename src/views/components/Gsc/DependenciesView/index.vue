<template>
    <div class="dependency-container">
        <h3>版本信息</h3>
        <span>{{ dependencyJson.version }}</span>
        <h3>依赖信息</h3>
        <ul>
            <li v-for="(value, key) in dependencyJson.dependencies" :key="key">
                <el-descriptions
                    :title="key"
                    direction="vertical"
                    :column="3"
                    size="32px"
                    border
                >
                    <el-descriptions-item label="groupId" >{{ value.groupId }}</el-descriptions-item>
                    <el-descriptions-item label="artifactId" :span="1">{{ value.artifactId }}</el-descriptions-item>
                    <el-descriptions-item label="version" :span="1">{{ value.version }}</el-descriptions-item>
                </el-descriptions>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { buildSDKTemplate } from '@/modules/sdk/dependency'
import { reactive } from 'vue'

const props = defineProps({
    pom: {
        type: String
    }
})

// 根据 props.pom 的值，构造依赖对象
const dependencyJson = reactive(buildSDKTemplate(props.pom))

function getDependency() {
    return dependencyJson
}

defineExpose({
    getDependency
})
</script>

<style scoped lang="scss">
.dependency-container {
    padding: 10px;
}
</style>
