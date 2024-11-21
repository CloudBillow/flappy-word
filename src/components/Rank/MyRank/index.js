import React from 'react'
import styles from './MyRank.module.css'


const MyRank = ({item}) => {
  return (
      <div className={styles.row}>
        <p className={styles.cell}>{item.rank}</p>
        <p className={styles.nameCell}>{item.name}</p>
        <p className={styles.cell}>{item.score}</p>
        <p className={styles.cell}>{item.hurdle}</p>
      </div>
  )
}

export default MyRank
