<template>
    <div v-if="['side', 'head', 'single'].includes(settingsStore.menu.menuMode)" class='sub-sidebar-container' :class="{'is-collapse': settingsStore.menu.subMenuCollapse}" @scroll='onSidebarScroll'>
        <Logo
            :show-logo="settingsStore.menu.menuMode === 'single'" :class="{
                'sidebar-logo': true,
                'sidebar-logo-bg': settingsStore.menu.menuMode === 'single',
                'shadow': sidebarScrollTop
            }"
        />
        <!-- 侧边栏模式（无主导航）或侧边栏精简模式 -->
        <el-menu
            :unique-opened='settingsStore.menu.subMenuUniqueOpened' :collapse='settingsStore.menu.subMenuCollapse' :collapse-transition='false' :class="{
                'is-collapse-without-logo': settingsStore.menu.menuMode !== 'single' && settingsStore.menu.subMenuCollapse,
                'menu-radius': settingsStore.menu.menuStyle === 'radius'
            }"
        >
            <transition-group name='sub-sidebar'>
                <template v-for='route in menuStore.sidebarMenus' :key='JSON.stringify(route)'>
                    <SidebarItem :item='route' />
                </template>
            </transition-group>
        </el-menu>
        <div class='sidebar-menu-collapse' :class="{'is-collapse': settingsStore.menu.subMenuCollapse}" @click='settingsStore.toggleSidebarCollapse()'>
            <el-icon :size='14'>
                <ArrowLeftBold />
            </el-icon>
        </div>
    </div>
</template>

<script setup name='SubSidebar'>
import { ArrowLeftBold } from '@element-plus/icons-vue'
import Logo from '../Logo/index.vue'
import SidebarItem from '../SidebarItem/index.vue'

import { useSettingsStore } from '@/store/modules/settings'
import { useMenuStore } from '@/store/modules/menu'

const settingsStore = useSettingsStore()
const menuStore = useMenuStore()

const sidebarScrollTop = ref(0)

function onSidebarScroll (e) {
    sidebarScrollTop.value = e.target.scrollTop
}
</script>

<style lang='scss' scoped>
// 次侧边栏动画
.sub-sidebar-enter-active {
    transition: 0.3s;
}

.sub-sidebar-enter-from,
.sub-sidebar-leave-active {
    opacity: 0;
    transform: translateY(30px) skewY(10deg);
}

.sub-sidebar-leave-active {
    position: absolute;
}

.sidebar-menu-collapse {
    background: none;
    border-color: transparent transparent transparent #ebebeb;
    border-width: 9px 0 9px 16px;
    border-style: solid;
    color: #c1c1c1;
    height: 64px;
    line-height: 64px;
    padding: 0;
    position: fixed;
    left: var(--g-sub-sidebar-width);
    top: calc(50% - 32px);
    width: 0;
    z-index: 9;
    box-shadow: none;
    cursor: pointer;
    display: inline-block;
    text-align: center;
    text-decoration: none;
    text-transform: none;
    transition: all .3s;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    vertical-align: middle;
    white-space: nowrap;

    &.is-collapse {
        left: 64px;

        i {
            transform: rotate(180deg);
        }
    }

    &:hover {
        border-left-color: #dedede;
        color: #888;
    }

    i {
        position: absolute;
        left: -15px;
        top: 17px;
        transition: all .3s;
    }
}

.sub-sidebar-container {
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
    // firefox隐藏滚动条
    scrollbar-width: none;
    // chrome隐藏滚动条
    &::-webkit-scrollbar {
        display: none;
    }

    width: var(--g-sub-sidebar-width);
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    transition: 0.3s;
    @include themeify {
        background-color: #f5f5f5;
        //box-shadow: 10px 0 10px -10px darken(themed("g-sub-sidebar-bg"), 20);
    }

    &.is-collapse {
        width: 64px;

        .sidebar-logo {
            &:not(.sidebar-logo-bg) {
                display: none;
            }

            :deep(span) {
                display: none;
            }
        }
    }

    .sidebar-logo {
        transition: box-shadow 0.2s, background-color 0.3s, color 0.3s;
        @include themeify {
            background-color: themed("g-sub-sidebar-bg");
        }

        &:not(.sidebar-logo-bg) {
            :deep(span) {
                @include themeify {
                    color: themed("g-sub-sidebar-menu-color");
                }
            }
        }

        &.sidebar-logo-bg {
            @include themeify {
                background-color: themed("g-main-sidebar-bg");
            }
        }

        &.shadow {
            @include themeify {
                box-shadow: 0 10px 10px -10px darken(themed("g-sub-sidebar-bg"), 20);
            }
        }
    }

    .el-menu {
        border-right: 0;
        padding-top: $g-sidebar-logo-height;
        transition: border-color 0.3s, background-color 0.3s, color 0.3s;
        @include themeify {
            //background-color: themed("g-sub-sidebar-bg");
            background-color: themed("g-sub-sidebar-bg");
        }

        &:not(.el-menu--collapse) {
            width: inherit;
        }

        &.is-collapse-without-logo {
            padding-top: 0;
        }

        &.el-menu--collapse {
            :deep(.title-icon) {
                margin-right: 0;
            }

            :deep(.el-menu-item),
            :deep(.el-sub-menu__title) {
                span,
                .el-sub-menu__icon-arrow {
                    display: none;
                }
            }
        }

        &.menu-radius:not(.el-menu--collapse) {
            .sidebar-item {
                padding: 0 10px;

                &:first-child {
                    padding-top: 10px;
                }

                &:last-child {
                    padding-bottom: 10px;
                }
            }

            :deep(.el-menu--inline),
            :deep(.el-menu-item),
            :deep(.el-sub-menu__title) {
                border-radius: 10px;
            }
        }
    }
}
</style>
