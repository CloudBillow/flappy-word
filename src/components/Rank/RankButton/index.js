import React from 'react'
import styles from './RankButton.module.css'


const RankButton = ({onClick}) => {
  return (
      <img src={`${process.env.PUBLIC_URL}/img/rank.png`}
           className={styles.rankButton}
           alt="Rank button"
           onClick={onClick}
      />
  )
}

export default RankButton
