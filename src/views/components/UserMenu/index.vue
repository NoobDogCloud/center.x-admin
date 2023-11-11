<template>
    <div class='user'>
        <div class='tools'>
            <span v-if='$store.state.window.list.length > 1' class='item'>
                <svg-icon name='toolbar-preview-windows' @click='previewAllWindows' />
            </span>
            <span
                v-if='$store.state.settings.enableNavSearch' class='item'
                @click="$eventBus.emit('global-search-toggle')"
            >
                <i class='ri-search-line' />
            </span>
            <el-popover
                v-if='$store.state.settings.enableNotification' :show-after='200' :width='350'
                placement='bottom' trigger='hover'
            >
                <Notification ref='tabs' />
                <template #reference>
                    <span class='item'>
                        <el-badge :value='5' type='primary'>
                            <i class='ri-notification-3-line' />
                        </el-badge>
                    </span>
                </template>
            </el-popover>
            <i18n-selector>
                <span class='item'>
                    <i class='ri-translate' />
                </span>
            </i18n-selector>
            <span v-if='isFullscreenEnable && $store.state.settings.enableFullscreen' class='item' @click='fullscreen'>
                <i :class="isFullscreen ? 'ri-fullscreen-exit-line' : 'ri-fullscreen-line'" />
            </span>
            <span
                v-if='$store.state.settings.enableThemeSetting' class='item'
                @click="$eventBus.emit('global-theme-toggle')"
            >
                <svg-icon name='toolbar-theme' />
            </span>
        </div>
        <el-dropdown class='user-container tools' @command='dataBaseCommand'>
            <div class='user-wrapper'>
                数据库操作
                <el-icon>
                    <el-icon-caret-bottom />
                </el-icon>
            </div>
            <template #dropdown>
                <el-dropdown-menu class='user-dropdown'>
                    <el-dropdown-item command='export'>导出数据库</el-dropdown-item>
                    <el-dropdown-item command='import' divided>
                        <el-upload
                            ref='uploader' :auto-upload='false' :on-change='onFileChange' :show-file-list='false'
                            class='upload-demo'
                        >
                            <span>{{ fileLoading ? '导入中...' : '导入数据库' }}</span>
                        </el-upload>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
        <el-dropdown class='user-container' @command='userCommand'>
            <div class='user-wrapper'>
                <el-avatar size='medium'>
                    <el-icon>
                        <el-icon-user-filled />
                    </el-icon>
                </el-avatar>
                {{ $store.state.user.account }}
                <el-icon>
                    <el-icon-caret-bottom />
                </el-icon>
            </div>
            <template #dropdown>
                <el-dropdown-menu class='user-dropdown'>
                    <el-dropdown-item command='setting'>{{ $t('app.profile') }}</el-dropdown-item>
                    <el-dropdown-item command='logout' divided>{{ $t('app.logout') }}</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</template>

<script name='UserMenu' setup>
import screenfull from 'screenfull'
import Notification from '../Notification/index.vue'
import { RpcClient } from 'gsc-frontend-sdk/gfw/rpc/rpcClient'
import config from 'gsc-frontend-sdk/gfw/config/config'
import { ref } from 'vue'

const { proxy } = getCurrentInstance()
const store = useStore()
const router = useRouter()

const isFullscreenEnable = computed(() => screenfull.isEnabled)
const isFullscreen = ref(false)

onMounted(() => {
    if (isFullscreenEnable.value) {
        screenfull.on('change', fullscreenChange)
    }
})
onBeforeUnmount(() => {
    if (isFullscreenEnable.value) {
        screenfull.off('change', fullscreenChange)
    }
})

function changess (v) {
    debugger
}

// 数据库操作
function dataBaseCommand (command) {
    switch (command) {
        case 'export':
            const client = RpcClient.New(config.framework)
            client.setPath('GfwSystem', 'exportBackup')
            client.setHeader('appKey', config.appKey) // 这个可以反复调用
            client.getDirect('backup.json')
            break
        case 'import':

            break
    }
}

const fileLoading = ref(false)
const uploader = ref(null)

function onFileChange (file, files) {
    debugger
    fileLoading.value = true
    const fileClient = RpcClient.New(config.framework)
    fileClient.setPath('GfwSystem', 'importBackup')
    fileClient.setHeader('appKey', config.appKey) // 这个可以反复调用
    fileClient.file(file.raw).then(v => {
        if (v.data.errorcode !== 0) {
            proxy.$message.error({
                message: v.data.message,
                center: true
            })
        } else {
            proxy.$message.success({
                message: '导入成功',
                center: true
            })
            uploader.value.clearFiles()
        }
    }).catch(v => {
        proxy.$message.error({
            message: '导入失败',
            center: true
        })
    }).finally(() => {
        fileLoading.value = false
    })
}

function previewAllWindows () {
    store.commit('settings/updateThemeSetting', {
        previewAllWindows: true
    })
}

function fullscreen () {
    screenfull.toggle()
}

function fullscreenChange () {
    isFullscreen.value = screenfull.isFullscreen
}

function userCommand (command) {
    switch (command) {
        case 'setting':
            proxy.$window.add({
                title: '个人设置',
                name: 'PersonalSetting'
            })
            break
        case 'logout':
            store.dispatch('user/logout').then(() => {
                router.push({
                    name: 'login'
                })
            })
            break
    }
}
</script>

<style lang='scss' scoped>
.user {
    display: flex;
    align-items: center;
    padding: 0 20px;
    white-space: nowrap;
}

.tools {
    margin-right: 20px;

    .item {
        margin-left: 5px;
        padding: 6px 8px;
        border-radius: 5px;
        outline: none;
        cursor: pointer;
        vertical-align: middle;
        transition: all 0.3s;

        [class^="ri-"] {
            vertical-align: -0.15em;
        }

        .el-badge {
            vertical-align: initial;
        }
    }
}

:deep(.language-container) {
    font-size: 16px;
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
