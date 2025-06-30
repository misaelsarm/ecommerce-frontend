import React from 'react';
import styles from './Skeleton.module.scss';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  borderRadius = '0.5rem',
  style,
  ...rest
}) => {
  const inlineStyle: React.CSSProperties = {
    width,
    height,
    borderRadius,
    ...style,
  };

  return <div className={styles.skeleton} style={inlineStyle} {...rest} />;
};
