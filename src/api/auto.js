import request from '@/utils/request'
import qs from 'qs'

// 查询列表
export function dictDetailList(data, pageInfo) {
  return request({
    url: '/api/screen/',
    method: 'get',
    params: {"page":pageInfo.page,"limit":pageInfo.limit,"name":data.name},
  })
}


// 执行
export function autoTest(data) {
  return request({
    url: '/api/auto/',
    method: 'post',
    data:data
  })
}

// 一键
// export function autoSuite(data) {
//   return request({
//     url: '/api/testsuite/',
//     method: 'post',
//     data:data
//   })
// }


// 一键
export function autoSuite() {
  return request({
    url: '/api/testsuite/',
    method: 'post',
  })
}

