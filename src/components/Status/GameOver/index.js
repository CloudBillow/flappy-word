import React from 'react'
import styles from './GameOver.module.css'
import ForStart from '../ForStart'
import { post, apiPaths } from '../../../api/api'
import { useEffect } from 'react'
import UserStorage from '../../../utils/storage'

const GameOver = ({score, passedCount}) => {

  // 上传分数
  const uploadScore = async() => {
    const userInfo = UserStorage.getUserInfo()
    try {
      await post(apiPaths.UPLOAD_SCORE, {
        userId: userInfo.userId,
        score: score,
        hurdle: passedCount
      })
    } catch(error) {
      console.error('上传分数失败:', error)
    }
  }

  useEffect(() => {
    uploadScore()
  }, [])

  return (
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
            <td>穿过:</td>
            <td>{passedCount}</td>
          </tr>
          </tbody>
        </table>
        <ForStart
            className={styles.reStart}
            message={'按下空格重新开始'}
        />
      </div>
  )
}

export default GameOver
