import request from '@/utils/request'

export function getList() {
  return request({
    url: '/api/show_books',
    method: 'get',
  })
}

export function addbook(book_name) {
  console.log(book_name)
  return request({
    url: '/api/add_book',
    method: 'post',
    data:{"book_name":book_name}
  })
}
