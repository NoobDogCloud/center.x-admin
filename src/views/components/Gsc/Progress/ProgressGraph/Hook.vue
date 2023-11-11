<template>
    <div class="automatic-node">
        <div class="panel">
            <p class="title">{{ title }}</p>
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
    border: 1px solid $hook-node-text-color;
    border-radius: $hook-node-border-radius;
    background: $hook-node-background;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
    box-shadow: 5px 5px 3px 0px $hook-node-second-background;
    display: flex;
    padding: 0 15px;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;

    .title {
        color: $hook-node-text-color;
        font-size: 16px;
        font-weight: bold;
    }
}
</style>
