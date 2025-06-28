import React from 'react';
import styles from './Chip.module.scss';

interface ChipProps {
  text: string;
  color?: 'green' | 'blue' | 'red' | 'yellow' | 'dark' | 'grey';
  onClose?: () => void;
}

const Chip: React.FC<ChipProps> = ({ text, color = 'grey', onClose }) => {
  return (
    <div className={`${styles.chip} ${styles[color]}`}>
      {text}
      {onClose && (
        <span className={styles.close} onClick={onClose}>
          &times;
        </span>
      )}
    </div>
  );
};

export default Chip;
