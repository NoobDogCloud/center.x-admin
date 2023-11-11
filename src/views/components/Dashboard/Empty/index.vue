<template>
    <div class='empty-container'>
    </div>
</template>

<script setup>
const locationOrigin = ref(location.href)

function open (url) {
    window.open(url, 'top')
}
</script>

<style lang='scss' scoped>
.empty-container {
    height: 100%;
    overflow: auto;

    .header {
        margin: 0;

        .text-emphasis {
            text-emphasis-style: "❤";
        }

        a {
            color: inherit;
            text-decoration: none;
            border-bottom: 1px solid #ccc;
            cursor: pointer;
        }
    }
}
</style>
