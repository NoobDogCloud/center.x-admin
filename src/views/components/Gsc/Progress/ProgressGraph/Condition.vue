<template>
    <div class="automatic-node">
        <div class="panel">
            <p class="title">{{title}}</p>
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
    padding: 18%;
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
    transform: rotate(45deg);
    border: 1px $condition-node-text-color solid;
    border-radius: $condition-node-border-radius;
    background: $condition-node-background;
    box-shadow: 6px 0px 5px 0px $condition-node-second-background;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;

    .title {
        color: $condition-node-text-color;
        font-size: 18px;
        font-weight: bold;
        transform: rotate(-45deg);
        text-align: center;
    }
}
</style>
