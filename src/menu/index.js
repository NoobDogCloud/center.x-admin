import WindowApp from './modules/window.app'
import WindowService from './modules/window.service'
import WindowConfig from './modules/window.config'
import WindowDeploy from './modules/window.deploy'
import WindowKubernetes from './modules/window.kubernetes'
import WindowSDK from './modules/window.sdk'
// import WindowTest from './modules/window.test'

const menu = [
    {
        title: '框架',
        icon: 'sidebar-default',
        children: [WindowApp, WindowService, WindowDeploy, WindowKubernetes, WindowConfig, WindowSDK]
    }
]

export default menu
