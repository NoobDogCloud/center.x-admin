<template>
    <el-row :gutter="20">
        <el-col :span="5">
            <div id="stencil"/>
        </el-col>
        <el-col :span="14">
            <div id="container"/>
        </el-col>
        <el-col :span="5">

        </el-col>
    </el-row>
</template>

<script setup>
import {onMounted, reactive} from "vue";
import {Addon, Cell, Graph, Node, Shape} from '@antv/x6';

const tableData = [
    {
        id: 1,
        title: "标题1",
        content: "内容1",
    },
    {
        id: 2,
        title: "标题2",
        content: "内容2",
    },
    {
        id: 3,
        title: "标题3",
        content: "内容3",
    },
]

let graph;
let stencil;
let curCel;

// 中间画布
const buildGraph = () => {
    graph = new Graph({
        container: document.getElementById('container'),
        height: 600,
        background: {
            color: '#fffbe6', // 设置画布背景颜色
        },
        grid: {
            size: 10,      // 网格大小 10px
            visible: true, // 渲染网格背景
        },
    });
}

// 左侧模板
const buildStencil = () => {
    stencil = new Addon.Stencil({
        target: graph,
        stencilGraphWidth: 280,
        // search: { rect: true },
        collapsable: true,
        groups: [
            {
                name: 'basic',
                title: '基础节点',
                // 高度
                graphHeight: 180,
            },
            {
                name: 'combination',
                title: '组合节点',
                // 布局选项
                layoutOptions: {
                    // 每行几列
                    columns: 1,
                    // 左侧边距
                    marginX: 60,
                },
                graphHeight: 260,
            },
            // {
            //   name: 'group',
            //   title: '节点组',
            //   graphHeight: 100,
            //   layoutOptions: {
            //     columns: 1,
            //     marginX: 60,
            //   },
            // },
        ],
    });
    document.querySelector('#stencil')?.appendChild(stencil.container)
}

// 左侧模板加载数据 stencil.load
const stencilLoadData = () => {
    // createNode方式
    const bizNode1 = graph.createNode({
        shape: "rect",
        width: 100,
        height: 50,
        attrs: {
            label: {
                fontSize: 12,
                text: "业务节点1"
            },
        },
    })
    // 构造函数方式
    const bizNode2 = new Shape.Rect({
        width: 100,
        height: 50,
        attrs: {
            label: {
                fontSize: 12,
                text: "业务节点2"
            },
        },
    });
    // 节点元数据方式
    const bizNode3 = {
        width: 100,
        height: 50,
        attrs: {
            label: {
                fontSize: 12,
                text: "业务节点3"
            },
        },
    }

    stencil.load([bizNode1, bizNode2, bizNode3], 'basic')
}

// 表单数据定义
const formData = reactive({
    id: null,
    title: null,
    content: null,
});

// 初始化事件
const initEvent = () => {
    graph.on('cell:click', ({cell}) => {
        console.log(cell.getAttrs())
        // 将之前被选中的节点样式清除
        curCel?.attr('body/stroke', null)
        // 新的节点赋值
        curCel = cell
        // 新的节点边框样式设置为红色
        curCel?.attr('body/stroke', "red")

        // 将cell data中Id进行赋值
        formData.id = cell.getData()?.id

        if (formData.id) {
            // 模拟请求数据
            setTimeout(() => {
                const tableDataRow = tableData.filter(item => item.id === formData.id)[0];
                formData.title = tableDataRow.title
                formData.content = tableDataRow.content
            }, 100)
        } else {
            formData.title = null
            formData.content = null
        }
    });
}

// 所有下拉数据
const dropdownData = reactive({
    tableData: [],
});


onMounted(() => {
    buildGraph();
    buildStencil();
    stencilLoadData();
    initEvent();
    // 模拟请求数据
    setTimeout(() => {
        dropdownData.tableData = tableData;
    }, 1000)

})

const onIdChange = () => {
    // 模拟请求
    setTimeout(() => {
        const tableDataRow = tableData.filter(item => item.id === formData.id)[0];
        formData.title = tableDataRow?.title;
        formData.content = tableDataRow?.content;

        curCel?.setData({
            id: formData.id
        })
        curCel?.attr('label/text', formData.title)

    }, 100)
}

const toJson = () => {
    console.log(graph.toJSON())
}
</script>

<style scoped lang="less">

</style>