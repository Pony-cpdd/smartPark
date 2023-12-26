import request from '@/utils/request'

// https://api-hmzs.itheima.net/v1/park/sys/user
/**
 * 获取员工列表
 * @param params
 * @returns {*}
 */
export function getEmployeeListAPI(params) {
  return request({
    url: '/park/sys/user',
    method: 'get',
    params
  })
}
