// API头
export const API_BASEURL = '/pms-service'
export const API_TIMEOUT = 3600000
// 静态目录
export const STATIC_PATH = (process.env.NODE_ENV === 'production') ? './static/' : '/static/'
