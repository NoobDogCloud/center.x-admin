import { createApp } from 'vue'
import App from './App.vue'
import VForm3 from '@/../lib/vform/designer.umd.js'
import '@/../lib/vform/designer.style.css'
import { piniaStore } from './store'
import router from './router'
import ElementPlus, { ElNotification } from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import { useI18n } from './locales'
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'
import registerWindowComponent from '@/views/windows/registerWindowComponent'
import globalProperties from '@/util/global.properties'
// 自定义指令
import directive from '@/util/directive'
// 错误日志上报
import errorLog from '@/util/error.log'
// 加载 svg 图标
import 'virtual:svg-icons-register'

import '@antv/x6-vue-shape'
// 加载 iconify 图标
import { downloadAndInstall } from '@/iconify'
import icons from '@/iconify/index.json'
// 全局样式
import '@/assets/styles/globals.scss'
import { InitGscApplication } from 'gsc-frontend-sdk'
import storage from '@/util/storage'

const app = createApp(App)

app.use(VForm3)

app.use(piniaStore)

app.use(router)

useI18n(app)

app.use(ElementPlus)

app.use(ContextMenu)

registerWindowComponent(app)

globalProperties(app)

directive(app)

errorLog(app)

if (icons.useType === 'offline') {
    for (const info of icons.collections) {
        downloadAndInstall(info)
    }
}

// 将 element-plus 的图标库注册到全局
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
    app.component(`ElIcon${key}`, component)
}

// PWA
// import './pwa'

// 挂载网络错误提示
const err_group = {
    'local': error => {
        ElNotification({
            title: '网络错误',
            message: (error?.message || error?.record) ?? '网络错误',
            showClose: false,
            type: 'error'
        })
    },
    'service': error => {
        ElNotification({
            title: '应用错误',
            message: (error?.message || error?.record) ?? '应用错误',
            showClose: false,
            type: 'error'
        })
    },
    'remote': error => {
        ElNotification({
            title: '服务错误',
            message: (error?.message || error?.record) ?? '服务错误',
            showClose: false,
            type: 'error'
        })
    }
}

// 初始化应用上下文
// 插入动画,成功PASS,失败提示无效应用
/**
 * 模式配置例子:
 * ======================================================
 *  直连模式:配置应用api(适用测试环境)
 *  direct:
 *      http://127.0.0.1:805
 * ======================================================
 *  安全网关模式:配置安全网关地址(适用重要外网应用)
 *      访问Web应用需要通过安全网关地址访问,例如请求网关服务器 http://127.0.0.1:8000
 *  sec-gateway:
 *      http://127.0.0.1:8001
 * ======================================================
 *  网关模式:配置网关地址(适用普通外网应用)
 *      可以直接访问应用
 *  gateway:
 *      http://127.0.0.1:8000
 * ======================================================
 *  服务网格模式:配置网格鉴权服务器地址(适用内网发布)
 *      访问Web应用需要通过鉴权服务器访问,例如请求鉴权服务器 http://127.0.0.1:8080
 *  mesh:
 *      http://127.0.0.1:8080
 * */
/**
 * direct:
 * 12.12.12.120:805
 * gateway:
 * 12.12.12.100:30181
 * sec-gateway:
 * 12.12.12.100:31579
 * mesh:
 * 12.12.12.100:31328
 */
InitGscApplication({
    appID: '0',
    appKey: 'grapeSoft@',
    mode: 'direct',
    baseUrl: import.meta.env.VITE_APP_API_ENDPOINT ?? 'http://127.0.0.1:805'
    // baseUrl: 'http://127.0.0.1:805'
    // baseUrl: 'http://12.12.12.170:805'
    // baseUrl: 'http://192.168.50.153:805'
    // baseUrl: 'http://101.200.218.142:50805'
},
() => storage.local.get('GlobalSession') ? JSON.parse(storage.local.get('GlobalSession')) : {},
err_group
).then(() => {}).catch(error => {})

app.mount('#app')
