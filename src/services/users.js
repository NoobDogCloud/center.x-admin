import ServiceApi from 'gsc-frontend-sdk/base/serviceApi'
import { QueryOptionBuilder } from 'gsc-frontend-sdk/gfw/rpc/queryOptionBuilder'

export default ServiceApi.New({
    name: 'system',
    model: 'Users',
    header: QueryOptionBuilder.build().desc('createat').build(),
    pushHook: {},
    pullHook: {}
})
