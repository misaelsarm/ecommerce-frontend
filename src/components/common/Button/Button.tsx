import { classNames, variationName } from '@/utils/css';
import React from 'react'
import styles from './Button.module.scss'

interface ButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  label?: string;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'link';
  block?: boolean

}

export const Button = ({ onClick, label, className, disabled, children, variant = 'primary', block }: ButtonProps) => {

  const buttonClass = classNames(
    styles.button,
    styles[variationName('variant', variant)],
    block && styles.block
  );

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={buttonClass}
    >
      {children}
    </button>
  )
}