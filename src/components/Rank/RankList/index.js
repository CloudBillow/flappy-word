import React, { useState } from 'react'
import styles from './RankList.module.css'

const RankList = ({isOpen, onClose, children}) => {
  if (!isOpen) return null

  return (
      <div style={styles.overlay}>
        <div style={styles.modal}>
          <button onClick={onClose} style={styles.closeButton}>
            &times;
          </button>
          <div style={styles.content}>
            {children}
          </div>
        </div>
      </div>
  )
}

export default RankList
