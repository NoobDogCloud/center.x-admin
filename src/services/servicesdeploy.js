import ServiceApi from 'gsc-frontend-sdk/base/serviceApi'
import { QueryOptionBuilder } from 'gsc-frontend-sdk/gfw/rpc/queryOptionBuilder'

export default ServiceApi.New({
    name: 'system',
    model: 'ServicesDeploy',
    headers: QueryOptionBuilder.build().desc('id').topic('system#Context').build(),
    pushHook: {},
    pullHook: {
        datamodel: v => {
            return v ? JSON.parse(v) : v
        },
        config: v => {
            return v ? JSON.parse(v) : v
        },
        proxy_target: v => {
            return v ? JSON.parse(v) : v
        }
    }
})

export function replicaSetNumber () {
    const r = []
    for (let i = 1; i <= 10; i++) {
        r.push({
            id: i,
            name: String(i)
        })
    }
    return r
}

export function getDeploySecureText (row, column, v) {
    return v === 1 ? '是' : '否'
}
