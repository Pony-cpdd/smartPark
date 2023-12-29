import request from '@/utils/request'

/**
 * 获取楼宇列表
 * @param params
 * @returns {*}
 */
//  https://api-hmzs.itheima.net/v1/park/building
export function getBuildingListAPI(params) {
  return request({
    url: '/park/building',
    method: 'get',
    params
  })
}

/**
 * 添加楼宇
 * @param data
 * @returns {AxiosPromise}
 */
//  https://api-hmzs.itheima.net/v1/park/building
export function addBuildingAPI(data) {
  return request({
    url: '/park/building',
    method: 'POST',
    data
  })
}

/**
 * 根据id删除楼宇
 * @param id
 * @returns {*}
 */
//  https://api-hmzs.itheima.net/v1/park/building/{id}
export function deleteBuildingByIdAPI(id) {
  return request({
    url: `/park/building/${id}`,
    method: 'DELETE',
    id
  })
}

/**
 * 更新楼宇信息
 * @param data
 * @returns {AxiosPromise}
 */
//  https://api-hmzs.itheima.net/v1/park/building
export function editBuildingAPI(data) {
  return request({
    url: '/park/building',
    method: 'PUT',
    data
  })
}

