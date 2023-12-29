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

/**
 * 添加员工
 * @param data
 * @returns {AxiosPromise}
 */
//  https://api-hmzs.itheima.net/v1/park/sys/user
export function addEmployeeAPI(data) {
  return request({
    url: '/park/sys/user',
    method: 'POST',
    data
  })
}

/**
 * 获取角色列表
 * @param params
 * @returns {AxiosPromise}
 */
//  https://api-hmzs.itheima.net/v1/park/sys/role
export function getRoleListAPI(params) {
  return request({
    url: '/park/sys/role',
    method: 'GET',
    params
  })
}
