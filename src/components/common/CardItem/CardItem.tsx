import React from 'react'
import styles from './CardItem.module.scss'

interface Props {
  title?: string
  content?: React.ReactNode
}

export const CardItem = ({ title, content }: Props) => {
  return (
    <div className={styles.cardItem}>
      <h4>{title}</h4>
      {content}
    </div>
  )
}