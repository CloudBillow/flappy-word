import React from 'react'
import styles from './Bird.module.css'

const Bird = ({top}) => (
    <div className={styles.bird} style={{top: `${top}px`, left: '50px'}}/>
)

export default Bird
