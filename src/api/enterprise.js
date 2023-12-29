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

/**
 * 更新企业
 * @param data
 * @returns {AxiosPromise}
 */
//  https://api-hmzs.itheima.net/v1/park/enterprise
export function updateEnterpriseAPI(data) {
  return request({
    url: '/park/enterprise',
    method: 'PUT',
    data
  })
}
//  https://api-hmzs.itheima.net/v1/park/enterprise/{id}
export function deleteEnterpriseByIdAPI(id) {
  return request({
    url: `/park/enterprise/${id}`,
    method: 'DELETE',
    id
  })
}

/**
 * 添加合同
 * @param data 参数
 * @returns {*}
 */
//  https://api-hmzs.itheima.net/v1/park/enterprise/rent
export function addRentAPI(data) {
  return request({
    url: '/park/enterprise/rent',
    method: 'POST',
    data
  })
}

/**
 * 获取可租赁楼宇
 * @returns {*}
 */
//  https://api-hmzs.itheima.net/v1/park/rent/building
export function getRentBuildingAPI() {
  return request({
    url: '/park/rent/building',
    method: 'GET'
  })
}

/**
 * 根据id展开查看企业租赁信息列表
 * @param id
 * @returns {*}
 */
//  https://api-hmzs.itheima.net/v1/park/enterprise/rent/{id}
export function getDetailByIdAPI(id) {
  return request({
    url: `/park/enterprise/rent/${id}`,
    method: 'GET',
    id
  })
}

