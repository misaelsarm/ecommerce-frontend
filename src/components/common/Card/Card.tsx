import React from 'react'
import styles from './Card.module.scss'

interface Props {
  children: React.ReactNode
}

export const Card = ({ children }: Props) => {
  return (
    <div className={styles.card}>
      {children}
    </div>
  )
}