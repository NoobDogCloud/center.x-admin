import ServiceApi from 'gsc-frontend-sdk/base/serviceApi'
import { GscEncrypt } from 'gsc-frontend-sdk/gfw/encode/GscEncrypt'
import { QueryOptionBuilder } from 'gsc-frontend-sdk/gfw/rpc/queryOptionBuilder'

export default ServiceApi.New({
    name: 'system',
    model: 'Cluster',
    headers: QueryOptionBuilder.build().desc('id').topic('system#Context').build(),
    pushHook: {
        config: v => GscEncrypt.encodeString(v),
        registry: v => GscEncrypt.encodeString(v)
    },
    pullHook: {
        config: v => GscEncrypt.decodeString(v),
        registry: v => GscEncrypt.decodeString(v)
    }
})
