import { createRoot } from 'react-dom/client';
import React, { useEffect, useState } from 'react';
import styles from './MyAlert.module.css';

const AlertComponent = ({ message, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    // 等待动画完成后再移除组件
    setTimeout(onClose, 300); // 300ms 要和 CSS 动画时间一致
  };

  return (
      <div className={styles.alertContainer}>
        <div className={`${styles.alertContent} ${isClosing ? styles.hide : ''}`}>
          {message}
        </div>
      </div>
  );
};

let activeAlert = null;
let activeTimeout = null;

const MyAlert = (message) => {
  if (activeAlert) {
    activeAlert.unmount();
    if (activeTimeout) {
      clearTimeout(activeTimeout);
    }
  }

  return new Promise((resolve) => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    const root = createRoot(container);

    const handleClose = () => {
      root.unmount();
      container.remove();
      activeAlert = null;
      activeTimeout = null;
      resolve();
    };

    const startClose = () => {
      const alertInstance = document.querySelector('[class*="alertContent"]');
      if (alertInstance) {
        alertInstance.classList.add(styles.hide);
        setTimeout(handleClose, 300); // 等待动画完成
      } else {
        handleClose();
      }
    };

    root.render(
        <AlertComponent
            message={message}
            onClose={handleClose}
        />
    );

    activeAlert = root;
    activeTimeout = setTimeout(startClose, 2000);
  });
};

export default MyAlert;
