import { defineStore } from 'pinia'
import { piniaStore } from '@/store'
import storage from '@/util/storage'
import usersApi from '@/services/users'
import _ from 'lodash'

import { useMenuStore } from './menu'
import { useWindowStore } from './window'
import { GscSession } from 'gsc-frontend-sdk/gfw/appliction/session'

const session = GscSession.getInstance()
GscSession.setStoreGetter((keyOrData) => {
    let data = JSON.parse(storage.local.get('user_info') ?? '{}')
    if (_.isString(keyOrData)) {
        return data[keyOrData]
    } else {
        return data
    }
})
GscSession.setStoreSetter((keyOrData, value) => {
    let data = JSON.parse(storage.local.get('user_info') ?? '{}')
    if (_.isString(keyOrData)) {
        data[keyOrData] = value
        storage.local.set('user_info', JSON.stringify(data))
    } else {
        storage.local.set('user_info', JSON.stringify(keyOrData))
    }
})

// const api = RpcClient.New(config.framework)
export const useUserStore = defineStore(
    // 唯一ID
    'user',
    {
        state: () => ({
            account: session.info()?.userid ?? '',
            // token: session.getSID() ?? '',
            token: session.info()?.token ?? '',
            failure_time: session.info()?.failure_times ?? '',
            permissions: []
        }),
        getters: {
            isLogin: state => {
                let retn = false
                if (state.token) {
                    if (new Date().getTime() < state.failure_time * 1000) {
                        retn = true
                        session.build(session.info().token, session.info())
                    }
                }
                return retn
            }
        },
        actions: {
            login (data) {
                return new Promise((resolve, reject) => {
                    usersApi.login(data.account, data.password).then(res => {
                        this.setUserData(res.getRecord())
                        resolve()
                    })
                        .catch(error => {
                            reject(error)
                        })
                })
            },
            async logout () {
                const menu = useMenuStore()
                const window = useWindowStore()
                this.removeUserData()
                menu.switchHeaderActived(0, { root: true })
                menu.removeMenus(null, { root: true })
                window.removeAll(null, { root: true })
                // await api.setPath('users', 'logout').post('') // 需要账号
            },
            // 获取我的权限
            getPermissions () {
                // 暂时不用
                const permissions = ['permission.browse', 'permission.create', 'permission.edit', 'permission.remove']
                this.setPermissions(permissions)
            },
            setUserData (data) {
                session.build(data.token, data)
                this.account = session.info()?.userid ?? ''
                this.token = session.getSID() ?? ''
                this.failure_time = session.info()?.failure_time ?? ''
            },
            removeUserData () {
                this.account = ''
                this.token = ''
                this.failure_time = ''

                session.destroy()
            },
            setPermissions (permissions) {
                this.permissions = permissions
            }
        }
    }
)

export function useUserOutsideStore () {
    return useUserStore(piniaStore)
}
