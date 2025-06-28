import styles from './Fab.module.scss';
import React from 'react'

interface Props {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  icon?: React.ReactNode;
  actionName?: string;
}

const Fab = ({ onClick, icon, actionName }: Props) => {
  return (
    <div className={styles.fabWrapper}>
      {
        actionName &&
        <span className={styles.actionName}>{actionName}</span>
      }
      <div
        onClick={onClick}
        className={styles.fab}>
        {icon}
      </div>
    </div>
  )
}

export default Fab