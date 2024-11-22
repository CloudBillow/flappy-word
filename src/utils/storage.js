import { STORAGE_PREFIX, VERSION_KEY, USER_KEY } from '../constants'

/**
 * 获取用户信息
 * @returns {Object|null} 用户信息
 */
export const getUserInfo = () => {
  try {
    const userInfo = localStorage.getItem(USER_KEY)
    return userInfo ? JSON.parse(userInfo) : null
  } catch(error) {
    console.error('获取用户信息失败:', error)
    return null
  }
}

/**
 * 保存用户信息
 * @param {Object} userInfo - 用户信息对象
 */
export const saveUserInfo = (userInfo) => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(userInfo))
  } catch(error) {
    console.error('保存用户信息失败:', error)
  }
}

/**
 * 清除用户信息
 */
export const clearUserInfo = () => {
  try {
    localStorage.removeItem(USER_KEY)
  } catch(error) {
    console.error('清除用户信息失败:', error)
  }
}

/**
 * 清除游戏相关存储
 */
export const clearGameStorage = () => {
  try {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error('清除本地存储时出错:', error)
  }
}

/**
 * 获取版本信息
 */
export const getVersion = () => {
  try {
    return localStorage.getItem(VERSION_KEY)
  } catch (error) {
    console.error('获取版本信息时出错:', error)
    return null
  }
}

/**
 * 设置版本信息
 */
export const setVersion = (version) => {
  try {
    localStorage.setItem(VERSION_KEY, version)
  } catch (error) {
    console.error('设置版本信息时出错:', error)
  }
}
