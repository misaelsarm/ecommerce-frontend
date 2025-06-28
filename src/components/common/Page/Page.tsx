import React from 'react'
import styles from './Page.module.scss'

interface Props {
  children?: React.ReactNode
  title?: string
}

const Page = ({ children, title }: Props) => {
  return (
    <div className={styles.page}>
      <h2>{title}</h2>
      {children}
    </div>
  )
}

export default Page