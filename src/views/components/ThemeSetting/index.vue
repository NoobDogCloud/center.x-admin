<template>
    <div>
        <el-drawer v-model="isShow" title="主题配置" direction="rtl" :size="350">
            <el-alert title="主题配置可实时预览效果，更多设置请在 src/settings.js 中进行设置，建议在生产环境隐藏主题配置功能" type="error" :closable="false" />
            <el-divider>导航栏模式</el-divider>
            <div class="menu-mode">
                <el-tooltip content="侧边栏模式（含主导航）" placement="top" :show-after="500" :append-to-body="false">
                    <div class="mode mode-side" :class="{'active': menuMode === 'side'}" @click="menuMode = 'side'">
                        <svg-icon name="ri-checkbox-circle-fill" />
                    </div>
                </el-tooltip>
                <el-tooltip content="顶部模式" placement="top" :show-after="500" :append-to-body="false">
                    <div class="mode mode-head" :class="{'active': menuMode === 'head'}" @click="menuMode = 'head'">
                        <svg-icon name="ri-checkbox-circle-fill" />
                    </div>
                </el-tooltip>
                <el-tooltip content="侧边栏模式（不含主导航）" placement="top" :show-after="500" :append-to-body="false">
                    <div class="mode mode-single" :class="{'active': menuMode === 'single'}" @click="menuMode = 'single'">
                        <svg-icon name="ri-checkbox-circle-fill" />
                    </div>
                </el-tooltip>
                <el-tooltip content="侧边栏精简模式" placement="top" :show-after="500" :append-to-body="false">
                    <div class="mode mode-only-side" :class="{'active': menuMode === 'only-side'}" @click="menuMode = 'only-side'">
                        <svg-icon name="ri-checkbox-circle-fill" />
                    </div>
                </el-tooltip>
                <el-tooltip content="顶部精简模式" placement="top" :show-after="500" :append-to-body="false">
                    <div class="mode mode-only-head" :class="{'active': menuMode === 'only-head'}" @click="menuMode = 'only-head'">
                        <svg-icon name="ri-checkbox-circle-fill" />
                    </div>
                </el-tooltip>
            </div>
            <el-divider>导航栏风格</el-divider>
            <div class="menu-style">
                <el-tooltip content="卡片" placement="top" :show-after="500" :append-to-body="false">
                    <div class="style style-card" :class="{'active': menuStyle === 'card'}" @click="menuStyle = 'card'">
                        <svg-icon name="ri-checkbox-circle-fill" />
                    </div>
                </el-tooltip>
                <el-tooltip content="圆角" placement="top" :show-after="500" :append-to-body="false">
                    <div class="style style-radius" :class="{'active': menuStyle === 'radius'}" @click="menuStyle = 'radius'">
                        <svg-icon name="ri-checkbox-circle-fill" />
                    </div>
                </el-tooltip>
                <el-tooltip v-if="$store.state.settings.menuMode !== 'single'" content="箭头" placement="top" :show-after="500" :append-to-body="false">
                    <div class="style" :class="{
                        'style-arrow-right': ['side', 'only-side'].includes($store.state.settings.menuMode),
                        'style-arrow-bottom': ['head', 'only-head'].includes($store.state.settings.menuMode),
                        'active': menuStyle === 'arrow'
                    }" @click="menuStyle = 'arrow'"
                    >
                        <svg-icon name="ri-checkbox-circle-fill" />
                    </div>
                </el-tooltip>
            </div>
            <el-divider>主题风格</el-divider>
            <div class="theme">
                <el-tooltip content="默认" placement="top" :show-after="500" :append-to-body="false">
                    <div class="theme-default" :class="{'active': theme === 'default'}" @click="theme = 'default'">
                        <div class="content" />
                    </div>
                </el-tooltip>
                <el-tooltip content="Vue CLI 风格" placement="top" :show-after="500" :append-to-body="false">
                    <div class="theme-vue-cli" :class="{'active': theme === 'vue-cli'}" @click="theme = 'vue-cli'">
                        <div class="content" />
                    </div>
                </el-tooltip>
                <el-tooltip content="码云风格" placement="top" :show-after="500" :append-to-body="false">
                    <div class="theme-gitee" :class="{'active': theme === 'gitee'}" @click="theme = 'gitee'">
                        <div class="content" />
                    </div>
                </el-tooltip>
                <el-tooltip content="清新" placement="top" :show-after="500" :append-to-body="false">
                    <div class="theme-freshness" :class="{'active': theme === 'freshness'}" @click="theme = 'freshness'">
                        <div class="content" />
                    </div>
                </el-tooltip>
                <el-tooltip content="素雅" placement="top" :show-after="500" :append-to-body="false">
                    <div class="theme-elegant" :class="{'active': theme === 'elegant'}" @click="theme = 'elegant'">
                        <div class="content" />
                    </div>
                </el-tooltip>
                <el-tooltip content="纯白" placement="top" :show-after="500" :append-to-body="false">
                    <div class="theme-pure-white" :class="{'active': theme === 'pure-white'}" @click="theme = 'pure-white'">
                        <div class="content" />
                    </div>
                </el-tooltip>
            </div>
            <el-divider>侧边栏</el-divider>
            <div class="setting-item">
                <div class="label">折叠按钮</div>
                <el-switch v-model="enableSidebarCollapse" :disabled="['only-side', 'only-head'].includes($store.state.settings.menuMode)" />
            </div>
            <div class="setting-item">
                <div class="label">是否折叠</div>
                <el-switch v-model="sidebarCollapse" :disabled="['only-side', 'only-head'].includes($store.state.settings.menuMode)" />
            </div>
            <div class="setting-item">
                <div class="label">
                    切换跳转
                    <el-tooltip content="开启该功能后，切换侧边栏时，页面自动跳转至该侧边栏导航下第一个路由地址" placement="top" :append-to-body="false">
                        <svg-icon name="ri-question-line" />
                    </el-tooltip>
                </div>
                <el-switch v-model="switchSidebarAndOpenWindow" :disabled="['single', 'only-side', 'only-head'].includes($store.state.settings.menuMode)" />
            </div>
            <div class="setting-item">
                <div class="label">
                    保持展开一个
                    <el-tooltip content="开启该功能后，侧边栏只保持一个子菜单的展开" placement="top" :append-to-body="false">
                        <svg-icon name="ri-question-line" />
                    </el-tooltip>
                </div>
                <el-switch v-model="sidebarUniqueOpened" :disabled="['only-side', 'only-head'].includes($store.state.settings.menuMode)" />
            </div>
            <el-divider>功能按钮</el-divider>
            <div class="setting-item">
                <div class="label">
                    导航栏搜索
                    <el-tooltip content="对导航栏进行快捷搜索" placement="top" :append-to-body="false">
                        <svg-icon name="ri-question-line" />
                    </el-tooltip>
                </div>
                <el-switch v-model="enableNavSearch" />
            </div>
            <div class="setting-item">
                <div class="label">
                    通知中心
                    <el-tooltip content="该功能具体业务功能需自行开发，框架仅提供示例模版" placement="top" :append-to-body="false">
                        <svg-icon name="ri-question-line" />
                    </el-tooltip>
                </div>
                <el-switch v-model="enableNotification" />
            </div>
            <div class="setting-item">
                <div class="label">国际化</div>
                <el-switch v-model="enableI18n" />
            </div>
            <div class="setting-item">
                <div class="label">
                    全屏
                    <el-tooltip content="该功能使用场景极少，用户习惯于通过窗口“最大化”功能来扩大显示区域，以显示更多内容，并且使用 F11 键也可以进入全屏效果" placement="top" :append-to-body="false">
                        <svg-icon name="ri-question-line" />
                    </el-tooltip>
                </div>
                <el-switch v-model="enableFullscreen" />
            </div>
            <el-divider>其它</el-divider>
            <div class="setting-item">
                <div class="label">
                    组件尺寸
                    <el-tooltip content="全局设置 Element Plus 组件的默认尺寸大小" placement="top" :append-to-body="false">
                        <svg-icon name="ri-question-line" />
                    </el-tooltip>
                </div>
                <el-select v-model="elementSize" size="small">
                    <el-option label="默认 (large)" value="large" />
                    <el-option label="中等 (medium)" value="medium" />
                    <el-option label="小 (small)" value="small" />
                    <el-option label="极小 (mini)" value="mini" />
                </el-select>
            </div>
            <div class="setting-item">
                <div class="label">底部版权</div>
                <el-switch v-model="showCopyright" />
            </div>
            <div class="setting-item">
                <div class="label">页面水印</div>
                <el-switch v-model="enableWatermark" />
            </div>
        </el-drawer>
    </div>
</template>

<script setup name="ThemeSetting">
const { proxy } = getCurrentInstance()
const store = useStore()

const isShow = ref(false)

const menuMode = computed({
    get: function() {
        return store.state.settings.menuMode
    },
    set: function(newValue) {
        store.commit('menu/switchHeaderActived', 0)
        store.commit('settings/updateThemeSetting', {
            'menuMode': newValue
        })
    }
})
const menuStyle = computed({
    get: function() {
        return store.state.settings.menuStyle
    },
    set: function(newValue) {
        store.commit('settings/updateThemeSetting', {
            'menuStyle': newValue
        })
    }
})
const theme = computed({
    get: function() {
        return store.state.settings.theme
    },
    set: function(newValue) {
        store.commit('settings/updateThemeSetting', {
            'theme': newValue
        })
    }
})
const elementSize = computed({
    get: function() {
        return store.state.settings.elementSize
    },
    set: function(newValue) {
        proxy.$ELEMENT.size = newValue
        store.commit('settings/updateThemeSetting', {
            'elementSize': newValue
        })
    }
})
const enableSidebarCollapse = computed({
    get: function() {
        return store.state.settings.enableSidebarCollapse
    },
    set: function(newValue) {
        store.commit('settings/updateThemeSetting', {
            'enableSidebarCollapse': newValue
        })
    }
})
const sidebarCollapse = computed({
    get: function() {
        return store.state.settings.sidebarCollapse
    },
    set: function(newValue) {
        store.commit('settings/updateThemeSetting', {
            'sidebarCollapse': newValue
        })
    }
})
const switchSidebarAndOpenWindow = computed({
    get: function() {
        return store.state.settings.switchSidebarAndOpenWindow
    },
    set: function(newValue) {
        store.commit('settings/updateThemeSetting', {
            'switchSidebarAndOpenWindow': newValue
        })
    }
})
const sidebarUniqueOpened = computed({
    get: function() {
        return store.state.settings.sidebarUniqueOpened
    },
    set: function(newValue) {
        store.commit('settings/updateThemeSetting', {
            'sidebarUniqueOpened': newValue
        })
    }
})
const showCopyright = computed({
    get: function() {
        return store.state.settings.showCopyright
    },
    set: function(newValue) {
        store.commit('settings/updateThemeSetting', {
            'showCopyright': newValue
        })
    }
})
const enableNavSearch = computed({
    get: function() {
        return store.state.settings.enableNavSearch
    },
    set: function(newValue) {
        store.commit('settings/updateThemeSetting', {
            'enableNavSearch': newValue
        })
    }
})
const enableNotification = computed({
    get: function() {
        return store.state.settings.enableNotification
    },
    set: function(newValue) {
        store.commit('settings/updateThemeSetting', {
            'enableNotification': newValue
        })
    }
})
const enableI18n = computed({
    get: function() {
        return store.state.settings.enableI18n
    },
    set: function(newValue) {
        store.commit('settings/updateThemeSetting', {
            'enableI18n': newValue
        })
    }
})
const enableFullscreen = computed({
    get: function() {
        return store.state.settings.enableFullscreen
    },
    set: function(newValue) {
        store.commit('settings/updateThemeSetting', {
            'enableFullscreen': newValue
        })
    }
})
const enableWatermark = computed({
    get: function() {
        return store.state.settings.enableWatermark
    },
    set: function(newValue) {
        store.commit('settings/updateThemeSetting', {
            'enableWatermark': newValue
        })
    }
})

watch(() => store.state.settings.menuMode, val => {
    if (val === 'single' && store.state.settings.menuStyle === 'arrow') {
        store.commit('settings/updateThemeSetting', {
            'menuStyle': 'card'
        })
    }
})

onMounted(() => {
    proxy.$eventBus.on('global-theme-toggle', () => {
        isShow.value = !isShow.value
    })
})
</script>

<style lang="scss" scoped>
:deep(.el-drawer__body) {
    padding: 0 15px 20px;
    overflow: auto;
}
:deep(.el-input) {
    width: 150px;
}
.menu-mode {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding-bottom: 10px;
    .mode {
        position: relative;
        width: 50px;
        height: 40px;
        border-radius: 4px;
        overflow: hidden;
        cursor: pointer;
        background-color: #e1e3e6;
        box-shadow: 0 0 15px 1px #aaa;
        transition: 0.3s;
        &:hover {
            box-shadow: 0 0 15px 1px #666;
        }
        &.active {
            box-shadow: 0 0 0 2px #409eff;
        }
        &::before,
        &::after {
            pointer-events: none;
        }
        &-side {
            &::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 10px;
                height: 100%;
                background-color: #222b45;
            }
            &::after {
                content: "";
                position: absolute;
                top: 0;
                left: 10px;
                width: 15px;
                height: 100%;
                background-color: #fff;
            }
        }
        &-head {
            &::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 10px;
                background-color: #222b45;
            }
            &::after {
                content: "";
                position: absolute;
                top: 10px;
                left: 0;
                width: 15px;
                height: calc(100% - 10px);
                background-color: #fff;
            }
        }
        &-single {
            &::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 15px;
                height: 100%;
                background-color: #fff;
            }
        }
        &-only-side {
            &::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 10px;
                height: 100%;
                background-color: #222b45;
            }
        }
        &-only-head {
            &::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 10px;
                background-color: #222b45;
            }
        }
        i {
            position: absolute;
            right: 2px;
            bottom: 2px;
            display: none;
        }
        &.active i {
            display: block;
            color: #409eff;
        }
    }
}
.menu-style {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding-bottom: 10px;
    .style {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        width: 60px;
        height: 30px;
        overflow: hidden;
        cursor: pointer;
        background-color: #334067;
        box-shadow: 0 0 15px 1px #aaa;
        transition: 0.3s;
        &:hover {
            box-shadow: 0 0 15px 1px #666;
        }
        &.active {
            box-shadow: 0 0 0 2px #409eff;
        }
        &-radius {
            border-radius: 10px;
        }
        &-arrow-right {
            &::before {
                content: "";
                position: absolute;
                right: 0;
                top: 50%;
                margin-top: -7px;
                width: 0;
                height: 0;
                border-top: 7px solid transparent;
                border-right: 7px solid #fff;
                border-bottom: 7px solid transparent;
            }
        }
        &-arrow-bottom {
            &::before {
                content: "";
                position: absolute;
                bottom: 0;
                left: 50%;
                margin-left: -7px;
                width: 0;
                height: 0;
                border-left: 7px solid transparent;
                border-right: 7px solid transparent;
                border-bottom: 7px solid #fff;
            }
        }
        i {
            display: none;
        }
        &.active i {
            display: block;
            color: #409eff;
        }
    }
}
.theme {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding-bottom: 10px;
    [class^="theme-"] {
        position: relative;
        width: 30px;
        height: 30px;
        cursor: pointer;
        border-radius: 5px;
        overflow: hidden;
        box-shadow: 0 0 15px 1px #aaa;
        transition: 0.3s;
        &:hover {
            box-shadow: 0 0 15px 1px #666;
        }
        &::before,
        &::after {
            content: "";
            position: absolute;
            width: 50%;
            height: 50%;
            pointer-events: none;
        }
        &::before {
            top: 0;
            left: 0;
        }
        &::after {
            top: 0;
            left: 50%;
        }
        &.active {
            box-shadow: 0 0 0 2px #409eff;
        }
        .content {
            position: absolute;
            width: 100%;
            height: 100%;
            &::before,
            &::after {
                content: "";
                position: absolute;
                width: 50%;
                height: 50%;
                pointer-events: none;
            }
            &::before {
                bottom: 0;
                left: 0;
            }
            &::after {
                bottom: 0;
                left: 50%;
            }
        }
    }
    .theme-default {
        &::before {
            background-color: map-get($theme-default, "g-header-bg");
        }
        &::after {
            background-color: map-get($theme-default, "g-header-menu-active-bg");
        }
        .content {
            &::before {
                background-color: map-get($theme-default, "g-sub-sidebar-bg");
            }
            &::after {
                background-color: map-get($theme-default, "g-sub-sidebar-menu-active-bg");
            }
        }
    }
    .theme-vue-cli {
        &::before {
            background-color: map-get($theme-vue-cli, "g-header-bg");
        }
        &::after {
            background-color: map-get($theme-vue-cli, "g-header-menu-active-bg");
        }
        .content {
            &::before {
                background-color: map-get($theme-vue-cli, "g-sub-sidebar-bg");
            }
            &::after {
                background-color: map-get($theme-vue-cli, "g-sub-sidebar-menu-active-bg");
            }
        }
    }
    .theme-gitee {
        &::before {
            background-color: map-get($theme-gitee, "g-header-bg");
        }
        &::after {
            background-color: map-get($theme-gitee, "g-header-menu-active-bg");
        }
        .content {
            &::before {
                background-color: map-get($theme-gitee, "g-sub-sidebar-bg");
            }
            &::after {
                background-color: map-get($theme-gitee, "g-sub-sidebar-menu-active-bg");
            }
        }
    }
    .theme-freshness {
        &::before {
            background-color: map-get($theme-freshness, "g-header-bg");
        }
        &::after {
            background-color: map-get($theme-freshness, "g-header-menu-active-bg");
        }
        .content {
            &::before {
                background-color: map-get($theme-freshness, "g-sub-sidebar-bg");
            }
            &::after {
                background-color: map-get($theme-freshness, "g-sub-sidebar-menu-active-bg");
            }
        }
    }
    .theme-elegant {
        &::before {
            background-color: map-get($theme-elegant, "g-header-bg");
        }
        &::after {
            background-color: map-get($theme-elegant, "g-header-menu-active-bg");
        }
        .content {
            &::before {
                background-color: map-get($theme-elegant, "g-sub-sidebar-bg");
            }
            &::after {
                background-color: map-get($theme-elegant, "g-sub-sidebar-menu-active-bg");
            }
        }
    }
    .theme-pure-white {
        &::before {
            background-color: map-get($theme-pure-white, "g-header-bg");
        }
        &::after {
            background-color: map-get($theme-pure-white, "g-header-menu-active-bg");
        }
        .content {
            &::before {
                background-color: map-get($theme-pure-white, "g-sub-sidebar-bg");
            }
            &::after {
                background-color: map-get($theme-pure-white, "g-sub-sidebar-menu-active-bg");
            }
        }
    }
}
.setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 5px 0;
    padding: 5px 10px;
    border-radius: 5px;
    transition: all 0.3s;
    &:hover {
        background: #f1f1f1;
    }
    .label {
        font-size: 14px;
        color: #666;
        display: flex;
        align-items: center;
        i {
            margin-left: 4px;
            font-size: 17px;
            color: #e6a23c;
            cursor: help;
        }
    }
}
</style>
