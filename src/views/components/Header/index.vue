<template>
    <transition name='header'>
        <header v-if="['head', 'only-head'].includes(settingsStore.menu.menuMode)">
            <div class='header-container'>
                <div class='main'>
                    <Logo />
                    <!-- 顶部模式 -->
                    <div
                        v-if="settingsStore.menu.menuMode === 'head'" class='nav' :class="{
                            'nav-radius': settingsStore.menu.menuStyle === 'radius',
                            'nav-arrow': settingsStore.menu.menuStyle === 'arrow'
                        }"
                    >
                        <template v-for='(item, index) in menuStore.transformMenus' :key='index'>
                            <div v-if='item.children && item.children.length !== 0' class='item' :class="{'active': index == menuStore.headerActived}" @click='switchMenu(index)'>
                                <el-icon v-if='item.icon'>
                                    <svg-icon :name='item.icon' />
                                </el-icon>
                                <span v-if='item.title'>{{ item.title }}</span>
                            </div>
                        </template>
                    </div>
                    <!-- 顶部精简模式 -->
                    <el-menu
                        v-else-if="settingsStore.menu.menuMode === 'only-head'" mode='horizontal' class='el-menu-nav' :class="{
                            'el-menu-nav-radius': settingsStore.menu.menuStyle === 'radius',
                            'el-menu-nav-arrow': settingsStore.menu.menuStyle === 'arrow'
                        }"
                    >
                        <template v-for='(route, index) in menuStore.transformMenus' :key='index'>
                            <SidebarItem :item='route' />
                        </template>
                    </el-menu>
                </div>
                <Tools />
            </div>
        </header>
    </transition>
</template>

<script setup name='Header'>
import Logo from '../Logo/index.vue'
import Tools from '../Tools/index.vue'
import SidebarItem from '../SidebarItem/index.vue'

import { useSettingsStore } from '@/store/modules/settings'
import { useMenuStore } from '@/store/modules/menu'

const settingsStore = useSettingsStore()
const menuStore = useMenuStore()

const switchMenu = inject('switchMenu')
</script>

<style lang='scss' scoped>
// 头部动画
.header-enter-active {
    transition: 0.2s;
}

.header-enter-from {
    transform: translateY(-#{$g-header-height});
}

header {
    position: fixed;
    z-index: 1011;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    padding: 0 20px;
    height: $g-header-height;
    @include themeify {
        color: themed("g-header-color");
        background-color: themed("g-header-bg");
        box-shadow: 0 2px 4px 0 lighten(themed("g-header-bg"), 10);
    }

    .header-container {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .main {
            flex: 1;
            display: flex;
            align-items: center;
            height: 100%;
        }
    }

    :deep(.title) {
        position: relative;
        width: inherit;
        //height: inherit;
        height: 35px;
        padding: inherit;
        background-color: inherit;

        .logo {
            //width: 50px;
            //height: 50px;
            width: 35px;
            height: 35px;
        }

        span {
            //font-size: 24px;
            font-size: 18px;
            letter-spacing: 1px;
            @include themeify {
                color: themed("g-header-color");
            }
        }
    }

    .nav {
        display: flex;
        height: 100%;
        margin-left: 50px;

        .item {
            display: flex;
            align-items: center;
            justify-content: center;
            //flex-direction: column;
            padding: 5px 10px;
            margin-right: 1px;
            //width: 80px;
            width: auto;
            cursor: pointer;
            transition: all 0.3s;
            @include themeify {
                color: themed("g-header-menu-color");
                background-color: themed("g-header-bg");
            }

            &:hover {
                @include themeify {
                    color: themed("g-header-menu-hover-color");
                    background-color: themed("g-header-menu-hover-bg");
                }
            }

            &.active {
                @include themeify {
                    color: themed("g-header-menu-active-color");
                    background-color: themed("g-header-menu-active-bg");
                }
            }

            .el-icon {
                font-size: 18px;
                vertical-align: middle;

                & + span {
                    vertical-align: middle;
                    @include text-overflow(1, false);
                    font-size: 14px;
                    margin-left: 5px;
                }
            }
        }

        &.nav-radius {
            .item {
                border-radius: 5px;
                margin: 5px 5px 5px 0;

                &:last-child {
                    margin-right: 0;
                }
            }
        }

        &.nav-arrow {
            .item {
                position: relative;

                &.active::before {
                    content: "";
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    margin-left: -7px;
                    width: 0;
                    height: 0;
                    border-right: 7px solid transparent;
                    border-left: 7px solid transparent;
                    border-bottom: 7px solid #fff;
                }
            }
        }
    }

    .el-menu-nav {
        flex: 1;
        display: flex;
        align-items: center;
        height: 100%;
        margin-left: 50px;
        border-bottom: none;
        background-color: inherit;

        .sidebar-item,
        :deep(.el-sub-menu),
        :deep(.el-sub-menu__title) {
            height: 100%;
            display: flex;
            align-items: center;
        }

        :deep(.el-sub-menu.is-active) {
            .el-sub-menu__title {
                @include themeify {
                    color: themed("g-header-menu-active-color") !important;
                    background-color: themed("g-header-menu-active-bg") !important;
                }
            }
        }

        :deep(.el-sub-menu__title) {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            padding: 0 5px;
            width: 80px;
            line-height: initial;
            transition: all 0.3s;
            @include themeify {
                color: themed("g-header-menu-color") !important;
            }

            &:hover {
                @include themeify {
                    color: themed("g-header-menu-hover-color") !important;
                    background-color: themed("g-header-menu-hover-bg") !important;
                }

                .el-icon {
                    transform: scale(1);
                }
            }

            .el-icon {
                width: initial;
                margin-right: 0;
                font-size: 24px;
                vertical-align: middle;
            }

            .title {
                flex: initial;
                margin-left: initial;
                height: initial;
                line-height: initial;
                text-align: center;
                font-size: 16px;
                @include text-overflow(1, false);
            }

            .el-sub-menu__icon-arrow {
                display: none;
            }
        }

        &.el-menu-nav-radius {
            .sidebar-item {
                :deep(.el-sub-menu__title) {
                    height: calc(100% - 10px);
                    border-radius: 5px;
                    margin: 5px 5px 5px 0;
                }

                &:last-child {
                    margin-right: 0;
                }
            }
        }

        &.el-menu-nav-arrow {
            .sidebar-item {
                :deep(.is-active) {
                    .el-sub-menu__title {
                        &::before {
                            content: "";
                            position: absolute;
                            bottom: 0;
                            left: 50%;
                            margin-left: -7px;
                            width: 0;
                            height: 0;
                            border-right: 7px solid transparent;
                            border-left: 7px solid transparent;
                            border-bottom: 7px solid #fff;
                        }
                    }
                }
            }
        }
    }

    :deep(.tools) {
        padding: 0;

        .buttons .el-icon {
            @include themeify {
                color: themed("g-header-color");
            }
        }

        .user-container {
            font-size: 16px;
            @include themeify {
                color: themed("g-header-color");
            }
        }
    }
}
</style>
