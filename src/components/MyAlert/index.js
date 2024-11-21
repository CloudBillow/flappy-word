import { createRoot } from 'react-dom/client';
import React, { useEffect } from 'react';
import styles from './MyAlert.module.css';

const AlertComponent = ({ message, onClose }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
      <div className={styles.alertContainer}>
        <div className={styles.alertContent}>
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

    root.render(
        <AlertComponent
            message={message}
            onClose={handleClose}
        />
    );

    activeAlert = root;
    activeTimeout = setTimeout(handleClose, 2000);
  });
};

export default MyAlert;
