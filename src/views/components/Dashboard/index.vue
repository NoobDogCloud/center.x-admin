<template>
    <div ref="windows" class="dashboard" :class="{
            [`scroll-snap-${settingsStore.window.autoPosition}`]: settingsStore.window.autoPosition !== 'none',
            'preview-all': settingsStore.previewAllWindows,
            'focus': focusEnabled
        }" @click="exitPreviewAllWindows">
        <div class="preview-all-mode">
            <el-radio-group v-model="previewAllMode" size="large" style="display: inline-block;" @click.stop>
                <el-radio-button label="preview">预 览</el-radio-button>
                <el-radio-button label="drag">排 序</el-radio-button>
            </el-radio-group>
            <el-tooltip content="可以通过快捷键 Alt + W 快速进入窗口预览界面" placement="left" :append-to-body="false">
                <el-icon class="help">
                    <i-ri-question-line />
                </el-icon>
            </el-tooltip>
        </div>
        <draggable v-if="windowStore.list.length > 0" v-model="windowList" class="dashboard-container" :class="{
                'mode-drag': settingsStore.previewAllWindows && previewAllMode === 'drag',
                'dragging': isDragging
            }" v-bind="dragOptions" item-key="name" draggable=".window" handle=".draggable" :component-data="{
                tag: 'div',
                type: 'transition-group',
                name: !isDragging ? 'window' : null
            }" @start="isDragging = true" @end="isDragging = false">
            <template #item="{element}">
                <div :ref="`window-${element.name}`" class="window" :class="{
                        'window-focus': focusEnabled && focusList.findIndex(item => item === element.name) >= 0
                    }">
                    <div class="window-container" :class="{
                            'maximize': element.isMaximize,
                            'preview': settingsStore.previewAllWindows
                        }">
                        <div v-if="element.showTitle !== false" class="header" @dblclick="scrollToWindow(element.name)" @contextmenu="onWindowContextmenu($event, element)">
                            <div class="titles">
                                <el-tooltip v-if="element.title" effect="dark" :content="element.breadcrumbNeste.map(bc => generateI18nTitle(bc.i18n, bc.title)).join(' / ')" placement="bottom-start"
                                    :show-after="500" :disabled="element.breadcrumbNeste.map(b => b.title).length == 0">
                                    <span class="title">
                                        {{ generateI18nTitle(element.i18n, element.title) }}
                                    </span>
                                </el-tooltip>
                            </div>
                            <div class="btns" @dblclick.stop>
                                <div class="btn" @click="$window.toggleMaximize(element.name)">
                                    <el-icon>
                                        <i-ri-picture-in-picture-exit-line />
                                    </el-icon>
                                </div>
                                <div class="btn" @click="$window.remove(element.name)">
                                    <el-icon>
                                        <i-ep-close-bold />
                                    </el-icon>
                                </div>
                            </div>
                        </div>
                        <div class="maximize-exit" @click="$window.toggleMaximize(element.name)">
                            <el-icon>
                                <i-ri-picture-in-picture-2-line />
                            </el-icon>
                        </div>
                        <div class="container">
                            <el-scrollbar>
                                <Component :is="element.name" v-if="!element.reload" :is-maximize="element.isMaximize" :params="element.params" />
                            </el-scrollbar>
                        </div>
                        <div class="mask" @click="maskClick(element.name)">点击进入该窗口</div>
                        <div class="focus-check" :class="{'checked': focusList.includes(element.name)}" @click.stop="focusToggle(element.name)">
                            <el-icon>
                                <i-ep-check />
                            </el-icon>
                        </div>
                        <div class="draggable" @click.stop>
                            <div class="title">{{ generateI18nTitle(element.i18n, element.title) }}</div>
                        </div>
                    </div>
                </div>
            </template>
        </draggable>
        <Empty v-else />
    </div>
    <div class="preview-all-focus-actions" :class="{
            'show': ((settingsStore.previewAllWindows && previewAllMode === 'preview') || focusEnabled) && focusList.length > 0
        }">
        <span v-if="focusList.length == 1">再勾选一个窗口，可开启专注模式</span>
        <el-button v-if="settingsStore.previewAllWindows && previewAllMode === 'preview' && focusList.length > 1" size="large" @click.stop="intoFocus">进入专注模式</el-button>
        <el-button v-else-if="focusEnabled" size="large" @click.stop="exitFocus">退出专注模式</el-button>
    </div>
</template>

<script setup name="Dashboard">
import storage from '@/util/storage'
import Empty from './Empty/index.vue'
import draggable from 'vuedraggable'

const { proxy } = getCurrentInstance()

import { useSettingsStore } from '@/store/modules/settings'
const settingsStore = useSettingsStore()
import { useWindowStore } from '@/store/modules/window'
const windowStore = useWindowStore()

import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const generateI18nTitle = inject('generateI18nTitle')
const previewAllMode = ref('preview')

const isDragging = ref(false)
const dragOptions = computed(() => {
    return {
        animation: 200,
        ghostClass: 'window-ghost'
    }
})

const focusList = ref([])
const focusEnabled = ref(false)
function focusToggle(windowName) {
    if (focusList.value.includes(windowName)) {
        focusList.value = focusList.value.filter(item => item !== windowName)
    } else {
        if (focusList.value.length < settingsStore.window.focusMaxNum) {
            focusList.value.push(windowName)
        } else {
            ElMessage({
                type: 'warning',
                message: `最多可勾选不超过 ${settingsStore.window.focusMaxNum} 个窗口`,
                center: true
            })
        }
    }
}
function intoFocus() {
    focusEnabled.value = true
    exitPreviewAllWindows()
}

const windowList = computed({
    get() {
        return windowStore.list
    },
    set(value) {
        windowStore.sort(value)
    }
})

watch(() => windowStore.list, val => {
    nextTick(() => {
        if (val.length > 0) {
            windowScrollTip()
        }
    })
}, {
    deep: true
})

function windowScrollTip() {
    // if (proxy.$refs['windows'].scrollWidth > proxy.$refs['windows'].clientWidth && !storage.local.has('windowScrollTip')) {
    //     ElMessageBox.confirm(`
    //         <div style="text-align: left;">
    //             当前窗口数量已超过浏览器展示区域，你可以通过拖动窗口下方的滚动条进行定位，除此之外，我们推荐使用以下三种更高效的方式进行窗口定位：
    //             <ol>
    //                 <li>在窗口展示区域内，按住 Shift 键，滑动鼠标滚轮</li>
    //                 <li>在窗口标题区域，双击或右键选择“聚焦”选项</li>
    //                 <li>使用 Alt + W 快捷键进入预览界面</li>
    //             </ol>
    //         </div>
    //     `, '温馨提示', {
    //         dangerouslyUseHTMLString: true,
    //         confirmButtonText: '知道了',
    //         showCancelButton: false,
    //         showClose: false,
    //         closeOnClickModal: false,
    //         closeOnPressEscape: false,
    //         type: 'info',
    //         center: true
    //     }).then(() => {
    //         storage.local.set('windowScrollTip', true)
    //     })
    // }
}

proxy.$eventBus.on('scrollToWindow', windowName => scrollToWindow(windowName))

// 记录进入窗口预览界面前 scrollLeft 的值，退出的时候可以进行复原
const originalScrollLeft = ref(0)
watch(() => settingsStore.previewAllWindows, val => {
    if (val) {
        previewAllMode.value = 'preview'
        focusList.value = []
        originalScrollLeft.value = proxy.$refs['windows'].scrollLeft
    }
})

onMounted(() => {
    proxy.$hotkeys('alt+w', e => {
        if (windowStore.list.length > 1 && windowStore.list.every(item => !item.isMaximize)) {
            e.preventDefault()
            if (settingsStore.previewAllWindows) {
                exitPreviewAllWindows()
            } else {
                settingsStore.updateThemeSetting({
                    previewAllWindows: true
                })
            }
        }
    })
})

function scrollToOriginal(scrollLeft) {
    nextTick(() => {
        proxy.$refs['windows'].scroll(scrollLeft, 0)
    })
}
function scrollToWindow(windowName) {
    nextTick(() => {
        const window = proxy.$refs[`window-${windowName}`]
        if( window ) {
            const offsetLeft = window.offsetLeft
            proxy.$refs['windows'].scrollTo({
                left: offsetLeft,
                behavior: 'smooth'
            })
        }
    })
}
function scrollToPrevWindow(windowName) {
    let index = windowStore.list.findIndex(item => item.name === windowName)
    if (index > 0) {
        scrollToWindow(windowStore.list[index - 1].name)
    }
}
function scrollToNextWindow(windowName) {
    let index = windowStore.list.findIndex(item => item.name === windowName)
    if (index + 1 <= windowStore.list.length) {
        scrollToWindow(windowStore.list[index + 1].name)
    }
}
function onWindowContextmenu(event, windowItem) {
    event.preventDefault()
    proxy.$contextmenu({
        x: event.x,
        y: event.y,
        zIndex: 3,
        iconFontClass: '',
        customClass: 'contextmenu-custom',
        items: [
            {
                label: t('window.reload'),
                icon: 'i ri:refresh-line',
                onClick: () => proxy.$window.reload(windowItem.name)
            },
            {
                label: t('window.remove'),
                icon: 'i ri:close-line',
                divided: true,
                onClick: () => proxy.$window.remove(windowItem.name)
            },
            {
                label: t('window.maximize'),
                icon: 'i ri:picture-in-picture-exit-line',
                onClick: () => proxy.$window.toggleMaximize(windowItem.name)
            },
            {
                label: t('window.focus'),
                icon: 'i ri:focus-3-line',
                divided: true,
                onClick: () => {
                    scrollToWindow(windowItem.name)
                    if (!storage.local.has('windowFocusTip')) {
                        ElMessageBox.confirm('你可以通过双击标题栏快速聚焦窗口', '温馨提示', {
                            confirmButtonText: '知道了',
                            showCancelButton: false,
                            showClose: false,
                            closeOnClickModal: false,
                            closeOnPressEscape: false,
                            type: 'info',
                            center: true
                        }).then(() => {
                            storage.local.set('windowFocusTip', true)
                        })
                    }
                }
            },
            {
                label: t('window.focusPrev'),
                disabled: windowStore.list[0].name === windowItem.name,
                onClick: () => scrollToPrevWindow(windowItem.name)
            },
            {
                label: t('window.focusNext'),
                disabled: windowStore.list[windowStore.list.length - 1].name === windowItem.name,
                divided: true,
                onClick: () => scrollToNextWindow(windowItem.name)
            },
            {
                label: t('window.removeOtherSide'),
                disabled: !windowStore.list.some(item => item.name !== windowItem.name),
                onClick: () => {
                    windowStore.removeOtherSide(windowItem.name)
                }
            },
            {
                label: t('window.removeLeftSide'),
                disabled: windowStore.list[0].name === windowItem.name,
                onClick: () => {
                    windowStore.removeLeftSide(windowItem.name)
                }
            },
            {
                label: t('window.removeRightSide'),
                disabled: windowStore.list[windowStore.list.length - 1].name === windowItem.name,
                onClick: () => {
                    windowStore.removeRightSide(windowItem.name)
                }
            }
        ]
    })
}

function exitPreviewAllWindows() {
    if (settingsStore.previewAllWindows) {
        settingsStore.updateThemeSetting({
            previewAllWindows: false
        })
        scrollToOriginal(originalScrollLeft.value)
    }
}
function exitFocus() {
    if (focusEnabled.value) {
        focusEnabled.value = false
        focusList.value = []
    }
}
function maskClick(windowName) {
    exitPreviewAllWindows()
    setTimeout(() => {
        scrollToWindow(windowName)
    }, 0)
}
</script>

<style lang="scss">
@import "iconfont/iconfont.css";
.contextmenu-custom {
    .mx-context-menu-items .mx-context-menu-item {
        .text {
            display: flex;
            align-items: center;
        }
        &.disabled .text .icon {
            color: #9f9f9f;
        }
    }
}
</style>
<style lang="scss" scoped>
.dashboard {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    transition: 0.3s;
    &[class*="scroll-snap"] {
        scroll-snap-type: x mandatory;
    }
    &.scroll-snap-start .window {
        scroll-snap-align: start;
    }
    &.scroll-snap-center .window {
        scroll-snap-align: center;
    }
    &.scroll-snap-end .window {
        scroll-snap-align: end;
    }
    &.preview-all {
        position: fixed;
        z-index: 2000;
        top: 0;
        bottom: 0;
        left: 0;
        overflow-y: auto;
        background-color: rgb(0 0 0 / 50%);
        backdrop-filter: blur(10px);
        .preview-all-mode {
            display: block;
        }
        .dashboard-container {
            flex-wrap: wrap;
            justify-content: center;
            bottom: auto;
            height: max-content;
            padding-bottom: 80px;
            &:not(.mode-drag) {
                align-items: center;
                .window {
                    height: $g-window-height;
                    margin-right: calc(
                        $g-window-width * ($g-window-perview-scale - 1)
                    );
                    margin-bottom: calc(
                        $g-window-height * ($g-window-perview-scale - 1)
                    );
                    transform-origin: top left;
                    transform: scale($g-window-perview-scale);
                    user-select: none;
                    width: $g-window-width;
                }
            }
            &.mode-drag .window {
                width: 200px;
                margin-right: unset;
                .window-container {
                    margin: 8px;
                    > * {
                        display: none;
                    }
                    .draggable {
                        display: block;
                    }
                }
            }
        }
    }
    .preview-all-mode {
        display: none;
        padding: 20px 0;
        text-align: center;
        position: relative;
        .help {
            color: #ccc;
            right: 20px;
            font-size: 18px;
            @include position-center(y);
        }
    }
    &.focus {
        position: fixed;
        z-index: 2000;
        top: 0;
        bottom: 0;
        left: 0;
        overflow-y: auto;
        background-color: rgb(0 0 0 / 50%);
        backdrop-filter: blur(10px);
        .dashboard-container {
            height: calc(100% - 80px);
            align-items: stretch;
            justify-content: space-between;
            > .window {
                display: none;
                flex: unset;
                width: 100%;
                padding: 10px;
                margin-right: unset;
                overflow: auto;
                .window-container {
                    margin: 0;
                    width: 100%;
                    height: 100%;
                    .header {
                        display: none;
                    }
                }
                &.window-focus {
                    display: block;
                }
            }
        }
    }
    .dashboard-container {
        display: flex;
        height: 100%;
    }
    .window {
        flex: none;
        display: flex;
        // width: $g-window-width;
        width: 100%;
        margin-right: -16px;
        &.window-ghost {
            opacity: 0;
        }
        .window-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            width: calc(100% - 32px);
            margin: 16px;
            background-color: #fff;
            //box-shadow: 0 0 1px 0 #ccc;
            transition: 0.3s;
            //&:hover {
            //    box-shadow: 0 0 5px 0 #ccc;
            //}
            &.maximize {
                position: fixed;
                z-index: 2000;
                margin: 0;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                .header {
                    display: none;
                }
                .maximize-exit {
                    display: block;
                }
            }
            &.preview {
                .mask {
                    display: flex;
                }
                .focus-check {
                    display: flex;
                }
            }
            .header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 10px;
                //height: 40px;
                border-bottom: 1px solid #eee;
                margin-bottom: 6px;
                .titles {
                    display: flex;
                    align-items: center;
                    .title {
                        font-weight: bold;
                        //font-size: 14px;
                        font-size: 28px;
                    }
                    .title + .btns {
                        margin-left: 10px;
                    }
                }
                .btns {
                    display: flex;
                    .btn {
                        transition: 0.3s;
                        opacity: 0.5;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 5px;
                        font-size: 16px;
                        border-radius: 3px;
                        background-color: rgb(238 238 238 / 50%);
                        cursor: pointer;
                        &.disabled {
                            color: #ccc;
                            cursor: not-allowed;
                        }
                        &:not(.disabled):hover {
                            opacity: 1;
                            background-color: #eee;
                        }
                    }
                    .btn + .btn {
                        margin-left: 5px;
                    }
                }
            }
            .maximize-exit {
                display: none;
                position: fixed;
                z-index: 1000;
                right: -40px;
                top: -40px;
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background-color: rgb(0 0 0 / 30%);
                cursor: pointer;
                transition: 0.3s;
                .el-icon {
                    position: absolute;
                    bottom: 16px;
                    left: 16px;
                    transition: 0.3s;
                }
                &:hover {
                    background-color: rgb(0 0 0 / 70%);
                    .el-icon {
                        color: #fff;
                    }
                }
            }
            .container {
                flex: 1;
                overflow: auto;
                overscroll-behavior: contain;
                > .el-scrollbar {
                    > :deep(.el-scrollbar__wrap) {
                        padding: $g-window-container-padding;
                    }
                }
            }
            .mask {
                display: none;
                align-items: center;
                justify-content: center;
                position: absolute;
                z-index: 1000;
                margin: 16px;
                top: 0;
                left: 0;
                width: calc(100% - 32px);
                height: 80%;
                background-color: rgb(255 255 255 / 50%);
                font-size: 48px;
                color: rgb(0 0 0 / 0%);
                text-shadow: 0 0 0 rgb(0 0 0 / 0%);
                cursor: pointer;
                transition: 0.3s;
                &:hover {
                    color: #5482ee;
                    text-shadow: 0 0 5px rgb(0 0 0 / 50%);
                }
            }
            .focus-check {
                display: none;
                align-items: center;
                justify-content: center;
                position: absolute;
                z-index: 1001;
                margin: 16px;
                top: 80%;
                left: 0;
                width: calc(100% - 32px);
                height: calc(20% - 32px);
                background-color: rgb(255 255 255 / 50%);
                border-top: 1px dashed #eee;
                cursor: pointer;
                &:hover .el-icon {
                    color: #ccc;
                    font-size: 100px;
                }
                &.checked .el-icon {
                    color: #5482ee;
                    font-size: 100px;
                }
                .el-icon {
                    display: block;
                    color: #eee;
                    font-size: 80px;
                    transition: 0.3s;
                }
            }
            .draggable {
                display: none;
                padding: 10px;
                cursor: move;
                .title {
                    font-size: 14px;
                    height: 48px;
                    line-height: 24px;
                    @include text-overflow(2, fales);
                }
            }
        }
        &:last-child {
            margin-right: 0;
        }
    }
}
.preview-all-focus-actions {
    position: fixed;
    z-index: 2001;
    left: 0;
    bottom: -80px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 80px;
    background-image: linear-gradient(
        to bottom,
        rgb(0 0 0 / 0%),
        rgb(0 0 0 / 80%)
    );
    transition: 0.3s;
    &.show {
        bottom: 0;
    }
    span {
        font-size: 24px;
        color: #fff;
        text-shadow: 0 0 5px rgb(0 0 0 / 100%);
    }
}
.window-enter-from {
    opacity: 0;
    transform: translateY(100px);
}
.window-enter-active {
    transition: all 0.5s;
}
</style>
