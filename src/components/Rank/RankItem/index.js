import React from 'react'
import styles from './RankItem.module.css'

const RankItem = ({rank, item}) => {
  const renderRank = () => {
    if (rank <= 3) {
      return (
          <img
              src={`/img/rank_${rank}.png`}
              alt={`第${rank}名`}
              className={styles.rankIcon}
          />
      )
    }
    return <p className={styles.cell}>{rank}</p>
  }

  return (
      <div className={styles.row}>
        <div className={styles.cell}>
          {renderRank()}
        </div>
        <p className={styles.nameCell}>{item.name}</p>
        <p className={styles.cell}>{item.score}</p>
        <p className={styles.cell}>{item.hurdle}</p>
      </div>
  )
}

export default RankItem
