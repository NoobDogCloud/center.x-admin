import ServiceApi from 'gsc-frontend-sdk/base/serviceApi'
import { isString } from 'lodash'

export default ServiceApi.New({
    name: 'system',
    model: 'SdkManager',
    pullHook: {
        dependencies_template: v => (isString(v) ? JSON.parse(v) : v)
    }
})

