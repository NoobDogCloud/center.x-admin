import ServiceApi from 'gsc-frontend-sdk/base/serviceApi'
import { isString } from 'lodash'
import { QueryOptionBuilder } from 'gsc-frontend-sdk/gfw/rpc/queryOptionBuilder'

export default ServiceApi.New({
    name: 'system',
    model: 'Apps',
    headers: QueryOptionBuilder.build().desc('createat').topic('system#Context').build(),
    pullHook: {
        config: v => (isString(v) ? JSON.parse(v) : v)
    }
})

export const SessionTypeOptions = [
    { key: 'jwt', value: 'jwt', label: 'JWT' },
    { key: 'redis', value: 'redis', label: '会话模式' },
    { key: '', value: '', label: '未设置' }
]

export const AppPublishOptions = [
    {
        key: 'gateway-service',
        value: 'gateway-service',
        label: '网关模式'
    },
    {
        key: 'secgateway-service',
        value: 'secgateway-service',
        label: '安全网关'
    },
    {
        key: 'node-service',
        value: 'node-service',
        label: '服务网格'
    },
    {
        key: 'no-publish',
        value: 'no-publish',
        label: '不发布'
    }
]

export function getAppPublishText(v) {
    const item = AppPublishOptions.find(item => item.value === v)
    return item ? item.label : ''
}

