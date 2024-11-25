import axios from 'axios'
import { clearUserInfo, getUserInfo, saveUserInfo } from '../utils/storage'
import MyAlert from '../components/MyAlert'

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
apiClient.interceptors.request.use(
    (config) => {
      if (getUserInfo()) {
        config.headers['Authorization'] = 'Bearer ' + getUserInfo().token
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
)

apiClient.interceptors.response.use(
    async(response) => {

      // 处理 token 过期
      if (response.data.code === 40003) {
        try {
          const userInfo = getUserInfo()
          if (!userInfo?.name || !userInfo?.code) {
            return Promise.reject('登录信息已失效')
          }

          // 重新登录
          const data = await post(apiPaths.REFRESH_TOKEN, {
            refreshToken: userInfo.refreshToken
          })

          // 更新存储的用户信息
          saveUserInfo({
            ...userInfo,
            token: data.token
          })

          // 使用新 token 重试原始请求
          const config = response.config
          config.headers['Authorization'] = 'Bearer ' + data.token
          // 重试请求
          console.log('重新登录中...')
          return apiClient(config)

        } catch(error) {
          console.error('重新登录失败:', error)
          return Promise.reject(error)
        }
      }

      if (response.data.code === 40004 || response.data.code === 401) {
        // 登录过期退出到登录页
        clearUserInfo()
        await MyAlert('登录已过期，请重新登录')
        return
      }

      // 其他正常响应处理
      if (response.data.code === 200) {
        return response.data.data
      } else {
        await MyAlert(response.data.message)
        console.warn('API 请求失败:', response.data.message)
        return Promise.reject(response.data.message)
      }
    },
    (error) => {
      console.error('API 请求失败:', error.response || error.message)
      MyAlert('系统异常')
    }
)

const API_PATHS = {
  RANK_LIST: '/flappyword/ranking',
  LOGIN: '/flappyword/login',
  UPLOAD_SCORE: '/flappyword/ranking',
  MY_RANK: '/flappyword/ranking/current',
  REFRESH_TOKEN: '/flappyword/login/refreshToken'
}

export const post = (url, data) => apiClient.post(url, data)

export const get = (url, params) => apiClient.get(url, {params})

export const apiPaths = API_PATHS
