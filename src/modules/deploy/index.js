// 服务部署模块

import axios from 'axios'

// 检测服务访问通断
export const checkServicePing = (url, cb) => {
    console.log('heart', url)
    axios
        .get('http://' + url + '/@heart')
        .then(res => {
            console.log(res.data)
            cb(String(res.data) === '1')
        })
        .catch(err => {
            console.error(err)
            cb(undefined, err)
        })
}
