import React from 'react'
import styles from './FabGroup.module.scss'

interface Props {
  children: React.ReactNode;
}

export const FabGroup = ({ children }: Props) => {
  return (
    <div
      className={styles.fabGroup}
    >
      {children}
    </div>
  )
}