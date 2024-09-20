import React, { forwardRef, useImperativeHandle, useState } from 'react'
import styles from './Countdown.module.css'

const Countdown = forwardRef((props, ref) => {

  const COUNTDOWN_TIME = 3

  const [countdown, setCountdown] = useState(COUNTDOWN_TIME)

  useImperativeHandle(ref, () => ({
    setCountdown: (value) => setCountdown(value),
    resetCountdown: () => setCountdown(COUNTDOWN_TIME)
  }))

  return (
      <div className={styles.countdown}>
        {countdown}
      </div>
  )
})

export default Countdown
