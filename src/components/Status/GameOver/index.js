import React, { useEffect } from 'react'
import styles from './GameOver.module.css'
import ForStart from '../ForStart'
import { post, apiPaths } from '../../../api/api'
import { getUserInfo } from '../../../utils/storage'
import { encrypt } from '../../../utils/crypto';

const GameOver = ({ score, passedCount, userAction }) => {

  useEffect(() => {
    let isSubscribed = true

    const uploadScore = async () => {
      const userInfo = getUserInfo()
      if (!userInfo?.userId) {
        console.warn('未找到用户信息')
        return
      }

      try {
        if (isSubscribed) {
          const track = encrypt(JSON.stringify(userAction))
          await post(apiPaths.UPLOAD_SCORE, {
            userId: userInfo.userId,
            score: score,
            hurdle: passedCount,
            track: track
          })
        }
      } catch (error) {
        if (isSubscribed) {
          console.error('上传分数失败:', error)
        }
      }
    }

    uploadScore()

    return () => {
      isSubscribed = false
    }
  }, []) // 空依赖数组，只在组件挂载时执行一次

  return (
      <div className={styles.gameOver}>
        <span className={styles.title}>游戏结束</span>
        <table className={styles.scoreTable}>
          <tbody>
          <tr>
            <td>得分:</td>
            <td>{score}</td>
          </tr>
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

export default React.memo(GameOver)
