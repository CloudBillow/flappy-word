import React, { useEffect, useState } from 'react'
import styles from './LoginForm.module.css'
import { useGameContext } from '../../context/GameContext'
import UserStorage from '../../utils/storage'
import MyAlert from '../MyAlert'

const LoginForm = () => {
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const {GameStatus, changeGameStatus, doLogin} = useGameContext()

  useEffect(() => {
    checkLogin()
  }, [])

  const checkLogin = async() => {
    const userInfo = UserStorage.getUserInfo()
    if (userInfo != null) {
      changeGameStatus(GameStatus.NOT_STARTED)
      return true
    }
    setIsLoading(false)
  }

  const handleSubmit = async () => {
    if (name.length <= 0) {
      await MyAlert('速速报上名来')
      return
    }
    if (code.length !== 6) {
      await MyAlert('请确保校验码为6位数字！')
      return
    }
    if (name.length > 10) {
      await MyAlert('名字太长了，我有点记不住...')
      return
    }
    doLogin(name, code)
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
