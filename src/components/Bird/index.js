import React from 'react'
import styles from './Bird.module.css'

const Bird = ({letter, top}) => (
    <div
        className={styles.bird}
        style={{top: `${top}px`, left: '50px'}}
    >
      <p className={styles.letter}>
        {letter}
      </p>
    </div>
)

export default Bird
