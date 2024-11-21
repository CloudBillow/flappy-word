import React, { useEffect, useState } from 'react'
import styles from './RankList.module.css'
import RankItem from '../RankItem'
import { get, apiPaths } from '../../../api/api'
import MyRank from '../MyRank'

const RankList = ({isOpen, onClose}) => {

  const [dataList, setDataList] = useState([])

  useEffect(() => {
    if (isOpen) {
      get(apiPaths.RANK_LIST)
          .then((data) => {
            setDataList(data.records)
          })
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <button onClick={onClose} className={styles.closeButton}>
            &times;
          </button>
          <div className={styles.content}>
            <h2 className={styles.title}>排行榜</h2>
            <div className={styles.table}>
              <div className={styles.header}>
                <p className={styles.cell}>排名</p>
                <p className={styles.nameCell}>玩家</p>
                <p className={styles.cell}>分数</p>
                <p className={styles.cell}>穿过</p>
              </div>
              <div className={styles.body}>
                {dataList.map((item, index) => (
                    <RankItem key={index} rank={index + 1} item={item}/>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.myScore}>
          <MyRank/>
        </div>
      </div>
  )
}

export default RankList
