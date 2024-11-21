import axios from 'axios'
import UserStorage from '../utils/storage'
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
      if (UserStorage.getUserInfo()) {
        config.headers['Authorization'] = 'Bearer ' + UserStorage.getUserInfo().token
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
      if (response.data.code === 40001) {
        try {
          const userInfo = UserStorage.getUserInfo()
          if (!userInfo?.name || !userInfo?.code) {
            await MyAlert('登录信息已失效，请重新登录')
            return Promise.reject('登录信息已失效')
          }

          // 重新登录
          const loginData = await post(apiPaths.LOGIN, {
            username: userInfo.name,
            code: userInfo.code
          })

          // 更新存储的用户信息
          UserStorage.saveUserInfo({
            name: userInfo.name,
            code: userInfo.code,
            userId: loginData.userId,
            token: loginData.token
          })

          // 使用新 token 重试原始请求
          const config = response.config
          config.headers['Authorization'] = 'Bearer ' + loginData.token
          // 重试请求
          return apiClient(config)

        } catch(error) {
          console.error('重新登录失败:', error)
          await MyAlert('重新登录失败，请刷新页面重试')
          return Promise.reject(error)
        }
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
      return Promise.reject(error)
    }
)

const API_PATHS = {
  RANK_LIST: '/flappyword/ranking',
  LOGIN: '/flappyword/login',
  UPLOAD_SCORE: '/flappyword/ranking',
  MY_RANK: '/flappyword/ranking/current'
}

export const post = (url, data) => apiClient.post(url, data)

export const get = (url, params) => apiClient.get(url, {params})

export const apiPaths = API_PATHS
