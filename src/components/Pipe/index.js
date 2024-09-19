import React from 'react'
import styles from './Pipe.module.css'

const Pipe = ({width, top, height, left}) => (
    <div
        className={styles.pipe}
        style={{width, top, height, left}}
    />
)

export default Pipe
