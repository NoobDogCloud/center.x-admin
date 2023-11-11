<template>
    <div class='progress-box' :style='{height: height}'>
        <div class='stencil-box' ref='stencilBox'></div>
        <div class='graph-box' ref='graphBox'></div>
        <!--        <el-button class="add-button" @click="add">123</el-button>-->
        <div class='tool-tip'>
            <p style='color: #ddd'>123</p>
        </div>
    </div>
    <AutomaticForm v-model:visible='visible.Automatic' :node='currentNode' />
    <AuditForm v-model:visible='visible.Audit' :node='currentNode' />
    <HookForm v-model:visible='visible.Hook' :node='currentNode' />
    <ConditionForm v-model:visible='visible.Condition' :node='currentNode' />
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import ProgressGraph from './ProgressGraph/index'
import AutomaticForm from './ProgressForm/AutomaticForm.vue'
import AuditForm from './ProgressForm/AuditForm.vue'
import HookForm from './ProgressForm/HookForm.vue'
import ConditionForm from './ProgressForm/ConditionForm.vue'

const props = defineProps({
    height: {
        type: Number
    }
})

const height = computed(() => {
    return props.height || '100%'
})

const graphBox = ref()
const stencilBox = ref()
//4类节点表单可见
const visible = reactive({
    'Automatic': false,
    'Audit': false,
    'Condition': false,
    'Hook': false
})
const currentNode = ref(null)
let progressGraph = null

const add = () => {
    console.log(JSON.stringify(progressGraph.graph.toJSON()))
    // nodeProps.title = nodeProps.title + '1'
}

onMounted(() => {
    progressGraph = new ProgressGraph(graphBox.value)
    progressGraph.initStencil(stencilBox.value)
    const data = {
        // 节点
        nodes: [
            // progressGraph.getNode('Automatic', {
            //     id: 'node1', // String，节点的唯一标识
            //     x: 40,       // Number，必选，节点位置的 x 值
            //     y: 137.5,       // Number，必选，节点位置的 y 值
            // }, nodeProps),
            // progressGraph.getNode('Audit', {
            //     id: 'node2', // String，节点的唯一标识
            //     x: 340,       // Number，必选，节点位置的 x 值
            //     y: 140,       // Number，必选，节点位置的 y 值
            // }, {num: 312}),
            // progressGraph.getNode('Condition', {
            //     id: 'node3', // String，节点的唯一标识
            //     x: 610,       // Number，必选，节点位置的 x 值
            //     y: 105,       // Number，必选，节点位置的 y 值
            // }, {num: 312}),
            // progressGraph.getNode('Hook', {
            //     id: 'node4', // String，节点的唯一标识
            //     x: 870,       // Number，必选，节点位置的 x 值
            //     y: 162.5,       // Number，必选，节点位置的 y 值
            // }, {num: 312})
        ],
        // 边
        edges: [
            // progressGraph.getEdge('node1', 'node2')
            // {
            //     source: 'node2', // String，必须，起始节点 id
            //     target: 'node3', // String，必须，目标节点 id
            //     attrs: {
            //         line: {
            //             stroke: '#5452f6',
            //             strokeWidth: 2,
            //             targetMarker: {
            //                 name: 'classic',
            //                 size: 10,
            //             },
            //         },
            //     },
            // },
        ]
    }

    progressGraph.graph.on('node:dblclick', ({ e, x, y, node, view }) => {
        visible[node.getProp().shape] = true
        currentNode.value = node
    })

    // const dnd = new Addon.Dnd({
    //     target:progressGraph.graph
    // })
    progressGraph.graph.fromJSON(data)
    // updateInPorts.call(graph.getNodes()[0], graph)
})
</script>

<style scoped>
.progress-box {
    width: 100%;
    height: 100%;
    display: flex;
    background: #fdfcff;
    border: 1px #ddd solid;
    overflow: hidden;
}

.stencil-box {
    width: 220px;
    height: 100%;
    position: relative;
}

.graph-box {
    flex-grow: 1;
    height: 100%;
}

.add-button {
    position: absolute;
    bottom: 0;
    left: 0;
}

.tool-tip {
    position: fixed;
    background: #303133;
    padding: 10px;
    padding: 5px 11px;
    border-radius: 4px;
    font-size: 12px;
    left: -500px;
}

.tool-tip p {
    margin: 0;
}

.tool-tip:after {
    position: absolute;
    bottom: -4px;
    left: 50%;
    margin-left: -4px;
    width: 8px;
    height: 8px;
    content: '';
    border-width: 15px;
    border-color: #303133;
    background: #303133;
    transform: rotate(45deg);
}
</style>
