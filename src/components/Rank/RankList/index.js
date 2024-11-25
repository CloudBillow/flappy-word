import React, { useEffect, useState } from 'react'
import styles from './RankList.module.css'
import RankItem from '../RankItem'
import { get, apiPaths } from '../../../api/api'
import MyRank from '../MyRank'
import { useGameContext } from '../../../context/GameContext'
import MyAlert from '../../MyAlert'

const RankList = ({isOpen, onClose}) => {
  const [dataList, setDataList] = useState([])
  const {checkLoginStatus} = useGameContext()
  const [shouldRender, setShouldRender] = useState(false)

  // 处理登录检查和数据加载
  useEffect(() => {
    if (!isOpen) {
      setShouldRender(false)
      return
    }

    // 使用 setTimeout 将登录检查移到下一个事件循环
    const timeoutId = setTimeout(() => {
      if (!checkLoginStatus()) {
        MyAlert('登录已过期，请重新登录')
        onClose() // 关闭弹窗
        return
      }

      setShouldRender(true)

      // 加载排行榜数据
      get(apiPaths.RANK_LIST)
          .then((data) => {
            if (data && data.records) {
              setDataList(data.records)
            }
          })
          .catch(() => {
            MyAlert('获取排行榜数据失败')
            onClose()
          })
    }, 0)

    return () => clearTimeout(timeoutId)
  }, [isOpen, checkLoginStatus, onClose])

  // 如果弹窗未打开或还未完成登录检查，不渲染任何内容
  if (!isOpen || !shouldRender) return null

  return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <button
              onClick={() => {
                setShouldRender(false)
                onClose()
              }}
              className={styles.closeButton}
          >
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
