import React from 'react'
import styles from './Pipe.module.css'

const Pipe = ({top, height, left}) => (
    <div className={styles} style={{top, height, left}}/>
)

export default Pipe
