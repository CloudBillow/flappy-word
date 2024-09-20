import React from 'react'
import styles from './RankButton.module.css'
import rankImage from '../../../static/rank.png';


const RankButton = () => {
  return (
      <img src={rankImage} className={styles.rankButton} alt="Rank button"/>
  )
}

export default RankButton
