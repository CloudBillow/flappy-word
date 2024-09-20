import React from 'react'
import styles from './GameOver.module.css'

const GameOver = ({score}) => (
    <div className={styles.gameOver}>
      游戏结束<br/>
      分数: {score}<br/>
      <p className={styles.replay}>
        按下空格重新开始
      </p>
    </div>
)

export default GameOver
