<template>
    <div class="automatic-node">
        <div class="panel">
            <div class="dot-box">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
            <div class="content">
                <p>{{ title }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import {inject, ref} from "vue";

const props = defineProps({
    type: {
        type: String,
        default: 'primary'
    }
})

//数据处理
const nodeInject = inject('getNode');
const node = nodeInject();
node.on("change:data", ({current}) => {
    title.value = current.title;
});
const data = node.getData();
const title = ref(data ? data.title : '');
</script>

<style scoped lang="scss">
.automatic-node {
    width: 100%;
    height: 100%;
    padding: $node-wrap-padding;
    position: relative;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
}

.panel {
    height: 100%;
    flex-grow: 1;
    z-index: 10;
    margin-right: 5px;
    border: 2px $audit-node-border-color solid;
    border-radius: $audit-node-border-radius;
    background: $audit-node-background-color;
    box-shadow: 5px 5px 3px 0px $audit-node-second-background;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;

    .dot-box {
        height: 30px;
        display: flex;
        align-items: center;
        padding: 0 10px;
        border-bottom: 2px $audit-node-border-color solid;

        .dot {
            margin-right: 8px;
            width: 13px;
            height: 13px;
            border-radius: 50%;
            background: $audit-node-border-color;
        }
    }

    .content {
        padding: 10px;
        color: $audit-node-border-color;
        font-size: 14px;
        font-weight: bold;
        flex-grow: 1;
    }
}

.background-panel {
    position: absolute;
    top: 5px;
    left: 5px;
    width: 190px;
    height: 100px;
    z-index: 9;
    border-radius: $audit-node-border-radius;
    background: $audit-node-second-background;
}
</style>
