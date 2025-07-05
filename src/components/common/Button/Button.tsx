import React from 'react'

interface ButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  label?: string;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
}

export const Button = ({ onClick, label, className, disabled, children }: ButtonProps) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className='btn'
    >
      {children}
    </button>
  )
}