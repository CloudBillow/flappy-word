import React, { useEffect, useState } from 'react'
import styles from './LoginForm.module.css'
import { useGameContext } from '../../context/GameContext'
import { post, apiPaths } from '../../api/api'
import UserStorage from '../../utils/storage'

const LoginForm = () => {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(true)  // 添加加载状态
  const {GameStatus, changeGameStatus} = useGameContext()

  useEffect(() => {
    checkLogin()
  }, [])

  const checkLogin = async() => {
    const userInfo = UserStorage.getUserInfo()
    if (userInfo != null) {
      await doLogin(userInfo.name, userInfo.code)
      return true
    }
    setIsLoading(false) // 如果没有用户信息，将加载状态设为 false，显示登录框
  }

  const handleSubmit = () => {
    if (name.length <= 0) {
      alert('速速报上名来')
      return
    }
    if (code.length !== 6) {
      alert('请确保校验码为6位数字！')
      return
    }
    if (name.length > 10) {
      alert('名字太长了，我有点记不住...')
      return
    }
    alert(`欢迎，${name}！请牢记您的校验码：${code}`)
    doLogin(name, code)
  }

  const doLogin = async(name, code) => {
    try {
      const data = await post(apiPaths.LOGIN, {
        username: name,
        code: code
      })
      // 登录成功后保存用户信息
      UserStorage.saveUserInfo({
        name: name,
        code: code,
        userId: data.userId,
        token: data.token
      })
      changeGameStatus(GameStatus.NOT_STARTED)
    } catch(error) {
      console.error('登录失败:', error)
      setIsLoading(false) // 如果登录失败，显示登录框
    }
  }

  // 如果正在加载，不渲染任何内容
  if (isLoading) {
    return null
  }

  return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <h2 className={styles.title}>来者何人</h2>
          <div className={styles.table}>
            {/* 输入框：名字 */}
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="起个名字吧"
                className={styles.input}
            />

            {/* 输入框：验证码 */}
            <input
                type="number"
                value={code}
                onChange={(e) =>
                    e.target.value.length <= 6 && setCode(e.target.value)
                }
                placeholder="输入6位数字用于验证"
                className={styles.input}
            />

            {/* 进入按钮 */}
            <button onClick={handleSubmit} className={styles.button}>
              进入
            </button>
          </div>
        </div>
      </div>
  )
}

export default LoginForm
