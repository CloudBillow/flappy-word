import React, { useState } from 'react'
import FlappyBird from '../FlappyBird'
import styles from '../Game/Game.module.css'
import RankList from '../Rank/RankList'
import RankButton from '../Rank/RankButton'
import { useGameContext } from '../../context/GameContext'
import LoginForm from '../LoginForm'

const Game = () => {

  const [isModalOpen, setIsModalOpen] = useState(false)
  const {GameStatus, currentGameStatus} = useGameContext()

  const openRankList = () => {
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  return (
      <div className={styles.gameContainer}>
        {(currentGameStatus === GameStatus.NOT_LOGIN) && (
            <LoginForm/>
        )}
        {(currentGameStatus === GameStatus.GAME_OVER || currentGameStatus === GameStatus.NOT_STARTED) && (
            <RankButton onClick={openRankList}/>
        )}
        {(currentGameStatus !== GameStatus.NOT_LOGIN) && (
            <FlappyBird/>
        )}
        <RankList isOpen={isModalOpen} onClose={closeModal}/>
      </div>
  )
}

export default Game
