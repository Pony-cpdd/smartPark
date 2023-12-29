import request from '@/utils/request'

/**
 * 获取企业列表
 * @param params
 * @returns {*}
 */
// https://api-hmzs.itheima.net/v1/park/enterprise
export function getEnterpriseListAPI(params) {
  return request({
    url: '/park/enterprise',
    method: 'GET',
    params
  })
}

/**
 * 获取行业下拉列表
 * @param params
 * @returns {AxiosPromise}
 */
//  https://api-hmzs.itheima.net/v1/park/industry
export function getIndustryListAPI(params) {
  return request({
    url: '/park/industry',
    method: 'GET',
    params
  })
}

/**
 * 添加企业
 * @param data 参数
 * @returns {AxiosPromise}
 */
//  https://api-hmzs.itheima.net/v1/park/enterprise
export function addEnterpriseAPI(data) {
  return request({
    url: '/park/enterprise',
    method: 'POST',
    data
  })
}

/**
 * 根据id查询企业
 * @param id
 * @returns {*}
 */
//  https://api-hmzs.itheima.net/v1/park/enterprise/{id}
export function getEnterpriseByIdAPI(id) {
  return request({
    url: `/park/enterprise/${id}`,
    method: 'GET',
    id
  })
}

