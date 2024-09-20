import React from 'react'
import styles from './GameOver.module.css'

const GameOver = ({score, passedCount}) => (
    <div className={styles.gameOver}>
      <span className={styles.title}>游戏结束</span>
      <table className={styles.scoreTable}>
        <tbody>
        <tr>
          <td>得分:</td>
          <td>{score}</td>
        </tr>
        </tbody>
        <tbody>
        <tr>
          <td>通过:</td>
          <td>{passedCount}</td>
        </tr>
        </tbody>
      </table>
      <span className={styles.replay}>
        按下空格重新开始
      </span>
    </div>
)

export default GameOver
