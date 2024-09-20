import React from 'react';
import styles from './Countdown.module.css';

const Countdown = ({ count }) => {
  return (
      <div className={styles.countdown}>
        {count > 0 ? count : '开始！'}
      </div>
  );
};

export default Countdown;
