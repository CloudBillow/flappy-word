import React, { useState, useEffect, useCallback } from 'react'
import Cloud from '../Cloud'
import styles from './CloudsContainer.module.css'

const CloudsContainer = () => {
  const [clouds, setClouds] = useState([])

  const generateCloud = useCallback(() => {
    return {
      id: Math.random(),
      top: Math.random() * 100,
      scale: 0.6 + Math.random() * 0.2,
      speed: 15 + Math.random() * 15
    }
  }, [])

  useEffect(() => {
    // 初始生成一朵云
    const initialClouds = [generateCloud()]
    setClouds(initialClouds)

    const interval = setInterval(() => {
      setClouds(prevClouds => {
        // 只保留最新的10个云
        const activeClouds = prevClouds.slice(-10)

        // 如果活跃的云少于3朵，添加一朵新云
        if (activeClouds.length < 3) {
          return [...activeClouds, generateCloud()]
        }

        return activeClouds
      })
    }, 8000)

    return () => clearInterval(interval)
  }, [generateCloud])

  return (
      <div className={styles.cloudsContainer}>
        {clouds.map(cloud => (
            <Cloud
                key={cloud.id}
                style={{
                  top: `${cloud.top}%`,
                  transform: `scale(${cloud.scale})`,
                  animationDuration: `${cloud.speed}s`
                }}
            />
        ))}
      </div>
  )
}

export default CloudsContainer
