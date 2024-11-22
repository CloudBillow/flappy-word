import React, { useEffect, useState } from 'react'
import styles from './MyRank.module.css'
import { apiPaths, get } from '../../../api/api'
import { getUserInfo } from '../../../utils/storage'
import { useGameContext } from '../../../context/GameContext'

const MyRank = () => {

  const [myRank, setMyRank] = useState({})
  const {GameStatus, changeGameStatus} = useGameContext()
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const userInfo = getUserInfo(() => {
      changeGameStatus(GameStatus.NOT_LOGIN);
    });
    if (userInfo) {
      setUserName(userInfo.name);
    }
  }, [changeGameStatus]);

  useEffect(() => {
    get(apiPaths.MY_RANK)
        .then((data) => {
          if (data == null) {
            data = {}
          }
          setMyRank(data)
        })
        .catch(() => {
          setMyRank({})
        })
  }, [])

  const renderRank = () => {
    const rank = myRank.number
    if (!rank) return '-'
    if (rank > 0 && rank <= 3) {
      return (
          <img
              src={`/img/rank_${rank}.png`}
              alt={`第${rank}名`}
              className={styles.rankIcon}
          />
      )
    }
    return <p className={styles.cell}>{rank === 0 ? '-' : rank}</p>
  }

  return (
      <div className={styles.row}>
        <div className={styles.cell}>
          {renderRank()}
        </div>
        <p className={styles.nameCell}>{userName}</p>
        <p className={styles.cell}>{myRank.score || '-'}</p>
        <p className={styles.cell}>{myRank.hurdle || '-'}</p>
      </div>
  )
}

export default MyRank
