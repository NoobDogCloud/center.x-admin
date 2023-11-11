<template>
    <div class="tools">
        <div class="buttons">
            <span v-if="windowStore.list.length > 1" class="item">
                <el-icon @click="previewAllWindows">
                    <i-icon-park-outline-all-application />
                </el-icon>
            </span>
            <span
                v-if="settingsStore.topbar.enableNavSearch" class="item"
                @click="$eventBus.emit('global-search-toggle')"
            >
                <el-icon>
                    <i-ri-search-line />
                </el-icon>
            </span>
            <el-popover
                v-if="settingsStore.topbar.enableNotification" :show-after="200" :width="350"
                placement="bottom" trigger="hover"
            >
                <Notification ref="tabs" />
                <template #reference>
                    <span class="item">
                        <el-badge :value="5" type="primary">
                            <el-icon>
                                <i-ri-notification-3-line />
                            </el-icon>
                        </el-badge>
                    </span>
                </template>
            </el-popover>
            <i18n-selector>
                <span class="item">
                    <el-icon>
                        <i-ri-translate />
                    </el-icon>
                </span>
            </i18n-selector>
            <span v-if="settingsStore.topbar.enableFullscreen" class="item" @click="toggle">
                <el-icon>
                    <i-ri-fullscreen-exit-line v-show="isFullscreen" />
                    <i-ri-fullscreen-line v-show="!isFullscreen" />
                </el-icon>
            </span>
            <span
                v-if="settingsStore.topbar.enableAppSetting" class="item"
                @click="$eventBus.emit('global-theme-toggle')"
            >
                <el-icon>
                    <i-uiw-setting-o />
                </el-icon>
            </span>
        </div>
        <el-dropdown class="user-container tools" style="margin-right: 20px" @command="dataBaseCommand">
            <div class="user-wrapper">
                数据库操作
                <el-icon>
                    <i-ep-caret-bottom />
                </el-icon>
            </div>
            <template #dropdown>
                <el-dropdown-menu class="user-dropdown">
                    <el-dropdown-item command="export">导出数据库</el-dropdown-item>
                    <el-dropdown-item command="import" divided>
                        <el-upload
                            ref="uploader" :auto-upload="false" :on-change="onFileChange" :show-file-list="false"
                            class="upload-demo"
                        >
                            <span>{{ fileLoading ? '导入中...' : '导入数据库' }}</span>
                        </el-upload>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
        <el-dropdown class="user-container" @command="userCommand">
            <div class="user-wrapper">
                <el-avatar size="small">
                    <el-icon>
                        <i-ep-user-filled />
                    </el-icon>
                </el-avatar>
                {{ userStore.account }}
                <el-icon>
                    <i-ep-caret-bottom />
                </el-icon>
            </div>
            <template #dropdown>
                <el-dropdown-menu class="user-dropdown">
                    <el-dropdown-item command="setting">{{ t('app.profile') }}</el-dropdown-item>
                    <el-dropdown-item command="logout" divided>{{ t('app.logout') }}</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script name='UserMenu' setup>
import Notification from './Notification/index.vue'
import { useSettingsStore } from '@/store/modules/settings'
import { useUserStore } from '@/store/modules/user'
import { useWindowStore } from '@/store/modules/window'
import { useI18n } from 'vue-i18n'
import { useFullscreen } from '@vueuse/core'
import { RpcClient } from 'gsc-frontend-sdk/gfw/rpc/rpcClient'
import config from 'gsc-frontend-sdk/gfw/config/config'
import { getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'

const { proxy } = getCurrentInstance()
const router = useRouter()

const settingsStore = useSettingsStore()
const userStore = useUserStore()
const windowStore = useWindowStore()

const { t } = useI18n()

const { isFullscreen, toggle } = useFullscreen()

function previewAllWindows() {
    settingsStore.updateThemeSetting({
        previewAllWindows: true
    })
}

// 数据库操作
function dataBaseCommand(command) {
    const client = RpcClient.New('system')
    switch (command) {
        case 'export':
            client.setPath('GfwSystem', 'exportBackup')
            client.setHeader('appKey', config.appKey) // 这个可以反复调用
            client.getDirect('backup.json')
            break
        case 'import':
            // 导入数据库
            break
    }
}

function userCommand(command) {
    switch (command) {
        case 'setting':
            proxy.$window.add({
                title: '个人设置',
                name: 'PersonalSetting'
            })
            break
        case 'logout':
            userStore.logout().then(() => {
                router.push({
                    name: 'login'
                })
            })
            break
    }
}
</script>

<style lang='scss' scoped>
.tools {
    display: flex;
    align-items: center;
    padding: 0 20px;
    white-space: nowrap;

    .buttons {
        margin-right: 20px;

        .item {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            height: 26px;
            width: 34px;
            cursor: pointer;
            vertical-align: middle;
            transition: all 0.3s;

            .el-badge {
                display: flex;
                align-items: center;
            }
        }
    }

    :deep(.language-container) {
        font-size: 16px;
    }

    :deep(.user-container) {
        display: inline-block;
        height: 24px;
        line-height: 24px;
        cursor: pointer;

        .user-wrapper {
            .el-avatar {
                vertical-align: middle;
                margin-top: -2px;
                margin-right: 4px;
            }
        }
    }
}

:deep(.user-container) {
    display: inline-block;
    height: 50px;
    line-height: 50px;
    cursor: pointer;

    .user-wrapper {
        .el-avatar {
            vertical-align: middle;
            margin-top: -2px;
            margin-right: 4px;
        }
    }
}
</style>
