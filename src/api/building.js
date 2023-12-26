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
