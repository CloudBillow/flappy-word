import React, { useState, useEffect, useCallback } from 'react';
import styles from './ForStart.module.css'

const ForStart = ({message, className}) => {
  const [opacity, setOpacity] = useState(1);
  const [isIncreasing, setIsIncreasing] = useState(false);

  const animate = useCallback(() => {
    setOpacity(prevOpacity => {
      if (prevOpacity >= 1) {
        setIsIncreasing(false);
        return 0.99;
      } else if (prevOpacity <= 0.5) {
        setIsIncreasing(true);
        return 0.51;
      }
      return isIncreasing ? prevOpacity + 0.02 : prevOpacity - 0.02;
    });
  }, [isIncreasing]);

  useEffect(() => {
    let animationFrameId;

    const loop = () => {
      animationFrameId = requestAnimationFrame(loop);
      animate();
    };

    loop();

    return () => cancelAnimationFrame(animationFrameId);
  }, [animate]);

  return (
      <div
          className={`${className} ${styles.base}`}
          style={{ opacity: opacity }}
      >
        {message}
      </div>
  );
};

export default ForStart;
