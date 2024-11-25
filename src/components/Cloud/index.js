import React from 'react';
import styles from './Cloud.module.css';

const Cloud = ({ style }) => {
  return (
      <div
          className={styles.cloud}
          style={style}
      />
  );
};

export default Cloud;
