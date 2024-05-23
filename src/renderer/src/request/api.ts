import instance from './request'

export const logoutAPI = () => instance.get('/users/logout')
