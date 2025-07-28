import { classNames, variationName } from '@/utils/css';
import React from 'react'
import styles from './Button.module.scss'
import Link from 'next/link';

interface ButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'link';
  block?: boolean
  url?: string
}

export const Button = ({ onClick, disabled, children, variant = 'primary', block, url }: ButtonProps) => {

  const buttonClass = classNames(
    styles.button,
    styles[variationName('variant', variant)],
    block && styles.block
  );

  console.log({buttonClass})

  let buttonMarkup

  if (url) {
    buttonMarkup = disabled ?
      <button
        className={buttonClass}
        disabled>{children}
      </button> :
      <Link
        className={buttonClass}
        href={url}>{children}</Link>
  } else {
    buttonMarkup =
      <button
        disabled={disabled}
        onClick={onClick}
        className={buttonClass}
      >
        {children}
      </button>
  }

  return buttonMarkup
}