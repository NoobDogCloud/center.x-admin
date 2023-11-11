import ServiceApi from 'gsc-frontend-sdk/base/serviceApi'
import { GscEncrypt } from 'gsc-frontend-sdk/gfw/encode/GscEncrypt'
import { QueryOptionBuilder } from 'gsc-frontend-sdk/gfw/rpc/queryOptionBuilder'

export const ConfigTypeMap = [
    {
        key: 'db',
        name: '数据库'
    },
    {
        key: 'cache',
        name: '缓存'
    },
    {
        key: 'store',
        name: '存储'
    },
    {
        key: 'mq',
        name: '队列'
    },
    {
        key: 'streamComputer',
        name: '流计算'
    },
    {
        key: 'blockComputer',
        name: '块计算'
    },
    {
        key: 'other',
        name: '自定义'
    },
    {
        key: 'null',
        name: '无'
    }
]

export default ServiceApi.New({
    name: 'system',
    model: 'Configs',
    headers: QueryOptionBuilder.build().asc('id').topic('system#Context').build(),
    pushHook: {
        config: v => {
            // json 转 gsc-json
            const _v = v || {}
            return GscEncrypt.encodeJson(_v)
            // return JSON.stringify(v)
        }
    },
    pullHook: {
        type: v => {
            for (const item of ConfigTypeMap) {
                if (item.key === String(v)) {
                    return item.name
                }
            }
            return `不支持分类${v}`
        },
        config: v => {
            // json 转 gsc-json
            const _v = v || "{}"
            return GscEncrypt.decodeJson(_v)
            // return JSON.parse(v)
        }
    }
})
