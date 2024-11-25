import React, { createContext, useContext, useState, useEffect } from 'react'
import { getUserInfo, saveUserInfo } from '../utils/storage'
import { apiPaths, post } from '../api/api'

const GameContext = createContext(null)

export const GameProvider = ({children}) => {
  const GameStatus = {
    NOT_LOGIN: -1,
    NOT_STARTED: 0,
    COUNTDOWN: 1,
    PLAYING: 2,
    GAME_OVER: 3
  }

  const [currentGameStatus, setGameStatus] = useState(GameStatus.NOT_LOGIN)
  const [isLogin, setIsLogin] = useState(false)

  // 在 context 中添加登录状态检查
  const checkLoginStatus = () => {
    const userInfo = getUserInfo()
    if (!userInfo) {
      setIsLogin(false)
      setGameStatus(GameStatus.NOT_LOGIN)
      return false
    }
    setIsLogin(true)
    if (currentGameStatus === GameStatus.NOT_LOGIN) {
      setGameStatus(GameStatus.NOT_STARTED)
    }
    return true
  }

  // 组件挂载时和状态更新时检查登录状态
  useEffect(() => {
    checkLoginStatus()
  }, [])

  const changeGameStatus = (newStatus) => {
    // 在改变游戏状态时检查登录状态
    if (newStatus !== GameStatus.NOT_LOGIN && !checkLoginStatus()) {
      return
    }
    setGameStatus(newStatus)
  }

  const doLogin = async(name, code) => {
    try {
      const data = await post(apiPaths.LOGIN, {
        username: name,
        code: code
      })
      saveUserInfo({
        name: name,
        code: code,
        userId: data.userId,
        token: data.token,
        refreshToken: data.refreshToken
      })
      setIsLogin(true)
      setGameStatus(GameStatus.NOT_STARTED)
      return true
    } catch(e) {
      console.log('登录失败', e)
      return false
    }
  }

  const value = {
    GameStatus,
    currentGameStatus,
    changeGameStatus,
    doLogin,
    isLogin,
    checkLoginStatus  // 导出检查函数供组件使用
  }

  return (
      <GameContext.Provider value={value}>
        {children}
      </GameContext.Provider>
  )
}

export const useGameContext = () => {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameContext')
  }
  return context
}
