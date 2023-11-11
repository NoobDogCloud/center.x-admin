import ServiceApi from 'gsc-frontend-sdk/base/serviceApi'
import {QueryOptionBuilder} from 'gsc-frontend-sdk/gfw/rpc/queryOptionBuilder'

export default ServiceApi.New({
    name: 'system',
    model: 'Services',
    headers: QueryOptionBuilder.build().desc('id').topic('system#Context').build()
})

export const NetProtocolOption = [
    {
        key: 'TCP',
        value: 'TCP',
        label: 'TCP'
    },
    {
        key: 'UDP',
        value: 'UDP',
        label: 'UDP'
    }
]

export const TransferOptions = [
    {
        key: 'http',
        value: 'http',
        label: 'http'
    },
    {
        key: 'mq',
        value: 'mq',
        label: '消息队列'
    },
    {
        key: 'https',
        value: 'https',
        label: 'https'
    }
]

export const ServiceCategoryOptions = [
    {
        key: 'classic',
        value: 'classic',
        label: '普通服务'
    },
    {
        key: 'gateway',
        value: 'gateway',
        label: '网关服务'
    }
]

export const ServiceKindOptions = [
    {
        key: 'data',
        value: 'data',
        label: '数据服务'
    },
    {
        key: 'portal',
        value: 'portal',
        label: '入口服务'
    },
    {
        key: 'sec-gateway',
        value: 'sec-gateway',
        label: '安全网关服务'
    },
    {
        key: 'gateway',
        value: 'gateway',
        label: '网关服务'
    },
    {
        key: 'user',
        value: 'user',
        label: '用户服务'
    },
    {
        key: 'system',
        value: 'system',
        label: '系统服务'
    }
]

export const PublishOptions = [
    {
        id: 0,
        name: '集群内部'
    },
    {
        id: 1,
        name: '集群节点'
    },
    {
        id: 2,
        name: '负载均衡'
    }
]

export function getPublishText(v) {
    const item = PublishOptions.find(item => item.value === v)
    return item ? item.name : ''
}
