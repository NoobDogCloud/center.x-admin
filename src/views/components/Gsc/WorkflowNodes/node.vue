<template>
    <div>
        <el-button @click='add()'>内部Add: {{ num }}</el-button>
    </div>
</template>

<script setup>
import { inject, onMounted, ref } from 'vue'

const getGraph = inject('getGraph')
const getNode = inject('getNode')
const num = ref()
const add = () => {
    const node = this.getNode()
    const { num } = node.getData()
    node.setData({
        num: num + 1
    })
}

onMounted(() => {
    const self = this
    const node = this.getNode()
    // 监听数据改变事件
    node.on('change:data', ({ current }) => {
        self.num = current.num
    })
})
</script>

<style scoped lang='scss'>

</style>
