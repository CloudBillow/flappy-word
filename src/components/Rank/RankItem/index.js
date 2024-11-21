import React from 'react'
import styles from './RankItem.module.css'

const RankItem = ({ rank, item }) => {
  return (
      <div className={styles.row}>
        <p className={styles.cell}>{rank}</p>
        <p className={styles.nameCell}>{item.name}</p>
        <p className={styles.cell}>{item.score}</p>
        <p className={styles.cell}>{item.hurdle}</p>
      </div>
  )
}

export default RankItem
