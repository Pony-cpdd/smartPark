import request from '@/utils/request'

// 登录函数
/**
 * @description: 登录函数
 * @param {*} data { mobile,password}
 * @return {*} promise
 */
export function loginAPI(data) {
  // return request.post('/park/login',data)
  // 等同于↓
  return request({
    url: '/park/login',
    method: 'POST',
    data
  })
}
// 做测试用，判断cookie失效时重新登录
export function getIndustryAPI() {
  return request({
    url: 'park/industry'
  })
}
