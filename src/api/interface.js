import request from '@/utils/request'
import qs from 'qs'

// 查询列表
export function dictDetailList(data, pageInfo) {
  return request({
    url: '/api/search/',
    method: 'get',
    params: {"page":pageInfo.page,"limit":pageInfo.limit,"name":data.name},
  })
}

// 新增
export function createDictDetail(data) {
  return request({
    url: '/api/add/',
    method: 'post',
    data
  })
}

export function updateDictDetail(data) {
  return request({
    url: '/api/update/',
    method: 'post',
    data: data
  })
}


// 删除
export function deleteDictDetail(data) {
  return request({
    url: '/api/delete/',
    method: 'post',
    data:data
  })
}

// 发送
export function sendDictDetail(data) {
  return request({
    url: '/api/send/',
    method: 'post',
    data: data,
  })
}

//
export function autoTest(data) {
  return request({
    url: '/api/auto/',
    method: 'post',
    data:data
  })
}
