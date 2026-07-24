import request from './request'

export const login = (data) => {
  return request.post('/auth/login', data)
}

export const getUserInfo = () => {
  return request.get('/auth/userinfo')
}

export const getMenus = () => {
  return request.get('/auth/menus')
}

export const changePassword = (data) => {
  return request.put('/auth/password', data)
}
