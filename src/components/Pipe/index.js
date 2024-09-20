import React from 'react'
import styles from './Pipe.module.css'

const Pipe = ({ width, top, height, left, isTop }) => (
    <div
        className={`${styles.pipe} ${isTop ? styles.topPipe : styles.bottomPipe}`}
        style={{ width, top, height, left }}
    >
      <div className={styles.pipeBody}></div>
      <div className={styles.pipeEnd}></div>
    </div>
)

export default Pipe
