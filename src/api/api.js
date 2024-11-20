import axios from 'axios'

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
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
)

apiClient.interceptors.response.use(
    (response) => {
      if (response.data.code === 200) {
        return response.data.data // 直接返回响应数据
      } else {
        console.warn('API 请求失败:', response.data.message)
      }
    },
    (error) => {
      console.error('API 请求失败:', error.response || error.message)
      return Promise.reject(error)
    }
)

const API_PATHS = {
  RANK_LIST: '/flappyword/ranking'
}

export const post = (url, data) => apiClient.post(url, data)

export const get = (url, params) => apiClient.get(url, {params})

export const put = (url, data) => apiClient.put(url, data)

export const del = (url) => apiClient.delete(url)

export const apiPaths = API_PATHS
