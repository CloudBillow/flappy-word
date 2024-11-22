import React, { createContext, useContext, useState } from 'react'
import { apiPaths, post } from '../api/api'
import UserStorage from '../utils/storage'

const GameContext = createContext(null)

export const GameProvider = ({children}) => {

  // 游戏状态
  const GameStatus = {
    NOT_LOGIN: -1,
    NOT_STARTED: 0,
    COUNTDOWN: 1,
    PLAYING: 2,
    GAME_OVER: 3
  }

  const [currentGameStatus, setGameStatus] = useState(GameStatus.NOT_LOGIN)

  const changeGameStatus = (newStatus) => {
    setGameStatus(newStatus)
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
        token: data.token,
        refreshToken: data.refreshToken
      })
      changeGameStatus(GameStatus.NOT_STARTED)
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
    doLogin
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
