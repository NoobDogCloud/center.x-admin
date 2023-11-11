<template>
    <div>
        <el-button @click="$window.toggleMaximize('WindowExampleMaximize')">{{ $window.isMaximize('WindowExampleMaximize') ? '退出最大化' : '当前窗口最大化' }}</el-button>
    </div>
</template>
