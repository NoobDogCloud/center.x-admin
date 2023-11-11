<template>
    <Progress :height='height' />
</template>

<script setup>
import Progress from '@/views/components/Gsc/Progress/Progress.vue'
import { ref } from 'vue'

const height = ref((document.body.clientHeight - 210) + 'px')
</script>

<style scoped lang='scss'>

</style>
