/**
 * 用户信息存储工具类
 * 使用 localStorage 实现浏览器关闭后的数据持久化
 */
class UserStorage {

  static USER_KEY = 'flappy_word_user'

  /**
   * 保存用户信息
   * @param {Object} userInfo - 用户信息对象
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
   * @returns {Object|null} 用户信息对象，如果不存在返回null
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
   * 清除用户信息
   */
  static clearUserInfo() {
    try {
      localStorage.removeItem(this.USER_KEY)
    } catch(error) {
      console.error('清除用户信息失败:', error)
    }
  }

  /**
   * 更新部分用户信息
   * @param {Object} partialInfo - 需要更新的部分用户信息
   */
  static updateUserInfo(partialInfo) {
    try {
      const currentInfo = this.getUserInfo() || {}
      const updatedInfo = {...currentInfo, ...partialInfo}
      this.saveUserInfo(updatedInfo)
    } catch(error) {
      console.error('更新用户信息失败:', error)
    }
  }
}

export default UserStorage
