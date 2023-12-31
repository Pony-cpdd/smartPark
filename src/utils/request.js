import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
// 创建axios实例，通过实例请求接口
const service = axios.create({
  // baseURL：基地址（每个接口都有的地址），作用：后面封装的接口都会和baseURL自动拼接到一起
  baseURL: 'https://api-hmzs.itheima.net/v1',
  // 超时时间
  timeout: 5000 // request timeout
})

// 请求拦截器
// 发送请求时执行
service.interceptors.request.use(
  config => {
    // connfig携带的是请求信息，return不可省略 通常带token
    // 鉴权处理
    const token = store.state.user.token
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
// 服务器端返回数据时，数据流转的第一站
service.interceptors.response.use(
  response => {
    // 响应成功2xx
    return response.data
  },
  error => {
    // 响应失败4xx-5xx
    // console.dir(error)
    // 做拦截器接口统一错误处理
    // 判断token是否过期
    if (error.response.status === 401) {
      store.commit('user/removeToken')
      router.push('/login')
    }
    Message.error(error.response.data.msg)
    return Promise.reject(error)
  }
)

export default service
