<template>
    <div class="automatic-node">
        <div class="panel">
            <p class="title">{{ title }}</p>
            <p class="sub-title">{{ subTitle }}</p>
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
    subTitle.value = current.subTitle;
});
const data = node.getData();
const title = ref(data ? data.title : '');
const subTitle = ref(data ? data.subTitle : '');
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
    padding: 0 15px;
    border-radius: $auto-node-border-radius;
    background: $primary-auto-node-background;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;
    box-shadow: 5px 5px 3px 0px $primary-auto-node-second-background;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-sizing: border-box;

    .title {
        color: #fff;
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
    }

    .sub-title {
        color: #fff;
        font-size: 12px;
    }
}
</style>
