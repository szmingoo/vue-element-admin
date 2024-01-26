import request from '@/utils/request'


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
    method: 'get',
    params: data
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
export function deleteDictDetail(id) {
  return request({
    url: '/api/delete/',
    method: 'get',
    params: {"id":id}
  })
}
