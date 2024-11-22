/**
 * 用户信息存储工具类
 */
class UserStorage {

  static USER_KEY = 'flappy_word_user'

  /**
   * 保存用户信息
   */
  static saveUserInfo(userInfo) {
    try {
      localStorage.setItem(this.USER_KEY, JSON.stringify(userInfo))
    } catch(error) {
      console.error('保存用户信息失败:', error)
    }
  }

  /**
   * 获取用户信息
   */
  static getUserInfo() {
    try {
      const userInfo = localStorage.getItem(this.USER_KEY)
      return userInfo ? JSON.parse(userInfo) : null
    } catch(error) {
      console.error('获取用户信息失败:', error)
      return null
    }
  }

  /**
   * 登录过期
   */
  static clearUserInfo() {
    try {
      localStorage.removeItem(this.USER_KEY)
    } catch(error) {
      console.error('清除用户信息失败:', error)
    }
  }
}

export default UserStorage
