import React from 'react'

interface Props {
  title: string,
  icon: any
}

const Empty = ({ title, icon }: Props) => {
  return (
    <div className='empty' >
      {icon}
      <span>{title}</span>
    </div>
  )
}

export default Empty