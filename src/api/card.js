import request from '@/utils/request'

/**
 * 获取月卡列表
 * @param params 参数
 * @returns {*}
 */
export function getCardListAPI(params) {
  return request({
    url: '/parking/card/list',
    method: 'get',
    params
  })
}

/**
 * 添加月卡
 * @param data
 * @returns {*}
 */
//  https://api-hmzs.itheima.net/v1/parking/card
export function addCardAPI(data) {
  return request({
    url: '/parking/card',
    // 大小写无所谓
    method: 'POST',
    data
  })
}

/**
 * 根据路径传回的id获取月卡详情
 * @param id 月卡id
 * @returns {*}
 */
//  https://api-hmzs.itheima.net/v1/parking/card/detail/{id}
export function getCardDetailByIdAPI(id) {
  return request({
    url: `/parking/card/detail/${id}`,
    method: 'get',
    id
  })
}

/**
 * 更新月卡
 * @param data
 * @returns {AxiosPromise}
 */
//  https://api-hmzs.itheima.net/v1/parking/card/edit
export function editCardAPI(data) {
  return request({
    url: '/parking/card/edit',
    method: 'PUT',
    data
  })
}

/**
 * 删除月卡
 * @param id
 * @returns {*}
 */
// https://api-hmzs.itheima.net/v1/parking/card/{ids}
export function deleteCardAPI(id) {
  return request({
    url: `/parking/card/${id}`,
    method: 'DELETE',
    id
  })
}

