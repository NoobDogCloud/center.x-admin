import ServiceApi from 'gsc-frontend-sdk/base/serviceApi'
import { QueryOptionBuilder } from 'gsc-frontend-sdk/gfw/rpc/queryOptionBuilder'
import { isObject, isString } from 'lodash'
import { ConfigTypeMap } from '@/services/configs'

export default ServiceApi.New({
    name: 'system',
    model: 'ConfigTemplates',
    headers: QueryOptionBuilder.build().desc('id').topic('system#Context').build(),
    pushHook: {
        template: v => isObject(v) ? JSON.stringify(v) : v
    },
    pullHook: {
        template: v => isString(v) ? JSON.parse(v) : v
    }
})
