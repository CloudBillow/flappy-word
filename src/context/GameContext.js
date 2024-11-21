import React, { createContext, useContext, useEffect, useState } from 'react'

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

  const value = {
    GameStatus,
    currentGameStatus,
    changeGameStatus
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
