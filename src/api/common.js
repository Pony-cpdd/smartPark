import request from '@/utils/request'

/**
 * 上传文件
 * @param data
 * @returns {AxiosPromise}
 */
//  https://api-hmzs.itheima.net/v1/upload
export function upload(data) {
  return request({
    url: '/upload',
    method: 'POST',
    data
  })
}
